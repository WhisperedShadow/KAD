import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingCode = () => {
    const [bookingCodes, setBookingCodes] = useState([]);
    const [bookingCode, setBookingCode] = useState('');
    const [subBookingCode, setSubBookingCode] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBookingCodes();
    }, []);

    const fetchBookingCodes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/bookingcode');
            setBookingCodes(response.data);
        } catch (error) {
            console.error('Error fetching booking codes:', error);
        }
    };

    const handleCreate = async () => {
        try {
            await axios.post('http://localhost:5000/api/bookingcode', {
                bookingCode,
                subBookingCode,
                remarks,
            });

            fetchBookingCodes();
            setIsModalOpen(false);
            setBookingCode('');
            setSubBookingCode('');
            setRemarks('');
        } catch (error) {
            console.error('Error creating booking code:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/bookingcode/${id}`);
            fetchBookingCodes();
        } catch (error) {
            console.error('Error deleting booking code:', error);
        }
    };

    const handleDeleteSubCode = async (id, subCode) => {
        try {
            await axios.delete(`http://localhost:5000/api/bookingcode/${id}/subcode/${subCode}`);
            fetchBookingCodes();
        } catch (error) {
            console.error('Error deleting sub-booking code:', error);
        }
    };

    const filteredBookingCodes = bookingCodes.filter(code =>
        code.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Booking Codes</h2>
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
                        <th className="border p-2">Booking Code</th>
                        <th className="border p-2">Sub-Booking Codes</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookingCodes.map((code) => (
                        <tr key={code._id}>
                            <td className="border p-2">{code.bookingCode}</td>
                            <td className="border p-2">
                                <ul>
                                    {code.subBookingCodes.map((sub) => (
                                        <li key={sub.subBookingCode}>
                                            {sub.subBookingCode} - {sub.remarks}
                                            <button
                                                onClick={() => handleDeleteSubCode(code._id, sub.subBookingCode)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            >
                                                Delete Sub
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="border p-2">
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
                        <h2 className="text-xl font-bold mb-4">Create Booking Code</h2>
                        <input
                            type="text"
                            placeholder="Booking Code"
                            value={bookingCode}
                            onChange={(e) => setBookingCode(e.target.value)}
                            className="border p-2 rounded mb-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Sub Booking Code"
                            value={subBookingCode}
                            onChange={(e) => setSubBookingCode(e.target.value)}
                            className="border p-2 rounded mb-2 w-full"
                        />
                        <textarea
                            placeholder="Remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="border p-2 rounded mb-2 w-full"
                        ></textarea>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCreate}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                Save
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

export default BookingCode;
