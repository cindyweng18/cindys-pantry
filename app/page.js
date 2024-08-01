'use client'
import { useState, useEffect } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {firestore} from "../firebase";
import { doc, setDoc, getDoc, getDocs, collection, getFirestore, query, onSnapshot, deleteDoc} from 'firebase/firestore';
import { Button, Divider, IconButton, InputBase, Modal, Paper, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Nav from './navbar';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [show, handleShow] = useState(false)
  const [itemName, setItemName] = useState('')
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [itemFound, setItem] = useState(items)

  const getItems = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setItems(inventoryList)
  }

  useEffect(() => {
    getItems()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { name: item, quantity: 1 })
    }
    await getItems()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await getItems()
  }

  const searchItem = (item) => {
    const found = items.filter((i) => 
      i.name.toLowerCase().includes(item.toLowerCase()))
    setItems(found)
  }
  
  return (
    <>
    <Nav> </Nav>
    <Box
      width="100vw"
      height="90vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack
        spacing={2} direction="row"
      >
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
            searchItem(itemName)
            setItemName('')
          }}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </Stack>
      <Box>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#FFC7ED'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius={4}
        >
          <Typography variant={'h4'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>

        <Stack width="800px" height="800px" spacing={2} overflow={'auto'}>
          {items.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="80px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#FFF8DB'}
              paddingX={5}
              borderRadius={4}
            >
              <Typography variant={'h5'} color={'#173B45'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h5'} color={'#173B45'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
    </>
  )
}