import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">PawPedia</span>
              <span className="ml-2 text-sm bg-yellow-400 text-gray-800 px-2 py-1 rounded-full">The Ultimate Dog Directory</span>
            </Link>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-1 md:gap-4">
            <Link href="/" className="px-3 py-2 rounded hover:bg-purple-700 transition-colors">
              Home
            </Link>
            <Link href="/breeds" className="px-3 py-2 rounded hover:bg-purple-700 transition-colors">
              Breeds
            </Link>
            <Link href="/breed-finder" className="px-3 py-2 rounded bg-yellow-400 text-gray-800 hover:bg-yellow-500 transition-colors font-medium">
              Breed Finder
            </Link>
            <Link href="/blog" className="px-3 py-2 rounded hover:bg-purple-700 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="px-3 py-2 rounded hover:bg-purple-700 transition-colors">
              About
            </Link>
            <Link href="/contact" className="px-3 py-2 rounded hover:bg-purple-700 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 