'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Heart, Star, Loader2 } from 'lucide-react';
import { getProductInvitation } from '@/models/invitations';
import { Product } from '@/types/interface';

interface CatalogueItem {
  data: Product;
}

const segments: string[] = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze'];

export default function Catalogue() {
  const router = useRouter();
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isHeaderFixed, setIsHeaderFixed] = useState<boolean>(false);
  
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsHeaderFixed(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data: Product[] = await getProductInvitation();

        const wrappedData: CatalogueItem[] = data
          .filter(Boolean)
          .map((item) => ({ data: item }));

        setCatalogues(wrappedData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setCatalogues([]);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleNavigation = (url: string, id: string) => {
    if (navigatingId) return;
    setNavigatingId(id);
    router.push(url);
  };

  const filteredCatalogues = catalogues.filter((item) => {
    if (!item?.data) return false;

    const matchesSegment =
      selectedSegment === 'All' || item.data.segmentation === selectedSegment;

    const matchesSearch =
      item.data.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.data.segmentation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.data.productType?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSegment && matchesSearch;
  });

  const clearSearch = () => setSearchQuery('');

  const getSegmentColor = (segment: string) => {
    switch (segment) {
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

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800'>
      {/* Hero Header */}
      <section className='relative overflow-hidden text-white min-h-[50vh] sm:min-h-[60vh] flex items-center'>
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop&crop=center)',
          }}
        ></div>
        <div className='absolute inset-0 bg-gradient-to-br from-pink-700/80 to-pink-200/40'></div>

        <div className='relative z-10 text-center py-16 sm:py-20 px-4 sm:px-6 w-full'>
          <div className='max-w-5xl mx-auto'>
            {/* SPAN TIDAK DIHILANGKAN */}
            <div className='mb-4 sm:mb-6'>
              <span className='inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium border border-white/30'>
                ✨ Premium Wedding Invitations
              </span>
            </div>
            <h1 className='text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent leading-tight'>
              Undangan Digital
            </h1>
            <p className='text-base sm:text-xl md:text-2xl font-light mb-6 sm:mb-8 text-white/95 max-w-3xl mx-auto leading-relaxed'>
              Ciptakan momen istimewa dengan desain yang tak terlupakan.
              Sentuhan modern untuk hari bahagia Anda.
            </p>

            <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-4'>
              <span className='flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-xs sm:text-sm'>
                <Heart className='w-3 h-3 sm:w-4 sm:h-4 fill-current text-pink-300' />
                <span className='text-white/90'>Elegan</span>
              </span>
              <span className='flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-xs sm:text-sm'>
                <Star className='w-3 h-3 sm:w-4 sm:h-4 fill-current text-yellow-300' />
                <span className='text-white/90'>Modern</span>
              </span>
              <span className='px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white/90 text-xs sm:text-sm'>
                Personal
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Header with smooth animation */}
      <header
        className={`z-50 sticky top-0 backdrop-blur-xl border-b border-gray-700/40 transition-all duration-500 ${
          isHeaderFixed
            ? 'bg-gray-900/95 shadow-lg shadow-pink-500/10 scale-[1.01] opacity-100'
            : 'bg-gray-900/60 opacity-90'
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 transition-all duration-500'>
          {/* Search Bar */}
          <div className='relative max-w-2xl mx-auto mb-4 sm:mb-6'>
            <Search className='absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5' />
            <input
              type='text'
              placeholder='Cari nama atau tema undangan...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-10 py-2.5 sm:pl-12 sm:pr-12 sm:py-3 text-sm sm:text-base bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300'
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className='absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-400 transition-colors'
              >
                <X className='w-4 h-4 sm:w-5 sm:h-5' />
              </button>
            )}
          </div>

          {/* Segment Filter */}
          <div className='flex flex-wrap justify-center gap-2 sm:gap-3'>
            {segments.map((segment) => (
              <button
                key={segment}
                onClick={() => setSelectedSegment(segment)}
                className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 ${
                  selectedSegment === segment
                    ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-500/30'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 border border-gray-700/50'
                }`}
              >
                {segment}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Catalogue */}
      <section className='py-8 px-4 sm:px-6'>
        <div className='max-w-7xl mx-auto'>
          {loading ? (
             <div className='flex items-center justify-center min-h-[400px]'>
               <div className='text-center'>
                 <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4'></div>
                 <p className='text-white'>Loading experiences...</p>
               </div>
             </div>
          ) : filteredCatalogues.length === 0 ? (
            <div className='text-center py-16'>
              <Search className='w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-500 opacity-50' />
              <h3 className='text-lg sm:text-xl font-semibold text-gray-300 mb-2'>
                Tidak ada template ditemukan
              </h3>
            </div>
          ) : (
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
              {filteredCatalogues.map((item) => (
                <div
                  key={item.data.productId}
                  onClick={() => handleNavigation(`/catalogue/${item.data.productName}`, item.data.productId)}
                  className='group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 overflow-hidden border border-gray-700/50 hover:-translate-y-1 cursor-pointer'
                >
                  {/* Loading Overlay */}
                  {navigatingId === item.data.productId && (
                    <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                    </div>
                  )}

                  <div className='relative h-48 sm:h-56 overflow-hidden'>
                    <img
                      src={item.data.coverImage}
                      alt={item.data.productName}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20'></div>

                    <div className='absolute top-2 left-2 sm:top-3 sm:left-3'>
                      <span
                        className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg ${getSegmentColor(
                          item.data.segmentation
                        )}`}
                      >
                        {item.data.segmentation}
                      </span>
                    </div>

                    <div className='absolute bottom-2 left-2 sm:bottom-3 sm:left-3'>
                      <span className='text-[10px] sm:text-xs font-medium text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/20'>
                        {item.data.productType}
                      </span>
                    </div>
                  </div>

                  <div className='p-3 sm:p-4 flex items-center justify-between gap-2'>
                    <h3 className='text-xs sm:text-base font-semibold text-white group-hover:text-pink-400 transition-colors line-clamp-1'>
                      {item.data.productName}
                    </h3>
                    <span className='text-xs sm:text-base font-bold text-pink-400 whitespace-nowrap'>
                      {formatPrice(item.data.basePriceNoPhoto)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
