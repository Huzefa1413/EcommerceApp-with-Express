import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import ViewProducts from './components/ViewProducts.js';
import AddProducts from './components/AddProducts.js';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<><Navbar /><ViewProducts /></>} />
          <Route path="/addproduct" element={<><Navbar /><AddProducts /></>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
