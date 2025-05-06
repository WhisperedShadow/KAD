import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ListPolicy = () => {
    const [policies, setPolicies] = useState([]);
    const { username, userRole } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useState({
        regNum: '',
        policyNum: '',
        startDate: '',
        endDate: '',
        sourcedMonth: '',
        bookingCode: '',
        subBookingCode: '',
        modeOfPayment: '',
        companyCode: '',
        productType: '',
        username: userRole !== 'Admin' ? username : '',
    });
    const [bookingCodes, setBookingCodes] = useState([]);
    const [subBookingCodes, setSubBookingCodes] = useState([]);
    const [sourcedMonths, setSourcedMonths] = useState([]);
    const navigate = useNavigate();

    const fetchPolicies = useCallback(async () => {
        try {
            const params = new URLSearchParams({ ...searchParams });
            const response = await axios.get(`${backendUrl}/api/listpolicy?${params.toString()}`);
            setPolicies(response.data);
        } catch (error) {
            console.error('Error fetching policies:', error);
        }
    }, [searchParams]);

    const fetchDropdownData = useCallback(async () => {
        try {
            const bookingCodesResponse = await axios.get(`${backendUrl}/api/listpolicy/bookingcodes`);
            const bookingCodes = bookingCodesResponse.data.map(item => item.bookingCode);
            setBookingCodes(bookingCodes);

            // Initialize subBookingCodes as empty
            setSubBookingCodes([]);

            const sourcedMonthsResponse = await axios.get(`${backendUrl}/api/listpolicy/sourcedmonths`);
            setSourcedMonths(sourcedMonthsResponse.data);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    }, []);

    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies]);

    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);

    const fetchSubBookingCodes = async (bookingCode) => {
        if (!bookingCode) {
            setSubBookingCodes([]); // clear sub-booking codes if booking code is not selected.
            return;
        }
        try {
            const response = await axios.get(`${backendUrl}/api/listpolicy/subbookingcodes/${bookingCode}`);
            setSubBookingCodes(response.data);
        } catch (error) {
            console.error('Error fetching sub-booking codes:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
        if (e.target.name === 'bookingCode') {
            fetchSubBookingCodes(e.target.value); // call fetchSubBookingCodes.
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchPolicies();
    };

    const openPdf = (filePath) => {
        window.open(`${backendUrl}/${filePath}`, '_blank');
    };

    const handleNavigateToAddPolicy = (policyNumber) => {
        navigate(`/policy/add/${policyNumber}`);
    };

    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(policies);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Policies');

        // Generate Excel file and trigger a download
        XLSX.writeFile(workbook, 'policies.xlsx');
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
                    <label className="block text-sm font-medium text-gray-700">Company Code:</label>
                    <input type="text" name="companyCode" placeholder="Company Code" onChange={handleSearchChange} className="mt-1 block w-full border p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Code:</label>
                    <input type="text" name="productType" placeholder="Product Code" onChange={handleSearchChange} className="mt-1 block w-full border p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mode of Payment:</label>
                    <input type="text" name="modeOfPayment" placeholder="Mode of Payment" onChange={handleSearchChange} className="mt-1 block w-full border p-2" />
                </div>
                {userRole === 'Admin' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username:</label>
                        <input type="text" name="username" placeholder="Username" onChange={handleSearchChange} className="mt-1 block w-full border p-2" />
                    </div>
                )}
                <div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
                </div>
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 mb-4">
                    <thead>
                        <tr>
                            <th className="border p-2">Customer Name</th>
                            <th className="border p-2">Customer Number</th>
                            <th className="border p-2">Registration Number</th>
                            <th className="border p-2">Company Code</th>
                            <th className="border p-2">Product Code</th>
                            <th className="border p-2">Policy Number</th>
                            <th className="border p-2">Policy Start</th>
                            <th className="border p-2">Policy End</th>
                            <th className="border p-2">Sourced Month</th>
                            <th className="border p-2">Total TP Premium</th>
                            <th className="border p-2">Net Premium</th>
                            <th className="border p-2">Gross Premium</th>
                            <th className="border p-2">Mode of Payment</th>
                            <th className="border p-2">Policy Status</th>
                            <th className="border p-2">Payment Status</th>
                            <th className="border p-2">PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map(policy => (
                            <tr key={policy.registrationNumber}>
                                <td className="border p-2">{policy.customerName}</td>
                                <td className="border p-2">{policy.customerNumber}</td>
                                <td className="border p-2">{policy.registrationNumber}</td>
                                <td className="border p-2">{policy.companyCode}</td>
                                <td className="border p-2">{policy.productType}</td>
                                <td className="border p-2">{policy.policyNumber}</td>
                                <td className="border p-2">{policy.policyStart}</td>
                                <td className="border p-2">{policy.policyEnd}</td>
                                <td className="border p-2">{policy.sourcedMonth}</td>
                                <td className="border p-2">{policy.totalTpPremium}</td>
                                <td className="border p-2">{policy.netPremium}</td>
                                <td className="border p-2">{policy.grossPremium}</td>
                                <td className="border p-2">{policy.modeOfPayment}</td>
                                <td className="border p-2">{policy.policyStatus}</td>
                                <td className="border p-2">{policy.paymentStatus}</td>
                                <td className="border p-2">
                                    {policy.filePath && (
                                        <button onClick={() => openPdf(policy.filePath)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">View PDF</button>
                                    )}
                                </td>
                                <td className="border p-2">
                                    {(policy.policyStatus !== "Entry Approved" && policy.policyStatus !== "Entry Corrected") && (
                                        <button
                                            onClick={() => handleNavigateToAddPolicy(policy.policyNumber)}
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Modify
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleExport} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Export</button>
            </div>
        </div>
    );
};

export default ListPolicy;
