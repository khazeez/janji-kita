'use client';
import { useState, useEffect } from 'react';
import { Heart, Eye, Check, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/interface';
interface FavoriteProduct {
  PRODUCT_ID: string;
  PRODUCT_NAME: string;
  COVER_IMAGE: string;
  SEGMENTATION: string;
  TIER: string;
  BASE_PRICE_NO_PHOTO: number;
  PRODUCT_TYPE: string;
  IS_PROMO: boolean;
  PROMO_PRICE_NO_PHOTO: number;
}

interface FavoriteItem {
  FAVORITE_ID: string;
  CREATED_AT: string;
  PRODUCT: FavoriteProduct;
}

export default function Saved() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const res = await fetch('/api/favorites');
      if (res.status === 401) {
        router.push('/sign-in');
        return;
      }
      const result = await res.json();
      if (result.data) {
        setFavorites(result.data);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      const res = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.PRODUCT.PRODUCT_ID !== productId));
        window.dispatchEvent(new CustomEvent('update-counts'));
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleUse = (productName: string, productId: string) => {
    setNavigatingId(productId);
    router.push(`/create/${encodeURIComponent(productName)}`);
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Platinum': return 'bg-gradient-to-r from-slate-300 to-slate-500 text-white';
      case 'Gold': return 'bg-gradient-to-r from-amber-400 to-yellow-600 text-white';
      case 'Silver': return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900';
      case 'Bronze': return 'bg-gradient-to-r from-orange-400 to-amber-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (favorites.length === 0) {
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
          className='bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors text-sm md:text-base'
        >
          Jelajahi Tema
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-4 md:space-y-6'>
      <div>
        <p className='text-sm md:text-base text-gray-400'>
          {favorites.length} tema favorit tersimpan
        </p>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
        {favorites.map((fav) => {
          const p = fav.PRODUCT;
          return (
            <div
              key={fav.FAVORITE_ID}
              className='bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-pink-500 transition-all duration-300 group'
            >
              <div className='relative aspect-[4/3] bg-gradient-to-br from-pink-500/20 to-purple-600/20 overflow-hidden'>
                {p.COVER_IMAGE ? (
                  <img
                    src={p.COVER_IMAGE}
                    alt={p.PRODUCT_NAME}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center'>
                    <Heart className='w-12 h-12 md:w-16 md:h-16 text-pink-500/30' />
                  </div>
                )}

                <div className='absolute top-2 left-2 md:top-3 md:left-3'>
                  <span className={`${getSegmentColor(p.SEGMENTATION)} text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-wider`}>
                    {p.SEGMENTATION}
                  </span>
                </div>

                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 md:gap-3 px-4'>
                  <button
                    onClick={() => handleUse(p.PRODUCT_NAME, p.PRODUCT_ID)}
                    disabled={navigatingId === p.PRODUCT_ID}
                    className='bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm'
                  >
                    {navigatingId === p.PRODUCT_ID ? (
                      <Loader2 size={14} className='md:w-4 md:h-4 animate-spin' />
                    ) : (
                      <Check size={14} className='md:w-4 md:h-4' />
                    )}
                    Gunakan
                  </button>
                  <button
                    onClick={() => handleRemove(p.PRODUCT_ID)}
                    disabled={removingId === p.PRODUCT_ID}
                    className='bg-red-500/80 hover:bg-red-600 disabled:opacity-60 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm'
                  >
                    {removingId === p.PRODUCT_ID ? (
                      <Loader2 size={14} className='md:w-4 md:h-4 animate-spin' />
                    ) : (
                      <Trash2 size={14} className='md:w-4 md:h-4' />
                    )}
                    Hapus
                  </button>
                </div>
              </div>

              <div className='p-3 md:p-4'>
                <h3 className='text-xs md:text-lg font-bold text-white mb-1 md:mb-2 line-clamp-1'>
                  {p.PRODUCT_NAME}
                </h3>
                <p className='text-xs md:text-xl font-bold text-pink-500'>
                  {formatPrice(p.BASE_PRICE_NO_PHOTO)}
                </p>
              </div>
            </div>
          );
        })}
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
