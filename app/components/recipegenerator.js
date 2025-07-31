'use client';
import { useState } from 'react';

export default function RecipeGenerator({ pantryItems }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const ingredients = pantryItems.map(i => i.name).join(',');
      const res = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&ranking=2&ignorePantry=true&apiKey=${process.env.NEXT_PUBLIC_RECIPE_API_KEY}`);
      const data = await res.json();

      if (!res.ok) throw new Error('Failed to fetch recipes');
      setRecipes(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 py-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🍽️ Recipes You Can Make</h2>
      <button
        onClick={fetchRecipes}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Generate Recipes
      </button>

      {loading && <p className="text-blue-500">Loading recipes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <img src={recipe.image} alt={recipe.title} className="w-full rounded mb-2" />
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{recipe.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Used Ingredients: {recipe.usedIngredientCount}, Missing: {recipe.missedIngredientCount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}