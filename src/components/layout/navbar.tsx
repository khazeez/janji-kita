export default function Navbar() {
  return (
    <div className='fixed top-0 left-0 w-full z-50 bg-transparent text-white shadow-md'>
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
        {/* Logo */}
        <div className='font-bold text-2xl'>JanjiKita</div>

        {/* Menu Tengah */}
        <div className='space-x-10 hidden md:flex'>
          <a href='#catalogue' className='hover:text-gray-300'>
            Catalogue
          </a>
          <a href='#about' className='hover:text-gray-300'>
            About
          </a>
          <a href='#blog' className='hover:text-gray-300'>
            Blog
          </a>
          <a href='#blog' className='hover:text-gray-300'>
            Product
          </a>
        </div>

        {/* Sign in / Sign up */}
        <div className='space-x-4'>
          <button className='px-4 py-2 hover:underline'>Sign in</button>
          <button className='px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200'>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
