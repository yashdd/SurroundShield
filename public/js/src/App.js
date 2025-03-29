// src/App.js
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrationPage from './components/Registration.js'; // Import the Registration component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RegistrationPage /> {/* Render the Registration component */}
      </header>
    </div>
  );
}

export default App;
