//import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from "./componets/NavigationBar";
import Dashboard from "./componets/Dashboard";
import SalesByCountry from "./componets/SalesByCountry";
import SalesByProduct from "./componets/SalesByProduct";
import MonthlySales from "./componets/MonthlySales";
import PredictionForm from './componets/PredictionForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/country-sales" element={<SalesByCountry />} />
            <Route path="/product-sales" element={<SalesByProduct />} />
            <Route path="/monthly-sales" element={<MonthlySales />} />
            <Route path="/PredictionForm" element={<PredictionForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;