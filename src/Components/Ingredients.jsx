import React from 'react'

const Ingredients = ({ list, handleButton }) => {
    return (
        <div>
            <section className='ingredientList-section'>
                <h2>Ingredients on hand:</h2>
                <ul className="ingredients-list" aria-live="polite">{list}</ul>
                {list.length > 3 && (
                    <div className="get-recipe-container">
                        <div className="get-recipe-container-inside">
                            <div>
                                <h3>Ready for a recipe?</h3>
                                <p>Generate a recipe from your list of ingredients.</p>
                            </div>
                            <button onClick={handleButton}>Get a recipe</button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}

export default Ingredients;