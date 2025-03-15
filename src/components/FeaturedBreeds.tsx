"use client";

import { useState, useEffect } from 'react';
import BreedCard from './BreedCard';

// Featured breeds to display with their correct API format
const featuredBreedsList = [
  { display: 'labrador', api: 'labrador' },
  { display: 'german-shepherd', api: 'germanshepherd' },
  { display: 'golden-retriever', api: 'retriever/golden' },
  { display: 'bulldog', api: 'bulldog' },
  { display: 'beagle', api: 'beagle' },
  { display: 'poodle', api: 'poodle' },
  { display: 'rottweiler', api: 'rottweiler' },
  { display: 'yorkshire-terrier', api: 'terrier/yorkshire' }
];

const FeaturedBreeds = () => {
  const [breedImages, setBreedImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    const fetchBreedImages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const imagePromises = featuredBreedsList.map(async (breed) => {
          // Use the correct API format directly
          const response = await fetch(`https://dog.ceo/api/breed/${breed.api}/images/random`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch image for ${breed.display}`);
          }
          
          const data = await response.json();
          return { breed: breed.display, imageUrl: data.message };
        });
        
        const results = await Promise.all(imagePromises);
        
        const imagesMap: Record<string, string> = {};
        results.forEach(({ breed, imageUrl }) => {
          imagesMap[breed] = imageUrl;
        });
        
        setBreedImages(imagesMap);
        
        // Trigger animation after images are loaded
        setTimeout(() => {
          setAnimateCards(true);
        }, 300);
      } catch (err) {
        console.error('Error fetching breed images:', err);
        setError('Failed to load breed images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBreedImages();
  }, []);

  // Format breed name for display
  const formatBreedName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-70"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50 rounded-full translate-x-1/3 translate-y-1/3 opacity-70"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-4">
            Popular Companions
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Dog Breeds
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore some of the most popular dog breeds and find your perfect companion.
            Each breed has unique characteristics and care requirements.
          </p>
        </div>
        
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]"></div>
            <p className="mt-6 text-lg text-gray-600">Fetching adorable dogs...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12 bg-red-50 rounded-xl">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredBreedsList.map((breed, index) => (
              breedImages[breed.display] && (
                <div 
                  key={breed.display}
                  className={`transform transition-all duration-700 ease-out ${
                    animateCards ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="group h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={breedImages[breed.display]} 
                        alt={formatBreedName(breed.display)} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {formatBreedName(breed.display)}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="flex items-center mr-4">
                          <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          4.8/5
                        </span>
                        <span>Popular choice</span>
                      </div>
                      <a 
                        href={`/breeds/${breed.display}`}
                        className="inline-flex items-center text-indigo-600 font-medium group-hover:text-indigo-800 transition-colors"
                      >
                        View details
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
        
        <div className="text-center mt-16">
          <a 
            href="/breeds" 
            className="inline-flex items-center px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View All Breeds
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBreeds; 