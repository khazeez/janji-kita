import React from 'react';
import Image from 'next/image';
import { Instagram, Twitter, Linkedin, Github, Youtube, Facebook, } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: '#',
      color: 'hover:text-pink-400',
    },
    {
      name: 'Youtube',
      icon: Youtube,
      href: '#',
      color: 'hover:text-red-400',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: '#',
      color: 'hover:text-blue-300',
    },
  ];

  return (
    <footer className='relative bg-transparent h-full'>
      {/* Background Effects */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute left-30 top-15 lg:top-20 lg:left-115 lg:w-80 lg:h-80 w-50 h-50 rounded-full blur-3xl bg-gradient-to-r lg:from-pink-600/50 lg:to-pink-300/50 from-pink-600/60 to-pink-300/70' />
        {/* <div className='absolute bottom-0 right-1/4 w-60 h-60 rounded-full blur-3xl bg-gradient-to-r from-pink-600 to-pink-300' /> */}
      </div>

      <div className='relative z-10 flex flex-col items-center text-center px-6 py-16 max-w-3xl mx-auto'>
        {/* Brand Section */}
        <div className='items-center space-y-6'>
          <Image
            src='/janjiKitaPutih.png'
            alt=''
            width={500}
            height={500}
          ></Image>

          <div className='flex justify-center space-x-4 pt-4'>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className={`flex items-center justify-center w-10 h-10 rounded-2xl border border-slate-700/50 bg-slate-800/50 text-slate-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-slate-600/50 hover:bg-slate-700/50 ${social.color}`}
              >
                <social.icon className='w-4 h-4' />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='w-full border-t border-slate-800/50 mt-12 pt-8'>
          <div className='flex flex-col items-center space-y-3 text-sm font-light text-slate-400'>
            <div>© {currentYear} JanjiKita. All rights reserved.</div>
            <div className='flex items-center space-x-2'>
              <span>Made with ❤️ in Indonesia</span>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
