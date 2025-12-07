import { InvitationGift } from '@/types/interface';

export interface Props {
  data: InvitationGift;
}

export default function Gift({ data }: Props) {
  if (!data) {
    return (
      <div className='text-center text-gray-500 py-6'>
        Tidak ada data hadiah tersedia.
      </div>
    );
  }

  return (
    <section className='p-4'>
      <h2 className='text-2xl font-semibold text-center mb-6'>Wedding Gift</h2>

      <div className='border rounded-xl shadow-sm p-4 bg-white'>
        {/* Alamat */}
        {data.address && (
          <div className='mb-4'>
            <h3 className='text-lg font-medium text-gray-800 mb-2'>
              Alamat Pengiriman
            </h3>
            <p className='text-gray-600'>{data.address}</p>
          </div>
        )}

        {/* Gift Bank */}
        {data.giftBank?.account?.length > 0 && (
          <div className='mb-4'>
            <h3 className='text-lg font-medium text-gray-800 mb-2'>
              Rekening{' '}
              {data.giftBank.owner === 'BRIDE'
                ? 'Mempelai Wanita'
                : 'Mempelai Pria'}
            </h3>
            {data.giftBank.account.map((acc: any, index: number) => (
              <div
                key={index}
                className='bg-gray-50 rounded-lg p-3 mb-2 text-sm border'
              >
                <p>
                  <strong>Bank:</strong> {acc.bank_name}
                </p>
                <p>
                  <strong>Nomor:</strong> {acc.number}
                </p>
                <p>
                  <strong>Nama:</strong> {acc.nama}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Gift Wallet */}
        {data.giftWallet?.address?.length > 0 && (
          <div>
            <h3 className='text-lg font-medium text-gray-800 mb-2'>
              Wallet{' '}
              {data.giftWallet.owner === 'BRIDE'
                ? 'Mempelai Wanita'
                : 'Mempelai Pria'}
            </h3>
            {data.giftWallet.address.map((addr: any, index: number) => (
              <div
                key={index}
                className='bg-gray-50 rounded-lg p-3 mb-2 text-sm border'
              >
                <p>
                  <strong>Network:</strong> {addr.network}
                </p>
                <p>
                  <strong>Address:</strong> {addr.walletAddress}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
