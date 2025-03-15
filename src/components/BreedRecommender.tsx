'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  recommendationQuestions, 
  UserPreferences, 
  getBreedRecommendations,
  getAllDogBreeds,
  getBreedImage
} from '@/services/recommendationService';

interface Recommendation {
  breedName: string;
  reasoning: string;
  imageUrl?: string;
}

export default function BreedRecommender() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableBreeds, setAvailableBreeds] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  // Fetch available breeds on component mount
  useEffect(() => {
    const fetchBreeds = async () => {
      const breeds = await getAllDogBreeds();
      setAvailableBreeds(breeds);
    };
    
    fetchBreeds();
  }, []);

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
    setPreferences({});
    setRecommendations([]);
    setError(null);
  };

  const handleOptionSelect = (optionValue: string) => {
    const currentQuestion = recommendationQuestions[currentQuestionIndex];
    
    // Update preferences
    setPreferences(prev => ({
      ...prev,
      [currentQuestion.id]: optionValue
    }));
    
    // Move to next question or generate recommendations if all questions answered
    if (currentQuestionIndex < recommendationQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      generateRecommendations();
    }
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get recommendations from AI
      const recs = await getBreedRecommendations(preferences, availableBreeds);
      
      // Fetch images for each recommended breed
      const recsWithImages = await Promise.all(
        recs.map(async (rec) => {
          const imageUrl = await getBreedImage(rec.breedName.toLowerCase());
          return { ...rec, imageUrl };
        })
      );
      
      setRecommendations(recsWithImages);
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setPreferences({});
    setRecommendations([]);
    setError(null);
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Render the intro screen
  if (!showQuiz) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 shadow-lg max-w-4xl mx-auto my-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">Find Your Perfect Dog Breed Match</h2>
          <p className="text-lg text-gray-700">
            Answer a few questions about your lifestyle and preferences, and our AI-powered tool will recommend the best dog breeds for you.
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={startQuiz}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Render the questions
  if (currentQuestionIndex >= 0 && currentQuestionIndex < recommendationQuestions.length && recommendations.length === 0 && !isLoading) {
    const currentQuestion = recommendationQuestions[currentQuestionIndex];
    
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto my-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={goBack} 
              className={`text-indigo-600 flex items-center ${currentQuestionIndex === 0 ? 'invisible' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            <div className="text-gray-500 text-sm">
              Question {currentQuestionIndex + 1} of {recommendationQuestions.length}
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition duration-200"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between">
            <button 
              onClick={() => setShowQuiz(false)} 
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <div className="text-indigo-600">
              {currentQuestionIndex + 1} / {recommendationQuestions.length}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto my-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
        <p className="text-lg text-gray-700 mt-6">Finding your perfect dog breed match...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto my-12 text-center">
        <div className="text-red-500 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold mt-4">{error}</h3>
        </div>
        <button
          onClick={resetQuiz}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render recommendations
  if (recommendations.length > 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto my-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">Your Perfect Dog Breed Matches</h2>
          <p className="text-gray-600">Based on your preferences, here are the dog breeds that would be a great fit for you:</p>
        </div>
        
        <div className="space-y-8">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex flex-col md:flex-row bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="md:w-1/3 relative h-64">
                {rec.imageUrl && (
                  <Image
                    src={rec.imageUrl}
                    alt={rec.breedName}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="md:w-2/3 p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{rec.breedName}</h3>
                <p className="text-gray-600 mb-4">{rec.reasoning}</p>
                <Link 
                  href={`/breeds/${rec.breedName.toLowerCase()}`}
                  className="inline-block px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition duration-300 mr-4"
          >
            Retake Quiz
          </button>
          <Link 
            href="/breeds"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Browse All Breeds
          </Link>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
} 