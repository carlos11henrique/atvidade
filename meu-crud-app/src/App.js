import React from 'react';
import HomePage from './pages/HomePage';
import './App.css'; // Certifique-se de que o caminho está correto
import { Container } from '@mui/material';

function App() {
  return (
    <Container maxWidth="md">
      <HomePage />
    </Container>
  );
}

export default App;
