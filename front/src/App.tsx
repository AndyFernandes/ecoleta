import React, {useState} from 'react';
import './App.css';

// import Header from './Header';
// import Home from './pages/Home';
import Router from './routes';

function App() {
  // const [counter, setCounter] = useState(0);

  // function handleButtonClick(){
  //   setCounter(counter+1);
  // }
  
  return (
    <div>
      <Router />
      {/* <Header title='Ecoleta' /> */}
      
      {/* <h1>{counter}</h1>
      <button type='button' onClick={handleButtonClick}>Aumentar</button> */}
    </div>
  );
}

export default App;
