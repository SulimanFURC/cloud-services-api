import helmet from 'helmet';
import cors from 'cors';

// CORS options: allow only specific origins (customize as needed)
export const corsOptions = {
  origin: [
    'http://localhost:3000', // frontend dev
    'http://localhost:4200',
    'https://cloud-idea-generator.netlify.app', // Netlify production

    // Add your production frontend URL(s) here
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200
};

export { helmet, cors };
