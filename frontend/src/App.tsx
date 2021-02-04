import React from 'react';
import Signup from './components/Signup'
import Welcome from './components/Welcome'
import Background from './assets/background/geometric.jpg'
import styles from './css/App.module.css'
import Button from 'react-bootstrap/Button'
import Container from './components/partials/container/Container';

function App() {
  return (
    <div className="App">
      <div className={styles.html}>
        <Welcome></Welcome>
      </div>
    </div>
  );
}

export default App;
