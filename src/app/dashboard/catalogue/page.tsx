'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Heart, Star, Loader2 } from 'lucide-react';
import { useProducts, useCurrentUser, useFavorites, toggleFavoriteProduct } from '@/hooks/useData';

const segments: string[] = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze'];

export default function DashboardCatalogue() {
  const router = useRouter();
  const { data: products, isLoading } = useProducts();
  const { data: user } = useCurrentUser();
  const { data: favorites = [] } = useFavorites(user?.id);
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const favoriteIds = new Set(favorites.map((f: any) => f.PRODUCT?.PRODUCT_ID || f.productId).filter(Boolean));

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

  const handleToggleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!user) {
      router.push('/sign-in');
      return;
    }
    if (togglingId) return;
    setTogglingId(productId);
    const isFavorite = favoriteIds.has(productId);
    try {
      await toggleFavoriteProduct(user.id, productId, isFavorite);
      window.dispatchEvent(new CustomEvent('update-counts'));
    } finally {
      setTogglingId(null);
    }
  };

  const filteredCatalogues = (products || []).filter((item) => {
    if (!item) return false;

    const matchesSegment =
      selectedSegment === 'All' || item.segmentation === selectedSegment;

    const matchesSearch =
      item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.segmentation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productType?.toLowerCase().includes(searchQuery.toLowerCase());

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Katalog Tema</h1>
          <p className="text-gray-400 text-sm">Pilih tema undangan digital terbaik untuk momen spesialmu.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari nama atau tema undangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-400 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Segment Filter */}
          <div className="flex flex-wrap gap-2">
            {segments.map((segment) => (
              <button
                key={segment}
                onClick={() => setSelectedSegment(segment)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedSegment === segment
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {segment}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalogue Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
          <p className="text-gray-400 animate-pulse">Memuat koleksi tema...</p>
        </div>
      ) : filteredCatalogues.length === 0 ? (
        <div className="bg-gray-800 border border-dashed border-gray-700 rounded-3xl p-12 text-center">
          <div className="bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">
            Tidak ada template ditemukan
          </h3>
          <p className="text-gray-500 text-sm mb-4">Coba gunakan kata kunci lain atau ubah filter.</p>
          <button 
            onClick={() => {setSelectedSegment('All'); clearSearch();}}
            className="text-pink-500 hover:text-pink-400 font-medium text-sm underline underline-offset-4"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCatalogues.map((item) => (
            <div
              key={item.productId}
              onClick={() => handleNavigation(`/dashboard/catalogue/${item.productName}`, item.productId)}
              className="group relative bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-pink-500/10"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={item.coverImage}
                  alt={item.productName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Segment Tag */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-wider ${getSegmentColor(item.segmentation)}`}>
                    {item.segmentation}
                  </span>
                </div>

                {/* Favorite Button */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  <button
                    onClick={(e) => handleToggleFavorite(e, item.productId)}
                    disabled={togglingId === item.productId}
                    className={`p-2 rounded-xl border transition-all ${
                      favoriteIds.has(item.productId)
                        ? 'bg-pink-600 border-pink-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-pink-600 hover:border-pink-500 hover:text-white'
                    }`}
                  >
                    {togglingId === item.productId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart className={`w-4 h-4 ${favoriteIds.has(item.productId) ? 'fill-current' : ''}`} />
                    )}
                  </button>
                </div>

                {/* Type Badge */}
                <div className="absolute bottom-3 left-3">
                   <span className="text-[10px] font-medium text-gray-300 bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-700">
                    {item.productType}
                  </span>
                </div>
              </div>

                {/* Info Container */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-1">
                      {item.productName}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold">4.9</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-400 italic">Mulai dari</span>
                    <span className="text-pink-500 font-bold group-hover:scale-105 transition-transform">
                      {formatPrice(item.basePriceNoPhoto)}
                    </span>
                  </div>
                </div>

                {/* Navigation Loading Overlay */}
                {navigatingId === item.productId && (
                  <div className="absolute inset-0 z-20 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
