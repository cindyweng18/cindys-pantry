import React from 'react';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';

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
};

const AddItemModal = ({ open, handleClose, itemName, setItemName, addItem }) => (
  <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Add Item
      </Typography>
      <Stack width="105%" direction={'row'} spacing={2}>
        <TextField
          id="outlined-basic"
          label="Item"
          variant="outlined"
          fullWidth
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <Button variant="outlined" onClick={() => { addItem(itemName); setItemName(''); handleClose(); }}>
          Add
        </Button>
      </Stack>
    </Box>
  </Modal>
);

export default AddItemModal;