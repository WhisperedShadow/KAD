import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const GenerateReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('');
    const [reportData, setReportData] = useState({});
    const [error, setError] = useState('');

    const fetchReportData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/generate-report', {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    report_type: reportType,
                },
            });
            setReportData(response.data);
        } catch (error) {
            console.error('Error fetching report data', error);
            setError('Error fetching report data');
            setReportData({});
        }
    };

    const handleExportPDF = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/export-pdf', {
                responseType: 'blob',
                params: { start_date: startDate, end_date: endDate, report_type: reportType },
            });
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            saveAs(pdfBlob, 'report.pdf');
        } catch (error) {
            console.error('Error exporting PDF', error);
            setError('Error exporting PDF');
        }
    };

    const handleExportExcel = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/export-excel', {
                responseType: 'blob',
                params: { start_date: startDate, end_date: endDate, report_type: reportType },
            });
            const excelBlob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(excelBlob, 'report.xlsx');
        } catch (error) {
            console.error('Error exporting Excel', error);
            setError('Error exporting Excel');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Generate Report</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" 
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">End Date:</label>
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" 
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Report Type:</label>
                <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)} 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                    <option value="">Select Report Type</option>
                    <option value="policyStatus">Policy Status</option>
                    <option value="productType">Product Type</option>
                    <option value="monthlyPremium">Monthly Premium</option>
                    {/*<option value="policyRenewal">Policy Renewal</option>*/}
                    {/* Add more report types as needed */}
                </select>
            </div>
            <button 
                onClick={fetchReportData} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Generate Report
            </button>
            {error && (
                <div className="text-red-500 mb-4">
                    {error}
                </div>
            )}
            {Object.keys(reportData).length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mb-2">Report Data:</h3>
                    {Object.keys(reportData).map((status) => (
                        <div key={status} className="mb-4">
                            <h4 className="text-lg font-semibold mb-2">{status}</h4>

                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Policy Number</th>
                                        <th className="px-4 py-2">Customer Name</th>
                                        <th className="px-4 py-2">Policy Start</th>
                                        <th className="px-4 py-2">Policy End</th>
                                        <th className="px-4 py-2">Total Premium</th>
                                        {/* Add more columns as needed */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData[status].map((row, index) => (
                                        <tr key={index}>
                                            <td className="border px-4 py-2">{row.policyNumber}</td>
                                            <td className="border px-4 py-2">{row.customerName}</td>
                                            <td className="border px-4 py-2">{row.policyStart}</td>
                                            <td className="border px-4 py-2">{row.policyEnd}</td>
                                            <td className="border px-4 py-2">{row.totalTpPremium}</td>
                                            {/* Add more data cells as needed */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                    <div className="mt-4 flex space-x-4">
                        <button 
                            onClick={handleExportPDF} 
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Export as PDF
                        </button>
                        <button 
                            onClick={handleExportExcel} 
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Export as Excel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenerateReport;
