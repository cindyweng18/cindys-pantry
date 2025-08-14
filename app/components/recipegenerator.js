'use client';
import { useState } from 'react';
import {Box, Button, Card,CardActionArea,CardContent,CardMedia,CircularProgress,Dialog,DialogTitle,DialogContent,DialogActions,Grid,List,ListItem,ListItemText,Stack,Typography,Link as MUILink,Chip,Alert} from '@mui/material';

export default function RecipeGenerator({ pantryItems }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [matchInfo, setMatchInfo] = useState({ used: [], missed: [] });
  const apiKey = process.env.NEXT_PUBLIC_RECIPE_API_KEY;

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const ingredients = pantryItems.map((i) => i.name).join(',');
      const res = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
          ingredients
        )}&number=9&ranking=2&ignorePantry=true&apiKey=${apiKey}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch recipes');
      setRecipes(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRecipe = async (recipeLite) => {
    setModalOpen(true);
    setDetailsLoading(true);
    setDetailsError(null);
    setMatchInfo({
      used: recipeLite.usedIngredients || [],
      missed: recipeLite.missedIngredients || [],
    });

    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${recipeLite.id}/information?includeNutrition=false&apiKey=${apiKey}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch recipe details');
      setSelectedRecipe(data);
    } catch (err) {
      setDetailsError(err.message || 'Failed to load details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRecipe(null);
    setDetailsError(null);
    setMatchInfo({ used: [], missed: [] });
  };

  const summaryText = (html) => (html ? html.replace(/<[^>]+>/g, '') : '');

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} mb={2}>
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          Generate recipes using your current pantry items.
        </Typography>
        <Button
          variant="contained"
          onClick={fetchRecipes}
          disabled={loading || pantryItems.length === 0}
        >
          {loading ? 'Searching…' : 'Generate Recipes'}
        </Button>
      </Stack>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card variant="outlined">
              <CardActionArea onClick={() => handleOpenRecipe(recipe)}>
                <CardMedia component="img" image={recipe.image} alt={recipe.title} sx={{ height: 160 }} />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Used: {recipe.usedIngredientCount} • Missing: {recipe.missedIngredientCount}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>{selectedRecipe?.title || 'Recipe Details'}</DialogTitle>
        <DialogContent dividers>
          {detailsLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : detailsError ? (
            <Typography color="error">{detailsError}</Typography>
          ) : selectedRecipe ? (
            <Box>
              <Box display="flex" gap={2} flexDirection={{ xs: 'column', md: 'row' }} mb={2}>
                <CardMedia
                  component="img"
                  image={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  sx={{ width: { xs: '100%', md: 320 }, borderRadius: 1 }}
                />
                <Stack spacing={1} flex={1}>
                  <Typography variant="body1">Servings: {selectedRecipe.servings}</Typography>
                  <Typography variant="body1">Ready in: {selectedRecipe.readyInMinutes} minutes</Typography>
                  {selectedRecipe.sourceUrl && (
                    <Typography variant="body2">
                      Source:{' '}
                      <MUILink href={selectedRecipe.sourceUrl} target="_blank" rel="noopener">
                        {selectedRecipe.sourceName || 'View original'}
                      </MUILink>
                    </Typography>
                  )}
                  {selectedRecipe.summary && (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {summaryText(selectedRecipe.summary)}
                    </Typography>
                  )}
                </Stack>
              </Box>

              {/* Pantry match summary */}
              <Box mb={2}>
                <Typography variant="h6" gutterBottom>
                  Pantry Match
                </Typography>
                {matchInfo.missed.length ? (
                  <Alert severity="warning" sx={{ mb: 1 }}>
                    You're missing {matchInfo.missed.length} ingredient{matchInfo.missed.length > 1 ? 's' : ''}.
                  </Alert>
                ) : (
                  <Alert severity="success" sx={{ mb: 1 }}>
                    You have everything needed for this recipe!
                  </Alert>
                )}
                {!!matchInfo.used.length && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {matchInfo.used.map((ing) => (
                      <Chip key={`used-${ing.id || ing.name}`} label={ing.name || ing.originalName || ing.original} color="success" variant="outlined" size="small" />
                    ))}
                  </Stack>
                )}
                {!!matchInfo.missed.length && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mt={1}>
                    {matchInfo.missed.map((ing) => (
                      <Chip key={`missed-${ing.id || ing.name}`} label={ing.name || ing.originalName || ing.original} color="warning" variant="filled" size="small" />
                    ))}
                  </Stack>
                )}
              </Box>

              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <List dense>
                {(selectedRecipe.extendedIngredients || []).map((ing) => (
                  <ListItem key={ing.id} disableGutters>
                    <ListItemText primary={`• ${ing.original}`} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom mt={2}>
                Instructions
              </Typography>
              {selectedRecipe.analyzedInstructions?.length ? (
                <List dense>
                  {selectedRecipe.analyzedInstructions[0].steps.map((s) => (
                    <ListItem key={s.number} disableGutters>
                      <ListItemText primary={`${s.number}. ${s.step}`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {selectedRecipe.instructions ? summaryText(selectedRecipe.instructions) : 'No steps provided.'}
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2">Select a recipe to view details.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}