import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import SettingsPage from './components/Settings/SettingsPage';
import { FontSizeProvider, useFontSize } from './context/FontSizeContext';

function App() {
  return (
    <div className='App'>
      <FontSizeProvider>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/settings' element={<SettingsPage />} />
        </Routes>
      </FontSizeProvider>
    </div>
  );
}

export default App;
