'use client';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { Box, Button, Card, IconButton, InputBase, Paper, Stack, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InventoryItem from './components/inventoryitem';
import AddItemModal from './components/additemmodal';
import { getItems, addItem, removeItem } from './utils/firebaseutils';
import Hero from './components/hero';
import NavBar from './components/navbar';
import Footer from './components/footer';
import CircularProgress from '@mui/material/CircularProgress';
import RecipeGenerator from './components/recipegenerator';

export default function Home() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    let isMounted = true;
    const timeout = setTimeout(() => {
      if (isMounted) {
        setError("Request timed out. Please try again later.");
        setLoading(false);
      }
    }, 8000);

    const fetchItems = async () => {
      try {
        const inventoryList = await getItems();
        if (isMounted) {
          setItems(inventoryList);
          setLoading(false);
          clearTimeout(timeout);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching items:", err);
          setError("Failed to load pantry items.");
          setLoading(false);
          clearTimeout(timeout);
        }
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const searchItem = (item) => {
    const found = items.filter((i) => i.name.toLowerCase().includes(item.toLowerCase()));
    setItems(found);
  };

  const handleAddItem = async (name) => {
    try {
      setAddLoading(true);
      await addItem(name);
      const updatedItems = await getItems();
      setItems(updatedItems);
      setItemName('');
      handleClose();
    } catch (err) {
      console.error("Failed to add item:", err);
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
                Inventory Items
              </Typography>
            </Box>
          <AddItemModal
            open={open}
            handleClose={handleClose}
            itemName={itemName}
            setItemName={setItemName}
            addItem={handleAddItem}
            loading={addLoading}
          />
          <Stack spacing={2} direction="row">
            <Button variant="contained" onClick={handleOpen}>
              Add New Item/Update Item
            </Button>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Item"
                inputProps={{ 'aria-label': 'search item' }}
                onChange={(e) => setItemName(e.target.value)}
              />
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                aria-label="search"
                onClick={() => {
                  searchItem(itemName);
                  setItemName('');
                }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Stack>
          <Box mt={4}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" textAlign="center">{error}</Typography>
            ) : (
              <Stack spacing={2} mt={2} height="400px" overflow="auto">
                {items.map(({ name, quantity }) => (
                  <InventoryItem key={name} name={name} quantity={quantity} removeItem={removeItem} />
                ))}
              </Stack>
            )}
          </Box>
        </Box>

        <Box flex={1}>
          <RecipeGenerator pantryItems={items} />
        </Box>
      </Box>
      <Footer />
    </>
  );
}
