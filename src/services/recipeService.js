const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export async function generateRecipe(ingredients) {
    try {
        const response = await fetch(`${BACKEND_URL}/generate-recipe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.details || 'Failed to generate recipe');
        }

        const data = await response.json();
        return data.recipe;
    } catch (error) {
        console.error('Error generating recipe:', error);
        throw error;
    }
}