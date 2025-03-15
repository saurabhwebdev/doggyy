"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { getCachedBreedData, cacheBreedData, BreedData as CachedBreedData } from '@/services/breedService';

interface BreedInfoGeminiProps {
  breed: string;
  images: string[];
}

interface BreedData extends CachedBreedData {
  isLoading: boolean;
  error: string | null;
}

const BreedInfoGemini = ({ breed, images }: BreedInfoGeminiProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [breedData, setBreedData] = useState<BreedData>({
    description: '',
    temperament: '',
    lifeSpan: '',
    weight: '',
    height: '',
    group: '',
    origin: '',
    history: '',
    funFacts: [],
    trainingTips: [],
    characteristics: [],
    careInfo: [],
    isLoading: true,
    error: null
  });
  
  // Use environment variable for API key
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyDbjsVh3l8WjWr1JF5jGDupHZnfLN90a_0";

  // Format breed name for display
  const formatBreedName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    const fetchBreedInfo = async () => {
      try {
        const formattedBreedName = formatBreedName(breed);
        
        // First, check if we have cached data
        const cachedData = await getCachedBreedData(breed);
        
        if (cachedData) {
          // Use cached data if available
          setBreedData({
            ...cachedData,
            isLoading: false,
            error: null
          });
          console.log(`Using cached data for ${formattedBreedName}`);
          return;
        }
        
        console.log(`No cache found for ${formattedBreedName}, fetching from API...`);
        
        // If no cached data, fetch from Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `I need detailed information about the ${formattedBreedName} dog breed. Please provide the following information in a structured format:
                    
                    1. A detailed description of the breed (2-3 sentences)
                    2. Temperament traits (comma-separated list)
                    3. Life span (in years, e.g., "10-14 years")
                    4. Weight range (in kg, e.g., "20-30 kg")
                    5. Height range (in cm, e.g., "45-60 cm")
                    6. Breed group (e.g., "Working Group", "Sporting Group")
                    7. Origin (country or region)
                    8. Brief history of the breed (2-3 sentences)
                    9. 3-5 interesting fun facts about the breed
                    10. 3-5 training tips specific to this breed
                    
                    Also provide ratings from 1-5 for the following characteristics:
                    - Energy Level
                    - Trainability
                    - Good with Children
                    - Good with Other Dogs
                    - Shedding
                    - Grooming Needs
                    - Exercise Needs
                    - Barking Tendency
                    - Adaptability
                    - Apartment Friendly
                    
                    Finally, provide care information for the following categories:
                    - Exercise (specific to this breed)
                    - Grooming (specific to this breed)
                    - Nutrition (specific to this breed)
                    - Health (common health issues for this breed)
                    - Training (specific training approaches for this breed)
                    
                    Format your response as JSON with the following structure:
                    {
                      "description": "string",
                      "temperament": "string",
                      "lifeSpan": "string",
                      "weight": "string",
                      "height": "string",
                      "group": "string",
                      "origin": "string",
                      "history": "string",
                      "funFacts": ["string", "string", "string"],
                      "trainingTips": ["string", "string", "string"],
                      "characteristics": [
                        {"name": "Energy Level", "value": number},
                        {"name": "Trainability", "value": number},
                        {"name": "Good with Children", "value": number},
                        {"name": "Good with Other Dogs", "value": number},
                        {"name": "Shedding", "value": number},
                        {"name": "Grooming Needs", "value": number},
                        {"name": "Exercise Needs", "value": number},
                        {"name": "Barking Tendency", "value": number},
                        {"name": "Adaptability", "value": number},
                        {"name": "Apartment Friendly", "value": number}
                      ],
                      "careInfo": [
                        {"title": "Exercise", "content": "string"},
                        {"title": "Grooming", "content": "string"},
                        {"title": "Nutrition", "content": "string"},
                        {"title": "Health", "content": "string"},
                        {"title": "Training", "content": "string"}
                      ]
                    }
                    
                    Ensure all information is accurate and specific to the ${formattedBreedName} breed. If you're uncertain about any information, provide the most commonly accepted facts.`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1500,
            }
          })
        });
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts) {
          const responseText = data.candidates[0].content.parts[0].text;
          
          // Extract JSON from the response
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[0]);
            
            try {
              // Cache the data in Supabase for future requests
              const cacheResult = await cacheBreedData(breed, jsonData, 6); // Cache for 6 months
              if (!cacheResult) {
                console.warn(`Failed to cache data for ${formattedBreedName}, but will continue with display`);
              }
            } catch (cacheError) {
              console.error('Error while caching breed data:', cacheError);
              // Continue with display even if caching fails
            }
            
            setBreedData({
              ...jsonData,
              isLoading: false,
              error: null
            });
          } else {
            throw new Error("Could not parse JSON from response");
          }
        } else {
          throw new Error("Invalid response from Gemini API");
        }
      } catch (error) {
        console.error('Error fetching breed info:', error);
        setBreedData(prev => ({
          ...prev,
          isLoading: false,
          error: "Failed to load breed information. Please try again later."
        }));
        
        // Set fallback data
        const fallbackData: BreedData = {
          description: `The ${formatBreedName(breed)} is a wonderful companion dog known for its loyalty and friendly nature. These dogs are intelligent and trainable, making them excellent family pets. They require regular exercise and mental stimulation to stay happy and healthy.`,
          temperament: 'Friendly, Loyal, Intelligent',
          lifeSpan: '10-14 years',
          weight: '20-30 kg',
          height: '45-60 cm',
          group: 'Various',
          origin: 'Various regions',
          history: `The ${formatBreedName(breed)} has a rich history dating back many years. They were originally bred for specific purposes and have evolved over time to become the beloved companions we know today.`,
          funFacts: [
            `${formatBreedName(breed)}s are known for their unique personalities.`,
            `They have been featured in many famous movies and TV shows.`,
            `These dogs have a special way of communicating with their owners.`
          ],
          trainingTips: [
            'Start training early for best results.',
            'Use positive reinforcement techniques.',
            'Be consistent with commands and expectations.'
          ],
          characteristics: [
            { name: 'Energy Level', value: 3 },
            { name: 'Trainability', value: 3 },
            { name: 'Good with Children', value: 4 },
            { name: 'Good with Other Dogs', value: 3 },
            { name: 'Shedding', value: 3 },
            { name: 'Grooming Needs', value: 3 },
            { name: 'Exercise Needs', value: 3 },
            { name: 'Barking Tendency', value: 3 },
            { name: 'Adaptability', value: 3 },
            { name: 'Apartment Friendly', value: 3 }
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
            },
            {
              title: 'Training',
              content: `${formatBreedName(breed)}s respond well to positive reinforcement training methods. Consistency and patience are key to successful training.`
            }
          ],
          isLoading: false,
          error: null
        };
        
        setBreedData(fallbackData);
      }
    };

    fetchBreedInfo();
  }, [breed, API_KEY]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Custom renderer components for markdown
  const markdownComponents: Components = {
    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
    strong: ({ node, ...props }) => <strong className="font-bold text-indigo-800" {...props} />,
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

      {/* Loading State */}
      {breedData.isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg text-gray-600">Loading breed information...</span>
        </div>
      )}

      {/* Error State */}
      {breedData.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{breedData.error}</p>
        </div>
      )}

      {/* Breed Information */}
      {!breedData.isLoading && !breedData.error && (
        <>
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
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Group</h3>
                  <p className="text-gray-700">{breedData.group}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Origin</h3>
                  <p className="text-gray-700">{breedData.origin}</p>
                </div>
              </div>

              {/* History Section */}
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">History</h2>
              <p className="text-gray-700 mb-6">{breedData.history}</p>
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

          {/* Fun Facts Section */}
          <div className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Fun Facts About {formatBreedName(breed)}s</h2>
            <ul className="list-disc pl-6 space-y-3">
              {breedData.funFacts.map((fact, index) => (
                <li key={index} className="text-gray-700">{fact}</li>
              ))}
            </ul>
          </div>

          {/* Training Tips Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Training Tips</h2>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <ul className="list-disc pl-6 space-y-3">
                {breedData.trainingTips.map((tip, index) => (
                  <li key={index} className="text-gray-700">{tip}</li>
                ))}
              </ul>
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

          {/* Ideal Owner Section */}
          <div className="mb-12 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Is a {formatBreedName(breed)} Right For You?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Ideal For</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {(breedData.characteristics.find(c => c.name === "Energy Level")?.value ?? 0) >= 4 && (
                    <li className="text-gray-700">Active individuals or families</li>
                  )}
                  {(breedData.characteristics.find(c => c.name === "Good with Children")?.value ?? 0) >= 4 && (
                    <li className="text-gray-700">Families with children</li>
                  )}
                  {(breedData.characteristics.find(c => c.name === "Apartment Friendly")?.value ?? 0) >= 4 && (
                    <li className="text-gray-700">Apartment living</li>
                  )}
                  {(breedData.characteristics.find(c => c.name === "Trainability")?.value ?? 0) >= 4 && (
                    <li className="text-gray-700">First-time dog owners</li>
                  )}
                  <li className="text-gray-700">People looking for a loyal companion</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">May Not Be Ideal For</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {(breedData.characteristics.find(c => c.name === "Energy Level")?.value ?? 3) <= 2 && (
                    <li className="text-gray-700">Very active individuals</li>
                  )}
                  {(breedData.characteristics.find(c => c.name === "Energy Level")?.value ?? 0) >= 4 && (
                    <li className="text-gray-700">Those with limited time for exercise</li>
                  )}
                  {(breedData.characteristics.find(c => c.name === "Grooming Needs")?.value ?? 0) >= 4 && (
                    <li className="text-gray-700">Those who prefer low-maintenance pets</li>
                  )}
                  {(breedData.characteristics.find(c => c.name === "Barking Tendency")?.value ?? 0) >= 4 && (
                    <li className="text-gray-700">Those living in noise-sensitive environments</li>
                  )}
                  {(breedData.characteristics.find(c => c.name === "Apartment Friendly")?.value ?? 5) <= 2 && (
                    <li className="text-gray-700">Apartment dwellers with limited space</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Ask AI Assistant */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-12">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white mr-4 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Have Questions About {formatBreedName(breed)}s?</h3>
            <p className="text-gray-600 mb-4">Our AI assistant can answer specific questions about {formatBreedName(breed)}s, including training tips, health concerns, and more.</p>
            <button 
              onClick={() => {
                // Find and click the chatbot button
                const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
                if (chatButton) chatButton.click();
                
                // Set a timeout to allow the chat to open before setting the input value
                setTimeout(() => {
                  // Find the input field and set its value
                  const inputField = document.querySelector('input[placeholder*="Ask about dog breeds"]') as HTMLInputElement;
                  if (inputField) {
                    inputField.value = `Tell me more about ${formatBreedName(breed)} dogs`;
                    // Trigger an input event to make React aware of the change
                    const event = new Event('input', { bubbles: true });
                    inputField.dispatchEvent(event);
                  }
                }, 500);
              }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              Ask About {formatBreedName(breed)}s
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreedInfoGemini; 