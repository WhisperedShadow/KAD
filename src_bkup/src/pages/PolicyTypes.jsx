import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PolicyTypes = () => {
    const [policyTypes, setPolicyTypes] = useState([]);
    const [policyType, setPolicyType] = useState('');
    const [comments, setComments] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPolicyTypes();
    }, []);

    const fetchPolicyTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/policytype');
            setPolicyTypes(response.data);
        } catch (error) {
            console.error('Error fetching policy types:', error);
        }
    };

    const handleCreate = async () => {
        try {
            if (editId) {
                await axios.put(`http://localhost:5000/api/policytype/${editId}`, {
                    policyType,
                    comments,
                });
            } else {
                await axios.post('http://localhost:5000/api/policytype', {
                    policyType,
                    comments,
                });
            }

            fetchPolicyTypes();
            setIsModalOpen(false);
            setPolicyType('');
            setComments('');
            setEditId(null);
        } catch (error) {
            console.error('Error creating/updating policy type:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/policytype/${id}`);
            fetchPolicyTypes();
        } catch (error) {
            console.error('Error deleting policy type:', error);
        }
    };

    const handleEdit = (policy) => {
        setPolicyType(policy.policyType);
        setComments(policy.comments);
        setEditId(policy._id);
        setIsModalOpen(true);
    };

    const filteredPolicyTypes = policyTypes.filter(policy =>
        policy.policyType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Policy Types</h2>
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
                        <th className="border p-2">Policy Type</th>
                        <th className="border p-2">Comments</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPolicyTypes.map((policy) => (
                        <tr key={policy._id}>
                            <td className="border p-2">{policy.policyType}</td>
                            <td className="border p-2">{policy.comments}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleEdit(policy)}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(policy._id)}
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
                        <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Policy Type' : 'Create Policy Type'}</h2>
                        <input
                            type="text"
                            placeholder="Policy Type"
                            value={policyType}
                            onChange={(e) => setPolicyType(e.target.value)}
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

export default PolicyTypes;
