"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [dogImage, setDogImage] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
    
    // Fetch a random dog image from the Dog CEO API
    const fetchDogImage = async () => {
      try {
        setIsImageLoading(true);
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        if (response.ok) {
          const data = await response.json();
          setDogImage(data.message);
        }
      } catch (error) {
        console.error('Error fetching dog image:', error);
      } finally {
        setIsImageLoading(false);
      }
    };
    
    fetchDogImage();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/breeds?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-70 z-0"></div>
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-yellow-100 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Text content */}
          <div className={`transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mb-6">
              <span className="animate-pulse mr-2">●</span>
              <span>The Ultimate Dog Directory</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Perfect</span> Canine Companion
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Explore our comprehensive collection of dog breeds with detailed information on temperament, care needs, and characteristics.
            </p>
            
            <form onSubmit={handleSearch} className="mb-8 max-w-xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                
                <input
                  type="text"
                  placeholder="Search for a dog breed..."
                  className="w-full pl-12 pr-24 py-4 rounded-full text-gray-800 bg-white border border-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <button
                  type="submit"
                  className="absolute right-2 top-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                >
                  Search
                </button>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
                <span className="inline-block">Popular searches:</span>
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('labrador')}
                  className="text-blue-600 hover:underline"
                >
                  Labrador
                </button>
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('golden retriever')}
                  className="text-blue-600 hover:underline"
                >
                  Golden Retriever
                </button>
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('german shepherd')}
                  className="text-blue-600 hover:underline"
                >
                  German Shepherd
                </button>
              </div>
            </form>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <a
                href="/breeds"
                className="px-8 py-4 rounded-full bg-white text-gray-900 font-semibold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm hover:shadow flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                Browse All Breeds
              </a>
              <a
                href="/blog"
                className="px-8 py-4 rounded-full bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-all flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Dog Care Tips
              </a>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Trusted by dog lovers
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                200+ dog breeds
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Expert advice
              </span>
            </div>
          </div>
          
          {/* Right column - Image */}
          <div className={`relative transition-all duration-1000 delay-300 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative h-[550px] w-full rounded-3xl overflow-hidden shadow-2xl">
              {isImageLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {dogImage && (
                    <Image
                      src={dogImage}
                      alt="Happy dog"
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </>
              )}
            </div>
            
            {/* Floating badges */}
            <div className="absolute -left-6 top-10 bg-white p-4 rounded-2xl shadow-lg transform -rotate-6 transition-transform hover:rotate-0 hover:scale-105 cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Friendly</p>
                  <p className="text-xs text-gray-500">Great with families</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -right-6 bottom-20 bg-white p-4 rounded-2xl shadow-lg transform rotate-6 transition-transform hover:rotate-0 hover:scale-105 cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Energetic</p>
                  <p className="text-xs text-gray-500">Active companion</p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/2 -right-4 bg-white p-4 rounded-2xl shadow-lg transform -rotate-3 transition-transform hover:rotate-0 hover:scale-105 cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Loyal</p>
                  <p className="text-xs text-gray-500">Devoted companion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12 md:h-16" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero; 