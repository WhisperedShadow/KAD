import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListPolicy = () => {
    const [policies, setPolicies] = useState([]);
    const [searchParams, setSearchParams] = useState({
        regNum: '',
        policyNum: '',
        startDate: '',
        endDate: '',
        sourcedMonth: '',
        bookingCode: '',
        subBookingCode: '',
    });
    const [userRole, setUserRole] = useState('');
    const [bookingCodes, setBookingCodes] = useState([]);
    const [subBookingCodes, setSubBookingCodes] = useState([]);
    const [sourcedMonths, setSourcedMonths] = useState([]);

    const fetchPolicies = async () => {
        try {
            const params = new URLSearchParams(searchParams);
            const response = await axios.get(`http://localhost:5000/api/listpolicy?${params.toString()}`);
            setPolicies(response.data);
        } catch (error) {
            console.error('Error fetching policies:', error);
        }
    };

const fetchDropdownData = async () => {
    try {
        const bookingCodesResponse = await axios.get('http://localhost:5000/api/listpolicy/bookingcodes');
        const bookingCodes = bookingCodesResponse.data.map(item => item.bookingCode);
        setBookingCodes(bookingCodes);

        // No need to fetch subBookingCodes separately here
        setSubBookingCodes([]); // Initialize as empty

        const sourcedMonthsResponse = await axios.get('http://localhost:5000/api/listpolicy/sourcedmonths');
        setSourcedMonths(sourcedMonthsResponse.data);
    } catch (error) {
        console.error('Error fetching dropdown data:', error);
    }
};

    const fetchSubBookingCodes = async (bookingCode) => {
        if (!bookingCode) { // Add check
            setSubBookingCodes([]); // clear sub booking codes if booking code is not selected.
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/api/listpolicy/subbookingcodes/${bookingCode}`);
            setSubBookingCodes(response.data);
        } catch (error) {
            console.error('Error fetching sub-booking codes:', error);
        }
    };

    useEffect(() => {
        fetchPolicies();
        fetchDropdownData();
        //Removed fetchSubBookingCodes(); from here.
        const role = localStorage.getItem('userRole');
        setUserRole(role);
    }, [searchParams]);

    const handleSearchChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
        if (e.target.name === 'bookingCode') { //when booking code changes
            fetchSubBookingCodes(e.target.value); // call fetchSubBookingCodes.
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchPolicies();
    };

    const openPdf = (filePath) => {
        window.open(`http://localhost:5000/${filePath}`, '_blank');
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">List Policies</h2>
            <form onSubmit={handleSearchSubmit} className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Number:</label>
                    <input type="text" name="regNum" placeholder="Registration Number" onChange={handleSearchChange} className="mt-1 block w-full border p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Policy Number:</label>
                    <input type="text" name="policyNum" placeholder="Policy Number" onChange={handleSearchChange} className="mt-1 block w-full border p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                    <input type="date" name="startDate" placeholder="Start Date" onChange={handleSearchChange} className="mt-1 block w-full border p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Date:</label>
                    <input type="date" name="endDate" placeholder="End Date" onChange={handleSearchChange} className="mt-1 block w-full border p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sourced Month:</label>
                    <select name="sourcedMonth" onChange={handleSearchChange} className="mt-1 block w-full border p-2">
                        <option value="">Select Month</option>
                    {sourcedMonths.map((month, index) => (
                        <option key={index} value={month}>{month}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Booking Code:</label>
                    <select name="bookingCode" onChange={handleSearchChange} className="mt-1 block w-full border p-2">
                        <option value="">Select Booking Code</option>
                    {bookingCodes.map((code, index) => (
                        <option key={index} value={code}>{code}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sub Booking Code:</label>
                    <select name="subBookingCode" onChange={handleSearchChange} className="mt-1 block w-full border p-2">
                        <option value="">Select Sub Booking Code</option>
                    {subBookingCodes.map((code, index) => (
                        <option key={index} value={code}>{code}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
                </div>
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border p-2">Customer Name</th>
                            <th className="border p-2">Registration Number</th>
                            <th className="border p-2">Policy Number</th>
                            <th className="border p-2">Policy Start</th>
                            <th className="border p-2">Policy End</th>
                            <th className="border p-2">Sourced Month</th>
                            <th className="border p-2">Total TP Premium</th>
                            <th className="border p-2">Net Premium</th>
                            <th className="border p-2">Gross Premium</th>
                            <th className="border p-2">Policy Status</th>
                            <th className="border p-2">Payment Status</th>
                            <th className="border p-2">PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map(policy => (
                            <tr key={policy.registrationNumber}>
                                <td className="border p-2">{policy.customerName}</td>
                                <td className="border p-2">{policy.registrationNumber}</td>
                                <td className="border p-2">{policy.policyNumber}</td>
                                <td className="border p-2">{policy.policyStart}</td>
                                <td className="border p-2">{policy.policyEnd}</td>
                                <td className="border p-2">{policy.sourcedMonth}</td>
                                <td className="border p-2">{policy.totalTpPremium}</td>
                                <td className="border p-2">{policy.netPremium}</td>
                                <td className="border p-2">{policy.grossPremium}</td>
                                <td className="border p-2">{policy.policyStatus}</td>
                                <td className="border p-2">{policy.paymentStatus}</td>
                                <td className="border p-2">
                                    {policy.filePath && (
                                        <button onClick={() => openPdf(policy.filePath)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">View PDF</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListPolicy;
