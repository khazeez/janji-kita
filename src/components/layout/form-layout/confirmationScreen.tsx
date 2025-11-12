import React from 'react';
import {
  GiftData,
  Wallet,
  BankAccount,
  EVMChain,
  BrideGroomData,
  VenueData,
  LinkData,
} from '@/types/form';

export default function ConfirmationScreen({
  brideGroomData,
  venueData,
  giftData,
  linkData,
}: {
  brideGroomData: BrideGroomData;
  venueData: VenueData;
  giftData: GiftData;
  linkData: LinkData;
}) {
  return (
    <>
      <div className='space-y-6'>
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-pink-400 mb-4'>
            Data Mempelai
          </h3>
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-400'>Mempelai Wanita:</span>
              <span className='text-white font-medium'>
                {brideGroomData.brideName || '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>Orang Tua Wanita:</span>
              <span className='text-white font-medium'>
                {brideGroomData.brideParents || '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>Mempelai Pria:</span>
              <span className='text-white font-medium'>
                {brideGroomData.groomName || '-'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>Orang Tua Pria:</span>
              <span className='text-white font-medium'>
                {brideGroomData.groomParents || '-'}
              </span>
            </div>
          </div>
        </div>

        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-blue-400 mb-4'>
            Tempat Acara
          </h3>
          <div className='space-y-4 text-sm'>
            <div>
              <p className='text-gray-400 mb-2'>Akad Nikah:</p>
              <div className='bg-gray-700 rounded-lg p-3 space-y-1'>
                <p className='text-white font-medium'>
                  {venueData.akadVenue || '-'}
                </p>
                <p className='text-gray-300 text-xs'>
                  {venueData.akadAddress || '-'}
                </p>
                <p className='text-gray-400 text-xs'>
                  {venueData.akadDate || '-'} | {venueData.akadTime || '-'}
                </p>
              </div>
            </div>

            {venueData.hasResepsi && (
              <div>
                <p className='text-gray-400 mb-2'>Resepsi:</p>
                <div className='bg-gray-700 rounded-lg p-3 space-y-1'>
                  <p className='text-white font-medium'>
                    {venueData.resepsiVenue || '-'}
                  </p>
                  <p className='text-gray-300 text-xs'>
                    {venueData.resepsiAddress || '-'}
                  </p>
                  <p className='text-gray-400 text-xs'>
                    {venueData.resepsiDate || '-'} |{' '}
                    {venueData.resepsiTime || '-'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-green-400 mb-4'>
            Informasi Gift
          </h3>
          <div className='space-y-4 text-sm'>
            <div>
              <p className='text-gray-400 mb-2'>Rekening Mempelai Wanita:</p>
              {giftData.accounts?.filter((acc) => acc.owner === 'bride')
                .length > 0 ? (
                <div className='space-y-2'>
                  {giftData.accounts
                    .filter((acc) => acc.owner === 'bride')
                    .map((acc) => (
                      <div key={acc.id} className='bg-gray-700 rounded-lg p-3'>
                        <p className='text-white font-medium'>
                          {acc.bankName || '-'}
                        </p>
                        <p className='text-gray-300 text-xs'>
                          {acc.accountNumber || '-'}
                        </p>
                        <p className='text-gray-400 text-xs'>
                          {acc.accountName || '-'}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className='text-gray-500 text-xs'>Tidak ada rekening</p>
              )}
            </div>

            <div>
              <p className='text-gray-400 mb-2'>Rekening Mempelai Pria:</p>
              {giftData.accounts?.filter((acc) => acc.owner === 'groom')
                .length > 0 ? (
                <div className='space-y-2'>
                  {giftData.accounts
                    .filter((acc) => acc.owner === 'groom')
                    .map((acc) => (
                      <div key={acc.id} className='bg-gray-700 rounded-lg p-3'>
                        <p className='text-white font-medium'>
                          {acc.bankName || '-'}
                        </p>
                        <p className='text-gray-300 text-xs'>
                          {acc.accountNumber || '-'}
                        </p>
                        <p className='text-gray-400 text-xs'>
                          {acc.accountName || '-'}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className='text-gray-500 text-xs'>Tidak ada rekening</p>
              )}
            </div>

            {giftData.wallets && (
              <div>
                <p className='text-gray-400 mb-2'>Web3 Wallet:</p>
                <div className='bg-gray-700 rounded-lg p-3'>
                  <p className='text-white font-mono text-xs break-all'>
                    {'-'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-purple-400 mb-4'>
            Link Undangan
          </h3>
          <div className='bg-gray-700 rounded-lg p-4'>
            <p className='text-pink-400 font-medium break-all'>
              https://janjikita.art/{linkData.link || 'your-link'}
            </p>
          </div>
        </div>

        <div className='bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4'>
          <p className='text-sm text-yellow-300'>
            Pastikan semua data sudah benar sebelum melanjutkan
          </p>
        </div>
      </div>
    </>
  );
}
