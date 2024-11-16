'use client'
import { SignIn } from '@clerk/nextjs'
import { Grid } from '@mui/material'


export default function Page() {
  return (
    <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justifyContent="center"
    sx={{ minHeight: '100vh' }}
  >
      <SignIn />
    </Grid>
        

    
  )
}