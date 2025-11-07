import React from 'react';
import Image from 'next/image';
import {
  
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Music
} from 'lucide-react';

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
      name: 'Tiktok',
      icon: Music,
      href: '#',
      color: 'hover:text-sky-400',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: '#',
      color: 'hover:text-blue-400',
    },
    {
      name: 'GitHub',
      icon: Github,
      href: '#',
      color: 'hover:text-gray-300',
    },
  ];

  return (
    <footer className='relative border-t border-slate-800/50 bg-transparent'>
      {/* Background Effects */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl bg-gradient-to-r from-pink-600/5 to-purple-600/5' />
        <div className='absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl bg-gradient-to-r from-purple-600/5 to-pink-600/5' />
      </div>

      <div className='relative z-10 flex flex-col items-center text-center px-6 py-16 max-w-3xl mx-auto'>
        {/* Brand Section */}
        <div className='items-center space-y-6'>
          <h3 className='text-white text-5xl'>JanjiKita</h3>

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
