import React, { useState, useEffect } from 'react';
import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CompanyCode = () => {
    const [companyCodes, setCompanyCodes] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [shortName, setShortName] = useState('');
    const [comments, setComments] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCompanyCodes();
    }, []);

    const fetchCompanyCodes = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/companycode`);
            setCompanyCodes(response.data);
        } catch (error) {
            console.error('Error fetching company codes:', error);
        }
    };

    const handleCreate = async () => {
        try {
            if (editId) {
                await axios.put(`${backendUrl}/api/companycode/${editId}`, {
                    companyName,
                    shortName,
                    comments,
                });
            } else {
                await axios.post(`${backendUrl}/api/companycode`, {
                    companyName,
                    shortName,
                    comments,
                });
            }

            fetchCompanyCodes();
            setIsModalOpen(false);
            setCompanyName('');
            setShortName('');
            setComments('');
            setEditId(null);
        } catch (error) {
            console.error('Error creating/updating company code:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${backendUrl}/api/companycode/${id}`);
            fetchCompanyCodes();
        } catch (error) {
            console.error('Error deleting company code:', error);
        }
    };

    const handleEdit = (code) => {
        setCompanyName(code.companyName);
        setShortName(code.shortName);
        setComments(code.comments);
        setEditId(code._id);
        setIsModalOpen(true);
    };

    const filteredCompanyCodes = companyCodes.filter(code =>
        code.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.shortName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Company Codes</h2>
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Create
                </button>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border p-2">Company Name</th>
                        <th className="border p-2">Short Name</th>
                        <th className="border p-2">Comments</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCompanyCodes.map((code) => (
                        <tr key={code._id}>
                            <td className="border p-2">{code.companyName}</td>
                            <td className="border p-2">{code.shortName}</td>
                            <td className="border p-2">{code.comments}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleEdit(code)}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(code._id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative p-5 bg-white w-1/2 rounded-md">
                        <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Company Code' : 'Create Company Code'}</h2>
                        <input
                            type="text"
                            placeholder="Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="border p-2 rounded mb-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Short Name"
                            value={shortName}
                            onChange={(e) => setShortName(e.target.value)}
                            className="border p-2 rounded mb-2 w-full"
                        />
                        <textarea
                            placeholder="Comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="border p-2 rounded mb-2 w-full"
                        ></textarea>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCreate}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                {editId ? 'Update' : 'Save'}
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyCode;
