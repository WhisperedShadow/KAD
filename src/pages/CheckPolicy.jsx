import React, { useState, useContext } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { AuthContext } from './AuthContext'; // Adjust path as needed
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CheckPolicy = () => {
    const { userRole } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [sourcedMonth, setSourcedMonth] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [totalApproved, setTotalApproved] = useState(0);
    const [totalMismatch, setTotalMismatch] = useState(0);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSourcedMonthChange = (e) => {
        setSourcedMonth(e.target.value);
    };

    const handleValidate = async () => {
        if (!file) {
            alert('Please upload an Excel file.');
            return;
        }
        if (!sourcedMonth) {
            alert('Please select a sourced month.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('sourcedMonth', sourcedMonth);

        try {
            const response = await axios.post(`${backendUrl}/api/checkpolicy`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setValidationResult(response.data);
            setTotalApproved(response.data.totalApproved);
            setTotalMismatch(response.data.totalMismatch);
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    if (userRole !== 'Admin') {
        return <p>Access denied. This page is for Admin users only.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Check Policy</h2>
            <p>
                Download the Excel sheet and use this format to fill out and upload to process.
            </p>
            <div className="mb-4">
                <a href="/DataFormat.xlsx" className="block text-blue-500 underline mb-2">
                    Download the Excel sheet
                </a>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Upload Excel File:</label>
                <input type="file" accept=".xlsx" onChange={handleFileChange} className="mt-1 block w-full"/>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Sourced Month:</label>
                <select onChange={handleSourcedMonthChange} className="mt-1 block w-full">
                    <option value="">Select Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>
            </div>
            <button onClick={handleValidate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Validate
            </button>
            {validationResult && (
                <div className="mt-4 p-4 border border-gray-300">
                    <h3 className="font-bold">Validation Result:</h3>
                    <p>Total Policy Approved: {totalApproved}</p>
                    <p>Total Policy Mismatch: {totalMismatch}</p>
                </div>
            )}
        </div>
    );
};

export default CheckPolicy;
