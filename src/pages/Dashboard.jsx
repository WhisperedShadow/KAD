import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import styles from "./Dashboard.module.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

let name = "User"; 
let estpremium = "230,975.42" ;
let perstatusamt = "235" ;
let policycount = "4368" ;
let perstatuscnt = "530";



const Dashboard = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { username, userRole } = useContext(AuthContext);
    const navigate = useNavigate();
    const [policyDropdownOpen, setPolicyDropdownOpen] = useState(false); // Add Policy dropdown state
    const [utilityDropdownOpen, setUtilityDropdownOpen] = useState(false); // Add Utility dropdown state
    const [data, setData] = useState([]);

    useEffect(() => {
    const fetchPolicyCounts = async () => {
      try {
        const headers = {
          'Username': username,
          'UserRole': userRole,
          //'Authorization': `Bearer your-auth-token`,  // TODO in Future..
        };
        const response = await axios.get(`${backendUrl}/api/policy/monthly_counts`, { headers });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching policy monthly counts', error);
      }
    };

    fetchPolicyCounts();
    }, [username, userRole]);

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handlePolicyDropdownToggle = () => {
        setPolicyDropdownOpen(!policyDropdownOpen);
    };

    const handleUtilityDropdownToggle = () => {
        setUtilityDropdownOpen(!utilityDropdownOpen);
    };

    const handleNavigate = (path) => {
        console.log('userRole changed:', userRole);
        setDropdownOpen(false);
        setPolicyDropdownOpen(false);
        setUtilityDropdownOpen(false);
        navigate(path);
    };

    return (
       <div className={styles.container}>
          <div className={styles.dashboard}>
              <div className={styles.topsection}>
              <div className={styles.greetingheader}>
                <h1 className={styles.lineone}>Welcome {name}!!</h1>
                <p className={styles.linetwo}>Policy Dashboard</p>
              </div>
              </div>

             <div className={styles.cardcontainer}>
             <div className={styles.premiumcard}>
                <p className={styles.cardtitle}>Total Premium</p>
                <h1 className={styles.estpremium}>₹ {estpremium}</h1>
                <p className={styles.eststatus}><span className={styles.perstatus}> +{perstatusamt}%</span> Per year</p>

             </div>

             <div className={styles.policycard}>
             <p className={styles.cardtitle}>Policy counts</p>
                <h1 className={styles.policycount}>{policycount}</h1>
                <p className={styles.eststatus}><span className={styles.perstatus}>+ {perstatuscnt}%</span> Per year</p>
             </div>
             </div>

             <div className={styles.barcontainer1}>
              <div className={styles.topsecinbc1}>
             <p className={styles.cardtitle}>Policy Pending</p>
             <select className={styles.formselect}  name="year">
              <option>Year</option>
              <option value="01">2020</option>
              <option value="02">2021</option>
              <option value="03">2022</option>
              <option value="04">2023</option>
              <option value="05">2024</option>
            </select>
                </div>

             </div>




             <div className={styles.barcontainer2}>
              <div className={styles.topsecinbc2}> 
             <p className={styles.cardtitle}>Feature section</p>
             <select className={styles.formselect}  name="year">
              
              <option>Year</option>
              <option value="01">2020</option>
              <option value="02">2021</option>
              <option value="03">2022</option>
              <option value="04">2023</option>
              <option value="05">2024</option>
            </select>
            
            </div>

             </div>
      <div>   </div>
             
            </div>
        </div>
    
    );
};

export default Dashboard;
