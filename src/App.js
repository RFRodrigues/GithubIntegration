import React from 'react';
import './App.css';
import TableRepo from './components/TableRepo';
import TableUsers from './components/TableUsers';

function App() {
  return (
    <div className="App">
      <div className="container">
        <TableRepo />
        <TableUsers />
      </div>
    </div>
  );
}

export default App;
