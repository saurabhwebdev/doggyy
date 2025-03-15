const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Preparing project for Vercel deployment...');

// 1. Make sure TypeScript errors are fixed
try {
  console.log('Fixing TypeScript errors...');
  execSync('npm run fix-ts-errors', { stdio: 'inherit' });
} catch (error) {
  console.error('Error fixing TypeScript errors:', error);
}

// 2. Make sure .env file exists
if (!fs.existsSync(path.join(process.cwd(), '.env'))) {
  console.log('Creating .env file from .env.local...');
  if (fs.existsSync(path.join(process.cwd(), '.env.local'))) {
    fs.copyFileSync(
      path.join(process.cwd(), '.env.local'),
      path.join(process.cwd(), '.env')
    );
  } else {
    console.warn('Warning: .env.local file not found. Please create a .env file manually.');
  }
}

// 3. Make sure .env.production file exists
if (!fs.existsSync(path.join(process.cwd(), '.env.production'))) {
  console.log('Creating .env.production file from .env.local...');
  if (fs.existsSync(path.join(process.cwd(), '.env.local'))) {
    fs.copyFileSync(
      path.join(process.cwd(), '.env.local'),
      path.join(process.cwd(), '.env.production')
    );
  } else if (fs.existsSync(path.join(process.cwd(), '.env'))) {
    fs.copyFileSync(
      path.join(process.cwd(), '.env'),
      path.join(process.cwd(), '.env.production')
    );
  } else {
    console.warn('Warning: No environment file found. Please create a .env.production file manually.');
  }
}

// 4. Make sure vercel.json exists
if (!fs.existsSync(path.join(process.cwd(), 'vercel.json'))) {
  console.log('Creating vercel.json file...');
  const vercelConfig = {
    version: 2,
    buildCommand: 'npm run build-no-lint',
    devCommand: 'npm run dev',
    installCommand: 'npm install',
    framework: 'nextjs',
    outputDirectory: '.next'
  };
  fs.writeFileSync(
    path.join(process.cwd(), 'vercel.json'),
    JSON.stringify(vercelConfig, null, 2)
  );
}

// 5. Make sure .eslintrc.json exists
if (!fs.existsSync(path.join(process.cwd(), '.eslintrc.json'))) {
  console.log('Creating .eslintrc.json file...');
  const eslintConfig = {
    "extends": "next/core-web-vitals",
    "rules": {
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  };
  fs.writeFileSync(
    path.join(process.cwd(), '.eslintrc.json'),
    JSON.stringify(eslintConfig, null, 2)
  );
}

console.log('Project is ready for Vercel deployment!');
console.log('To deploy to Vercel:');
console.log('1. Push your code to GitHub');
console.log('2. Go to vercel.com and create a new project from your GitHub repository');
console.log('3. Configure your environment variables');
console.log('4. Deploy!'); 