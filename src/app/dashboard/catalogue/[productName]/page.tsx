'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Check,
  Heart,
  Star,
  Shield,
  Sparkles,
  ZoomIn,
  X,
  Loader2,
  Info,
  Calendar,
  MousePointer2
} from 'lucide-react';
import { getProductByName } from '@/models/invitations';
import { Product } from '@/types/interface';
import supabase from '@/lib/supabase/client';

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

interface PageProps {
  params: Promise<{
    productName: string;
  }>;
}

export default function DashboardProductDetail({ params }: PageProps) {
  const { productName } = use(params);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [withPhoto, setWithPhoto] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
    router.push(`/create/${selectedItem.productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
        <p className="text-gray-400 animate-pulse">Menyiapkan detail tema...</p>
      </div>
    );
  }

  if (error || !selectedItem) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 bg-gray-800/30 rounded-3xl border border-gray-700/50">
         <div className="bg-red-500/10 p-4 rounded-2xl mb-4">
            <Info className="w-8 h-8 text-red-500" />
         </div>
         <h2 className="text-xl font-bold mb-2 text-white">Oops! Terjadi Kesalahan</h2>
         <p className="text-gray-400 mb-6 max-w-sm">{error || 'Produk tidak ditemukan di database kami.'}</p>
         <button 
           onClick={handleBack} 
           className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl transition-all border border-gray-700 flex items-center gap-2"
         >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Katalog
         </button>
      </div>
    );
  }

  const galleryImages = [selectedItem.coverImage, selectedItem.coverImage]; // Placeholder duplicate for demo
  const features = (Array.isArray(selectedItem?.features) ? selectedItem?.features : []) as string[];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Navigation Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all border border-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{selectedItem.productName}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
              getSegmentColor(selectedItem.segmentation)
            )}>
              {selectedItem.segmentation}
            </span>
            <span className="text-gray-500 text-xs">•</span>
            <span className="text-gray-400 text-xs">{selectedItem.productType}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Visuals (7 Wide) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Showcase */}
          <div 
            className="group relative aspect-[16/10] sm:aspect-video rounded-3xl overflow-hidden bg-gray-800/50 border border-gray-700/50 cursor-pointer shadow-2xl shadow-black/50"
            onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={galleryImages[activeImage]}
              alt={selectedItem.productName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
               <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-medium">
                  <ZoomIn className="w-4 h-4" />
                  Lihat Fullscreen
               </div>
            </div>

            {/* Price Floating Tag */}
            <div className="absolute top-4 right-4 bg-pink-600 text-white px-4 py-2 rounded-2xl font-bold shadow-xl border border-pink-500 scale-90 group-hover:scale-100 transition-transform">
               {formatPrice(calculatePrice())}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={cn(
                  "relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden transition-all duration-300 border-2",
                  activeImage === index
                    ? "border-pink-500 scale-105 shadow-lg shadow-pink-500/20"
                    : "border-gray-700 hover:border-gray-500 opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Detailed Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 bg-gray-800/40 rounded-3xl border border-gray-700/50">
               <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-pink-500/10 rounded-xl">
                     <Calendar className="w-5 h-5 text-pink-500" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Masa Aktif</h3>
               </div>
               <p className="text-gray-400 text-sm leading-relaxed">Selamanya. Undangan Anda akan tetap dapat diakses meskipun acara telah selesai.</p>
            </div>
            
            <div className="p-5 bg-gray-800/40 rounded-3xl border border-gray-700/50">
               <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-pink-500/10 rounded-xl">
                     <Shield className="w-5 h-5 text-pink-500" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Privasi & Keamanan</h3>
               </div>
               <p className="text-gray-400 text-sm leading-relaxed">Data tamu aman dan fitur RSVP akan langsung mengirimkan notifikasi kepada Anda.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Options (5 Wide) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Action Card */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-[2rem] p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
             {/* Subtle Glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/5 blur-[100px] pointer-events-none" />

             {/* Header */}
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 rounded-full border border-pink-500/20">
                   <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                   <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">{selectedItem.tier} Tier</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">Pilih Paket Desain</h2>
                <p className="text-gray-400 text-sm leading-relaxed">Sesuaikan desain undangan ini dengan kebutuhan konten pernikahan Anda.</p>
             </div>

             {/* Package Toggle */}
             <div className="space-y-4">
                <div 
                  className={cn(
                    "relative flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer group",
                    !withPhoto ? "border-pink-500 bg-pink-500/5 shadow-lg shadow-pink-500/10" : "border-gray-700/50 bg-gray-900/40 hover:border-gray-600"
                  )}
                  onClick={() => setWithPhoto(false)}
                >
                   <div className="flex-1">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Standard</p>
                      <h4 className="font-bold text-white">Tanpa Album Foto</h4>
                      <p className="text-xs text-gray-500 mt-1 italic">Hanya teks & dekorasi</p>
                   </div>
                   <div className="text-right">
                      {!withPhoto && <div className="text-[10px] font-black text-pink-500 uppercase mb-1">Terpilih</div>}
                      <p className={cn("text-xl font-black", !withPhoto ? "text-pink-500" : "text-gray-400")}>
                        {formatPrice(selectedItem.basePriceNoPhoto)}
                      </p>
                   </div>
                </div>

                <div 
                  className={cn(
                    "relative flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer group",
                    withPhoto ? "border-pink-500 bg-pink-500/5 shadow-lg shadow-pink-500/10" : "border-gray-700/50 bg-gray-900/40 hover:border-gray-600",
                    !selectedItem.basePriceWithPhoto && "opacity-40 cursor-not-allowed pointer-events-none"
                  )}
                  onClick={() => setWithPhoto(true)}
                >
                   {/* Popular Ribbon */}
                   <div className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 text-[9px] font-black px-3 py-1 rounded-full shadow-lg border border-amber-300/50">
                      POPULER
                   </div>

                   <div className="flex-1">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Premium</p>
                      <h4 className="font-bold text-white">Dengan Album Foto</h4>
                      <p className="text-xs text-gray-500 mt-1 italic">Termasuk galeri prewedding</p>
                   </div>
                   <div className="text-right">
                      {withPhoto && <div className="text-[10px] font-black text-pink-500 uppercase mb-1">Terpilih</div>}
                      <p className={cn("text-xl font-black", withPhoto ? "text-pink-500" : "text-gray-400")}>
                        {selectedItem.basePriceWithPhoto ? formatPrice(selectedItem.basePriceWithPhoto) : 'N/A'}
                      </p>
                   </div>
                </div>
             </div>

             {/* Features List */}
             <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Fitur Utama</h4>
                <div className="grid grid-cols-1 gap-3">
                   {features.length > 0 ? features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                         <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-pink-500" />
                         </div>
                         {feature}
                      </div>
                   )) : (
                      <div className="text-gray-500 text-xs italic">Menampilkan fitur standar undangan digital.</div>
                   )}
                </div>
             </div>

             {/* Primary Actions */}
             <div className="space-y-3 pt-4 border-t border-gray-700/50">
                <button 
                  onClick={handleUseDesign}
                  className="w-full py-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-600/20 hover:shadow-pink-600/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group active:scale-95"
                >
                  <MousePointer2 className="w-5 h-5 group-hover:animate-bounce" />
                  PAKAI DESAIN INI
                </button>
                
                <button className="w-full py-3 bg-transparent hover:bg-gray-700/50 text-gray-400 hover:text-white rounded-2xl font-bold transition-all border border-transparent hover:border-gray-700 flex items-center justify-center gap-2">
                   <ExternalLink className="w-4 h-4" />
                   Lihat Preview Template
                </button>
             </div>
          </div>
          
          {/* Help Section */}
          <div className="p-5 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-3xl border border-gray-700/30 flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-xl">💡</div>
             <div>
                <h4 className="text-white text-sm font-bold">Bingung pilih mana?</h4>
                <p className="text-gray-500 text-xs mt-0.5">Konsultasi dengan tim kreatif kami via WhatsApp.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-gray-950/95 flex items-center justify-center p-4 backdrop-blur-xl transition-all duration-500"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <img
            src={galleryImages[activeImage]}
            alt={selectedItem.productName}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl transition-transform duration-500 animate-in zoom-in-95"
          />

          {/* Lightbox Thumbnails */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-3 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10" onClick={e => e.stopPropagation()}>
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={cn(
                  "w-14 h-14 rounded-xl overflow-hidden transition-all border-2",
                  activeImage === index ? "border-pink-500 scale-110" : "border-transparent opacity-50 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
