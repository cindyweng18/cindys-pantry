import * as React from 'react';
// import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {firebase, firestore} from "../firebase";
import { getDocs, collection, getFirestore, query, onSnapshot} from 'firebase/firestore';

const items = ['tomato', 'potato', 'onions', 'garlic']
let itemsArr = [];
export default function Home() {

  const q = query(collection(firestore, 'pantry'))
  const u = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      itemsArr.push({...doc.data(), id: doc.id});
    })
  })

  return(
    <Box 
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    alignItems={'center'}>
      <Box width="800px" height="100px" display={'flex'} justifyContent={'center'} alignItems={'center'}> Cindy's Pantry </Box>
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
        {items.map((i) => (
          <Box
            key={i}
            width="100%"
            height="100px"
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
          >
            {i}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}