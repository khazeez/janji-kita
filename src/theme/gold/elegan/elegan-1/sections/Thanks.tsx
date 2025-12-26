import React from 'react';
import { Instagram, Globe } from 'lucide-react';

interface InvitationDataUser {
  groomNickName: string;
  brideNickName: string;
}

interface Props {
  data: InvitationDataUser;
}

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox='0 0 24 24'
    fill='currentColor'
    className={className}
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
  </svg>
);

export default function Thanks({ data }: Props) {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/janjikita.art',
      color: 'hover:text-pink-400',
    },
    {
      name: 'Web',
      icon: Globe,
      href: 'https://janjikita.art',
      color: 'hover:text-red-400',
    },
    {
      name: 'Whatsapp',
      icon: WhatsAppIcon,
      href: 'https://wa.me/6282123436617?text=Halo,%20saya%20tertarik%20dengan%20undanganmu',
      color: 'hover:text-green-400',
    },
  ];

  return (
    <>
      <div className='flex flex-col items-center py-30 mt-30'>
        <div className='thanks p-3 mt-30'>
          <div className='flex flex-col items-center text-white'>
            <p className='text-sm tracking-widest'>THE WEDDING OF</p>

            <h1 className='text-5xl text-center font-brown-sugar px-10'>
              {data.groomNickName} & {data.brideNickName}
            </h1>
          </div>

          <p className='text-white text-sm text-center'>
            Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila
            Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do'a restu kepada
            kedua mempelai.
          </p>
        </div>

        <div className='logo mt-20 -mb-20 z-30 flex flex-col items-center'>
          <p className='text-white text-center'>Made with ❤️ by</p>
          <img src='/janjiKitaPutih.png' alt='Janji Kita' className='w-30' />

          <div className='flex justify-center space-x-4 pt-5'>
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className={`flex items-center justify-center text-white w-10 h-10 rounded-full border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-slate-600/50 hover:bg-slate-700/50 ${social.color}`}
                >
                  <IconComponent className='w-5 h-5' />
                </a>
              );
            })}
          </div>

          <p className='text-white text-xs text-center mt-4 opacity-70'>
            © 2025 Janji Kita. All rights reserved.
          </p>
        </div>

        <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-[150%] h-80 bg-gradient-to-t from-black to-transparent'></div>
      </div>
    </>
  );
}