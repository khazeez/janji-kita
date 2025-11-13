import { data } from 'motion/react-client';
import { BrideGroomData } from '@/types/form';


type BrideGroomInputProps = {
  data: BrideGroomData;
  onChange: (data: BrideGroomData) => void;
};

export default function BrideGroomDataInput({ data, onChange }: BrideGroomInputProps) {
  const handleChange = (field: keyof BrideGroomData, value: string) => {
    onChange({ ...data, [field]: value });
  };
  return (
    <>
      <div className='space-y-6'>
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-blue-400 mb-4'>
            Data Mempelai Pria
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Nama Lengkap Mempelai Pria
              </label>
              <input
                type='text'
                value={data.groomName}
                onChange={(e) => handleChange('groomName', e.target.value)}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                placeholder='Contoh: Muhammad Rizki'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Nama Panggilan 
              </label>
              <input
                type='text'
                value={data.groomNickName}
                onChange={(e) => handleChange('groomNickName', e.target.value)}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                placeholder='Contoh: Rizki'
              />
            </div>
             <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Nama Orang Tua Mempelai Pria
              </label>
              <input
                type='text'
                value={data.groomParents}
                onChange={(e) => handleChange('groomParents', e.target.value)}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                placeholder='Contoh: Bapak Budi dan Ibu Sari'
              />
            </div>
          </div>
        </div>
        <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
          <h3 className='text-lg font-semibold text-pink-400 mb-4'>
            Data Mempelai Wanita
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Nama Lengkap Mempelai Wanita
              </label>
              <input
                type='text'
                value={data.brideName}
                onChange={(e) => handleChange('brideName', e.target.value)}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                placeholder='Contoh: Siti Aisyah'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Nama Panggilan 
              </label>
              <input
                type='text'
                value={data.brideNickName}
                onChange={(e) => handleChange('brideNickName', e.target.value)}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                placeholder='Contoh: Aisyah'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Nama Orang Tua Mempelai Wanita
              </label>
              <input
                type='text'
                value={data.brideParents}
                onChange={(e) => handleChange('brideParents', e.target.value)}
                className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none'
                placeholder='Contoh: Bapak Ahmad dan Ibu Fatimah'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
