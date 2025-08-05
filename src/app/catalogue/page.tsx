'use client';
import React, { useState } from 'react';
import { Heart, Eye, Star, ArrowRight, Search, X } from 'lucide-react';

const catalogues = [
  {
    id: 1,
    name: 'Elegant Rose',
    price: 'Rp 150.000',
    originalPrice: 'Rp 200.000',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    category: 'Classic',
    rating: 4.9,
    features: ['Animasi Halus', 'Musik Latar', 'Galeri Foto'],
    popular: false,
  },
  {
    id: 2,
    name: 'Minimalist Love',
    price: 'Rp 120.000',
    originalPrice: 'Rp 160.000',
    image:
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop',
    category: 'Modern',
    rating: 4.8,
    features: ['Design Clean', 'Fast Loading', 'Mobile Friendly'],
    popular: true,
  },
  {
    id: 3,
    name: 'Classic Gold',
    price: 'Rp 180.000',
    originalPrice: 'Rp 250.000',
    image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
    category: 'Luxury',
    rating: 5.0,
    features: ['Premium Design', 'Custom Domain', 'RSVP System'],
    popular: false,
  },
  {
    id: 4,
    name: 'Garden Dream',
    price: 'Rp 140.000',
    originalPrice: 'Rp 180.000',
    image:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop',
    category: 'Nature',
    rating: 4.7,
    features: ['Floral Animation', 'Green Theme', 'Eco Friendly'],
    popular: false,
  },
  {
    id: 5,
    name: 'Modern Chic',
    price: 'Rp 165.000',
    originalPrice: 'Rp 220.000',
    image:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop',
    category: 'Contemporary',
    rating: 4.9,
    features: ['Bold Typography', 'Interactive Elements', 'Social Share'],
    popular: true,
  },
  {
    id: 6,
    name: 'Vintage Romance',
    price: 'Rp 175.000',
    originalPrice: 'Rp 230.000',
    image:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
    category: 'Vintage',
    rating: 4.8,
    features: ['Retro Style', 'Warm Colors', 'Classic Fonts'],
    popular: false,
  },
];

const categories = [
  'All',
  'Classic',
  'Modern',
  'Luxury',
  'Nature',
  'Contemporary',
  'Vintage',
];

export default function Catalogue() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCatalogues = catalogues.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.features.some((feature) =>
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const clearSearch = () => setSearchQuery('');

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800'>
      {/* Header */}
      <header className='relative overflow-hidden text-white min-h-[60vh] flex items-center'>
        {/* Background Image */}
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop&crop=center)',
          }}
        ></div>

        {/* Modern Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-pink-500/80 via-rose-600/70 to-purple-700/80'></div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent'></div>

        {/* Floating Elements */}
        <div className='absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-20 right-20 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000'></div>

        <div className='relative z-10 text-center py-20 px-6 w-full'>
          <div className='max-w-5xl mx-auto'>
            <div className='mb-6'>
              <span className='inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30'>
                ✨ Premium Wedding Invitations
              </span>
            </div>
            <h1 className='text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent leading-tight'>
              Undangan Digital
            </h1>
            <p className='text-xl md:text-2xl font-light mb-8 text-white/95 max-w-3xl mx-auto leading-relaxed'>
              Ciptakan momen istimewa dengan desain yang tak terlupakan.
              Sentuhan modern untuk hari bahagia Anda.
            </p>

            {/* Feature Pills */}
            <div className='flex flex-wrap items-center justify-center gap-4 mb-8'>
              <span className='flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30'>
                <Heart className='w-4 h-4 fill-current text-pink-300' />
                <span className='text-white/90'>Elegan</span>
              </span>
              <span className='flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30'>
                <Star className='w-4 h-4 fill-current text-yellow-300' />
                <span className='text-white/90'>Modern</span>
              </span>
              <span className='px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white/90'>
                Personal
              </span>
            </div>

            {/* CTA Buttons */}
            {/* <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <button className='px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-2xl shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300 transform hover:scale-105 flex items-center gap-2'>
                Jelajahi Template
                <ArrowRight className='w-5 h-5' />
              </button>
              <button className='px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-2xl border border-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-2'>
                <Eye className='w-5 h-5' />
                Lihat Demo
              </button>
            </div> */}
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <section className='py-8 px-6 bg-gray-800/50 backdrop-blur-sm'>
        <div className='max-w-2xl mx-auto'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Cari template, kategori, atau fitur...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-12 pr-12 py-4 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500/50 transition-all duration-300'
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-400 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className='py-12 px-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-wrap justify-center gap-3 mb-12'>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-lg shadow-pink-500/25 border border-pink-400/50'
                    : 'bg-gray-800/60 backdrop-blur-sm text-gray-300 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-rose-500/20 hover:text-pink-300 border border-gray-700/50 hover:border-pink-500/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue Grid */}
      <section className='pb-20 px-6'>
        <div className='max-w-7xl mx-auto'>
          {filteredCatalogues.length === 0 ? (
            <div className='text-center py-16'>
              <div className='text-gray-400 mb-4'>
                <Search className='w-16 h-16 mx-auto mb-4 opacity-50' />
              </div>
              <h3 className='text-xl font-semibold text-gray-300 mb-2'>
                Tidak ada template ditemukan
              </h3>
              <p className='text-gray-500'>
                Coba ubah kata kunci pencarian atau kategori
              </p>
            </div>
          ) : (
            <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8'>
              {filteredCatalogues.map((item) => (
                <div
                  key={item.id}
                  className='group relative bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 overflow-hidden border border-gray-700/50 hover:border-pink-500/30 transform hover:scale-105'
                  // onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Popular Badge */}
                  {item.popular && (
                    <div className='absolute top-4 left-4 z-20 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full'>
                      POPULER
                    </div>
                  )}

                  {/* Image Container */}
                  <div className='relative h-64 overflow-hidden'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300'></div>

                    {/* Hover Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-300 ${
                        hoveredCard === item.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <button className='bg-white text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors'>
                        <Eye className='w-4 h-4' />
                        Preview
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-6'>
                    {/* Category & Rating */}
                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-xs font-medium text-pink-300 bg-gradient-to-r from-pink-500/20 to-rose-500/20 px-3 py-1 rounded-full border border-pink-500/30 backdrop-blur-sm'>
                        {item.category}
                      </span>
                      <div className='flex items-center gap-1'>
                        <Star className='w-4 h-4 fill-amber-400 text-amber-400' />
                        <span className='text-sm font-medium text-gray-300'>
                          {item.rating}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className='text-xl font-semibold text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-rose-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300'>
                      {item.name}
                    </h3>

                    {/* Features */}
                    <div className='flex flex-wrap gap-1 mb-4'>
                      {item.features.map((feature, index) => (
                        <span
                          key={index}
                          className='text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded border border-gray-600/50'
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className='flex items-center justify-between mb-4'>
                      <div>
                        <span className='text-2xl font-bold text-white'>
                          {item.price}
                        </span>
                        <span className='text-sm text-gray-500 line-through ml-2'>
                          {item.originalPrice}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className='w-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-pink-500/25 transform hover:scale-105'>
                      Pilih Template
                      <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className='py-16 px-6 bg-gradient-to-r from-gray-800 to-gray-700 border-t border-gray-700/50'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-light mb-4 text-white'>
            Butuh Desain Custom?
          </h2>
          <p className='text-xl text-gray-300 mb-8'>
            Tim designer kami siap membantu mewujudkan undangan impian Anda
          </p>
          <button className='bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-pink-500/25 transform hover:scale-105'>
            Konsultasi Gratis
            <ArrowRight className='w-5 h-5' />
          </button>
        </div>
      </section>
    </div>
  );
}
