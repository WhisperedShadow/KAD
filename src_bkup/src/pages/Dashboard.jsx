import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', policies: 30 },
    { name: 'Feb', policies: 45 },
    { name: 'Mar', policies: 80 },
    { name: 'Apr', policies: 70 },
    // Add more data points as needed
];

const Dashboard = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(''); // Store the user's role
    const [policyDropdownOpen, setPolicyDropdownOpen] = useState(false); // Add Policy dropdown state

    useEffect(() => {
        // Retrieve the role from local storage on component mount
        const role = localStorage.getItem('userRole');
        setUserRole(role);
    }, []);

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handlePolicyDropdownToggle = () => {
        setPolicyDropdownOpen(!policyDropdownOpen);
    };

    const handleNavigate = (path) => {
        setDropdownOpen(false);
        setPolicyDropdownOpen(false);
        navigate(path);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation Bar */}
            <nav className="bg-gray-800 p-4 text-white">
                <div className="container mx-auto flex justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p className="text-sm">Welcome to your central dashboard</p>
                    </div>
                    <div className="flex space-x-4">
                        {/* Conditionally render the "Central" menu */}
                        {userRole === 'Admin' && (
                            <div className="relative group">
                                <button
                                    onClick={handleDropdownToggle}
                                    className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Central
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 z-10">
                                        <button
                                            onClick={() => handleNavigate('/central/companycode')}
                                            className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                                        >
                                            Company Code
                                        </button>
                                        <button
                                            onClick={() => handleNavigate('/central/bookingcode')}
                                            className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                                        >
                                            Booking Code
                                        </button>
                                        <button
                                            onClick={() => handleNavigate('/central/policytypes')}
                                            className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                                        >
                                            Policy Types
                                        </button>
                                        <button
                                            onClick={() => handleNavigate('/central/producttypes')}
                                            className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                                        >
                                            Product Types
                                        </button>
                                        <button
                                            onClick={() => handleNavigate('/central/vehicletypes')}
                                            className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                                        >
                                            Vehicle Types
                                        </button>
                                        <button
                                            onClick={() => handleNavigate('/central/rtomapping')}
                                            className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                                        >
                                            RTO Mapping
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="relative group">
                            <button
                                onClick={handlePolicyDropdownToggle}
                                className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Policy
                            </button>
                            {policyDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 z-10">
                                    <button
                                        onClick={() => handleNavigate('/policy/add')}
                                        className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                                    >
                                        Add Policy
                                    </button>
                                    <button
                                        onClick={() => handleNavigate('/policy/check')}
                                        className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                                    >
                                        Check Policy
                                    </button>
                                    <button
                                        onClick={() => handleNavigate('/policy/list')}
                                        className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                                    >
                                        List Policy
                                    </button>
                                    <button
                                        onClick={() => handleNavigate('/policy/map')}
                                        className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                                    >
                                        Map Policy
                                    </button>
                                </div>
                            )}
                        </div>
                        <button onClick={() => navigate('/utility')} className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            Utility
                        </button>
                        <button onClick={() => navigate('/commission')} className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            Commission
                        </button>
                        <button onClick={() => navigate('/motorquotes')} className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            Motor Quotes
                        </button>
                        <button onClick={() => navigate('/')} className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            Signout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto flex-grow py-10 grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Policy Counts</h2>
                    <div className="h-48 bg-gray-200 rounded-md p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="policies" stroke="#8884d8" />
                                <Line type="monotone" dataKey="policies" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Pending Policies</h2>
                    <div className="h-48 bg-gray-200 rounded-md">
                        {/* Pending Policies data will go here */}
                        <p className="text-center pt-16">Pending Policies Placeholder</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Total Revenue</h2>
                    <div className="h-48 bg-gray-200 rounded-md">
                        {/* Revenue data will go here */}
                        <p className="text-center pt-16">Revenue Placeholder</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Future Section</h2>
                    <div className="h-48 bg-gray-200 rounded-md">
                        {/* Future data or widgets will go here */}
                        <p className="text-center pt-16">Future Section Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
