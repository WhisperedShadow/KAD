import React, { use } from "react";
import styles from "./nav.module.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [icon, setIcon] = useState("");

  const urlsAndIcons = [
    { url: "/dashboard", icon: "fa-solid fa-table-columns fa-3x" },
    { url: "/central/companycode", icon: "fa-solid fa-crown fa-2x" },
    { url: "/projects", icon: "projects" },
    { url: "/contact", icon: "contact" },
  ];
  const location = useLocation();
  useEffect(() => {
    const currentPath = location.pathname;
    console.log(currentPath);
    setIcon(urlsAndIcons.find((item)=> item.url === currentPath));
  },[]);

  return (
    <nav className={styles.nav}>
      <div>
        <i className={icon.icon}></i>
      </div>
      <div className={styles.navlink}></div>
    </nav>
  );
};

export default Navbar;
