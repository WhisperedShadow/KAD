import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VehicleTypes = () => {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [variant, setVariant] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchVehicleTypes();
    }, []);

    const fetchVehicleTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vehicletype');
            setVehicleTypes(response.data);
        } catch (error) {
            console.error('Error fetching vehicle types:', error);
        }
    };

    const handleCreate = async () => {
        try {
            if (editId) {
                await axios.put(`http://localhost:5000/api/vehicletype/${editId}`, {
                    make,
                    model,
                    variant,
                });
            } else {
                await axios.post('http://localhost:5000/api/vehicletype', {
                    make,
                    model,
                    variant,
                });
            }

            fetchVehicleTypes();
            setIsModalOpen(false);
            setMake('');
            setModel('');
            setVariant('');
            setEditId(null);
        } catch (error) {
            console.error('Error creating/updating vehicle type:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/vehicletype/${id}`);
            fetchVehicleTypes();
        } catch (error) {
            console.error('Error deleting vehicle type:', error);
        }
    };

    const handleEdit = (vehicle) => {
        setMake(vehicle.make);
        setModel(vehicle.model);
        setVariant(vehicle.variant);
        setEditId(vehicle._id);
        setIsModalOpen(true);
    };

    const filteredVehicleTypes = vehicleTypes.filter(vehicle =>
        vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.variant.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Vehicle Types</h2>
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
                        <th className="border p-2">Make</th>
                        <th className="border p-2">Model</th>
                        <th className="border p-2">Variant</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredVehicleTypes.map((vehicle) => (
                        <tr key={vehicle._id}>
                            <td className="border p-2">{vehicle.make}</td>
                            <td className="border p-2">{vehicle.model}</td>
                            <td className="border p-2">{vehicle.variant}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleEdit(vehicle)}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(vehicle._id)}
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
                        <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Vehicle Type' : 'Create Vehicle Type'}</h2>
                        <input
                            type="text"
                            placeholder="Make"
                            value={make}
                            onChange={(e) => setMake(e.target.value)}
                            className="border p-2 rounded mb-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="border p-2 rounded mb-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Variant"
                            value={variant}
                            onChange={(e) => setVariant(e.target.value)}
                            className="border p-2 rounded mb-2 w-full"
                        />
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

export default VehicleTypes;
