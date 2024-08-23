import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import LoginPage from './components/LoginPage/LoginPage';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </div>
  );
}

//hello

export default App;

// this is a test
