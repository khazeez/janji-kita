import React from 'react';
import {
  Invitation,
  InvitationDataUser,
  InvitationEvent,
  InvitationGift,
} from '@/types/interface';

type Props = {
  brideGroomData: InvitationDataUser;
  venueData: InvitationEvent[];
  giftData: InvitationGift;
  invitationUrl: string;
};

export default function ConfirmationScreen({
  brideGroomData,
  venueData,
  giftData,
  invitationUrl,
}: Props) {
  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return '-';
    const dateObj = new Date(dateTime);
    return dateObj.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBrideBank = () => {
    return giftData.invitationGiftBank.find((b) => b.owner === 'BRIDE');
  };

  const getGroomBank = () => {
    return giftData.invitationGiftBank.find((b) => b.owner === 'GROOM');
  };

  const getBrideWallet = () => {
    return giftData.invitationGiftWallet.find((w) => w.owner === 'BRIDE');
  };

  const getGroomWallet = () => {
    return giftData.invitationGiftWallet.find((w) => w.owner === 'GROOM');
  };

  const getChainLabel = (chain: string) => {
    const chains: Record<string, string> = {
      bitcoin: 'Bitcoin (BTC)',
      ethereum: 'Ethereum (ETH)',
      usdt: 'USDT (EVM)',
      polygon: 'Polygon (MATIC)',
      bsc: 'BNB Smart Chain (BSC)',
      arbitrum: 'Arbitrum (ARB)',
      optimism: 'Optimism (OP)',
      avalanche: 'Avalanche C-Chain (AVAX)',
      base: 'Base',
      fantom: 'Fantom (FTM)',
    };
    return chains[chain] || chain;
  };

  const akadEvent = venueData.find((e) => e.eventType === 'AKAD');
  const resepsiEvents = venueData.filter((e) => e.eventType === 'RESEPSI');
  const otherEvents = venueData.filter((e) => e.eventType === 'OTHER');

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
              <h4 className='text-pink-300 font-medium mb-3'>
                Mempelai Wanita
              </h4>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Nama Lengkap:</span>
                  <span className='text-white font-medium'>
                    {brideGroomData.brideFullName || '-'}
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
                    {brideGroomData.brideParentName || '-'}
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
                    {brideGroomData.groomFullName || '-'}
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
                    {brideGroomData.groomParentName || '-'}
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
            {akadEvent && (
              <div className='bg-gray-700/50 rounded-lg p-4'>
                <h4 className='text-pink-300 font-medium mb-3'>Akad Nikah</h4>
                <div className='space-y-2 text-sm'>
                  <div>
                    <p className='text-gray-400 mb-1'>Tempat:</p>
                    <p className='text-white font-medium'>
                      {akadEvent.location || '-'}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-400 mb-1'>Alamat:</p>
                    <p className='text-white'>
                      {akadEvent.locationDetail || '-'}
                    </p>
                  </div>
                  {akadEvent.mapsUrl && (
                    <div>
                      <p className='text-gray-400 mb-1'>Google Maps:</p>
                      <a
                        href={akadEvent.mapsUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-400 hover:text-blue-300 text-xs break-all'
                      >
                        {akadEvent.mapsUrl}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className='text-gray-400 mb-1'>Waktu:</p>
                    <p className='text-white'>
                      {formatDateTime(akadEvent.startTime)}
                    </p>
                    <p className='text-gray-400 text-xs mt-1'>
                      s/d {formatDateTime(akadEvent.endTime)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Resepsi */}
            {resepsiEvents.length > 0 && (
              <div className='space-y-3'>
                {resepsiEvents.map((resepsi, index) => (
                  <div
                    key={resepsi.eventId}
                    className='bg-gray-700/50 rounded-lg p-4'
                  >
                    <h4 className='text-blue-300 font-medium mb-3'>
                      Resepsi {resepsiEvents.length > 1 ? index + 1 : ''}
                    </h4>
                    <div className='space-y-2 text-sm'>
                      <div>
                        <p className='text-gray-400 mb-1'>Tempat:</p>
                        <p className='text-white font-medium'>
                          {resepsi.location || '-'}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400 mb-1'>Alamat:</p>
                        <p className='text-white'>
                          {resepsi.locationDetail || '-'}
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
                          {formatDateTime(resepsi.startTime)}
                        </p>
                        <p className='text-gray-400 text-xs mt-1'>
                          s/d {formatDateTime(resepsi.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Other Events */}
            {otherEvents.length > 0 && (
              <div className='space-y-3'>
                {otherEvents.map((event, index) => (
                  <div
                    key={event.eventId}
                    className='bg-gray-700/50 rounded-lg p-4'
                  >
                    <h4 className='text-purple-300 font-medium mb-3'>
                      Acara Lainnya {otherEvents.length > 1 ? index + 1 : ''}
                    </h4>
                    <div className='space-y-2 text-sm'>
                      <div>
                        <p className='text-gray-400 mb-1'>Tempat:</p>
                        <p className='text-white font-medium'>
                          {event.location || '-'}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400 mb-1'>Alamat:</p>
                        <p className='text-white'>
                          {event.locationDetail || '-'}
                        </p>
                      </div>
                      {event.mapsUrl && (
                        <div>
                          <p className='text-gray-400 mb-1'>Google Maps:</p>
                          <a
                            href={event.mapsUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-400 hover:text-blue-300 text-xs break-all'
                          >
                            {event.mapsUrl}
                          </a>
                        </div>
                      )}
                      <div>
                        <p className='text-gray-400 mb-1'>Waktu:</p>
                        <p className='text-white'>
                          {formatDateTime(event.startTime)}
                        </p>
                        <p className='text-gray-400 text-xs mt-1'>
                          s/d {formatDateTime(event.endTime)}
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
                <h4 className='text-green-300 font-medium mb-2'>
                  Alamat Pengiriman Hadiah
                </h4>
                <p className='text-white text-sm'>{giftData.address}</p>
              </div>
            )}

            {/* Rekening Bank */}
            {(getBrideBank()?.account.length ||
              getGroomBank()?.account.length) && (
              <div>
                <h4 className='text-gray-400 font-medium mb-3 text-sm'>
                  Rekening Bank
                </h4>
                <div className='space-y-3'>
                  {/* Rekening Mempelai Wanita */}
                  {getBrideBank() && getBrideBank()!.account.length > 0 && (
                    <div className='bg-gray-700/50 rounded-lg p-4'>
                      <p className='text-pink-300 font-medium mb-3 text-sm'>
                        Mempelai Wanita
                      </p>
                      <div className='space-y-2'>
                        {getBrideBank()!.account.map((acc, index) => (
                          <div
                            key={index}
                            className='bg-gray-700 rounded-lg p-3'
                          >
                            <p className='text-white font-medium text-sm'>
                              {acc.bank || '-'}
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
                  {getGroomBank() && getGroomBank()!.account.length > 0 && (
                    <div className='bg-gray-700/50 rounded-lg p-4'>
                      <p className='text-blue-300 font-medium mb-3 text-sm'>
                        Mempelai Pria
                      </p>
                      <div className='space-y-2'>
                        {getGroomBank()!.account.map((acc, index) => (
                          <div
                            key={index}
                            className='bg-gray-700 rounded-lg p-3'
                          >
                            <p className='text-white font-medium text-sm'>
                              {acc.bank || '-'}
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
            {(getBrideWallet()?.address.length ||
              getGroomWallet()?.address.length) && (
              <div>
                <h4 className='text-gray-400 font-medium mb-3 text-sm'>
                  Web3 Wallet
                </h4>
                <div className='space-y-3'>
                  {/* Wallet Mempelai Wanita */}
                  {getBrideWallet() && getBrideWallet()!.address.length > 0 && (
                    <div className='bg-gray-700/50 rounded-lg p-4'>
                      <p className='text-pink-300 font-medium mb-3 text-sm'>
                        Mempelai Wanita
                      </p>
                      <div className='space-y-2'>
                        {getBrideWallet()!.address.map((wallet, index) => (
                          <div
                            key={index}
                            className='bg-gray-700 rounded-lg p-3'
                          >
                            <p className='text-gray-400 text-xs mb-1'>
                              {getChainLabel(wallet.network)}
                            </p>
                            <p className='text-white font-mono text-xs break-all'>
                              {wallet.walletAddress || '-'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wallet Mempelai Pria */}
                  {getGroomWallet() && getGroomWallet()!.address.length > 0 && (
                    <div className='bg-gray-700/50 rounded-lg p-4'>
                      <p className='text-blue-300 font-medium mb-3 text-sm'>
                        Mempelai Pria
                      </p>
                      <div className='space-y-2'>
                        {getGroomWallet()!.address.map((wallet, index) => (
                          <div
                            key={index}
                            className='bg-gray-700 rounded-lg p-3'
                          >
                            <p className='text-gray-400 text-xs mb-1'>
                              {getChainLabel(wallet.network)}
                            </p>
                            <p className='text-white font-mono text-xs break-all'>
                              {wallet.walletAddress || '-'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Jika tidak ada gift info */}
            {!giftData.address &&
              !getBrideBank()?.account.length &&
              !getGroomBank()?.account.length &&
              !getBrideWallet()?.address.length &&
              !getGroomWallet()?.address.length && (
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
              {`https://janjikita.art/${invitationUrl}`}
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className='bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4'>
          <p className='text-sm text-yellow-300'>
            ⚠️ Pastikan semua data sudah benar sebelum melanjutkan. Setelah
            submit, data tidak dapat diubah.
          </p>
        </div>
      </div>
    </>
  );
}
