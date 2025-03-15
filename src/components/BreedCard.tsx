import Image from 'next/image';
import Link from 'next/link';

interface BreedCardProps {
  breed: string;
  imageUrl: string;
}

const BreedCard = ({ breed, imageUrl }: BreedCardProps) => {
  // Format breed name for display (capitalize first letter of each word)
  const formatBreedName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Link href={`/breeds/${breed}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-xl">
        <div className="relative h-64 w-full">
          <Image
            src={imageUrl}
            alt={`${formatBreedName(breed)} dog`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">{formatBreedName(breed)}</h3>
          <p className="mt-2 text-sm text-gray-600">
            Click to learn more about the {formatBreedName(breed)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BreedCard; 