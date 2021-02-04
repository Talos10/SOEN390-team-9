import React from 'react';
import Main from './components/Main'
import styles from './css/App.module.css'

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
