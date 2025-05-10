import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2,Pencil} from 'lucide-react';
import styles from './VehicleTypes.module.css'; 
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const VehicleTypes = () => {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [variant, setVariant] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [activeRowId, setActiveRowId] = useState(null);
    const [hoveredDot, setHoveredDot] = useState(null);
    const [clickedDot, setClickedDot] = useState(null);
     
    const handleAction =(action ,code)=> {
        if(typeof code === 'string'){
            setClickedDot(`${action}-${code}`);
            if (action === 'Delete') {
                handleDelete(code);
            }
        } else {
        setClickedDot(`${action}-${code._id}`);

        if(action === 'Edit') {
            handleEdit(code);
        } else if(action === 'Delete') {
            handleDelete(code._id);
        }
    }
    setTimeout(() => {
        setClickedDot(null);
      }, 600);
  }
   

    useEffect(() => {
        fetchVehicleTypes();
    }, []);

    const fetchVehicleTypes = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/vehicletype`);
            setVehicleTypes(response.data);
        } catch (error) {
            console.error('Error fetching Vehicle Types:', error);
        }
    };

    const handleCreate = async () => {
        try {
            if (editId) {
                await axios.put(`${backendUrl}/api/vehicletype/${editId}`, {
                    make,
                    model,
                    variant,
                });
            } else {
                await axios.post(`${backendUrl}/api/vehicletype`, {
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
            console.error('Error creating/updating Vehicle Type:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${backendUrl}/api/vehicletype/${id}`);
            fetchVehicleTypes();
        } catch (error) {
            console.error('Error deleting vvhicle Type:', error);
        }
    };

    const handleEdit = (code) => {
        setMake(code.make);
        setModel(code.model);
        setVariant(code.variant);
        setEditId(code._id);
        setIsModalOpen(true);
    };

    const filteredVehicleTypes = vehicleTypes.filter(code =>
        code.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.model.toLowerCase().includes(searchQuery.toLowerCase())||
        code.variant.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.Container}>
          <div className={styles.ContentHeader}>
                <h2 className={styles.title}>Vehicle Types</h2>
                <div className={styles.searchBar}>
              
                   <input className={styles.searchInput}
                    type="text"
                    placeholder="Search type...//"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    
                     />
                </div>
          </div>
                <button className={styles.createBtn}
                    onClick={() => setIsModalOpen(true)}
                    >
                    + Create
                </button>
                
           <div className={styles.tableCnt}>
            <table className={styles.CpyTable}>
                <thead>
                    <tr>
                       
                        <th className={styles.cpyName}>Make</th>
                        <th className={styles.cpymodel}>Model</th>
                        <th className={styles.cmt}>variant</th>
                        <th className={styles.Act}>Actions</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {filteredVehicleTypes.map((code) => (
                        <tr key={code._id}>
                            <td className={styles.cpyName}>{code.make}</td>
                            <td className={styles.cpymodel}>{code.model}</td>
                            <td className={styles.cmt}>{code.variant}</td>
                            <td className={styles.Act}>
                                <div className={styles.BtnContainer}>
                                    <div 
                                    className={`${styles.mainButton} ${activeRowId === code._id ? styles.expanded : ''}`}
                                    onMouseEnter={() => setActiveRowId(code._id)}
                                    onMouseLeave={() =>{ setActiveRowId(null); setHoveredDot(null); }} 
                                        >
                                          <div className={`${styles.dotsContainer} ${activeRowId === code._id ? styles.hidden : ''}`}>
                                                 <span className={styles.dot}></span>
                                                 <span className={styles.dot}></span>
                                           </div>  
                                <div  className={`${styles.actionsContainer} ${activeRowId === code._id ? styles.visible : ''}`} >
                                <button
                                    className={`${styles.actionButton} ${styles.editButton} ${hoveredDot === `Edit-${code._id}` ? styles.hovered : ''} ${clickedDot === `Edit-${code._id}` ? styles.clicked : ''}`}
                                    onClick={() => handleEdit(code)}
                                    title='Edit'
                                    onMouseEnter={() => setHoveredDot(`Edit-${code._id}`)}
                                    onMouseLeave={() => setHoveredDot(null)}
                                  
                                >
                                     <Pencil 
                                          size={12} 
                                          className={`${styles.icon} ${hoveredDot === `Edit-${code._id}` ? styles.iconVisible : ''}`}
                                     />
                                    
                                </button>

                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton} ${hoveredDot === `Delete-${code._id}` ? styles.hovered : ''} ${clickedDot === `Delete-${code._id}` ? styles.clicked : ''}`}
                                    onClick={() => handleAction('Delete',code._id)}
                                    title="Delete"
                                    onMouseEnter={() => setHoveredDot(`Delete-${code._id}`)}
                                    onMouseLeave={() => setHoveredDot(null)}
                                    
                                >
                                    <Trash2 
                                       size={12} 
                                       className={`${styles.icon} ${hoveredDot === `Delete-${code._id}` ? styles.iconVisible : ''}`}
                                     />
                                </button>

                                </div>
                            </div>
                         </div>
                     </td>
                </tr>
                    ))}
                </tbody>
            </table>
            </div>
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>{editId ? 'Edit Vehicle Type' : 'Create Vehicle Type'}</h2>
                       
                       <div className={styles.formGrp}>
                         <label className={styles.formLabel}>Model</label>
                           <input
                            type="text"
                            placeholder="Enter Model"
                            value={make}
                            onChange={(e) => setMake(e.target.value)}
                            className={styles.formInput}
                            
                        />
                        </div>
                        <div className={styles.formGrp}>
                         <label className={styles.formLabel}>Make</label>
                        <input
                            type="text"
                            placeholder="Enter Make"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className={styles.formInput}
                            
                        />
                        </div>
                        <div className={styles.formGrp}>
                         <label className={styles.formLabel}>variant</label>
                        <textarea
                            placeholder="Add variant here..."
                            value={variant}
                            onChange={(e) => setVariant(e.target.value)}
                            className={styles.formTextarea}
                        ></textarea>
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                onClick={handleCreate}
                                className={styles.saveButton}
                                
                            >
                                {editId ? 'Update' : 'Save'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditId(null);
                                    setMake('');
                                    setModel('');
                                    setVariant('');
                                }}
                                className={styles.cancelButton}
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
