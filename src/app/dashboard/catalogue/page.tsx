'use client';
import React, { useState, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { getProductInvitation } from '@/models/invitations';
import { Product } from '@/types/interface';
import Link from 'next/link';

interface CatalogueItem {
  data: Product;
}

const segments: string[] = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze'];
const productTypes: string[] = [
  'Semua Produk',
  'Web',
  'Video',
  'Filter IG/TikTok',
];

export default function Catalogue() {
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [selectedProductType, setSelectedProductType] =
    useState<string>('Semua Produk');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data: Product[] = await getProductInvitation();

        // pastikan semua item tidak undefined dan bungkus ke CatalogueItem
        const wrappedData: CatalogueItem[] = data
          .filter(Boolean) // remove undefined/null
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

  const filteredCatalogues = catalogues.filter((item) => {
    if (!item?.data) return false; // safety check

    const matchesSegment =
      selectedSegment === 'All' || item.data.segmentation === selectedSegment;
    const matchesProductType =
      selectedProductType === 'Semua Produk' ||
      item.data.productType === selectedProductType;

    const matchesSearch =
      item.data.productName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.data.segmentation
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.data.productType?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSegment && matchesProductType && matchesSearch;
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

  return (
    <div className='min-h-screen bg-transparent sm:px-5'>
      <div className='pb-2 px-2'>
        <h1 className='sm:text-3xl text-xl font-bold'>
          Pilih tema yang kamu suka!
        </h1>
        <p className='text-sm text-gray-400'>
          Ada lebih dari 100+ tema yang bisa kamu pilih
        </p>
      </div>
      <header className='sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-white/10 transition-all duration-500'>
        <div className='max-w-7xl mx-auto px-4 py-6'>
          {/* Search Bar & Dropdown */}
          <div className='flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto mb-6'>
            {/* Search */}
            <div className='relative flex-1 group'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-pink-400 transition-colors' />
              <input
                type='text'
                placeholder='Cari tema...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-12 pr-12 py-3.5 text-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 hover:border-white/20 transition-all duration-300 shadow-lg shadow-black/5'
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-400 hover:bg-white/10 rounded-lg p-1 transition-all duration-200'
                >
                  <X className='w-4 h-4' />
                </button>
              )}
            </div>

            {/* Dropdown Product Type */}
            <div className='relative w-full sm:w-64'>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='w-full flex items-center justify-between px-4 py-3.5 text-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white hover:border-pink-500/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 shadow-lg shadow-black/5'
              >
                <span className='truncate text-sm font-medium'>
                  {selectedProductType}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180 text-pink-400' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className='absolute top-full mt-2 w-full bg-gray-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
                  {productTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedProductType(type);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                        selectedProductType === type
                          ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-500/20'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
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
                className={`px-5 py-2.5 sm:px-7 sm:py-3 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  selectedSegment === segment
                    ? 'bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 text-white shadow-xl shadow-pink-500/40 border border-pink-400/20'
                    : 'bg-white/5 backdrop-blur-md text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20 shadow-lg shadow-black/5'
                }`}
              >
                {segment}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <div className='flex items-center justify-center min-h-screen bg-gray-900'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4'></div>
            <p className='text-white'>Loading...</p>
          </div>
        </div>
      ) : (
        <section className=''>
          <div className=' mx-auto'>
            {filteredCatalogues.length === 0 ? (
              <div className='text-center py-12'>
                <Search className='w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-3 text-gray-500 opacity-50' />
                <h3 className='text-base sm:text-xl font-semibold text-gray-300 mb-1.5'>
                  Tidak ditemukan
                </h3>
                <p className='text-xs sm:text-sm text-gray-400'>
                  Coba ubah filter pencarian
                </p>
              </div>
            ) : (
              <div className='grid pt-10 grid-cols-2 lg:grid-cols-3 gap-2'>
                {filteredCatalogues.map((item) => (
                  <Link
                    key={item.data.productId} // pastikan ada key
                    href={`catalogue/${item.data.productName}`}
                    className='group bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 overflow-hidden border border-gray-700/50 hover:-translate-y-1 cursor-pointer'
                  >
                    <div className='relative h-60 md:h-85 overflow-hidden'>
                      <img
                        src={item.data.coverImage}
                        alt={item.data.productName}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20'></div>

                      <div className='absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex gap-1'>
                        <span
                          className={`text-[8px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg ${getSegmentColor(
                            item.data.segmentation
                          )}`}
                        >
                          {item.data.segmentation}
                        </span>
                      </div>

                      <div className='absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 flex gap-1'>
                        <span className='text-[8px] sm:text-xs font-medium text-white bg-black/60 backdrop-blur-sm px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/20'>
                          {item.data.segmentation}
                        </span>
                        <span
                          className={`text-[8px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm border ${getProductTypeColor(
                            item.data.productType
                          )}`}
                        >
                          {item.data.productType}
                        </span>
                      </div>
                    </div>

                    <div className='p-2 sm:p-4 flex items-center justify-between gap-1.5'>
                      <h3 className='text-[11px] sm:text-base font-semibold text-white group-hover:text-pink-400 transition-colors line-clamp-1'>
                        {item.data.productName}
                      </h3>
                      <span className='text-[10px] sm:text-base font-bold text-pink-400 whitespace-nowrap'>
                        {item.data.basePriceNoPhoto}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
