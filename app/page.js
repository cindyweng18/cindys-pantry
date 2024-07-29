import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

const items = ['tomato', 'potato', 'onions', 'garlic']

export default function Home() {
  return(
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2} overflow={'auto'}>
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