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
} from 'lucide-react';
import { getProductByName } from '@/models/invitations';
import { Product } from '@/types/interface';

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

export default function ProductDetail({ params }: PageProps) {
  const { productName } = use(params);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [withPhoto, setWithPhoto] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push('/dashboard/catalogue');
    }
  };

  const calculatePrice = () => {
    if (!selectedItem) return 0;
    return withPhoto
      ? (selectedItem.basePriceWithPhoto || selectedItem.basePriceNoPhoto)
      : selectedItem.basePriceNoPhoto;
  };

  const getSegmentColor = (segmentation: string) => {
    switch (segmentation) {
      case 'Platinum':
        return 'bg-gradient-to-r from-slate-300 to-slate-500 text-white';
      case 'Gold':
        return 'bg-gradient-to-r from-amber-400 to-yellow-600 text-white';
      case 'Silver':
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900';
      case 'Bronze':
        return 'bg-gradient-to-r from-orange-400 to-amber-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Safe gallery handling
  const galleryImages = selectedItem 
    ? [selectedItem.coverImage, selectedItem.coverImage]
    : [];
    
  // If product has features as array of strings
  const features = (Array.isArray(selectedItem?.features) ? selectedItem?.features : []) as string[];

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4'></div>
          <p className='text-white'>Memuat...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedItem) {
    return (
      <div className='min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-4 text-center'>
         <h2 className="text-xl font-bold mb-2 text-pink-500">Oops!</h2>
         <p className="text-gray-400 mb-6">{error || 'Produk tidak ditemukan'}</p>
         <button onClick={handleBack} className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors border border-gray-700">
            Kembali ke Katalog
         </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900'>
      {/* Clean & Integrated Header */}
      <header 
        className={cn(
          'top-0 z-50 transition-all duration-300 ease-in-out',
          isScrolled 
            ? 'bg-gray-900/80 backdrop-blur-lg border-b border-white/10 py-3' 
            : 'bg-transparent py-5'
        )}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <button
                onClick={handleBack}
                className='flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 group'
              >
                <ArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
                <span className='text-sm font-medium hidden sm:block'>Kembali</span>
              </button>
              
              <div className={cn(
                'h-8 w-[1px] bg-white/10 hidden sm:block transition-opacity duration-300',
                !isScrolled && 'opacity-0'
              )} />
              
              <div className='min-w-0'>
                <h1 className={cn(
                  'font-bold text-white truncate transition-all duration-300',
                  isScrolled ? 'text-lg opacity-100 translate-y-0' : 'text-xl sm:text-2xl opacity-100 sm:translate-y-0'
                )}>
                  {selectedItem.productName}
                </h1>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <button className='p-2.5 rounded-xl bg-white/5 hover:bg-pink-500/20 text-gray-400 hover:text-pink-400 transition-all duration-300 hover:scale-105 active:scale-95'>
                <Heart className='w-5 h-5' />
              </button>
              {/* Optional Share button could go here */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pb-32 lg:pb-12'>
        <div className='grid lg:grid-cols-2 gap-6 lg:gap-12'>
          {/* Left: Image Gallery */}
          <div className='space-y-4'>
            {/* Main Image */}
            <div
              className='relative group rounded-2xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 cursor-zoom-in'
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
              onClick={() => setIsLightboxOpen(true)}
            >
              <div className='aspect-[4/3] overflow-hidden'>
                <img
                  src={galleryImages[activeImage] || selectedItem.coverImage}
                  alt={selectedItem.productName}
                  className={cn(
                    'w-full h-full object-cover transition-transform duration-700',
                    isImageHovered && 'scale-110'
                  )}
                />
              </div>

              {/* Overlay on hover */}
              <div
                className={cn(
                  'absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300',
                  isImageHovered ? 'opacity-100' : 'opacity-0'
                )}
              >
                <div className='p-3 rounded-full bg-white/20 backdrop-blur-sm'>
                  <ZoomIn className='w-6 h-6 text-white' />
                </div>
              </div>

              {/* Badges */}
              <div className='absolute top-3 left-3 flex flex-wrap gap-2'>
                <span
                  className={cn(
                    'text-xs font-semibold px-3 py-1 rounded-full shadow-lg',
                    getSegmentColor(selectedItem.segmentation)
                  )}
                >
                  <Sparkles className='w-3 h-3 inline mr-1' />
                  {selectedItem.segmentation}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {galleryImages.length > 1 && (
            <div className='flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide'>
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    'relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden transition-all duration-300 border-2',
                    activeImage === index
                      ? 'border-pink-500 scale-105'
                      : 'border-gray-700 opacity-60 hover:opacity-100'
                  )}
                >
                  <img
                    src={img}
                    alt=''
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className='lg:sticky lg:top-24 lg:self-start space-y-6'>
            {/* Tier Badge */}
            <div>
              <span className='inline-flex items-center gap-1.5 text-sm font-medium text-pink-400 bg-pink-500/10 px-4 py-1.5 rounded-full border border-pink-500/20 uppercase'>
                <Star className='w-4 h-4 fill-pink-400' />
                {selectedItem.tier}
              </span>
            </div>

            {/* Title & Description */}
            <div className='space-y-3'>
              <h2 className='text-2xl sm:text-3xl font-bold text-white'>
                {selectedItem.productName}
              </h2>
              <p className='text-gray-400 leading-relaxed'>
                {selectedItem.description || 'Tema elegan dengan fitur lengkap untuk pernikahan impian Anda.'}
              </p>
            </div>

            {/* Package Selection */}
            <div className='bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50 space-y-4'>
              <h3 className='text-base font-semibold text-white flex items-center gap-2'>
                <Shield className='w-4 h-4 text-pink-400' />
                Pilih Paket
              </h3>

              <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                {/* No Photo Package */}
                <button
                  onClick={() => setWithPhoto(false)}
                  className={cn(
                    'relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 group',
                    !withPhoto
                      ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                      : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                  )}
                >
                  {!withPhoto && (
                    <div className='absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shadow-lg'>
                      <Check className='w-4 h-4 text-white' />
                    </div>
                  )}
                  <div className='text-center space-y-2'>
                    <p className='text-xs sm:text-sm font-medium text-gray-400'>
                      Tanpa Foto
                    </p>
                    <p
                      className={cn(
                        'text-xl sm:text-2xl font-bold transition-colors',
                        !withPhoto ? 'text-pink-400' : 'text-gray-200'
                      )}
                    >
                      <span className='text-sm font-normal'>Rp</span>{' '}
                      {formatPrice(selectedItem.basePriceNoPhoto)}
                    </p>
                  </div>
                </button>

                {/* With Photo Package */}
                <button
                  onClick={() => setWithPhoto(true)}
                  disabled={!selectedItem.basePriceWithPhoto}
                  className={cn(
                    'relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 group',
                    withPhoto
                      ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                      : 'border-gray-700 bg-gray-800/30 hover:border-gray-600',
                    !selectedItem.basePriceWithPhoto && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {/* Popular Badge */}
                  {selectedItem.basePriceWithPhoto && (
                    <div className='absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500 text-amber-950 text-[10px] font-bold rounded-full whitespace-nowrap'>
                        POPULER
                    </div>
                  )}

                  {withPhoto && (
                    <div className='absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shadow-lg'>
                      <Check className='w-4 h-4 text-white' />
                    </div>
                  )}
                  <div className='text-center space-y-2'>
                    <p className='text-xs sm:text-sm font-medium text-gray-400'>
                      Dengan Foto
                    </p>
                    <p
                      className={cn(
                        'text-xl sm:text-2xl font-bold transition-colors',
                        withPhoto ? 'text-pink-400' : 'text-gray-200'
                      )}
                    >
                      {selectedItem.basePriceWithPhoto ? (
                        <>
                        <span className='text-sm font-normal'>Rp</span>{' '}
                        {formatPrice(selectedItem.basePriceWithPhoto)}
                        </>
                      ) : (
                        <span className='text-xs'>Tidak Tersedia</span>
                      )}
                    </p>
                  </div>
                </button>
              </div>

              <p className='text-xs text-center text-gray-500'>
                {withPhoto
                  ? '✨ Termasuk foto prewedding'
                  : '📝 Teks dan dekorasi saja'}
              </p>
            </div>

            {/* Total Price */}
            <div className='bg-gradient-to-r from-pink-500/20 via-pink-500/10 to-pink-500/20 rounded-xl p-4 sm:p-5 border border-pink-500/30'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-400'>Total Harga</span>
                <div className='text-right'>
                  <span className='text-2xl sm:text-3xl font-bold text-pink-400'>
                    {formatPrice(calculatePrice())}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
            <div className='space-y-3'>
              <h3 className='text-base font-semibold text-white'>
                Fitur Termasuk
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-2 p-2.5 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors'
                  >
                    <div className='w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0' />
                    <span className='text-sm text-gray-400'>{String(feature)}</span>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Desktop Actions */}
            <div className='hidden lg:flex gap-3 pt-4'>
              <button className='flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:scale-[1.02]'>
                <ExternalLink className='w-5 h-5' />
                Preview
              </button>
              <button 
                  onClick={() => router.push(`/create/${selectedItem.productId}`)}
                  className='flex-[2] px-6 py-3.5 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] relative overflow-hidden group'>
                <span className='relative z-10'>Pakai Design Ini</span>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Footer */}
      <div className='fixed bottom-0 left-0 right-0 lg:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50 p-4 z-40'>
        <div className='flex items-center gap-3 max-w-lg mx-auto'>
          <div className='flex-shrink-0'>
            <p className='text-xs text-gray-500'>Total</p>
            <p className='text-lg font-bold text-pink-400'>
              {formatPrice(calculatePrice())}
            </p>
          </div>
          <div className='flex-1 flex gap-2'>
            <button className='p-3 bg-gray-800 rounded-xl border border-gray-700'>
              <ExternalLink className='w-5 h-5 text-gray-400' />
            </button>
            <button 
                onClick={() => router.push(`/create/${selectedItem.productId}`)}
                className='flex-1 py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/30'>
              Pakai Design
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className='fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4'
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className='absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors'
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className='w-6 h-6 text-white' />
          </button>
          <img
            src={galleryImages[activeImage]}
            alt={selectedItem.productName}
            className='max-w-full max-h-[90vh] object-contain rounded-lg'
          />

          {/* Lightbox Thumbnails */}
          {galleryImages.length > 1 && (
          <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2'>
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(index);
                }}
                className={cn(
                  'w-12 h-12 rounded-lg overflow-hidden transition-all border-2',
                  activeImage === index
                    ? 'border-white scale-110'
                    : 'border-gray-700 opacity-50 hover:opacity-100'
                )}
              >
                <img src={img} alt='' className='w-full h-full object-cover' />
              </button>
            ))}
          </div>
          )}
        </div>
      )}
    </div>
  );
}
