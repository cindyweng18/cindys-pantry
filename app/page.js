'use client';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { Box, Button, Card, Divider, IconButton, InputBase, Paper, Stack, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InventoryItem from './components/inventoryitem';
import AddItemModal from './components/additemmodal';
import { getItems, addItem, removeItem } from './utils/firebaseutils';
import Hero from './components/hero';
import NavBar from './components/navbar';
import Footer from './components/footer';

export default function Home() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  useEffect(() => {
    const fetchItems = async () => {
      const inventoryList = await getItems();
      setItems(inventoryList);
    };
    fetchItems();
  }, []);

  const searchItem = (item) => {
    const found = items.filter((i) => i.name.toLowerCase().includes(item.toLowerCase()));
    setItems(found);
  };
  
  return (
    <>
    <NavBar />
    <Hero />
      <Box width="100vw" height="70vh" display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'} gap={2}>
        <AddItemModal open={open} handleClose={handleClose} itemName={itemName} setItemName={setItemName} addItem={addItem} />
        <Stack spacing={30} direction="row">
          <Button variant="contained" onClick={handleOpen}>
            Add New Item/Update Item
          </Button>
          <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Item"
              inputProps={{ 'aria-label': 'search item' }}
              onChange={(e) => setItemName(e.target.value)}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => { searchItem(itemName); setItemName(''); }}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </Stack>
        <Box>
          <Box component={Card}
            variant="outlined" width="800px" height="100px" display={'flex'} justifyContent={'center'} alignItems={'center'} borderRadius={4}>
            <Typography variant={'h4'} textAlign={'center'} sx={{
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              }}>
              Inventory Items
            </Typography>
          </Box>
          <Stack width="800px" height="500px" spacing={2} overflow={'auto'}>
            {items.map(({ name, quantity }) => (
              <InventoryItem key={name} name={name} quantity={quantity} removeItem={removeItem} />
            ))}
          </Stack>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
