import Router from './router/Router';

export default function App() {
  console.log(process.env.REACT_APP_API);
  return (
    <div className="App">
      <Router></Router>
    </div>
  );
}
