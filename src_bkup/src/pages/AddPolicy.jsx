import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddPolicy = () => {
    const [companyCodes, setCompanyCodes] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [policyTypes, setPolicyTypes] = useState([]);
    const [bookingCodes, setBookingCodes] = useState([]);
    const [subBookingCodes, setSubBookingCodes] = useState([]);
    const [formData, setFormData] = useState({
        companyCode: '', productType: '', policyType: '', bookingCode: '', subBookingCode: '',
        customerName: '', customerNumber: '', customerEmail: '',
        registrationNumber: '', make: '', model: '', gvw: '', yom: '',
        policyNumber: '', policyStart: '', policyEnd: '', idv: '',
        totalTpPremium: '', netPremium: '', grossPremium: '', modeOfPayment: '',
    });
    const [policyFile, setPolicyFile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/addpolicy/dropdowns');
            setCompanyCodes(response.data.companyCodes);
            setProductTypes(response.data.productTypes);
            setPolicyTypes(response.data.policyTypes);
            setBookingCodes(response.data.bookingCodes);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    const fetchSubBookingCodes = async (bookingCode) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/addpolicy/subbookingcodes/${bookingCode}`);
            setSubBookingCodes(response.data);
        } catch (error) {
            console.error('Error fetching sub-booking codes:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'bookingCode') {
            fetchSubBookingCodes(e.target.value);
        }
    };

    const handleFileChange = (e) => {
        setPolicyFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const form = new FormData();
        for (const key in formData) {
            form.append(key, formData[key]);
        }
        if (policyFile) {
            form.append('policyFile', policyFile);
        }

        try {
            await axios.post('http://localhost:5000/api/addpolicy', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Policy added successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding policy');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Add Policy</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dropdowns */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company Code:</label>
                    <select name="companyCode" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Select Company Code</option>
                        {companyCodes.map(code => <option key={code} value={code}>{code}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Type:</label>
                    <select name="productType" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Select Product Type</option>
                        {productTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Policy Type:</label>
                    <select name="policyType" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Select Policy Type</option>
                        {policyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Booking Code:</label>
                    <select name="bookingCode" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Select Booking Code</option>
                        {bookingCodes.map(code => <option key={code} value={code}>{code}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sub Booking Code:</label>
                    <select name="subBookingCode" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Select Sub Booking Code</option>
                        {subBookingCodes.map(code => <option key={code} value={code}>{code}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Policy File:</label>
                    <input type="file" onChange={handleFileChange} className="mt-1 block w-full" />
                </div>

                {/* Customer Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name:</label>
                    <input type="text" name="customerName" placeholder="Customer Name" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Number:</label>
                    <input type="text" name="customerNumber" placeholder="Customer Number" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Email:</label>
                    <input type="text" name="customerEmail" placeholder="Customer Email" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                {/* Vehicle Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Number:</label>
                    <input type="text" name="registrationNumber" placeholder="Registration Number" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Make:</label>
                    <input type="text" name="make" placeholder="Make" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Model:</label>
                    <input type="text" name="model" placeholder="Model" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">GVW:</label>
                    <input type="text" name="gvw" placeholder="GVW" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">YoM:</label>
                    <input type="number" name="yom" placeholder="YoM" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                {/* Policy Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Policy Number:</label>
                    <input type="text" name="policyNumber" placeholder="Policy Number" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Policy Start:</label>
                    <input type="date" name="policyStart" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Policy End:</label>
                    <input type="date" name="policyEnd" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">IDV:</label>
                    <input type="number" name="idv" placeholder="IDV" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                {/* Premium Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Total TP Premium:</label>
                    <input type="number" name="totalTpPremium" placeholder="Total TP Premium" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Net Premium:</label>
                    <input type="number" name="netPremium" placeholder="Net Premium" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gross Premium:</label>
                    <input type="number" name="grossPremium" placeholder="Gross Premium" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mode of Payment:</label>
                    <select name="modeOfPayment" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Select Mode of Payment</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                        <option value="DD">DD</option>
                        <option value="Online">Online</option>
                    </select>
                </div>

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
            </form>
        </div>
    );

};

export default AddPolicy;
