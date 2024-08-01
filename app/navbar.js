import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Nav() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ height: '100px' }}>
        <Toolbar>
          <Typography variant="h3" component="h1" sx={{ flexGrow: 1 }} textAlign={'center'} >
            Cindy's Pantry
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}