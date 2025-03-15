"use client";

import Image from 'next/image';
import { useState } from 'react';

interface BreedInfoProps {
  breed: string;
  images: string[];
}

// This is a placeholder component that would be enhanced with real breed data
// In a production app, you would fetch this data from an API or database
const BreedInfo = ({ breed, images }: BreedInfoProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Format breed name for display
  const formatBreedName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Mock breed data - in a real app, this would come from an API
  const breedData = {
    temperament: 'Friendly, Loyal, Intelligent',
    lifeSpan: '10-14 years',
    weight: '20-30 kg',
    height: '45-60 cm',
    group: 'Working Group',
    origin: 'Various regions',
    description: `The ${formatBreedName(breed)} is a wonderful companion dog known for its loyalty and friendly nature. These dogs are intelligent and trainable, making them excellent family pets. They require regular exercise and mental stimulation to stay happy and healthy.`,
    characteristics: [
      { name: 'Energy Level', value: 4 },
      { name: 'Trainability', value: 5 },
      { name: 'Good with Children', value: 5 },
      { name: 'Good with Other Dogs', value: 4 },
      { name: 'Shedding', value: 3 },
      { name: 'Grooming Needs', value: 2 },
      { name: 'Exercise Needs', value: 4 },
      { name: 'Barking Tendency', value: 3 },
    ],
    careInfo: [
      {
        title: 'Exercise',
        content: `${formatBreedName(breed)}s need regular exercise to maintain their physical and mental health. Daily walks and play sessions are recommended.`
      },
      {
        title: 'Grooming',
        content: `Regular brushing helps keep the ${formatBreedName(breed)}'s coat healthy and reduces shedding. Bathing should be done as needed.`
      },
      {
        title: 'Nutrition',
        content: `A balanced diet appropriate for the ${formatBreedName(breed)}'s age, size, and activity level is essential for their overall health and wellbeing.`
      },
      {
        title: 'Health',
        content: `Like all breeds, ${formatBreedName(breed)}s may be prone to certain health conditions. Regular veterinary check-ups are important.`
      }
    ]
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
        {formatBreedName(breed)}
      </h1>

      {/* Image Gallery */}
      <div className="mb-8 relative">
        <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden">
          {images.length > 0 ? (
            <Image
              src={images[currentImageIndex]}
              alt={`${formatBreedName(breed)} dog`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p>No images available</p>
            </div>
          )}
        </div>
        
        {images.length > 1 && (
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4">
            <button 
              onClick={prevImage}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
              aria-label="Previous image"
            >
              &lt;
            </button>
            <button 
              onClick={nextImage}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
              aria-label="Next image"
            >
              &gt;
            </button>
          </div>
        )}
        
        {images.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Breed Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">About the {formatBreedName(breed)}</h2>
          <p className="text-gray-700 mb-6">{breedData.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800">Temperament</h3>
              <p className="text-gray-700">{breedData.temperament}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800">Life Span</h3>
              <p className="text-gray-700">{breedData.lifeSpan}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800">Weight</h3>
              <p className="text-gray-700">{breedData.weight}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800">Height</h3>
              <p className="text-gray-700">{breedData.height}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Characteristics</h2>
          <div className="space-y-4">
            {breedData.characteristics.map((characteristic, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">{characteristic.name}</span>
                  <span className="text-gray-500">{characteristic.value}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(characteristic.value / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Care Information */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Care Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {breedData.careInfo.map((info, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{info.title}</h3>
              <p className="text-gray-700">{info.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreedInfo; 