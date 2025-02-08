import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";
const HF_API_KEY = process.env.HF_API_KEY;

// Updated CORS configuration for Render deployment
app.use(cors({
    origin: [
        'http://localhost:5173',  // Local development
        'https://recipe-generator-2-gjky.onrender.com', // Add your Render frontend URL here
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// Validate API key on startup
if (!HF_API_KEY) {
    console.error("ERROR: Hugging Face API key is not set in .env file");
    process.exit(1);
}

const generatePrompt = (ingredients) => {
    return `Create a detailed recipe using these ingredients: ${ingredients.join(", ")}.Add your own exra ingredients. Make the instructions detailed (15-20 lines). Make Indian style dishes.
    Format the response in HTML.
    
    Response should follow this structure:
    <article class="recipe">
        <h1>[Recipe Title]</h1>
        <div class="recipe-meta">
            <p>Cooking Time: [time]</p>
            <p>Servings: [number]</p>
        </div>
        <section class="ingredients">
            <h2>Ingredients</h2>
            <ul>[list of ingredients]</ul>
        </section>
        <section class="instructions">
            <h2>Instructions</h2>
            <ol>[numbered steps]</ol>
        </section>
        <section class="tips">
            <h2>Tips</h2>
            <ul>[cooking tips]</ul>
        </section>
    </article>`;
};

app.post("/generate-recipe", async (req, res) => {
    try {
        const { ingredients } = req.body;
        console.log("Received ingredients:", ingredients);

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            console.log("Invalid ingredients format received");
            return res.status(400).json({
                error: "Invalid ingredients format",
                details: "Ingredients must be a non-empty array"
            });
        }

        console.log("Making request to Hugging Face API...");

        const response = await axios.post(HF_API_URL, {
            inputs: generatePrompt(ingredients),
            parameters: {
                max_new_tokens: 1000,
                temperature: 0.7,
                top_p: 0.9,
                do_sample: true,
                return_full_text: false,
            }
        }, {
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        console.log("API Response status:", response.status);

        if (response.status !== 200) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = response.data;
        console.log("API Response data:", data);

        if (!data || !data[0]?.generated_text) {
            throw new Error("Invalid response format from API");
        }

        let recipeHtml = data[0].generated_text
            .replace(/```html/g, "")
            .replace(/```/g, "")
            .trim();

        console.log("Processed recipe HTML:", recipeHtml);

        res.json({ recipe: recipeHtml });

    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            error: "Failed to generate recipe",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
});

// Test API key endpoint
app.get("/test-api-key", (req, res) => {
    if (HF_API_KEY) {
        res.json({ status: "API key is configured" });
    } else {
        res.status(500).json({ error: "API key is not configured" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API key ${HF_API_KEY ? 'is' : 'is NOT'} configured`);
});