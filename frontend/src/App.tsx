import React from 'react';
import Router from './Router'
import styles from './App.module.css'

export default function App() {
  return (
    <div className="App">
      <div className={styles.html}>
        <Router></Router>
      </div>
    </div>
  );
}
