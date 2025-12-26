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
    <div className='min-h-screen bg-transparent'>
      <header className='z-50 top-0 border-b border-gray-700/40 transition-all duration-500'>
        <div className='max-w-7xl mx-auto  pb-5'>
          {/* Search Bar & Dropdown */}
          <div className='flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mb-3 sm:mb-6'>
            {/* Search */}
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Cari tema...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-9 pr-9 py-2 text-sm bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300'
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-400 transition-colors'
                >
                  <X className='w-4 h-4' />
                </button>
              )}
            </div>

            {/* Dropdown Product Type */}
            <div className='relative w-full sm:w-56'>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white hover:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300'
              >
                <span className='truncate text-xs sm:text-sm'>
                  {selectedProductType}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className='absolute top-full mt-1 w-full bg-gray-800 border border-gray-700/50 rounded-lg shadow-xl overflow-hidden z-50'>
                  {productTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedProductType(type);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-gray-700 transition-colors ${
                        selectedProductType === type
                          ? 'bg-pink-600 text-white'
                          : 'text-gray-300'
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
          <div className='flex flex-wrap justify-center gap-1.5 sm:gap-3'>
            {segments.map((segment) => (
              <button
                key={segment}
                onClick={() => setSelectedSegment(segment)}
                className={`px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full font-medium text-[10px] sm:text-sm transition-all duration-300 ${
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
              <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
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
