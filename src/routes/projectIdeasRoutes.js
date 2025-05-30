import express from 'express';
import projectIdeasController from '../controllers/projectIdeasController.js';

const router = express.Router();

// Define API routes
router.get('/', projectIdeasController.getProjectIdeas);
router.post('/', projectIdeasController.createProjectIdea);

export default router;
