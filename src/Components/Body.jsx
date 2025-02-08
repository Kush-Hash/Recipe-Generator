import React from 'react'
import Recipe from "./Recipe.jsx"
import Ingredients from './Ingredients.jsx';
import { generateRecipe } from '../services/recipeService';

const Body = () => {
    const [ingredients, setIngredients] = React.useState([]);
    const [showRecipe, setShowRecipe] = React.useState(false);
    const [recipeData, setRecipeData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    function handleForm(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newIngredient = formData.get("ingredient").trim();
        if (newIngredient) {
            setIngredients((prev) => [...prev, newIngredient]);
        }
        e.currentTarget.reset();
    }

    async function handleRecipe() {
        if (ingredients.length === 0) {
            setError('Please add some ingredients first');
            return;
        }

        setLoading(true);
        setShowRecipe(true);
        setError(null);

        try {
            console.log('Sending ingredients:', ingredients); // Debug log

            const recipe = await generateRecipe(ingredients);
            console.log('Recipe generated:', recipe); // Debug log

            setRecipeData(recipe);
        } catch (err) {
            console.error('Recipe generation error:', err);
            setError(err.message || 'Failed to generate recipe. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className='input-section'>
                <form onSubmit={handleForm}>
                    <input
                        className='add-ingredient-form'
                        type="text"
                        placeholder='e.g. oregano'
                        aria-label="Add ingredient"
                        name="ingredient"
                        required
                    />
                    <button type="submit">+ Add ingredient</button>
                </form>
            </section>

            {ingredients.length > 0 && (
                <Ingredients
                    handleButton={handleRecipe}
                    list={ingredients.map(ingredient => (
                        <li key={ingredient}>{ingredient}</li>
                    ))}
                />
            )}

            {showRecipe && (
                <section className='recipe-section'>
                    <Recipe
                        recipe={recipeData}
                        loading={loading}
                        error={error}
                    />
                </section>
            )}
        </>
    )
}

export default Body