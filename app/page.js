'use client'

import { useState, useEffect } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {firebase, firestore} from "../firebase";
import { getDocs, collection, getFirestore, query, onSnapshot} from 'firebase/firestore';

let itemsArr = [];
export default function Home() {
  const [items, setItems] = useState([])

  const getItems = async () => {
    const q = query(collection(firestore, 'pantry'))
    const u = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      itemsArr.push({...doc.data(), id: doc.id});
    })
      setItems(itemsArr)
    })
  }

  useEffect(() => {
    console.log(items)
    getItems()
  }, [])
  

  return(
    <Box 
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}>
      <Box width="800px" height="100px" bgcolor={"#E5CCFF"} display={'flex'} justifyContent={'center'} alignItems={'center'}> Cindy's Pantry </Box>
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
        {items.map(item => (
          <Box
            key={item.name}
            width="100%"
            height="100px"
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
          >
            {item.name}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}