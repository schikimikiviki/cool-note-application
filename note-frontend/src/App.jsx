import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import SettingsPage from './components/Settings/SettingsPage';
import AdminPage from './components/AdminPage/AdminPage';
import DefaultHome from './components/DefaultHome/DefaultHome';
import LegalPage from './components/LegalPage/LegalPage';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<DefaultHome />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/legal' element={<LegalPage />} />
      </Routes>
    </div>
  );
}

export default App;
