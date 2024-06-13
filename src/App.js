import React from 'react';
import BarcodeReader from './BarcodeReader';
import { Container, CssBaseline } from '@mui/material';


const App = () => {
  return (
    <div>
      <CssBaseline />
      <Container maxWidth="sm" style={{ paddingTop: '40px' }}>
        <BarcodeReader />
      </Container>
    </div>
  );
};

export default App;