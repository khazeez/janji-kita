'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Eye, Check, Star, Loader2 } from 'lucide-react';
import { useCurrentUser, useFavorites, toggleFavoriteProduct } from '@/hooks/useData';
import { Product } from '@/types/interface';

export default function Saved() {
  const router = useRouter();
  const { data: user, isLoading: loadingUser } = useCurrentUser();
  const { data: favoriteItems = [], isLoading: loadingFavorites, mutate } = useFavorites(user?.id);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleFavorite = async (id: string) => {
    if (!user) return;
    if (togglingId) return;
    setTogglingId(id);
    try {
      await toggleFavoriteProduct(user.id, id);
      mutate();
    } finally {
      setTogglingId(null);
    }
  };

  const handlePreview = (product: Product) => {
    const slug = getProductSlug(product);
    window.open(`/theme/${slug}`, '_blank');
  };

  const handleUse = (product: Product) => {
    router.push(`/create/${product.productId}`);
  };

  const getSegmentColor = (segment: string) => {
    switch (segment?.toLowerCase()) {
      case 'bronze':
        return 'bg-gradient-to-r from-amber-700 to-amber-500';
      case 'silver':
        return 'bg-gradient-to-r from-gray-400 to-gray-300';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-400';
      case 'platinum':
        return 'bg-gradient-to-r from-cyan-400 to-blue-400';
      default:
        return 'bg-gray-500';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loadingUser || loadingFavorites) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Memuat tema favorit...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Heart className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2 text-center px-4">
          Silakan Login
        </h2>
        <p className="text-sm text-gray-400 mb-6 text-center px-4">
          Login untuk melihat tema favoritmu
        </p>
        <button 
          onClick={() => router.push('/sign-in')}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors text-sm"
        >
          Login Sekarang
        </button>
      </div>
    );
  }

  if (favoriteItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Heart className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2 text-center px-4">
          Belum Ada Tema Favorit
        </h2>
        <p className="text-sm text-gray-400 mb-6 text-center px-4">
          Mulai tambahkan tema favoritmu dengan klik icon hati di katalog
        </p>
        <button 
          onClick={() => router.push('/dashboard/catalogue')}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors text-sm"
        >
          Jelajahi Tema
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm md:text-base text-gray-400">
          {favoriteItems.length} tema favorit tersimpan
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {favoriteItems.map((item) => (
          <div
            key={item.productId}
            className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-pink-500 transition-all duration-300 group"
          >
            {/* Image Container */}
            <div 
              className="relative aspect-[4/3] overflow-hidden cursor-pointer"
              onClick={() => router.push(`/dashboard/catalogue/${item.productName}`)}
            >
              <img
                src={item.coverImage}
                alt={item.productName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />

              {/* Segment Badge - Top Left */}
              <div className="absolute top-2 left-2 md:top-3 md:left-3">
                <span
                  className={`${getSegmentColor(item.segmentation)} text-white text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg`}
                >
                  {item.segmentation}
                </span>
              </div>

              {/* Favorite Button - Top Right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(item.productId);
                }}
                className={`absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 rounded-full transition-all duration-200 ${
                  togglingId === item.productId ? 'animate-pulse' : ''
                } ${
                  'bg-white/90 hover:bg-white'
                } group-hover:scale-110`}
                title="Hapus dari favorit"
              >
                <Heart
                  size={16}
                  className="text-pink-500 md:w-[18px] md:h-[18px] transition-colors"
                  fill="currentColor"
                />
              </button>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 md:gap-3 px-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(item);
                  }}
                  className="bg-white/90 hover:bg-white text-gray-900 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm"
                >
                  <Eye size={14} className="md:w-4 md:h-4" />
                  Preview
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUse(item);
                  }}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm"
                >
                  <Check size={14} className="md:w-4 md:h-4" />
                  Gunakan
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-3 md:p-4">
              <h3 className="text-xs md:text-lg font-bold text-white mb-1 md:mb-2 line-clamp-1">
                {item.productName}
              </h3>
              <p className="text-xs md:text-xl font-bold text-pink-500">
                {formatPrice(item.basePriceNoPhoto)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getProductSlug(product: Product): string {
  const pName = product.productName.toLowerCase();
  if (pName.includes('adat') || pName.includes('nusantara') || pName.includes('jawa')) {
    return 'nusantara';
  }
  return 'glasses';
}
