import React, { useEffect, useState } from "react";
import styles from "./nav.module.css";
import { useLocation } from "react-router-dom";

const adminUrl = [
  {
    url: "central",
    icon: "fa-solid fa-crown fa-2x",
    links: [
      { name: "Company Codes", url: "/central/companycode" },
      { name: "Booking Codes", url: "/central/bookingcode" },
      { name: "Policy Types", url: "/central/policytypes" },
      { name: "Product Types", url: "/central/producttypes" },
      { name: "Vehicle Types", url: "/central/vehicletypes" },
      { name: "RTO mapping", url: "/central/rtomapping" },
    ],
  },
];

const urlsAndIcons = [
  {
    url: "dashboard",
    icon: "fa-solid fa-table-columns fa-2x",
    links: [{ name: "Dashboard", url: "/dashboard" }],
  },
  {
    url: "policy",
    icon: "fa-solid fa-file fa-2x",
    links: [
      { name: "Add policy", url: "/policy/add" },
      { name: "Check policy", url: "/policy/check" },
      { name: "Map policy", url: "/policy/map" },
      { name: "List policy", url: "/policy/list" },
    ],
  },
  {
    url: "utility",
    icon: "fa-solid fa-screwdriver-wrench fa-2x",
    links: [{ name: "Generate Report", url: "/utility/generate-report" }],
  },
  {
    url: "commission",
    icon: "fa-solid fa-money-check-dollar fa-2x",
    links: [{ name: "Commission", url: "/commission" }],
  },
  {
    url: "motorquotes",
    icon: "fa-solid fa-motorcycle fa-2x",
    links: [{ name: "Motor Quotes", url: "/motorquotes" }],
  },
];

const Navbar = () => {
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState({
    icon: "fa-solid fa-circle-question",
    links: [],
  });

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    const match =
      urlsAndIcons.find((item) => item.url === path) ||
      adminUrl.find((item) => item.url === path);
    setActiveIcon(match || { icon: "fa-solid fa-circle-question", links: [] });
  }, [location.pathname]);

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.topIcon}>
          <i className={activeIcon.icon}></i>
        </div>
        <div className={styles.navlink}>
          {/* Admin-only links */}
          {localStorage.getItem("userRole") === "Admin" &&
            adminUrl.map((item, index) => (
              <div className={styles.navlink_item} key={`admin-${index}`}>
                <div className={styles.navlink_item_icon}>
                  <i className={item.icon}></i>
                </div>
                <div className={styles.navlink_item_text}>
                  {item.links.map((link, i) => (
                    <a href={link.url} key={i}>
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}

          {/* General links */}
          {urlsAndIcons.map((item, index) => (
            <div className={styles.navlink_item} key={`nav-${index}`}>
              <div className={styles.navlink_item_icon}>
                <i className={item.icon}></i>
              </div>
              <div className={styles.navlink_item_text}>
                {item.links.map((link, i) => (
                  <a href={link.url} key={i}>
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
      <div
        className={styles.profile}
        onClick={() => {
          document
            .querySelector(`.${styles.profile_popup}`)
            .classList.toggle(styles.show_popup);
        }}
      >
        <div className={styles.profile_icon}>
          <i class="fa-solid fa-user-tie fa-2x"></i>
        </div>
        <div className={styles.profile_popup}>
          <p>{localStorage.getItem("username")}</p>
          <hr />
          <p>{localStorage.getItem("userRole")}</p>
          <button>Logout</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
