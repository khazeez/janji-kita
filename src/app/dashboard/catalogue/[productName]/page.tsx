'use client';

import { ArrowLeft, ExternalLink, Check } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getProductByName } from '@/models/invitations';
import { Product } from '@/types/interface';
import Link from 'next/link';

interface ProductDetail {
  data: Product;
}

export default function ProductDetailPage() {
  // router back
  const router = useRouter();
  const handleBack = () => router.back();

  // ambil params slug
  const params = useParams();
  // const productName = params.productName;
  const slugParam = Array.isArray(params?.productName)
    ? params.productName[0]
    : params?.productName;
  const productName = slugParam?.toString().toLowerCase();

  // state data produk
  const [selectedItem, setSelectedItem] = useState<ProductDetail | null>(null);
  const [withPhoto, setWithPhoto] = useState(false);

  // ambil data detail produk
  useEffect(() => {
    if (!productName) {
      console.log('AAAAAAAAAAAAAAAAA');
    }
    const fetchDetail = async () => {
      const product = await getProductByName('Glasses');
      if (product) {
        setSelectedItem({ data: product.transformedData[0] });
        console.log(product.transformedData[0]);
      }
    };
    fetchDetail();
  }, [productName]);

  // hitung harga
  const calculatePrice = () => {
    if (!selectedItem) return 0;
    return withPhoto
      ? selectedItem.data.basePriceWithPhoto
      : selectedItem.data.basePriceNoPhoto;
  };

  const getSegmentColor = (segmentation: string) => {
    switch (segmentation) {
      case 'Premium':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'Standard':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  const handlePreview = (desc: string) => {
    console.log('Preview:', desc);
  };

  // render
  return (
    <div className='min-h-screen bg-transparent pb-20'>
      <div className='max-w-6xl mx-auto'>
        {selectedItem ? (
          <div className='overflow-hidden'>
            <header className='flex gap-2 md:ml-10'>
              <button
                onClick={handleBack}
                className='flex items-center gap-1.5 text-gray-300 hover:text-pink-400 transition-colors mb-3 sm:mb-6'
              >
                <ArrowLeft className='w-4 h-4' />
              </button>
              <h1 className='text-3xl font-bold text-white mb-1.5'>
                {selectedItem.data.productName}
              </h1>
            </header>

            <div className='grid md:grid-cols-2 gap-3 sm:gap-6 p-3 sm:p-6 lg:p-8'>
              {/* LEFT */}
              <div className='space-y-2 sm:space-y-4'>
                <div className='relative rounded-lg overflow-hidden shadow-lg'>
                  <img
                    src={selectedItem.data.coverImage}
                    alt={selectedItem.data.productName}
                    className='w-full h-100 lg:h-full object-cover'
                  />
                  <div className='absolute top-2 left-2 flex gap-1.5'>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg ${getSegmentColor(
                        selectedItem.data.segmentation
                      )}`}
                    >
                      {selectedItem.data.segmentation}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className='flex flex-col justify-between space-y-3 sm:space-y-0'>
                <div className='space-y-3 sm:space-y-4'>
                  <div>
                    <span className='inline-block text-[10px] sm:text-sm font-medium text-pink-400 bg-pink-400/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-pink-400/20'>
                      {selectedItem.data.tier}
                    </span>
                  </div>

                  <p className='text-xs sm:text-base text-gray-300 leading-relaxed'>
                    {selectedItem.data.description}
                  </p>

                  {selectedItem.data.productType === 'web' && (
                    <div className='bg-gray-700/30 rounded-lg p-3 border border-gray-600/50'>
                      <h3 className='text-xs sm:text-base font-semibold text-white mb-2'>
                        Pilih Paket:
                      </h3>
                      <div className='grid grid-cols-2 gap-2'>
                        <button
                          onClick={() => setWithPhoto(false)}
                          className={`relative p-2.5 sm:p-4 rounded-lg border-2 transition-all ${
                            !withPhoto
                              ? 'border-pink-500 bg-pink-500/10'
                              : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                          }`}
                        >
                          {!withPhoto && (
                            <div className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center'>
                              <Check className='w-3 h-3 text-white' />
                            </div>
                          )}
                          <div className='text-center'>
                            <p className='text-[10px] sm:text-sm font-semibold text-white mb-0.5'>
                              Tanpa Foto
                            </p>
                            <p className='text-sm sm:text-xl font-bold text-pink-400'>
                              Rp {selectedItem.data.basePriceNoPhoto}
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => setWithPhoto(true)}
                          className={`relative p-2.5 sm:p-4 rounded-lg border-2 transition-all ${
                            withPhoto
                              ? 'border-pink-500 bg-pink-500/10'
                              : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                          }`}
                        >
                          {withPhoto && (
                            <div className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center'>
                              <Check className='w-3 h-3 text-white' />
                            </div>
                          )}
                          <div className='text-center'>
                            <p className='text-[10px] sm:text-sm font-semibold text-white mb-0.5'>
                              Dengan Foto
                            </p>
                            <p className='text-sm sm:text-xl font-bold text-pink-400'>
                              Rp {selectedItem.data.basePriceWithPhoto}
                            </p>
                          </div>
                        </button>
                      </div>
                      <p className='text-[10px] text-gray-400 mt-2 text-center'>
                        {withPhoto ? '+ Foto prewedding' : 'Tanpa foto'}
                      </p>
                    </div>
                  )}

                  <div className='bg-gradient-to-r from-pink-600/20 to-pink-500/20 rounded-lg p-3 border border-pink-500/30'>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs sm:text-base text-gray-300'>
                        Total:
                      </span>
                      <span className='text-lg sm:text-3xl font-bold text-pink-400'>
                        Rp {calculatePrice()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className='text-sm sm:text-lg font-semibold text-white mb-2'>
                      Fitur:
                    </h3>
                    <ul className='space-y-1.5'>
                      {selectedItem.data.features.map((feature, index) => (
                        <li
                          key={index}
                          className='flex items-start gap-2 text-xs sm:text-base text-gray-300'
                        >
                          <div className='w-1 h-1 rounded-full bg-pink-400 mt-1.5 flex-shrink-0'></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-700/50 mt-3'>
                  <button
                    onClick={() => handlePreview(selectedItem.data.description)}
                    className='flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-lg font-medium transition-all duration-300 border border-gray-600/50 text-sm'
                  >
                    <ExternalLink className='w-4 h-4' />
                    Preview
                  </button>
                  <Link
                    href={{
                      pathname: `/create/${selectedItem.data.productId}`,
                      query: { variant: withPhoto ? 'photo' : 'no-photo' },
                    }}
                    className='flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 text-sm'
                  >
                    Pakai Design
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className='text-gray-400 text-center mt-10'>Loading...</p>
        )}
      </div>
    </div>
  );
}
