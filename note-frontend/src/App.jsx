import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import SettingsPage from './components/Settings/SettingsPage';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/settings' element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
