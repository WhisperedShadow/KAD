import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddPolicy = () => {
    const [companyCodes, setCompanyCodes] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [policyTypes, setPolicyTypes] = useState([]);
    const [bookingCodes, setBookingCodes] = useState([]);
    const [subBookingCodes, setSubBookingCodes] = useState([]);
    const [formData, setFormData] = useState({
        companyCode: '',
        productType: '',
        policyType: '',
        bookingCode: '',
        subBookingCode: '',
        customerName: '',
        customerNumber: '',
        customerEmail: '',
        registrationNumber: '',
        make: '',
        model: '',
        gvw: '',
        yom: '',
        policyNumber: '',
        policyStart: '',
        policyEnd: '',
        idv: '',
        totalTpPremium: '',
        netPremium: '',
        grossPremium: '',
        modeOfPayment: ''
    });
    const [policyFile, setPolicyFile] = useState(null);
    const [error, setError] = useState('');
    const [autoFillProcessing, setAutoFillProcessing] = useState(false); // New state for auto fill processing

    const { username } = useContext(AuthContext);
    const { policyNumber } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('useEffect for fetching policy is called');
        console.log('policyNumber:', policyNumber);
        if (policyNumber) {
            axios.get(`${backendUrl}/api/policy/${policyNumber}`)
                .then((response) => {
                    setFormData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching policy:', error);
                    setError('Error fetching policy');
                });
        }
    }, [policyNumber]);

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/addpolicy/dropdowns`);
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
            const response = await axios.get(`${backendUrl}/api/addpolicy/subbookingcodes/${bookingCode}`);
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
            await axios.post(`${backendUrl}/api/addpolicy`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Username': username
                }
            });
            alert('Policy added successfully');
            navigate('/policy/list');
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding policy');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.put(`${backendUrl}/api/policy/${policyNumber}`, formData, {
                headers: { 'X-Username': username }
            });
            alert('Policy updated successfully');
            navigate('/policy/list');
        } catch (err) {

            setError(err.response?.data?.message || 'Error updating policy');
        }
    };

    const handleAutoFill = async () => {
        if (!policyFile) {
            setError('Please upload a policy file before using auto-fill.');
            return;
        }

        setAutoFillProcessing(true);
        setError('');

        const autoFillData = new FormData();
        autoFillData.append('companyCode', formData.companyCode);
        autoFillData.append('productCode', formData.productType);
        autoFillData.append('policyType', formData.policyType);
        autoFillData.append('policyFile', policyFile);

        console.log('AutoFill Data:', autoFillData);

        try {
            const response = await axios.post(`${backendUrl}/api/autofill`, autoFillData, {
               headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Map the backend response to your form fields
            const data = response.data;

            const parseDate = (dateStr) => {
                if (!dateStr) {
                 // Return empty string or a default value if dateStr is invalid
                 return '';
                }
                const parts = dateStr.split(/[\s,-/]+/);  // Split by space, hyphen, or slash
                if(parts.length === 3) {
                const [day, month, year] = parts.map(part => parseInt(part, 10));
                return new Date(year, month - 1, day).toISOString().split('T')[0];
                }
            return '';  // Return an empty string if parsing fails
            };

            setFormData(prevData => ({
               ...prevData,
               customerName: data['Insured Name'],
               policyStart: parseDate(data['Policy_start']),
               policyEnd: parseDate(data['Policy_end']),
               policyNumber: data['Policy Number'],
               make: data['Make'],
               model: data['Model'],
               registrationNumber: data['Registration No'],
               gvw: data['GVW'],
               idv: parseFloat(data['IDV'].replace(/[^0-9.-]+/g,"")),
               totalTpPremium: parseFloat(data['Total_TP_Premium'].replace(/[^0-9.-]+/g,"")),
               netPremium: parseFloat(data['Net_Premium'].replace(/[^0-9.-]+/g,"")),
               grossPremium: parseFloat(data['Gross_Premium'].replace(/[^0-9.-]+/g,""))
             }));
            console.log('Updated FormData:', formData); // Log the updated formData
        } catch (err) {
            setError(err.response?.data?.message || 'Error performing auto-fill');
        } finally {
           setAutoFillProcessing(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">{policyNumber ? 'Modify Policy' : 'Add Policy'}</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={policyNumber ? handleUpdate : handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dropdowns */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company Code:</label>
                    <select name="companyCode" value={formData.companyCode} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="">Select Company Code</option>
                        {companyCodes.map(code => <option key={code} value={code}>{code}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Type:</label>
                    <select name="productType" value={formData.productType} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="">Select Product Type</option>
                        {productTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Policy Type:</label>
                    <select name="policyType" value={formData.policyType} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="">Select Policy Type</option>
                        {policyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Booking Code:</label>
                    <select name="bookingCode" value={formData.bookingCode} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="">Select Booking Code</option>
                        {bookingCodes.map(code => <option key={code} value={code}>{code}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sub Booking Code:</label>
                    <select name="subBookingCode" value={formData.subBookingCode} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="">Select Sub Booking Code</option>
                        {subBookingCodes.map(code => <option key={code} value={code}>{code}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Policy File:</label>
                    <input type="file" onChange={handleFileChange} className="mt-1 block w-full" />
                </div>
                {policyFile && (
                    <button type="button" onClick={handleAutoFill} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
                        {autoFillProcessing ? 'Auto Filling...' : 'Auto Fill'}
                    </button>
                )}
                {/* Customer Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name:</label>
                    <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Number:</label>
                    <input type="text" name="customerNumber" value={formData.customerNumber} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Email:</label>
                    <input type="text" name="customerEmail" value={formData.customerEmail} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>

                {/* Vehicle Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Number:</label>
                    <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Make:</label>
                    <input type="text" name="make" value={formData.make} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Model:</label>
                    <input type="text" name="model" value={formData.model} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">GVW:</label>
                    <input type="text" name="gvw" value={formData.gvw} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
               {/* <div>
                    <label className="block text-sm font-medium text-gray-700">YoM:</label>
                    <input type="number" name="yom" value={formData.yom} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div> */}

                {/* Policy Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Policy Number:</label>
                    <input type="text" name="policyNumber" value={formData.policyNumber} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Policy Start:</label>
                    <input type="date" name="policyStart" value={formData.policyStart} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Policy End:</label>
                    <input type="date" name="policyEnd" value={formData.policyEnd} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">IDV:</label>
                    <input type="number" name="idv" value={formData.idv} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>

                {/* Premium Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Total TP Premium:</label>
                    <input type="number" name="totalTpPremium" value={formData.totalTpPremium} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Net Premium:</label>
                    <input type="number" name="netPremium" value={formData.netPremium} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gross Premium:</label>
                    <input type="number" name="grossPremium" value={formData.grossPremium} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mode of Payment:</label>
                    <select name="modeOfPayment" value={formData.modeOfPayment} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="">Select Mode of Payment</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                        <option value="DD">DD</option>
                        <option value="Online">Online</option>
                    </select>
                </div>

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {policyNumber ? 'Update' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default AddPolicy;
