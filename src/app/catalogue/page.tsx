'use client';
import React, { useState, useEffect } from 'react';
import { Search, X, Heart, Star } from 'lucide-react';

interface CatalogueItem {
  id: number;
  name: string;
  price: string;
  segment: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  theme: string;
  image: string;
}

const catalogues: CatalogueItem[] = [
  {
    id: 1,
    name: 'Elegant Rose',
    price: 'Rp 150.000',
    segment: 'Gold',
    theme: 'Adat',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Minimalist Love',
    price: 'Rp 120.000',
    segment: 'Silver',
    theme: 'Casual',
    image:
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Classic Pink',
    price: 'Rp 250.000',
    segment: 'Platinum',
    theme: 'Luxury',
    image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    name: 'Garden Dream',
    price: 'Rp 140.000',
    segment: 'Gold',
    theme: 'Agama',
    image:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    name: 'Modern Chic',
    price: 'Rp 220.000',
    segment: 'Platinum',
    theme: 'Luxury',
    image:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    name: 'Vintage Romance',
    price: 'Rp 130.000',
    segment: 'Silver',
    theme: 'Casual',
    image:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
  },
  {
    id: 7,
    name: 'Royal Wedding',
    price: 'Rp 180.000',
    segment: 'Gold',
    theme: 'Adat',
    image:
      'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=400&h=300&fit=crop',
  },
  {
    id: 8,
    name: 'Simple Elegance',
    price: 'Rp 90.000',
    segment: 'Bronze',
    theme: 'Agama',
    image:
      'https://images.unsplash.com/photo-1522673607212-f2f8ca47c9d4?w=400&h=300&fit=crop',
  },
];

const segments: string[] = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze'];

export default function Catalogue() {
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isHeaderFixed, setIsHeaderFixed] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setIsHeaderFixed(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredCatalogues = catalogues.filter((item) => {
    const matchesSegment =
      selectedSegment === 'All' || item.segment === selectedSegment;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.theme.toLowerCase().includes(searchQuery.toLowerCase());
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
          {filteredCatalogues.length === 0 ? (
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
                  key={item.id}
                  className='group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 overflow-hidden border border-gray-700/50 hover:-translate-y-1 cursor-pointer'
                >
                  <div className='relative h-48 sm:h-56 overflow-hidden'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20'></div>

                    <div className='absolute top-2 left-2 sm:top-3 sm:left-3'>
                      <span
                        className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg ${getSegmentColor(
                          item.segment
                        )}`}
                      >
                        {item.segment}
                      </span>
                    </div>

                    <div className='absolute bottom-2 left-2 sm:bottom-3 sm:left-3'>
                      <span className='text-[10px] sm:text-xs font-medium text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/20'>
                        {item.theme}
                      </span>
                    </div>
                  </div>

                  <div className='p-3 sm:p-4 flex items-center justify-between gap-2'>
                    <h3 className='text-xs sm:text-base font-semibold text-white group-hover:text-pink-400 transition-colors line-clamp-1'>
                      {item.name}
                    </h3>
                    <span className='text-xs sm:text-base font-bold text-pink-400 whitespace-nowrap'>
                      {item.price}
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
