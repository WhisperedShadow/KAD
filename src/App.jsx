import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './pages/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard'; 
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import CompanyCode from './pages/CompanyCode'; 
import BookingCode from './pages/BookingCode';
import PolicyTypes from './pages/PolicyTypes'; 
import ProductTypes from './pages/ProductTypes';
import VehicleTypes from './pages/VehicleTypes'; 
import AddPolicy from './pages/AddPolicy';
import ListPolicy from './pages/ListPolicy';
import CheckPolicy from './pages/CheckPolicy';
import GenerateReport from './pages/GenerateReport';

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/central/companycode" element={<CompanyCode />} /> 
                        <Route path="/central/bookingcode" element={<BookingCode />} />
                        <Route path="/central/policytypes" element={<PolicyTypes />} />
                        <Route path="/central/producttypes" element={<ProductTypes />} /> 
                        <Route path="/central/vehicletypes" element={<VehicleTypes />} />
                        <Route path="/policy/add" element={<AddPolicy />} />
			            <Route path="/policy/add/:policyNumber" element={<AddPolicy />} />
                        <Route path="/policy/list" element={<ListPolicy />} />
                        <Route path="/policy/check" element={<CheckPolicy />} />
                        <Route path="/utility/generate-report" element={<GenerateReport />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
