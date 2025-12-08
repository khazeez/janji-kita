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
  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return '-';
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className='space-y-6'>
        {/* Data Mempelai */}
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-pink-400 mb-4'>
            Data Mempelai
          </h3>
          <div className='space-y-4'>
            {/* Mempelai Wanita */}
            <div className='bg-gray-700/50 rounded-lg p-4'>
              <h4 className='text-pink-300 font-medium mb-3'>Mempelai Wanita</h4>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Nama Lengkap:</span>
                  <span className='text-white font-medium'>
                    {brideGroomData.brideName || '-'}
                  </span>
                </div>
                {brideGroomData.brideNickName && (
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Nama Panggilan:</span>
                    <span className='text-white font-medium'>
                      {brideGroomData.brideNickName}
                    </span>
                  </div>
                )}
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Orang Tua:</span>
                  <span className='text-white font-medium'>
                    {brideGroomData.brideParents || '-'}
                  </span>
                </div>
                {brideGroomData.brideInstagram && (
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Instagram:</span>
                    <span className='text-white font-medium'>
                      {brideGroomData.brideInstagram}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Mempelai Pria */}
            <div className='bg-gray-700/50 rounded-lg p-4'>
              <h4 className='text-blue-300 font-medium mb-3'>Mempelai Pria</h4>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Nama Lengkap:</span>
                  <span className='text-white font-medium'>
                    {brideGroomData.groomName || '-'}
                  </span>
                </div>
                {brideGroomData.groomNickName && (
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Nama Panggilan:</span>
                    <span className='text-white font-medium'>
                      {brideGroomData.groomNickName}
                    </span>
                  </div>
                )}
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Orang Tua:</span>
                  <span className='text-white font-medium'>
                    {brideGroomData.groomParents || '-'}
                  </span>
                </div>
                {brideGroomData.groomInstagram && (
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>Instagram:</span>
                    <span className='text-white font-medium'>
                      {brideGroomData.groomInstagram}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tempat Acara */}
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-blue-400 mb-4'>
            Tempat Acara
          </h3>
          <div className='space-y-4'>
            {/* Akad Nikah */}
            <div className='bg-gray-700/50 rounded-lg p-4'>
              <h4 className='text-pink-300 font-medium mb-3'>Akad Nikah</h4>
              <div className='space-y-2 text-sm'>
                <div>
                  <p className='text-gray-400 mb-1'>Tempat:</p>
                  <p className='text-white font-medium'>
                    {venueData.akadVenue || '-'}
                  </p>
                </div>
                <div>
                  <p className='text-gray-400 mb-1'>Alamat:</p>
                  <p className='text-white'>
                    {venueData.akadAddress || '-'}
                  </p>
                </div>
                {venueData.akadMapsUrl && (
                  <div>
                    <p className='text-gray-400 mb-1'>Google Maps:</p>
                    <a
                      href={venueData.akadMapsUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-400 hover:text-blue-300 text-xs break-all'
                    >
                      {venueData.akadMapsUrl}
                    </a>
                  </div>
                )}
                <div>
                  <p className='text-gray-400 mb-1'>Waktu:</p>
                  <p className='text-white'>
                    {formatDateTime(venueData.akadStartDate, venueData.akadStartTime)}
                  </p>
                  <p className='text-gray-400 text-xs mt-1'>
                    s/d {formatDateTime(venueData.akadEndDate, venueData.akadEndTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Resepsi */}
            {venueData.resepsiEvents && venueData.resepsiEvents.length > 0 && (
              <div className='space-y-3'>
                {venueData.resepsiEvents.map((resepsi, index) => (
                  <div key={index} className='bg-gray-700/50 rounded-lg p-4'>
                    <h4 className='text-blue-300 font-medium mb-3'>
                      {resepsi.description || `Resepsi ${index + 1}`}
                    </h4>
                    <div className='space-y-2 text-sm'>
                      <div>
                        <p className='text-gray-400 mb-1'>Tempat:</p>
                        <p className='text-white font-medium'>
                          {resepsi.venue || '-'}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400 mb-1'>Alamat:</p>
                        <p className='text-white'>
                          {resepsi.address || '-'}
                        </p>
                      </div>
                      {resepsi.mapsUrl && (
                        <div>
                          <p className='text-gray-400 mb-1'>Google Maps:</p>
                          <a
                            href={resepsi.mapsUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-400 hover:text-blue-300 text-xs break-all'
                          >
                            {resepsi.mapsUrl}
                          </a>
                        </div>
                      )}
                      <div>
                        <p className='text-gray-400 mb-1'>Waktu:</p>
                        <p className='text-white'>
                          {formatDateTime(resepsi.startDate, resepsi.startTime)}
                        </p>
                        <p className='text-gray-400 text-xs mt-1'>
                          s/d {formatDateTime(resepsi.endDate, resepsi.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Informasi Gift */}
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-green-400 mb-4'>
            Informasi Gift
          </h3>
          <div className='space-y-4'>
            {/* Alamat Pengiriman */}
            {giftData.address && (
              <div className='bg-gray-700/50 rounded-lg p-4'>
                <h4 className='text-green-300 font-medium mb-2'>Alamat Pengiriman Hadiah</h4>
                <p className='text-white text-sm'>{giftData.address}</p>
              </div>
            )}

            {/* Rekening Bank */}
            {giftData.accounts && giftData.accounts.length > 0 && (
              <div>
                <h4 className='text-gray-400 font-medium mb-3 text-sm'>Rekening Bank</h4>
                <div className='space-y-3'>
                  {/* Rekening Mempelai Wanita */}
                  {giftData.accounts.filter((acc) => acc.owner === 'bride').length > 0 && (
                    <div className='bg-gray-700/50 rounded-lg p-4'>
                      <p className='text-pink-300 font-medium mb-3 text-sm'>Mempelai Wanita</p>
                      <div className='space-y-2'>
                        {giftData.accounts
                          .filter((acc) => acc.owner === 'bride')
                          .map((acc) => (
                            <div key={acc.id} className='bg-gray-700 rounded-lg p-3'>
                              <p className='text-white font-medium text-sm'>
                                {acc.bankName || '-'}
                              </p>
                              <p className='text-gray-300 text-xs mt-1'>
                                {acc.accountNumber || '-'}
                              </p>
                              <p className='text-gray-400 text-xs'>
                                a.n. {acc.accountName || '-'}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Rekening Mempelai Pria */}
                  {giftData.accounts.filter((acc) => acc.owner === 'groom').length > 0 && (
                    <div className='bg-gray-700/50 rounded-lg p-4'>
                      <p className='text-blue-300 font-medium mb-3 text-sm'>Mempelai Pria</p>
                      <div className='space-y-2'>
                        {giftData.accounts
                          .filter((acc) => acc.owner === 'groom')
                          .map((acc) => (
                            <div key={acc.id} className='bg-gray-700 rounded-lg p-3'>
                              <p className='text-white font-medium text-sm'>
                                {acc.bankName || '-'}
                              </p>
                              <p className='text-gray-300 text-xs mt-1'>
                                {acc.accountNumber || '-'}
                              </p>
                              <p className='text-gray-400 text-xs'>
                                a.n. {acc.accountName || '-'}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Web3 Wallets */}
            {giftData.wallets && giftData.wallets.length > 0 && (
              <div className='bg-gray-700/50 rounded-lg p-4'>
                <h4 className='text-purple-300 font-medium mb-3 text-sm'>Web3 Wallet</h4>
                <div className='space-y-2'>
                  {giftData.wallets.map((wallet) => (
                    <div key={wallet.id} className='bg-gray-700 rounded-lg p-3'>
                      <p className='text-gray-400 text-xs mb-1'>{wallet.chain}</p>
                      <p className='text-white font-mono text-xs break-all'>
                        {wallet.address || '-'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jika tidak ada gift info */}
            {!giftData.address && 
             (!giftData.accounts || giftData.accounts.length === 0) && 
             (!giftData.wallets || giftData.wallets.length === 0) && (
              <p className='text-gray-500 text-sm text-center py-4'>
                Tidak ada informasi gift
              </p>
            )}
          </div>
        </div>

        {/* Link Undangan */}
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

        {/* Warning */}
        <div className='bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4'>
          <p className='text-sm text-yellow-300'>
            ⚠️ Pastikan semua data sudah benar sebelum melanjutkan. Setelah submit, data tidak dapat diubah.
          </p>
        </div>
      </div>
    </>
  );
}