import React from 'react';
import { Box, Button, Card, Divider, Typography } from '@mui/material';

const InventoryItem = ({ name, quantity, removeItem }) => (
    <>
  <Box
    key={name}
    width="100%"
    minHeight="80px"
    display={'flex'}
    justifyContent={'space-between'}
    alignItems={'center'}
    // bgcolor={'#FFF8DB'}
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
  <Divider />
  </>
);

export default InventoryItem;