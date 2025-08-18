'use client';
import { useState, useEffect } from 'react';
import * as React from 'react';
import {Box, Button, Card, CircularProgress, Typography, Stack, Paper, IconButton, InputBase, Alert, Collapse} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InventoryItem from './components/inventoryitem';
import AddItemModal from './components/additemmodal';
import { addItem, removeItem, listenToItems } from './utils/firebaseutils';
import Hero from './components/hero';
import NavBar from './components/navbar';
import Footer from './components/footer';
import RecipeGenerator from './components/recipegenerator';

export default function Home() {
  const [items, setItems] = useState([]);           
  const [filteredItems, setFilteredItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');   
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResultsTerm, setNoResultsTerm] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    let isMounted = true;
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        setError('Request timed out. Please try again later.');
        setLoading(false);
      }
    }, 8000);

    const unsubscribe = listenToItems((list) => {
      if (!isMounted) return;
      setItems(list);
      if (!searchTerm) setFilteredItems(list);
      setLoading(false);
      setError(null);
      clearTimeout(timeout);
    });

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe && unsubscribe();
    };
  }, []);

  const searchItem = (term) => {
    const raw = term || '';
    const t = raw.trim().toLowerCase();
    const results = items.filter((i) => i.name.toLowerCase().includes(t));
    setFilteredItems(results);
    if (raw && results.length === 0) {
      setNoResultsTerm(raw);
    } else {
      setNoResultsTerm('');
    }
  };

  const handleAddItem = async (name) => {
    try {
      setAddLoading(true);
      await addItem(name);
      setNewItemName('');
      setSearchTerm('');  
      setNoResultsTerm('');
      handleClose();
    } catch (err) {
      console.error('Failed to add item:', err);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Hero />
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} p={4} gap={4}>
        <Box flex={1}>
          <AddItemModal
            open={open}
            handleClose={handleClose}
            itemName={newItemName}
            setItemName={setNewItemName}
            addItem={handleAddItem}
            loading={addLoading} />
          <Stack spacing={2} direction="row">
            <Button variant="contained"
              onClick={() => {
                setNoResultsTerm('');
                setNewItemName('');
                handleOpen();
              }}>
              Add New Item/Update Item
            </Button>
            <Paper
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                searchItem(searchTerm);
              }}
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Item"
                inputProps={{ 'aria-label': 'search item' }}
                value={searchTerm}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearchTerm(v);
                  if (!v) {
                    setFilteredItems(items);
                    setNoResultsTerm('');
                  }
                }}
              />
              <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Stack>
          <Collapse in={!!noResultsTerm}>
            <Alert
              severity="info"
              sx={{ mt: 2 }}
              action={
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      setNewItemName(noResultsTerm); 
                      handleOpen();
                    }}
                  >
                    Add "{noResultsTerm}"
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setNoResultsTerm('');
                      setSearchTerm('');
                      setFilteredItems(items);
                    }}
                  >
                    Clear
                  </Button>
                </Stack>
              }
            >
              No matches for "{noResultsTerm}" in your pantry. Do you want to add it?
            </Alert>
          </Collapse>

          <Box mt={4}>
            <Card
              variant="outlined"
              sx={{
                width: '100%',
                height: 60,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                }}
              >
                Inventory Items
              </Typography>
            </Card>

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            ) : (
              <Stack spacing={2} mt={2} height="400px" overflow="auto">
                {filteredItems.map(({ name, quantity }) => (
                  <InventoryItem
                    key={name}
                    name={name}
                    quantity={quantity}
                    removeItem={removeItem}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Box>
        <Box flex={1}>
          <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" mb={2}>
              🍽️ Recipes You Can Make
            </Typography>
            <RecipeGenerator pantryItems={items} />
          </Card>
        </Box>
      </Box>
      <Footer />
    </>
  );
}