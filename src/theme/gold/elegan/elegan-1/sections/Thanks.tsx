import React from 'react';
import { Instagram, Globe } from 'lucide-react';

interface InvitationDataUser {
  groomNickName: string;
  brideNickName: string;
}

interface Props {
  data: InvitationDataUser;
}

// WhatsApp Icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox='0 0 24 24'
    fill='currentColor'
    className={className}
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z' />
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
      name: 'Website',
      icon: Globe,
      href: 'https://janjikita.art',
      color: 'hover:text-red-400',
    },
    {
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      href: 'https://wa.me/6282123436617',
      color: 'hover:text-green-400',
    },
  ];

  return (
    <section
      className='
        relative
        w-full
        min-h-screen
        flex
        flex-col
        justify-end
        text-white
        overflow-hidden
      '
    >
      {/* ===== Konten ===== */}
      <div className='relative z-10 flex flex-col items-center text-center px-6 pb-24 space-y-5'>
        <p className='text-sm tracking-widest opacity-80'>THE WEDDING OF</p>

        <h2 className='text-4xl font-brown-sugar leading-tight'>
          {data.groomNickName} <br /> & {data.brideNickName}
        </h2>

        <p className='text-sm opacity-90 max-w-xs'>
          Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila
          Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada
          kedua mempelai.
        </p>

        {/* Branding */}
        <div className='pt-8 flex flex-col items-center space-y-2'>
          <p className='text-xs opacity-80'>Made with ❤️ by</p>
          <img src='/janjiKitaPutih.png' alt='Janji Kita' className='w-28' />
        </div>

        {/* Social */}
        <div className='flex gap-4 pt-4'>
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className={`
                  w-10 h-10 flex items-center justify-center
                  rounded-full border border-white/20
                  bg-white/5 backdrop-blur
                  transition-all duration-300
                  hover:scale-110 ${social.color}
                `}
              >
                <Icon className='w-5 h-5' />
              </a>
            );
          })}
        </div>

        <p className='text-xs opacity-60 pt-4'>
          © 2025 Janji Kita. All rights reserved.
        </p>
      </div>

      {/* ===== Gradient ===== */}
      <div className='pointer-events-none absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black to-transparent' />
    </section>
  );
}
