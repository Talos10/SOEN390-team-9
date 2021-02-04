import React from 'react';
import Main from './components/Main'

import styles from './css/App.module.css'
import Button from 'react-bootstrap/Button'
import Container from './components/partials/container/Container';

function App() {
  return (
    <div className="App">
      <div className={styles.html}>
        <Main></Main>
      </div>
    </div>
  );
}

export default App;
