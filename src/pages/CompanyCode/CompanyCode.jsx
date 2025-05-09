import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2,Pencil} from 'lucide-react';
import styles from './CompanyCode.module.css'; 
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CompanyCode = () => {
    const [companyCodes, setCompanyCodes] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [shortName, setShortName] = useState('');
    const [comments, setComments] = useState('');
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
        <div className={styles.Container}>
          <div className={styles.ContentHeader}>
                <h2 className={styles.title}>Company Codes</h2>
                <div className={styles.searchBar}>
              
                   <input className={styles.searchInput}
                    type="text"
                    placeholder="Search company...//"
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
                       
                        <th className={styles.cpyName}>Company Name</th>
                        <th className={styles.cpyShortName}>Short Name</th>
                        <th className={styles.cmt}>Comments</th>
                        <th className={styles.Act}>Actions</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {filteredCompanyCodes.map((code) => (
                        <tr key={code._id}>
                            <td className={styles.cpyName}>{code.companyName}</td>
                            <td className={styles.cpyShortName}>{code.shortName}</td>
                            <td className={styles.cmt}>{code.comments}</td>
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
                        <h2 className={styles.modalTitle}>{editId ? 'Edit Company Code' : 'Create Company Code'}</h2>
                       
                       <div className={styles.formGrp}>
                         <label className={styles.formLabel}>Company Name</label>
                           <input
                            type="text"
                            placeholder="Enter Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className={styles.formInput}
                            
                        />
                        </div>
                        <div className={styles.formGrp}>
                         <label className={styles.formLabel}>Short Name</label>
                        <input
                            type="text"
                            placeholder="Enter Short Name"
                            value={shortName}
                            onChange={(e) => setShortName(e.target.value)}
                            className={styles.formInput}
                            
                        />
                        </div>
                        <div className={styles.formGrp}>
                         <label className={styles.formLabel}>Comments</label>
                        <textarea
                            placeholder="Add Comments here..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
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
                                    setCompanyName('');
                                    setShortName('');
                                    setComments('');
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

export default CompanyCode;
