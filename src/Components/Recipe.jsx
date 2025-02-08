import React from 'react';

const Recipe = ({ recipe, loading, error }) => {
    if (loading) {
        return (
            <div className="recipe-loading">
                <h2>Chef GPT is cooking up something special...</h2>
                <div className="cooking-animation">
                    <div className="pan"></div>
                    <div className="pancake"></div>
                    <div className="steam">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recipe-error">
                <h2>Oops!</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="recipe-empty">
                <h2>Chef Claude Recommends:</h2>
                <p>Add some ingredients and I'll create a delicious recipe for you!</p>
            </div>
        );
    }

    return (
        <div className="recipe-container">
            <div dangerouslySetInnerHTML={{ __html: recipe }} />
        </div>
    );
}

export default Recipe;