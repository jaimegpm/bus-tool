import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BusConfigPage from './pages/BusConfigPage';
import './App.css';

function App() {
  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/raid/:raidId" element={<BusConfigPage />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
}

export default App;
