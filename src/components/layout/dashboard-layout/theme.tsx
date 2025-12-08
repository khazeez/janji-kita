'use client';
import React, { useState, useEffect } from 'react';
import { Search, X, ArrowLeft, ExternalLink, Check, ChevronDown } from 'lucide-react';

interface CatalogueItem {
  id: number;
  name: string;
  price: string;
  segment: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  theme: string;
  productType: 'Web' | 'Video' | 'Filter IG/TikTok';
  image: string;
  description: string;
  features: string[];
  previewUrl: string;
}

const catalogues: CatalogueItem[] = [
  {
    id: 1,
    name: 'Elegant Rose',
    price: 'Rp 150.000',
    segment: 'Gold',
    theme: 'Adat',
    productType: 'Web',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    description: 'Design undangan pernikahan dengan nuansa adat yang elegan, dilengkapi dengan ornamen mawar yang indah.',
    features: ['Animasi halus', 'Musik latar', 'Galeri foto', 'RSVP online', 'Google Maps'],
    previewUrl: 'https://example.com/preview/elegant-rose',
  },
  {
    id: 2,
    name: 'Minimalist Love',
    price: 'Rp 120.000',
    segment: 'Silver',
    theme: 'Casual',
    productType: 'Web',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop',
    description: 'Design minimalis modern yang cocok untuk pernikahan casual dengan sentuhan romantis.',
    features: ['Design simpel', 'Loading cepat', 'RSVP', 'Countdown timer'],
    previewUrl: 'https://example.com/preview/minimalist-love',
  },
  {
    id: 3,
    name: 'Wedding Cinematic',
    price: 'Rp 500.000',
    segment: 'Platinum',
    theme: 'Luxury',
    productType: 'Video',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
    description: 'Video pernikahan cinematic dengan kualitas premium dan editing profesional.',
    features: ['4K Resolution', 'Color grading', 'Slow motion', 'Drone footage', 'Same day edit'],
    previewUrl: 'https://example.com/preview/wedding-cinematic',
  },
  {
    id: 4,
    name: 'Romantic Filter',
    price: 'Rp 75.000',
    segment: 'Bronze',
    theme: 'Casual',
    productType: 'Filter IG/TikTok',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop',
    description: 'Filter Instagram dan TikTok dengan efek romantis untuk momen spesial Anda.',
    features: ['Custom effect', 'Brand name', 'Wedding date', 'AR effects', 'Easy to use'],
    previewUrl: 'https://example.com/preview/romantic-filter',
  },
  {
    id: 5,
    name: 'Garden Dream',
    price: 'Rp 140.000',
    segment: 'Gold',
    theme: 'Agama',
    productType: 'Web',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop',
    description: 'Design bernuansa taman yang indah dengan sentuhan religius yang anggun.',
    features: ['Ayat suci', 'Musik islami', 'Galeri foto', 'RSVP', 'Lokasi acara'],
    previewUrl: 'https://example.com/preview/garden-dream',
  },
  {
    id: 6,
    name: 'Luxury Wedding Video',
    price: 'Rp 800.000',
    segment: 'Platinum',
    theme: 'Luxury',
    productType: 'Video',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop',
    description: 'Paket video pernikahan luxury dengan tim profesional dan equipment high-end.',
    features: ['Full day coverage', 'Multiple cameras', 'Professional editor', 'Highlight reel', 'Raw footage'],
    previewUrl: 'https://example.com/preview/luxury-video',
  },
  {
    id: 7,
    name: 'Vintage Filter Pack',
    price: 'Rp 60.000',
    segment: 'Bronze',
    theme: 'Casual',
    productType: 'Filter IG/TikTok',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
    description: 'Set filter vintage untuk Instagram dan TikTok dengan efek klasik yang timeless.',
    features: ['3 filter variants', 'Vintage effects', 'Customizable', 'Save to camera roll'],
    previewUrl: 'https://example.com/preview/vintage-filter',
  },
  {
    id: 8,
    name: 'Royal Wedding',
    price: 'Rp 180.000',
    segment: 'Gold',
    theme: 'Adat',
    productType: 'Web',
    image: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=400&h=300&fit=crop',
    description: 'Undangan megah dengan nuansa kerajaan untuk pernikahan adat yang istimewa.',
    features: ['Royal theme', 'Traditional music', 'Rich animations', 'Extended gallery', 'Gift registry'],
    previewUrl: 'https://example.com/preview/royal-wedding',
  },
];

const segments: string[] = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze'];
const productTypes: string[] = ['Semua Produk', 'Web', 'Video', 'Filter IG/TikTok'];

export default function Catalogue() {
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [selectedProductType, setSelectedProductType] = useState<string>('Semua Produk');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isHeaderFixed, setIsHeaderFixed] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<CatalogueItem | null>(null);
  const [withPhoto, setWithPhoto] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setIsHeaderFixed(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setWithPhoto(false);
    }
  }, [selectedItem]);

  const filteredCatalogues = catalogues.filter((item) => {
    const matchesSegment = selectedSegment === 'All' || item.segment === selectedSegment;
    const matchesProductType = selectedProductType === 'Semua Produk' || item.productType === selectedProductType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSegment && matchesProductType && matchesSearch;
  });

  const calculatePrice = () => {
    if (!selectedItem) return '0';
    const basePrice = parseInt(selectedItem.price.replace(/[^0-9]/g, ''));
    const photoPrice = 50000;
    const totalPrice = withPhoto ? basePrice + photoPrice : basePrice;
    return totalPrice.toLocaleString('id-ID');
  };

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

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case 'Web':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Video':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Filter IG/TikTok':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleItemClick = (item: CatalogueItem) => {
    setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  const handleUseDesign = () => {
    window.location.href = '/dashboard/form';
  };

  const handlePreview = (url: string) => {
    window.open(url, '_blank');
  };

  // Detail View
  if (selectedItem) {
    return (
      <div className='min-h-screen bg-transparent'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>
          <button
            onClick={handleBackToList}
            className='flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors mb-4 sm:mb-6'
          >
            <ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
            <span className='text-sm sm:text-base font-medium'>Kembali ke Katalog</span>
          </button>

          <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden'>
            <div className='grid md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8'>
              <div className='space-y-3 sm:space-y-4'>
                <div className='relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg'>
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className='w-full h-64 sm:h-80 lg:h-96 object-cover'
                  />
                  <div className='absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-2'>
                    <span className={`text-xs sm:text-sm font-bold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-lg ${getSegmentColor(selectedItem.segment)}`}>
                      {selectedItem.segment}
                    </span>
                    <span className={`text-xs sm:text-sm font-semibold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-lg border ${getProductTypeColor(selectedItem.productType)}`}>
                      {selectedItem.productType}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col justify-between space-y-4 sm:space-y-0'>
                <div className='space-y-4'>
                  <div>
                    <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>
                      {selectedItem.name}
                    </h1>
                    <div className='flex items-center justify-between'>
                      <span className='inline-block text-xs sm:text-sm font-medium text-pink-400 bg-pink-400/10 px-3 py-1 rounded-full border border-pink-400/20'>
                        {selectedItem.theme}
                      </span>
                    </div>
                  </div>

                  <p className='text-sm sm:text-base text-gray-300 leading-relaxed'>
                    {selectedItem.description}
                  </p>

                  {selectedItem.productType === 'Web' && (
                    <div className='bg-gray-700/30 rounded-lg p-4 border border-gray-600/50'>
                      <h3 className='text-sm sm:text-base font-semibold text-white mb-3'>
                        Pilih Paket:
                      </h3>
                      <div className='grid grid-cols-2 gap-3'>
                        <button
                          onClick={() => setWithPhoto(false)}
                          className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all ${
                            !withPhoto
                              ? 'border-pink-500 bg-pink-500/10'
                              : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                          }`}
                        >
                          {!withPhoto && (
                            <div className='absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center'>
                              <Check className='w-4 h-4 text-white' />
                            </div>
                          )}
                          <div className='text-center'>
                            <p className='text-xs sm:text-sm font-semibold text-white mb-1'>
                              Tanpa Foto
                            </p>
                            <p className='text-lg sm:text-xl font-bold text-pink-400'>
                              {selectedItem.price}
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => setWithPhoto(true)}
                          className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all ${
                            withPhoto
                              ? 'border-pink-500 bg-pink-500/10'
                              : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                          }`}
                        >
                          {withPhoto && (
                            <div className='absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center'>
                              <Check className='w-4 h-4 text-white' />
                            </div>
                          )}
                          <div className='text-center'>
                            <p className='text-xs sm:text-sm font-semibold text-white mb-1'>
                              Dengan Foto
                            </p>
                            <p className='text-lg sm:text-xl font-bold text-pink-400'>
                              Rp{' '}
                              {(
                                parseInt(selectedItem.price.replace(/[^0-9]/g, '')) + 50000
                              ).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </button>
                      </div>
                      <p className='text-xs text-gray-400 mt-3 text-center'>
                        {withPhoto ? '+ Foto prewedding di halaman utama' : 'Tanpa foto prewedding'}
                      </p>
                    </div>
                  )}

                  <div className='bg-gradient-to-r from-pink-600/20 to-pink-500/20 rounded-lg p-4 border border-pink-500/30'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm sm:text-base text-gray-300'>Total Harga:</span>
                      <span className='text-2xl sm:text-3xl font-bold text-pink-400'>
                        Rp {selectedItem.productType === 'Web' ? calculatePrice() : selectedItem.price.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className='text-base sm:text-lg font-semibold text-white mb-3'>
                      Fitur yang Tersedia:
                    </h3>
                    <ul className='space-y-2'>
                      {selectedItem.features.map((feature, index) => (
                        <li
                          key={index}
                          className='flex items-start gap-2 text-sm sm:text-base text-gray-300'
                        >
                          <div className='w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 flex-shrink-0'></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700/50 mt-4'>
                  <button
                    onClick={() => handlePreview(selectedItem.previewUrl)}
                    className='flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-300 border border-gray-600/50 text-sm sm:text-base'
                  >
                    <ExternalLink className='w-4 h-4 sm:w-5 sm:h-5' />
                    Preview
                  </button>
                  <button
                    onClick={handleUseDesign}
                    className='flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 text-sm sm:text-base'
                  >
                    Pakai Design Ini
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Catalogue List View
  return (
    <div className='min-h-screen bg-transparent'>
      <header className='z-50 top-0 border-b border-gray-700/40 transition-all duration-500'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6'>
          {/* Search Bar & Dropdown */}
          <div className='flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-4 sm:mb-6'>
            {/* Search */}
            <div className='relative flex-1'>
              <Search className='absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5' />
              <input
                type='text'
                placeholder='Cari nama atau tema...'
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

            {/* Dropdown Product Type */}
            <div className='relative w-full sm:w-64'>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='w-full flex items-center justify-between px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white hover:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300'
              >
                <span className='truncate'>{selectedProductType}</span>
                <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className='absolute top-full mt-2 w-full bg-gray-800 border border-gray-700/50 rounded-xl shadow-xl overflow-hidden z-50'>
                  {productTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedProductType(type);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-700 transition-colors ${
                        selectedProductType === type ? 'bg-pink-600 text-white' : 'text-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
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

      <section className='py-8 px-4 sm:px-6'>
        <div className='max-w-7xl mx-auto'>
          {filteredCatalogues.length === 0 ? (
            <div className='text-center py-16'>
              <Search className='w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-500 opacity-50' />
              <h3 className='text-lg sm:text-xl font-semibold text-gray-300 mb-2'>
                Tidak ada template ditemukan
              </h3>
              <p className='text-sm text-gray-400'>Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
              {filteredCatalogues.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className='group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 overflow-hidden border border-gray-700/50 hover:-translate-y-1 cursor-pointer'
                >
                  <div className='relative h-48 sm:h-56 overflow-hidden'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20'></div>

                    <div className='absolute top-2 left-2 sm:top-3 sm:left-3 flex gap-1.5'>
                      <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg ${getSegmentColor(item.segment)}`}>
                        {item.segment}
                      </span>
                    </div>

                    <div className='absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex gap-1.5'>
                      <span className='text-[10px] sm:text-xs font-medium text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/20'>
                        {item.theme}
                      </span>
                      <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm border ${getProductTypeColor(item.productType)}`}>
                        {item.productType}
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