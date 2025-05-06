import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductTypes = () => {
    const [productTypes, setProductTypes] = useState([]);
    const [productType, setProductType] = useState('');
    const [comments, setComments] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProductTypes();
    }, []);

    const fetchProductTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/producttype');
            setProductTypes(response.data);
        } catch (error) {
            console.error('Error fetching product types:', error);
        }
    };

    const handleCreate = async () => {
        try {
            if (editId) {
                await axios.put(`http://localhost:5000/api/producttype/${editId}`, {
                    productType,
                    comments,
                });
            } else {
                await axios.post('http://localhost:5000/api/producttype', {
                    productType,
                    comments,
                });
            }

            fetchProductTypes();
            setIsModalOpen(false);
            setProductType('');
            setComments('');
            setEditId(null);
        } catch (error) {
            console.error('Error creating/updating product type:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/producttype/${id}`);
            fetchProductTypes();
        } catch (error) {
            console.error('Error deleting product type:', error);
        }
    };

    const handleEdit = (product) => {
        setProductType(product.productType);
        setComments(product.comments);
        setEditId(product._id);
        setIsModalOpen(true);
    };

    const filteredProductTypes = productTypes.filter(product =>
        product.productType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Product Types</h2>
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
                        <th className="border p-2">Product Type</th>
                        <th className="border p-2">Comments</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProductTypes.map((product) => (
                        <tr key={product._id}>
                            <td className="border p-2">{product.productType}</td>
                            <td className="border p-2">{product.comments}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
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
                        <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Product Type' : 'Create Product Type'}</h2>
                        <input
                            type="text"
                            placeholder="Product Type"
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
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

export default ProductTypes;
