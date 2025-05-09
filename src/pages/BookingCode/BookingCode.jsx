import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2,Pencil} from 'lucide-react';
import styles from './BookingCode.module.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
            const response = await axios.get(`${backendUrl}/api/bookingcode`);
            setBookingCodes(response.data);
        } catch (error) {
            console.error('Error fetching booking codes:', error);
        }
    };

    const handleCreate = async () => {
        try {
            await axios.post(`${backendUrl}/api/bookingcode`, {
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
            await axios.delete(`${backendUrl}/api/bookingcode/${id}`);
            fetchBookingCodes();
        } catch (error) {
            console.error('Error deleting booking code:', error);
        }
    };

    const handleDeleteSubCode = async (id, subCode) => {
        try {
            await axios.delete(`${backendUrl}/api/bookingcode/${id}/subcode/${subCode}`);
            fetchBookingCodes();
        } catch (error) {
            console.error('Error deleting sub-booking code:', error);
        }
    };

    const filteredBookingCodes = bookingCodes.filter(code =>
        code.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.Container}>
        <div className={styles.ContentHeader}>
            <h2 className={styles.title}>Booking Codes</h2>
            <div className={styles.searchBar}>
               <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                   
                />
          </div>
        </div>
                <button  className={styles.createBtn}
                    onClick={() => setIsModalOpen(true)}
                   
                >
                     + Create
                </button>
               
           <div className={styles.tableCnt}>
            <table className={styles.BkTable}>
                <thead>
                    <tr>
                       <th className={styles.Act}>Actions</th>
                        <th className={styles.BkCode}>Booking Code</th>
                        <th className={styles.SubBk}>Sub-Booking Codes</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {filteredBookingCodes.map((code) => (
                        <tr key={code._id}>

                             <td >
                                <button
                                    onClick={() => handleDelete(code._id)} 
                                    className={styles.deleteAll}
                                    
                                >
                                     <Trash2 className={styles.deleteIconAll} />
                                </button>
                            </td>
                            <td className={styles.BkCode}>{code.bookingCode}</td>
                            <td >
                                <ul>
                                    {code.subBookingCodes.map((sub) => (
                                        <li key={sub.subBookingCode}>
                                            {sub.subBookingCode} - {sub.remarks}
                                            <button
                                                onClick={() => handleDeleteSubCode(code._id, sub.subBookingCode)}
                                                className={styles.deleteSub}
                                            >
                                               
                                                    <Trash2 className={styles.SubdeleteIcon} />
                                            </button>
                                        </li>
                                    ))}
                                </ul> 
                            </td>
                    
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
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
