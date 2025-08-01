'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';

export default function RecipeGenerator({ pantryItems }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const ingredients = pantryItems.map(i => i.name).join(',');
      const res = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&ranking=2&ignorePantry=true&apiKey=${process.env.NEXT_PUBLIC_RECIPE_API_KEY}`
      );
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
    <Box px={2} py={4} maxWidth="lg" mx="auto">
      <Box
        component={Card}
        variant="outlined"
        width="100%"
        height="60px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius={2}
      >
        <Typography
          variant="h5"
          sx={{
            color: (theme) =>
              theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
          }}
        >
          Recipes You Can Make
        </Typography>
      </Box>
      <Button variant="contained" onClick={fetchRecipes} sx={{ mb: 3 }}>
        Generate Recipes
      </Button>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" textAlign="center" mt={2}>
          {error}
        </Typography>
      )}

      <Grid container spacing={2}>
        {recipes.map(recipe => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card>
              <CardMedia
                component="img"
                image={recipe.image}
                alt={recipe.title}
                sx={{ height: 140 }}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {recipe.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Used Ingredients: {recipe.usedIngredientCount}, Missing: {recipe.missedIngredientCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}