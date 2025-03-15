-- Create blog posts table
CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  featured_image TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog categories table
CREATE TABLE blog_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE blog_comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Nutrition', 'nutrition', 'Articles about dog nutrition and diet'),
  ('Training', 'training', 'Tips and guides for training your dog'),
  ('Health', 'health', 'Information about dog health and wellness'),
  ('Behavior', 'behavior', 'Understanding dog behavior and psychology'),
  ('Grooming', 'grooming', 'Tips for grooming and maintaining your dog''s appearance'),
  ('Breeds', 'breeds', 'Information about different dog breeds');

-- Insert some sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, author, category, published_at) VALUES
  (
    'Essential Nutrition Tips for Your Dog',
    'essential-nutrition-tips-for-your-dog',
    '# Essential Nutrition Tips for Your Dog

Good nutrition is the foundation of your dog''s health and wellbeing. Here are some essential tips to ensure your furry friend gets the nutrition they need.

## Understand Your Dog''s Nutritional Needs

Different dogs have different nutritional requirements based on their:

- Age (puppy, adult, senior)
- Size and breed
- Activity level
- Health conditions

Consult with your veterinarian to determine the specific nutritional needs of your dog.

## Choose High-Quality Dog Food

When selecting dog food, look for:

- A named animal protein source as the first ingredient (e.g., chicken, beef, lamb)
- Whole food ingredients rather than by-products
- No artificial preservatives, colors, or flavors
- Complete and balanced nutrition (look for AAFCO statement)

## Proper Portion Control

Overfeeding is a common problem that can lead to obesity and related health issues. Follow the feeding guidelines on the dog food packaging, but adjust based on your dog''s individual needs.

## Consistent Feeding Schedule

Most adult dogs do well with two meals per day. Puppies may need three or four smaller meals. Stick to a consistent feeding schedule to help with digestion and house training.

## Fresh Water Always Available

Ensure your dog always has access to clean, fresh water. Change the water daily and clean the bowl regularly.

## Treats in Moderation

Treats should make up no more than 10% of your dog''s daily caloric intake. Choose healthy options like small pieces of cooked lean meat or vegetables like carrots.

## Foods to Avoid

Some human foods are toxic to dogs, including:

- Chocolate
- Grapes and raisins
- Onions and garlic
- Xylitol (found in sugar-free products)
- Alcohol
- Caffeine

## Consider Supplements Carefully

Most dogs on a complete and balanced diet don''t need supplements. However, some may benefit from specific supplements like fish oil or joint supplements. Always consult with your veterinarian before adding supplements to your dog''s diet.

## Watch for Food Allergies

Signs of food allergies or sensitivities include:

- Itchy skin
- Ear infections
- Gastrointestinal issues
- Excessive licking

If you suspect your dog has a food allergy, work with your veterinarian to identify the allergen.

## Adjust Diet as Needed

Your dog''s nutritional needs will change throughout their life. Regularly reassess their diet with your veterinarian and make adjustments as needed.

Remember, good nutrition is one of the most important things you can provide for your dog''s health and happiness!',
    'Learn about the key nutrients your dog needs for optimal health and how to choose the right food for their specific needs.',
    'https://images.dog.ceo/breeds/retriever-golden/n02099601_7692.jpg',
    'Dr. Sarah Johnson',
    'Nutrition',
    '2023-03-15T12:00:00Z'
  ),
  (
    'The Ultimate Guide to Dog Training',
    'ultimate-guide-to-dog-training',
    '# The Ultimate Guide to Dog Training

Effective dog training is essential for a harmonious relationship with your canine companion. This guide covers the fundamentals of dog training to help you and your dog communicate better.

## Basic Principles of Dog Training

### Positive Reinforcement

Positive reinforcement involves rewarding your dog for desired behaviors, which increases the likelihood they''ll repeat those behaviors. Rewards can include:

- Treats
- Praise
- Petting
- Play
- Toys

### Consistency

Consistency is key in dog training. Everyone in the household should:

- Use the same commands
- Enforce the same rules
- Follow the same routines

### Timing

Timing is crucial. Rewards must be given immediately after the desired behavior (within seconds) for your dog to make the connection.

### Patience

Training takes time and patience. Dogs learn at different rates, and some concepts are more challenging than others.

## Essential Commands Every Dog Should Know

### Sit

1. Hold a treat close to your dog''s nose
2. Move your hand up, causing their head to follow and their bottom to lower
3. Once they''re in sitting position, say "sit," give the treat, and offer praise

### Stay

1. Ask your dog to sit
2. Open your palm in front of you and say "stay"
3. Take a few steps back
4. Reward them if they stay, gradually increasing the distance and duration

### Come

1. Put your dog on a leash and say "come" while gently pulling on the leash
2. When they come to you, reward them
3. Practice off-leash in a safe, enclosed area

### Down

1. Hold a treat in your closed hand
2. Move your hand to the ground, allowing them to follow
3. Slide your hand along the ground to encourage their body to follow
4. When they''re in the down position, say "down," and give the treat

### Leave It

1. Place a treat in both hands
2. Show one enclosed fist with the treat inside and say "leave it"
3. Ignore any behaviors like pawing or mouthing
4. Once they stop trying to get the treat, offer the treat from your other hand
5. Gradually work up to placing the treat on the floor

## Common Training Challenges

### Jumping Up

- Ignore jumping behavior
- Turn away when your dog jumps
- Reward them when all four paws are on the ground
- Teach an alternative behavior like sitting for greeting

### Pulling on Leash

- Stop walking when your dog pulls
- Only continue walking when the leash is slack
- Reward good walking behavior
- Consider tools like front-clip harnesses

### Barking

- Identify the cause of barking
- Teach a "quiet" command
- Reward quiet behavior
- Provide adequate exercise and mental stimulation

## Advanced Training Techniques

### Clicker Training

Clicker training uses a small device that makes a distinct clicking sound to mark desired behaviors precisely, followed by a reward.

### Target Training

Teach your dog to touch a target (like your hand or a stick) with their nose, which can be used to guide them into various positions or behaviors.

### Shaping

Shaping involves rewarding successive approximations of a behavior until the complete behavior is achieved.

## Training Tips for Success

- Keep training sessions short (5-15 minutes)
- End on a positive note
- Train in different environments
- Gradually increase distractions
- Be consistent with commands and rewards
- Make training fun for both of you
- Never use punishment or fear-based methods

Remember, the goal of training is to build a strong bond with your dog based on trust and clear communication. Enjoy the process!',
    'Discover effective training techniques to build a strong bond with your dog and address common behavioral issues.',
    'https://images.dog.ceo/breeds/collie-border/n02106166_1031.jpg',
    'Mark Wilson',
    'Training',
    '2023-02-28T14:30:00Z'
  ); 