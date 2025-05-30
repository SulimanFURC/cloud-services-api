import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure dotenv loads from the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

class ProjectIdeasController {
    async getProjectIdeas(req, res) {
        try {
            // Business logic to retrieve example data
            const exampleData = {}; // Replace with actual data retrieval logic
            res.status(200).json(exampleData);
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while retrieving project ideas.' });
        }
    }

    async createProjectIdea(req, res) {
        try {
            const { cloudProvider, experienceLevel, serviceList, provider } = req.body;
            if (!cloudProvider || !experienceLevel || !Array.isArray(serviceList)) {
                return res.status(400).json({ message: 'cloudProvider, experienceLevel, and serviceList (array) are required.' });
            }

            const prompt = `You are an AI assistant that suggests hands-on cloud project ideas.\nThe user wants a project for ${cloudProvider} cloud.\nTheir experience level is ${experienceLevel}.\nThey are interested in the following services: ${serviceList.join(', ')}.\n\nPlease provide 3 project ideas. Each idea should be an object in a JSON array.\nEach project idea object MUST include the following fields:\n1.  \`title\`: (String) A concise project title.\n2.  \`description\`: (String) A brief description (2-3 sentences).\n3.  \`keyServicesToFocusOn\`: (Array of Strings) Key services from the user's selected list that are central to this project.\n4.  \`difficultyRatingStars\`: (Integer) A difficulty rating from 1 to 5 stars (1=very easy, 5=very complex) relative to the user's experience level.\n5.  \`estimatedTimeToComplete\`: (String) A rough estimate of the time to complete the project (e.g., "4-6 hours", "2-3 days").\n6.  \`whyThisProject\`: (String) A brief explanation (2-3 sentences) of why this project is beneficial for the user's learning, highlighting what they will learn in relation to the selected services and experience level.\n7.  \`highLevelSteps\`: (Array of Strings) A few high-level steps or a basic outline to get started. If the experience level is 'Beginner', provide slightly more guidance here.\n8.  \`costInsights\`: (Object) An object with:\n    * \`generalConsiderations\`: (String) Very rough, general cost considerations or notes on relevant free tiers. ALWAYS include a disclaimer that these are estimates and official pricing should be checked.\n    * \`officialPricingLinks\`: (Array of Objects) Each object should have a \`serviceName\` (String) and a \`link\` (String) to the official pricing page for a key service involved.\n9.  \`alternativeServiceSuggestions\`: (Array of Objects) Suggestions for 1-2 alternative or complementary services. Each object should have:\n    * \`serviceName\`: (String) The name of the alternative/complementary service.\n    * \`reason\`: (String) A brief reason why it's a good alternative or complement.\n10. \`stretchGoals\`: (Array of Strings) 1-2 optional "stretch goal" ideas or advanced features the user could add to challenge themselves further.\n\nFormat the entire response STRICTLY as a single JSON array of these project idea objects.\n\nExample project object structure:\n{\n  "title": "Serverless Image Thumbnail Generator",\n  "description": "Create a serverless function that automatically generates thumbnails for images uploaded to a cloud storage bucket.",\n  "keyServicesToFocusOn": ["AWS S3", "AWS Lambda"],\n  "difficultyRatingStars": 2,\n  "estimatedTimeToComplete": "6-8 hours",\n  "whyThisProject": "Excellent for understanding event-driven architecture and serverless compute with S3 events triggering Lambda. Great for beginners to grasp core cloud concepts.",\n  "highLevelSteps": [\n    "Set up an S3 bucket for original images and another for thumbnails.",\n    "Develop a Lambda function (e.g., in Python with Pillow library) to resize images.",\n    "Configure an S3 PUT event trigger on the original images bucket to invoke the Lambda function.",\n    "Test by uploading an image and verifying thumbnail creation."\n  ],\n  "costInsights": {\n    "generalConsiderations": "AWS Lambda and S3 have generous free tiers. This project can often be completed within free limits if usage is low. Always monitor your usage. This is an estimate, check official pricing.",\n    "officialPricingLinks": [\n      { "serviceName": "AWS S3", "link": "https://aws.amazon.com/s3/pricing/\" },\n      { \"serviceName\": \"AWS Lambda\", \"link\": \"https://aws.amazon.com/lambda/pricing/\" }\n    ]\n  },\n  "alternativeServiceSuggestions": [\n    { "serviceName": "Azure Blob Storage & Azure Functions", "reason": "Direct equivalents in Azure for a similar serverless architecture." },\n    { "serviceName": "Cloudinary (3rd party)", "reason": "A specialized media management service that handles transformations, could be integrated or used as an alternative for more complex needs." }\n  ],\n  "stretchGoals": [\n    "Add error handling and notifications (e.g., using SNS).",\n    "Store metadata about the images and thumbnails in a NoSQL database (e.g., DynamoDB)."\n  ]\n}`;

            let ideas;
            if (provider && provider.toLowerCase() === 'gemini') {
                // Gemini API implementation
                console.log("Gemini: ", process.env.GEMINI_API_KEY);
                const geminiApiKey = process.env.GEMINI_API_KEY;
                if (!geminiApiKey) {
                    return res.status(500).json({ message: 'Gemini API key not configured.' });
                }
                const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + geminiApiKey, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });
                const geminiData = await geminiResponse.json();
                if (!geminiResponse.ok) {
                    return res.status(500).json({ message: geminiData.error?.message || 'Failed to get response from Gemini.' });
                }
                try {
                    // Gemini's response format
                    const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
                    // Remove markdown code block if present and parse JSON
                    let cleaned = content;
                    if (cleaned.startsWith('```json')) {
                        cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
                    } else if (cleaned.startsWith('```')) {
                        cleaned = cleaned.replace(/^```\w*\s*/, '').replace(/```\s*$/, '');
                    }
                    try {
                        ideas = JSON.parse(cleaned);
                    } catch (e) {
                        return res.status(200).json({ raw: cleaned, message: 'Gemini response is not valid JSON. Here is the raw response for debugging.' });
                    }
                } catch (e) {
                    return res.status(500).json({ message: 'Failed to extract Gemini response.' });
                }
            } else {
                // OpenAI implementation (default)
                const openaiApiKey = process.env.API_KEY;
                if (!openaiApiKey) {
                    return res.status(500).json({ message: 'OpenAI API key not configured.' });
                }
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openaiApiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            { role: 'system', content: 'You are an AI assistant that suggests hands-on cloud project ideas.' },
                            { role: 'user', content: prompt }
                        ],
                        max_tokens: 800,
                        temperature: 0.7
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    return res.status(500).json({ message: data.error?.message || 'Failed to get response from OpenAI.' });
                }
                try {
                    const content = data.choices?.[0]?.message?.content;
                    ideas = JSON.parse(content);
                } catch (e) {
                    return res.status(500).json({ message: 'Failed to parse OpenAI response as JSON.' });
                }
            }
            res.status(201).json(ideas);
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while creating project ideas.' });
        }
    }
}

export default new ProjectIdeasController();
