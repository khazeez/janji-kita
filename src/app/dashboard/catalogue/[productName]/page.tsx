'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Check,
  Heart,
  Shield,
  Sparkles,
  ZoomIn,
  X,
  Loader2,
  Info,
  Calendar,
  MousePointer2,
  MessageCircle,
  Image as ImageIcon,
  Layers,
  Clock,
  Smartphone,
  Globe,
  Music,
  Share2,
  Gift,
  Eye
} from 'lucide-react';
import GlassesDesign from '@/theme/gold/elegan/elegan-1/main';
import AdatDesign from '@/theme/gold/traditional/main';
import { getProductByName } from '@/models/invitations';
import { Product, AllInvitationData } from '@/types/interface';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const cn = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default function DashboardProductDetail({ params }: PageProps) {
  const { productName } = use(params);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);
  const [navigatingToCreate, setNavigatingToCreate] = useState(false);

  const [withPhoto, setWithPhoto] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await getProductByName(productName);
        if (error || !data) {
          setError('Produk tidak ditemukan');
        } else {
          setSelectedItem(data as Product);
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan saat memuat produk');
      } finally {
        setLoading(false);
      }
    };

    if (productName) {
      fetchProduct();
    }
  }, [productName]);

  useEffect(() => {
    if (!selectedItem) return;
    const checkFavorite = async () => {
      try {
        const res = await fetch('/api/favorites');
        if (res.ok) {
          const result = await res.json();
          const ids = new Set((result.data || []).map((f: any) => f.PRODUCT.PRODUCT_ID));
          setIsFavorited(ids.has(selectedItem.productId));
        }
      } catch {}
    };
    checkFavorite();
  }, [selectedItem]);

  const handleBack = () => {
    router.push('/dashboard/catalogue');
  };

  const calculatePrice = () => {
    if (!selectedItem) return 0;
    return withPhoto
      ? (selectedItem.basePriceWithPhoto || selectedItem.basePriceNoPhoto)
      : selectedItem.basePriceNoPhoto;
  };

  const getSegmentColor = (segmentation: string) => {
    const seg = segmentation?.toLowerCase() || '';
    if (seg.includes('platinum'))
      return 'bg-slate-300 text-slate-800 border-slate-400';
    if (seg.includes('gold'))
      return 'bg-amber-500 text-amber-950 border-amber-600';
    if (seg.includes('silver'))
       return 'bg-gray-300 text-gray-800 border-gray-400';
    if (seg.includes('bronze'))
       return 'bg-orange-600 text-white border-orange-700';
    return 'bg-gray-800 text-gray-400 border-gray-700';
  };

  const handleUseDesign = async () => {
    if (!selectedItem) return;
    setNavigatingToCreate(true);
    router.push(`/create/${selectedItem.productId}`);
  };

  const toggleFavorite = async () => {
    if (!selectedItem || togglingFav) return;
    setTogglingFav(true);
    try {
      if (isFavorited) {
        const res = await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: selectedItem.productId }),
        });
        if (res.ok) {
          setIsFavorited(false);
          window.dispatchEvent(new CustomEvent('update-counts'));
        }
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: selectedItem.productId }),
        });
        if (res.ok) {
          setIsFavorited(true);
          window.dispatchEvent(new CustomEvent('update-counts'));
        }
      }
    } catch {} finally {
      setTogglingFav(false);
    }
  };

  const createPreviewData = (product: Product): AllInvitationData => ({
    invitationId: 'preview',
    userId: 'preview',
    invitationUrl: '#',
    invitationStatus: 'draft',
    viewCount: 0,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    product,
    invitationDataUser: {
      dataId: 'preview',
      invitationId: 'preview',
      groomFullName: 'Ahmad Fauzan',
      groomNickName: 'Fauzan',
      groomParentName: 'Bpk. H. Ahmad & Ibu Hj. Siti',
      groomInstagram: '@fauzan_ahmad',
      groomPhotoUrl: '',
      brideFullName: 'Nurul Aisyah',
      brideNickName: 'Aisyah',
      brideParentName: 'Bpk. H. Abdullah & Ibu Hj. Fatimah',
      brideInstagram: '@aisyah_nurul',
      bridePhotoUrl: '',
      galleryPhotos: [],
      loveStory: [],
      audioUrl: '',
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    invitationEvent: [
      {
        eventId: 'preview-akad',
        invitationId: 'preview',
        eventType: 'AKAD',
        location: 'Masjid Agung Al-Falah',
        locationDetail: 'Jl. Merdeka No. 123, Jakarta Pusat',
        mapsUrl: 'https://maps.google.com',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        eventId: 'preview-resepsi',
        invitationId: 'preview',
        eventType: 'RESEPSI',
        location: 'Gedung Serbaguna Permata Hati',
        locationDetail: 'Jl. Sudirman No. 456, Jakarta Selatan',
        mapsUrl: 'https://maps.google.com',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    invitationGift: {
      giftId: 'preview',
      invitationId: 'preview',
      address: 'Jl. Contoh No. 789, Jakarta',
      invitationGiftBank: [
        {
          giftBankId: 'preview',
          giftId: 'preview',
          account: [{ bankName: 'BCA', accountNumber: '1234567890', accountName: 'Ahmad Fauzan' }],
          owner: 'GROOM',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      invitationGiftWallet: [
        {
          giftWalletId: 'preview',
          giftId: 'preview',
          address: [{ walletName: 'DANA', walletNumber: '081234567890', walletOwner: 'Nurul Aisyah' }],
          owner: 'BRIDE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    guestBook: [],
  });

  const renderTheme = (product: Product) => {
    const productName = product.productName || '';
    const previewData = createPreviewData(product);
    switch (productName) {
      case 'Adat':
      case 'Traditional':
        return <AdatDesign data={previewData} />;
      default:
        return <GlassesDesign data={previewData} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-5">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full bg-pink-500/10 animate-ping" />
        </div>
        <div className="text-center">
          <p className="text-gray-300 font-semibold">Menyiapkan detail tema...</p>
          <p className="text-gray-500 text-sm mt-1">Sebentar lagi</p>
        </div>
      </div>
    );
  }

  if (error || !selectedItem) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-gray-800/30 rounded-3xl border border-gray-700/50 max-w-lg mx-auto">
        <div className="bg-red-500/10 p-5 rounded-2xl mb-5">
          <Info className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Tidak Ditemukan</h2>
        <p className="text-gray-400 mb-8 max-w-sm">{error || 'Produk tidak ditemukan di database kami.'}</p>
        <button
          onClick={handleBack}
          className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-2xl transition-all border border-gray-700 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const features = (Array.isArray(selectedItem?.features) ? selectedItem?.features : []) as string[];
  const hasPhotoOption = !!selectedItem.basePriceWithPhoto;

  const includedFeatures = [
    { icon: Smartphone, label: 'Tampilan mobile-friendly' },
    { icon: Globe, label: 'Domain khusus' },
    { icon: Music, label: ' Musik latar' },
    { icon: Share2, label: 'Bagikan ke tamu' },
    { icon: Gift, label: 'Amplop digital' },
    { icon: Clock, label: 'Countdown acara' },
  ];

  return (
    <div className="space-y-8 pb-24 lg:pb-0 max-w-7xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all border border-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{selectedItem.productName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                getSegmentColor(selectedItem.segmentation)
              )}>
                {selectedItem.segmentation}
              </span>
              <span className="text-gray-600 text-xs">•</span>
              <span className="text-gray-500 text-xs">{selectedItem.productType}</span>
            </div>
          </div>
        </div>
        <button
          onClick={toggleFavorite}
          disabled={togglingFav}
          className={`p-3 rounded-2xl transition-all border ${
            isFavorited
              ? 'bg-pink-500/10 border-pink-500/30 text-pink-500'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-pink-500 hover:border-pink-500/30'
          }`}
        >
          {togglingFav ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Visuals */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Image */}
          <div
            className="group relative aspect-[16/10] sm:aspect-video rounded-3xl overflow-hidden bg-gray-800/50 border border-gray-700/50 cursor-pointer shadow-2xl shadow-black/50"
            onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={selectedItem.coverImage}
              alt={selectedItem.productName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-medium">
                <ZoomIn className="w-4 h-4" />
                Lihat Fullscreen
              </div>
            </div>

            <div className="absolute top-4 right-4 bg-pink-600 text-white px-4 py-2 rounded-2xl font-bold shadow-xl border border-pink-500">
              {formatPrice(calculatePrice())}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 bg-gray-800/40 rounded-3xl border border-gray-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-pink-500/10 rounded-xl">
                  <Calendar className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="font-semibold text-white text-sm">Masa Aktif</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Selamanya. Undangan tetap dapat diakses meskipun acara telah selesai.</p>
            </div>
            <div className="p-5 bg-gray-800/40 rounded-3xl border border-gray-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-pink-500/10 rounded-xl">
                  <Shield className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="font-semibold text-white text-sm">Privasi & Keamanan</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Data tamu aman dan notifikasi RSVP dikirim langsung ke Anda.</p>
            </div>
            <div className="p-5 bg-gray-800/40 rounded-3xl border border-gray-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-pink-500/10 rounded-xl">
                  <ImageIcon className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="font-semibold text-white text-sm">Galeri Foto</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Tambahkan album foto prewedding dan momen spesial Anda.</p>
            </div>
            <div className="p-5 bg-gray-800/40 rounded-3xl border border-gray-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-pink-500/10 rounded-xl">
                  <Layers className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="font-semibold text-white text-sm">Kustomisasi</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Sesuaikan warna, font, dan konten sesuai keinginan Anda.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Options */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Action Card */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-[2rem] p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/5 blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 rounded-full border border-pink-500/20">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">{selectedItem.tier} Tier</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Pilih Paket</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Sesuaikan dengan kebutuhan undangan Anda.</p>
            </div>

            {/* Package Selection */}
            <div className="space-y-3">
              <div
                className={cn(
                  "relative flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer",
                  !withPhoto
                    ? "border-pink-500 bg-pink-500/5 shadow-lg shadow-pink-500/10"
                    : "border-gray-700/50 bg-gray-900/40 hover:border-gray-600"
                )}
                onClick={() => setWithPhoto(false)}
              >
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Standard</p>
                  <h4 className="font-bold text-white text-lg">Tanpa Foto</h4>
                  <p className="text-xs text-gray-500 mt-1">Teks & dekorasi saja</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-[11px] text-gray-400">Semua fitur dasar</span>
                  </div>
                </div>
                <div className="text-right">
                  {!withPhoto && (
                    <div className="text-[10px] font-black text-pink-500 uppercase mb-1.5">Terpilih</div>
                  )}
                  <p className={cn("text-xl font-black", !withPhoto ? "text-pink-500" : "text-gray-400")}>
                    {formatPrice(selectedItem.basePriceNoPhoto)}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "relative flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer",
                  withPhoto
                    ? "border-pink-500 bg-pink-500/5 shadow-lg shadow-pink-500/10"
                    : "border-gray-700/50 bg-gray-900/40 hover:border-gray-600",
                  !hasPhotoOption && "opacity-40 cursor-not-allowed pointer-events-none"
                )}
                onClick={() => hasPhotoOption && setWithPhoto(true)}
              >
                {hasPhotoOption && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 text-[9px] font-black px-3 py-1 rounded-full shadow-lg border border-amber-300/50">
                    POPULER
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Premium</p>
                  <h4 className="font-bold text-white text-lg">Dengan Foto</h4>
                  <p className="text-xs text-gray-500 mt-1">+ Galeri prewedding</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-[11px] text-gray-400">Semua fitur + galeri foto</span>
                  </div>
                </div>
                <div className="text-right">
                  {withPhoto && (
                    <div className="text-[10px] font-black text-pink-500 uppercase mb-1.5">Terpilih</div>
                  )}
                  <p className={cn("text-xl font-black", withPhoto ? "text-pink-500" : "text-gray-400")}>
                    {hasPhotoOption ? formatPrice(selectedItem.basePriceWithPhoto!) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Included Features */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Yang Termasuk</h4>
              <div className="grid grid-cols-1 gap-3">
                {includedFeatures.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-6 h-6 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-pink-500" />
                      </div>
                      {feat.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Features */}
            {features.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Fitur Tambahan</h4>
                <div className="grid grid-cols-1 gap-2">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-500" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-700/50">
              <button
                onClick={() => setShowPreview(true)}
                className="w-full py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-2xl font-bold border border-gray-700 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Eye className="w-5 h-5" />
                LIHAT PREVIEW
              </button>
              <button
                onClick={handleUseDesign}
                disabled={navigatingToCreate}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-600/20 hover:shadow-pink-600/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {navigatingToCreate ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MousePointer2 className="w-5 h-5" />
                )}
                {navigatingToCreate ? 'Menyiapkan...' : 'PAKAI DESAIN INI'}
              </button>
            </div>
          </div>

          {/* Help Section */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-3xl border border-gray-700/30 hover:border-gray-600 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm font-bold">Butuh Bantuan?</h4>
                <p className="text-gray-500 text-xs mt-0.5">Konsultasi gratis via WhatsApp dengan tim kami.</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
          </a>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-gray-950/95"
          onClick={() => setShowPreview(false)}
        >
          {/* Close button — fixed top-right */}
          <button
            className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-all border border-gray-700 shadow-xl"
            onClick={() => setShowPreview(false)}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="min-h-screen flex justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-[360px]">
              {selectedItem && renderTheme(selectedItem)}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-gray-950/95 flex items-center justify-center p-4 backdrop-blur-xl"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedItem.coverImage}
            alt={selectedItem.productName}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
