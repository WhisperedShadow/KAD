import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { AuthContext } from './AuthContext';
import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL;


const Dashboard = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { username, userRole } = useContext(AuthContext);
    const navigate = useNavigate();
    const [policyDropdownOpen, setPolicyDropdownOpen] = useState(false); // Add Policy dropdown state
    const [utilityDropdownOpen, setUtilityDropdownOpen] = useState(false); // Add Utility dropdown state
    const [data, setData] = useState([]);

    useEffect(() => {
    const fetchPolicyCounts = async () => {
      try {
        const headers = {
          'Username': username,
          'UserRole': userRole,
          //'Authorization': `Bearer your-auth-token`,  // TODO in Future..
        };
        const response = await axios.get(`${backendUrl}/api/policy/monthly_counts`, { headers });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching policy monthly counts', error);
      }
    };

    fetchPolicyCounts();
    }, [username, userRole]);

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handlePolicyDropdownToggle = () => {
        setPolicyDropdownOpen(!policyDropdownOpen);
    };

    const handleUtilityDropdownToggle = () => {
        setUtilityDropdownOpen(!utilityDropdownOpen);
    };

    const handleNavigate = (path) => {
        console.log('userRole changed:', userRole);
        setDropdownOpen(false);
        setPolicyDropdownOpen(false);
        setUtilityDropdownOpen(false);
        navigate(path);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation Bar */}
            

            {/* Main Content */}
            <div className="container mx-auto flex-grow py-10 grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Policy Counts</h2>
                    <div className="h-48 bg-gray-200 rounded-md p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="policies" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
                                <YAxis />
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
