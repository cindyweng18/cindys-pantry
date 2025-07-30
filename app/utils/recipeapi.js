export async function fetchRecipesFromPantry(ingredients = []) {
  const apiKey = process.env.NEXT_PUBLIC_RECIPE_API_KEY;

  const response = await fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&number=6&apiKey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recipes.");
  }

  return await response.json();
}
