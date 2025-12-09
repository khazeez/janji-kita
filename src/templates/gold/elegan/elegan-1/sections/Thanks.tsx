import { InvitationDataUser } from '@/types/interface';

export interface Props {
  data: InvitationDataUser;
}

export default function Thanks({data}: Props) {
  return (
    <>
      <div className='flex flex-col items-center py-30 mt-70'>
        <div className='thanks p-3 mt-30'>
          <div className='flex flex-col items-center text-white'>
            <p className='text-sm tracking-widest'>THE WEDDING OF</p>

            <h1 className='text-5xl text-center font-brown-sugar px-10'>
              {data.groomNickName} & {data.brideNickName}
            </h1>
          </div>

          <p className='text white text-sm text-center text-white'>
            Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila
            Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do'a restu kepada
            kedua mempelai.​
          </p>
        </div>
        <div className='logo mt-20 -mb-20 z-30'>
          <p className='text-white'>Made with ❤️ by</p>
          <img src='/janjiKitaPutih.png' alt='' className='w-30' />
        </div>

        <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-[150%] h-80 bg-gradient-to-t from-black to-transparent'></div>
      </div>
    </>
  );
}
