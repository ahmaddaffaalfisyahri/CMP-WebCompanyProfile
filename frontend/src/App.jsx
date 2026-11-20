import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CMPPublicSite from './components/cmp/CMPPublicSite';
import Admin from './pages/Admin';
export default function App() {
  return <BrowserRouter><Routes><Route path="/" element={<CMPPublicSite />} /><Route path="/admin" element={<Admin />} /><Route path="/login" element={<Admin />} /></Routes></BrowserRouter>;
}
