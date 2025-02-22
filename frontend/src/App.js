import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Home from './pages/Home';
import CreateProduct from "./pages/createProduct";
import MyProducts from './pages/myProduct';
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />  {/* Include NavBar here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/myProduct" element={<MyProducts />} />
        <Route path="/createProduct" element={<CreateProduct />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
