import { InvitationDataUser } from '@/types/interface';
import { Instagram, Twitter, Linkedin, Github, Youtube, Facebook, NetworkIcon, MessageCircle } from 'lucide-react';

export interface Props {
  data: InvitationDataUser;
}

export default function Thanks({ data }: Props) {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: '#',
      color: 'hover:text-pink-400',
    },
    {
      name: 'Web',
      icon: NetworkIcon,
      href: 'https://janjikita.art',
      color: 'hover:text-red-400',
    },
    {
      name: 'Whatsapp',
      icon: MessageCircle,
      href: '#https://wa.me/6282123436617?text=Halo,%20saya%20tertarik%20dengan%20undanganmu',
      color: 'hover:text-blue-300',
    },
  ];
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
            kedua mempelai.
          </p>
        </div>
        <div className='logo mt-20 -mb-20 z-30'>
          <p className='text-white'>Made with ❤️ by</p>
          <img src='/janjiKitaPutih.png' alt='' className='w-30' />
          <div className='flex justify-center space-x-4 pt-5'>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              aria-label={social.name}
              className={`flex items-center justify-center text-white w-5 h-5 rounded-full border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-slate-600/50 hover:bg-slate-700/50 ${social.color}`}
            >
              <social.icon className='w-4 h-4' />
            </a>
          ))}
        </div>
        </div>
        

        <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-[150%] h-80 bg-gradient-to-t from-black to-transparent'></div>
      </div>
    </>
  );
}
