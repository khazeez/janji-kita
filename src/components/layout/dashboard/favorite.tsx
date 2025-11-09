'use client';
import { useState } from 'react';
import { Heart, Eye, Check } from 'lucide-react';
import Image from 'next/image';

interface FavoriteItem {
  id: string;
  name: string;
  image: string;
  segment: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  theme: 'Adat' | 'GenZ' | 'Klasik';
  price: number;
  isSaved: boolean;
}

export default function Saved() {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([
    {
      id: '1',
      name: 'Elegant Wedding',
      image: '/themes/elegant.jpg',
      segment: 'Gold',
      theme: 'Klasik',
      price: 350000,
      isSaved: true,
    },
    {
      id: '2',
      name: 'Modern Minimalist',
      image: '/themes/modern.jpg',
      segment: 'Platinum',
      theme: 'GenZ',
      price: 450000,
      isSaved: true,
    },
    {
      id: '3',
      name: 'Rustic Romance',
      image: '/themes/rustic.jpg',
      segment: 'Silver',
      theme: 'Adat',
      price: 400000,
      isSaved: true,
    },
    {
      id: '4',
      name: 'Garden Paradise',
      image: '/themes/garden.jpg',
      segment: 'Bronze',
      theme: 'GenZ',
      price: 250000,
      isSaved: true,
    },
    {
      id: '5',
      name: 'Royal Majesty',
      image: '/themes/royal.jpg',
      segment: 'Platinum',
      theme: 'Klasik',
      price: 500000,
      isSaved: true,
    },
    {
      id: '6',
      name: 'Traditional Heritage',
      image: '/themes/traditional.jpg',
      segment: 'Gold',
      theme: 'Adat',
      price: 380000,
      isSaved: true,
    },
  ]);

  const toggleSave = (id: string) => {
    setFavoriteItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSaved: !item.isSaved } : item
      )
    );
  };

  const handlePreview = (id: string) => {
    console.log('Preview tema:', id);
    // Logic preview theme akan ditambahkan di sini
  };

  const handleUse = (id: string) => {
    console.log('Gunakan tema:', id);
    // Logic untuk menggunakan tema akan ditambahkan di sini
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Bronze':
        return 'bg-gradient-to-r from-amber-700 to-amber-500';
      case 'Silver':
        return 'bg-gradient-to-r from-gray-400 to-gray-300';
      case 'Gold':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-400';
      case 'Platinum':
        return 'bg-gradient-to-r from-cyan-400 to-blue-400';
      default:
        return 'bg-gray-500';
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Adat':
        return 'bg-orange-500/90';
      case 'GenZ':
        return 'bg-purple-500/90';
      case 'Klasik':
        return 'bg-blue-500/90';
      default:
        return 'bg-gray-500/90';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const savedItems = favoriteItems.filter((item) => item.isSaved);

  if (savedItems.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px]'>
        <Heart className='w-16 h-16 md:w-24 md:h-24 text-gray-600 mb-4' />
        <h2 className='text-xl md:text-2xl font-bold text-white mb-2 text-center px-4'>
          Belum Ada Tema Favorit
        </h2>
        <p className='text-sm md:text-base text-gray-400 mb-6 text-center px-4'>
          Mulai tambahkan tema favoritmu dengan klik icon hati
        </p>
        <button className='bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors text-sm md:text-base'>
          Jelajahi Tema
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-4 md:space-y-6'>
      {/* Header */}
      <div>
        <h2 className='text-xl text-center md:text-2xl lg:text-2xl font-bold text-white mb-1 md:mb-2'>
          Tema Favorit
        </h2>
        <p className='text-sm md:text-base text-gray-400'>
          {savedItems.length} tema favorit tersimpan
        </p>
      </div>

      {/* Grid Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
        {savedItems.map((item) => (
          <div
            key={item.id}
            className='bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-pink-500 transition-all duration-300 group'
          >
            {/* Image Container */}
            <div className='relative aspect-[4/3] bg-gradient-to-br from-pink-500/20 to-purple-600/20 overflow-hidden'>
              {/* Placeholder Image */}
              <div className='w-full h-full flex items-center justify-center'>
                <Heart className='w-12 h-12 md:w-16 md:h-16 text-pink-500/30' />
              </div>

              {/* Segment Badge - Top Left */}
              <div className='absolute top-2 left-2 md:top-3 md:left-3'>
                <span
                  className={`${getSegmentColor(
                    item.segment
                  )} text-white text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg`}
                >
                  {item.segment}
                </span>
              </div>

              {/* Theme Badge - Bottom Left */}
              <div className='absolute bottom-2 left-2 md:bottom-3 md:left-3'>
                <span
                  className={`${getThemeColor(
                    item.theme
                  )} backdrop-blur-sm text-white text-[10px] md:text-xs font-semibold px-2 py-1 md:px-3 md:py-1.5 rounded-full`}
                >
                  {item.theme}
                </span>
              </div>

              {/* Favorite Button - Top Right */}
              <button
                onClick={() => toggleSave(item.id)}
                className='absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 bg-white/90 hover:bg-white rounded-full transition-all duration-200 group-hover:scale-110'
                title={
                  item.isSaved ? 'Hapus dari favorit' : 'Tambah ke favorit'
                }
              >
                <Heart
                  size={16}
                  className={`md:w-[18px] md:h-[18px] transition-colors ${
                    item.isSaved ? 'text-pink-500' : 'text-gray-400'
                  }`}
                  fill={item.isSaved ? 'currentColor' : 'none'}
                />
              </button>

              {/* Hover Overlay */}
              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 md:gap-3 px-4'>
                <button
                  onClick={() => handlePreview(item.id)}
                  className='bg-white/90 hover:bg-white text-gray-900 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm'
                >
                  <Eye size={14} className='md:w-4 md:h-4' />
                  Preview
                </button>
                <button
                  onClick={() => handleUse(item.id)}
                  className='bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm'
                >
                  <Check size={14} className='md:w-4 md:h-4' />
                  Gunakan
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className='p-3 md:p-4'>
              <h3 className='text-base md:text-lg font-bold text-white mb-1 md:mb-2 line-clamp-1'>
                {item.name}
              </h3>
              <p className='text-lg md:text-xl font-bold text-pink-500'>
                {formatPrice(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
