import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  ArrowUpRight,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'API Documentation', href: '#' },
      { name: 'Integrations', href: '#' },
      { name: 'Changelog', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press Kit', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    resources: [
      { name: 'Blog', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Tutorials', href: '#' },
      { name: 'Webinars', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR', href: '#' },
      { name: 'Security', href: '#' },
    ],
  };

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: '#',
      color: 'hover:text-pink-400',
    },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: '#',
      color: 'hover:text-blue-500',
    },
    { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-300' },
  ];

  return (
    <footer className='relative shadow-md backdrop-blur-md bg-transparent border-t border-slate-800/50'>
      {/* Background Effects */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-600/5 to-purple-600/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10'>
        <div className='max-w-7xl mx-auto px-6 py-16'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
            {/* Brand Section */}
            <div className='lg:col-span-4'>
              <div className='space-y-6'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center'>
                    <div className='w-6 h-6 bg-white rounded-lg flex items-center justify-center'>
                      <div className='w-3 h-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full'></div>
                    </div>
                  </div>
                  <h3 className='text-2xl font-light text-white tracking-wide'>
                    JanjiKita
                  </h3>
                </div>

                <p className='text-slate-400 font-light leading-relaxed max-w-sm'>
                  JanjiKita adalah platform undangan digital modern yang
                  memudahkan kamu membagikan momen spesial dengan cara yang
                  indah, interaktif, dan praktis.
                </p>

                <div className='space-y-3'>
                  <div className='flex items-center space-x-3 text-slate-400 hover:text-slate-300 transition-colors duration-200'>
                    <Mail className='w-4 h-4' />
                    <span className='font-light'>halo@janjikita.id</span>
                  </div>
                  <div className='flex items-center space-x-3 text-slate-400 hover:text-slate-300 transition-colors duration-200'>
                    <Phone className='w-4 h-4' />
                    <span className='font-light'>+62 812 3456 7890</span>
                  </div>
                  <div className='flex items-center space-x-3 text-slate-400 hover:text-slate-300 transition-colors duration-200'>
                    <MapPin className='w-4 h-4' />
                    <span className='font-light'>Bandung, Indonesia</span>
                  </div>
                </div>

                <div className='flex space-x-4 pt-4'>
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`w-10 h-10 bg-slate-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-slate-700/50 hover:border-slate-600/50 text-slate-400 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-slate-700/50`}
                      aria-label={social.name}
                    >
                      <social.icon className='w-4 h-4' />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className='lg:col-span-8'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
                {Object.entries(footerLinks).map(([section, links]) => (
                  <div key={section} className='space-y-4'>
                    <h4 className='text-white font-medium tracking-wide'>
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </h4>
                    <ul className='space-y-3'>
                      {links.map((link) => (
                        <li key={link.name}>
                          <a
                            href={link.href}
                            className='text-slate-400 hover:text-white font-light transition-colors duration-200 flex items-center group'
                          >
                            {link.name}
                            <ArrowUpRight className='w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className='border-t border-slate-800/50'>
          <div className='max-w-7xl mx-auto px-6 py-12'>
            <div className='flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0'>
              <div className='text-center lg:text-left'>
                <h3 className='text-2xl font-light text-white mb-2'>
                  Tetap terhubung
                </h3>
                <p className='text-slate-400 font-light'>
                  Dapatkan info terbaru dan penawaran menarik langsung ke email
                  kamu.
                </p>
              </div>
              <div className='flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto'>
                <input
                  type='email'
                  placeholder='Masukkan email kamu'
                  className='px-6 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600/50 focus:border-slate-600/50 transition-all duration-200 sm:min-w-[300px]'
                />
                <button className='px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl font-medium hover:from-pink-600 hover:to-pink-700 transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-slate-800/50'>
          <div className='max-w-7xl mx-auto px-6 py-8'>
            <div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'>
              <div className='text-slate-400 font-light text-sm'>
                © {currentYear} JanjiKita. All rights reserved.
              </div>
              <div className='flex items-center space-x-8 text-sm'>
                <span className='text-slate-400 font-light'>
                  Made with ❤️ in Indonesia
                </span>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                  <span className='text-slate-400 font-light'>
                    All systems operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
