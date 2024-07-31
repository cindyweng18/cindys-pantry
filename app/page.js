'use client'
import { useState, useEffect } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {firestore} from "../firebase";
import { doc, setDoc, getDoc, getDocs, collection, getFirestore, query, onSnapshot, deleteDoc} from 'firebase/firestore';
import { Button, Divider, Modal, TextField, Typography } from '@mui/material';
import Nav from './navbar';
import Search from './search';

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
  const [itemName, setItemName] = useState('')
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
        <Search> </Search>
      </Stack>
      <Box>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius={2}
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
              bgcolor={'#F8EDED'}
              paddingX={5}
              borderRadius={2}
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