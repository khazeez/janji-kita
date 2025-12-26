import React from 'react';
import dummyWeddingData from '@/data/dummyData';

interface BankAccount {
  bank_name: string;
  account_number: string;
  account_holder: string;
}

interface Wallet {
  wallet_name: string;
  wallet_number: string;
  wallet_holder: string;
}

interface WeddingData {
  data_id: string;
  invitation_id: string;
  invitation_link: string;
  groom_full_name: string;
  groom_nick_name: string;
  groom_parent_name?: string;
  groom_instagram?: string;
  groom_photo_url?: string;
  bride_full_name: string;
  bride_nick_name: string;
  bride_parent_name?: string;
  bride_instagram?: string;
  bride_photo_url?: string;
  gallery_photos: string[];
  akad_datetime: string;
  akad_location: string;
  akad_address: string;
  akad_maps_url?: string;
  resepsi_datetime: string;
  resepsi_location: string;
  resepsi_address: string;
  resepsi_maps_url?: string;
  gift_address?: string;
  groom_bank_accounts: BankAccount[];
  bride_bank_accounts: BankAccount[];
  groom_wallets: Wallet[];
  bride_wallets: Wallet[];
  love_story?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface Props {
  data: WeddingData;
}

export default function NetflixDesign({ data }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='bg-black text-white min-h-screen'>
      {/* Hero */}
      <div className='h-screen flex items-center justify-center text-center px-4'>
        <div>
          <h1 className='text-5xl md:text-7xl font-bold mb-4'>
            {data.groom_nick_name} & {data.bride_nick_name}
          </h1>
          <p className='text-xl text-gray-400'>The Wedding</p>
        </div>
      </div>

      {/* Couple */}
      <div className='py-16 px-4 max-w-6xl mx-auto'>
        <div className='grid md:grid-cols-2 gap-8'>
          <div className='text-center'>
            {data.groom_photo_url && (
              <img
                src={data.groom_photo_url}
                alt={data.groom_full_name}
                className='w-full h-80 object-cover rounded mb-4'
              />
            )}
            <h3 className='text-2xl font-bold'>{data.groom_full_name}</h3>
            {data.groom_parent_name && (
              <p className='text-gray-400 mt-2'>
                Putra dari {data.groom_parent_name}
              </p>
            )}
            {data.groom_instagram && (
              <a
                href={`https://instagram.com/${data.groom_instagram}`}
                className='text-red-500 mt-2 inline-block'
              >
                @{data.groom_instagram}
              </a>
            )}
          </div>

          <div className='text-center'>
            {data.bride_photo_url && (
              <img
                src={data.bride_photo_url}
                alt={data.bride_full_name}
                className='w-full h-80 object-cover rounded mb-4'
              />
            )}
            <h3 className='text-2xl font-bold'>{data.bride_full_name}</h3>
            {data.bride_parent_name && (
              <p className='text-gray-400 mt-2'>
                Putri dari {data.bride_parent_name}
              </p>
            )}
            {data.bride_instagram && (
              <a
                href={`https://instagram.com/${data.bride_instagram}`}
                className='text-red-500 mt-2 inline-block'
              >
                @{data.bride_instagram}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Love Story */}
      {data.love_story && (
        <div className='py-16 px-4 bg-gray-900'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl font-bold mb-6'>Our Story</h2>
            <p className='text-gray-300 whitespace-pre-line'>
              {data.love_story}
            </p>
          </div>
        </div>
      )}

      {/* Gallery */}
      {data.gallery_photos.length > 0 && (
        <div className='py-16 px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>Gallery</h2>
          <div className='max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4'>
            {data.gallery_photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`Gallery ${i + 1}`}
                className='w-full h-64 object-cover rounded'
              />
            ))}
          </div>
        </div>
      )}

      {/* Events */}
      <div className='py-16 px-4 bg-gray-900'>
        <h2 className='text-3xl font-bold text-center mb-8'>Events</h2>
        <div className='max-w-4xl mx-auto grid md:grid-cols-2 gap-8'>
          <div className='bg-black p-6 rounded'>
            <h3 className='text-xl font-bold text-red-500 mb-3'>Akad Nikah</h3>
            <p className='mb-2'>{formatDate(data.akad_datetime)}</p>
            <p className='font-semibold'>{data.akad_location}</p>
            <p className='text-gray-400 text-sm mb-4'>{data.akad_address}</p>
            {data.akad_maps_url && (
              <a
                href={data.akad_maps_url}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-red-600 px-4 py-2 rounded inline-block'
              >
                Lihat Map
              </a>
            )}
          </div>

          <div className='bg-black p-6 rounded'>
            <h3 className='text-xl font-bold text-red-500 mb-3'>Resepsi</h3>
            <p className='mb-2'>{formatDate(data.resepsi_datetime)}</p>
            <p className='font-semibold'>{data.resepsi_location}</p>
            <p className='text-gray-400 text-sm mb-4'>{data.resepsi_address}</p>
            {data.resepsi_maps_url && (
              <a
                href={data.resepsi_maps_url}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-red-600 px-4 py-2 rounded inline-block'
              >
                Lihat Map
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Gift */}
      <div className='py-16 px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'>Wedding Gift</h2>
        {data.gift_address && (
          <p className='text-center text-gray-400 mb-6'>{data.gift_address}</p>
        )}
        <div className='max-w-4xl mx-auto grid md:grid-cols-2 gap-8'>
          {(data.groom_bank_accounts.length > 0 ||
            data.groom_wallets.length > 0) && (
            <div>
              <h3 className='text-xl font-bold mb-4'>{data.groom_nick_name}</h3>
              {data.groom_bank_accounts.map((acc, i) => (
                <div key={i} className='bg-gray-900 p-4 rounded mb-3'>
                  <p className='text-sm text-gray-400'>{acc.bank_name}</p>
                  <p className='font-mono text-lg'>{acc.account_number}</p>
                  <p className='text-sm'>{acc.account_holder}</p>
                </div>
              ))}
              {data.groom_wallets.map((wallet, i) => (
                <div key={i} className='bg-gray-900 p-4 rounded mb-3'>
                  <p className='text-sm text-gray-400'>{wallet.wallet_name}</p>
                  <p className='font-mono text-lg'>{wallet.wallet_number}</p>
                  <p className='text-sm'>{wallet.wallet_holder}</p>
                </div>
              ))}
            </div>
          )}

          {(data.bride_bank_accounts.length > 0 ||
            data.bride_wallets.length > 0) && (
            <div>
              <h3 className='text-xl font-bold mb-4'>{data.bride_nick_name}</h3>
              {data.bride_bank_accounts.map((acc, i) => (
                <div key={i} className='bg-gray-900 p-4 rounded mb-3'>
                  <p className='text-sm text-gray-400'>{acc.bank_name}</p>
                  <p className='font-mono text-lg'>{acc.account_number}</p>
                  <p className='text-sm'>{acc.account_holder}</p>
                </div>
              ))}
              {data.bride_wallets.map((wallet, i) => (
                <div key={i} className='bg-gray-900 p-4 rounded mb-3'>
                  <p className='text-sm text-gray-400'>{wallet.wallet_name}</p>
                  <p className='font-mono text-lg'>{wallet.wallet_number}</p>
                  <p className='text-sm'>{wallet.wallet_holder}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className='py-8 text-center text-gray-500 border-t border-gray-800'>
        <p>Thank you!</p>
      </div>
    </div>
  );
}
