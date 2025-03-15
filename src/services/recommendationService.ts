import { BreedData } from './breedService';

interface RecommendationQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    value: string;
  }[];
}

export interface UserPreferences {
  [key: string]: string;
}

export const recommendationQuestions: RecommendationQuestion[] = [
  {
    id: 'living_space',
    question: 'What type of living space do you have?',
    options: [
      { text: 'Apartment', value: 'apartment' },
      { text: 'Small house', value: 'small_house' },
      { text: 'Large house with yard', value: 'large_house_yard' },
      { text: 'Rural property with lots of space', value: 'rural_property' }
    ]
  },
  {
    id: 'activity_level',
    question: 'How active is your lifestyle?',
    options: [
      { text: 'Sedentary - minimal exercise', value: 'sedentary' },
      { text: 'Moderately active - short walks daily', value: 'moderate' },
      { text: 'Active - regular exercise', value: 'active' },
      { text: 'Very active - running, hiking, outdoor adventures', value: 'very_active' }
    ]
  },
  {
    id: 'experience',
    question: 'What is your experience with dogs?',
    options: [
      { text: 'First-time owner', value: 'first_time' },
      { text: 'Some experience', value: 'some_experience' },
      { text: 'Experienced owner', value: 'experienced' }
    ]
  },
  {
    id: 'time_commitment',
    question: 'How much time can you dedicate to your dog daily?',
    options: [
      { text: 'Minimal (less than 30 minutes)', value: 'minimal' },
      { text: 'Moderate (1-2 hours)', value: 'moderate' },
      { text: 'Significant (3+ hours)', value: 'significant' }
    ]
  },
  {
    id: 'grooming',
    question: 'How much grooming are you willing to do?',
    options: [
      { text: 'Minimal - low maintenance breeds', value: 'minimal' },
      { text: 'Moderate - weekly brushing', value: 'moderate' },
      { text: 'High - daily brushing and regular professional grooming', value: 'high' }
    ]
  },
  {
    id: 'children',
    question: 'Do you have children in your household?',
    options: [
      { text: 'No children', value: 'no_children' },
      { text: 'Older children (8+)', value: 'older_children' },
      { text: 'Young children (under 8)', value: 'young_children' },
      { text: 'Babies or toddlers', value: 'babies' }
    ]
  },
  {
    id: 'other_pets',
    question: 'Do you have other pets?',
    options: [
      { text: 'No other pets', value: 'no_pets' },
      { text: 'Other dogs', value: 'other_dogs' },
      { text: 'Cats', value: 'cats' },
      { text: 'Small animals (birds, rodents, etc.)', value: 'small_animals' }
    ]
  },
  {
    id: 'allergies',
    question: 'Are allergies a concern?',
    options: [
      { text: 'No allergies', value: 'no_allergies' },
      { text: 'Mild allergies - prefer low-shedding breeds', value: 'mild_allergies' },
      { text: 'Severe allergies - need hypoallergenic breeds', value: 'severe_allergies' }
    ]
  },
  {
    id: 'purpose',
    question: 'What is your primary purpose for getting a dog?',
    options: [
      { text: 'Companionship', value: 'companionship' },
      { text: 'Family pet', value: 'family_pet' },
      { text: 'Protection/guard dog', value: 'protection' },
      { text: 'Active lifestyle partner', value: 'active_partner' }
    ]
  },
  {
    id: 'size_preference',
    question: 'What size dog do you prefer?',
    options: [
      { text: 'Small (under 20 lbs)', value: 'small' },
      { text: 'Medium (20-50 lbs)', value: 'medium' },
      { text: 'Large (50-90 lbs)', value: 'large' },
      { text: 'Extra large (90+ lbs)', value: 'extra_large' },
      { text: 'No preference', value: 'no_preference' }
    ]
  }
];

/**
 * Get breed recommendations based on user preferences using Gemini AI
 * @param preferences User preferences from the questionnaire
 * @param availableBreeds List of available breed names
 * @returns Array of recommended breed names with reasoning
 */
export async function getBreedRecommendations(
  preferences: UserPreferences,
  availableBreeds: string[]
): Promise<{ breedName: string; reasoning: string }[]> {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Gemini API key is not defined');
    }
    
    // Format the preferences for the prompt
    const formattedPreferences = Object.entries(preferences)
      .map(([key, value]) => {
        // Convert the key from snake_case to readable format
        const readableKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `${readableKey}: ${value}`;
      })
      .join('\n');
    
    // Format the available breeds
    const formattedBreeds = availableBreeds.join(', ');
    
    // Create the prompt for Gemini
    const prompt = `
      As a dog breed expert, recommend 5 dog breeds that would be the best match for a person with the following preferences:
      
      ${formattedPreferences}
      
      Choose only from these available breeds: ${formattedBreeds}
      
      For each recommended breed, provide:
      1. The breed name
      2. A brief explanation of why this breed is a good match based on the preferences
      
      Format your response as a JSON array with objects containing 'breedName' and 'reasoning' properties.
      Example:
      [
        {
          "breedName": "Labrador Retriever",
          "reasoning": "Great family dog that matches your active lifestyle and experience level."
        },
        ...
      ]
    `;
    
    // Call the Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the response text
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response
    let recommendations;
    
    try {
      // Try to parse the entire response as JSON
      recommendations = JSON.parse(responseText);
    } catch (error) {
      // If that fails, try to extract JSON from the text
      const jsonRegex = /\[[\s\S]*\]/;
      const match = responseText.match(jsonRegex);
      
      if (!match) {
        throw new Error('Could not extract JSON from AI response');
      }
      
      try {
        recommendations = JSON.parse(match[0]);
      } catch (innerError) {
        console.error('Error parsing extracted JSON:', innerError);
        throw new Error('Failed to parse recommendations from AI response');
      }
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error getting breed recommendations:', error);
    return [
      {
        breedName: 'Labrador Retriever',
        reasoning: 'A versatile, friendly breed that adapts well to most lifestyles. (Note: This is a fallback recommendation due to an error in the AI service.)'
      },
      {
        breedName: 'Poodle',
        reasoning: 'Intelligent, hypoallergenic, and comes in different sizes to suit various living situations. (Note: This is a fallback recommendation due to an error in the AI service.)'
      },
      {
        breedName: 'Golden Retriever',
        reasoning: 'Friendly, reliable family dog that\'s good with children and other pets. (Note: This is a fallback recommendation due to an error in the AI service.)'
      }
    ];
  }
}

/**
 * Get all available dog breeds from the Dog CEO API
 * @returns Array of breed names
 */
export async function getAllDogBreeds(): Promise<string[]> {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Convert the breed object to a flat array of breed names
    const breeds: string[] = [];
    
    for (const [breed, subBreeds] of Object.entries(data.message)) {
      // Add the main breed
      breeds.push(breed);
      
      // Add sub-breeds if they exist
      if (Array.isArray(subBreeds) && subBreeds.length > 0) {
        subBreeds.forEach((subBreed: string) => {
          breeds.push(`${breed} ${subBreed}`);
        });
      }
    }
    
    return breeds;
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    return [];
  }
}

/**
 * Get a random image for a specific dog breed from the Dog CEO API
 * @param breed The breed name
 * @returns URL of a random image for the breed
 */
export async function getBreedImage(breed: string): Promise<string> {
  try {
    // Format breed name for API
    // The Dog API uses specific formats for breed paths
    let apiUrl: string;
    
    // Normalize the breed name (lowercase, trim)
    const normalizedBreed = breed.toLowerCase().trim();
    
    // Handle special cases for breed names
    const breedNameMap: Record<string, string> = {
      // Bulldogs
      'french bulldog': 'bulldog/french',
      'english bulldog': 'bulldog/english',
      'american bulldog': 'bulldog/american',
      'bulldog': 'bulldog',
      
      // Terriers
      'boston terrier': 'terrier/boston',
      'yorkshire terrier': 'terrier/yorkshire',
      'border terrier': 'terrier/border',
      'bull terrier': 'terrier/bull',
      'fox terrier': 'terrier/fox',
      'scottish terrier': 'terrier/scottish',
      'west highland terrier': 'terrier/westhighland',
      'west highland white terrier': 'terrier/westhighland',
      'airedale terrier': 'terrier/airedale',
      'cairn terrier': 'terrier/cairn',
      'norfolk terrier': 'terrier/norfolk',
      'norwich terrier': 'terrier/norwich',
      'silky terrier': 'terrier/silky',
      'tibetan terrier': 'terrier/tibetan',
      'toy terrier': 'terrier/toy',
      'wheaten terrier': 'terrier/wheaten',
      
      // Spaniels
      'bichon frise': 'bichon/frise',
      'cocker spaniel': 'spaniel/cocker',
      'springer spaniel': 'spaniel/springer',
      'cavalier king charles spaniel': 'spaniel/cavalier',
      'king charles spaniel': 'spaniel/cavalier',
      'brittany spaniel': 'spaniel/brittany',
      'japanese spaniel': 'spaniel/japanese',
      'sussex spaniel': 'spaniel/sussex',
      'welsh spaniel': 'spaniel/welsh',
      
      // Shepherds
      'german shepherd': 'germanshepherd',
      'australian shepherd': 'shepherd/australian',
      'shetland sheepdog': 'sheepdog/shetland',
      
      // Retrievers
      'golden retriever': 'retriever/golden',
      'labrador retriever': 'retriever/labrador',
      'chesapeake bay retriever': 'retriever/chesapeake',
      'curly retriever': 'retriever/curly',
      'flatcoated retriever': 'retriever/flatcoated',
      
      // Hounds
      'afghan hound': 'hound/afghan',
      'basset hound': 'hound/basset',
      'blood hound': 'hound/blood',
      'english hound': 'hound/english',
      'ibizan hound': 'hound/ibizan',
      'walker hound': 'hound/walker',
      
      // Poodles
      'poodle': 'poodle/standard',
      'miniature poodle': 'poodle/miniature',
      'toy poodle': 'poodle/toy',
      
      // Other common breeds
      'shih tzu': 'shihtzu',
      'border collie': 'collie/border',
      'welsh corgi': 'corgi/welsh',
      'pembroke welsh corgi': 'corgi/pembroke',
      'cardigan welsh corgi': 'corgi/cardigan',
      'doberman pinscher': 'doberman',
      'miniature schnauzer': 'schnauzer/miniature',
      'giant schnauzer': 'schnauzer/giant',
      'standard schnauzer': 'schnauzer',
      'great dane': 'dane/great',
      'saint bernard': 'stbernard',
      'bernese mountain dog': 'mountain/bernese',
      'swiss mountain dog': 'mountain/swiss',
    };
    
    // Check if we have a special mapping for this breed
    if (breedNameMap[normalizedBreed]) {
      apiUrl = `https://dog.ceo/api/breed/${breedNameMap[normalizedBreed]}/images/random`;
    } else {
      // Try to handle other breeds by removing spaces
      // This works for breeds like "husky", "beagle", etc.
      const formattedBreed = normalizedBreed.replace(/\s+/g, '');
      apiUrl = `https://dog.ceo/api/breed/${formattedBreed}/images/random`;
    }
    
    console.log(`Fetching image for ${normalizedBreed} from ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      // If the first attempt fails, try a fallback approach
      // Some breeds might be listed under different names
      console.warn(`Failed to fetch image for ${normalizedBreed}, trying fallback...`);
      
      // Try to extract the first word (main breed) if it's a compound name
      const mainBreed = normalizedBreed.split(' ')[0];
      const fallbackUrl = `https://dog.ceo/api/breed/${mainBreed}/images/random`;
      
      if (fallbackUrl !== apiUrl) {
        console.log(`Trying fallback URL: ${fallbackUrl}`);
        const fallbackResponse = await fetch(fallbackUrl);
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          return fallbackData.message;
        }
      }
      
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error(`Error fetching image for breed ${breed}:`, error);
    return 'https://placehold.co/600x400?text=No+Image+Available';
  }
} 