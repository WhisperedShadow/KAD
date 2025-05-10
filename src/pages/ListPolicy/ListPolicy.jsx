import styles from "./ListPolicy.module.css";
import { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ListPolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [filter, setFilter] = useState(false);
  const [bookingCodes, setBookingCodes] = useState([]);
  const [subBookingCodes, setSubBookingCodes] = useState([]);
  const [sourcedMonths, setSourcedMonths] = useState([]);
  const { username, userRole } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useState({
    name: "",
    regNum: "",
    policyNum: "",
    startDate: "",
    endDate: "",
    sourcedMonth: "",
    bookingCode: "",
    subBookingCode: "",
    modeOfPayment: "online",
    companyCode: "",
    productType: "",
    username: userRole !== "Admin" ? username : "",
  });

  useEffect(() => {
    const filterdPolicies = policies.filter((policy) => {
      return (
        (searchParams.regNum === "" ||
          policy.registrationNumber
            .toLowerCase()
            .includes(searchParams.regNum.toLowerCase()) ||
          policy.customerName
            .toLowerCase()
            .includes(searchParams.name.toLowerCase())) &&
        (searchParams.policyNum === "" ||
          policy.policyNumber
            .toLowerCase()
            .includes(searchParams.policyNum.toLowerCase())) &&
        (searchParams.startDate === "" ||
          new Date(policy.policyStart) >= new Date(searchParams.startDate)) &&
        (searchParams.endDate === "" ||
          new Date(policy.policyEnd) <= new Date(searchParams.endDate)) &&
        (searchParams.companyCode === "" ||
          policy.companyCode
            .toLowerCase()
            .includes(searchParams.companyCode.toLowerCase())) &&
        (searchParams.sourcedMonth === "" ||
          policy.sourcedMonth
            .toLowerCase()
            .includes(searchParams.sourcedMonth.toLowerCase())) &&
        (searchParams.bookingCode === "All" ||
          searchParams.bookingCode === "" ||
          policy.bookingCode
            .toLowerCase()
            .includes(searchParams.bookingCode.toLowerCase())) &&
        (searchParams.subBookingCode === "" ||
          policy.subBookingCode
            .toLowerCase()
            .includes(searchParams.subBookingCode.toLowerCase())) &&
        (searchParams.productType === "" ||
          policy.productType
            .toLowerCase()
            .includes(searchParams.productType.toLowerCase())) &&
        (searchParams.username === "" ||
          policy.username
            .toLowerCase()
            .includes(searchParams.username.toLowerCase()))
      );
    });
    setPolicies(filterdPolicies);
  }, [searchParams]);

  const fetchPolicies = useCallback(async () => {
    try {
      const responce = await axios.get(`${backendUrl}/api/listpolicy`);
      const policies = responce.data.map((item) => ({
        ...item,
        isOpen: false,
      }));
      setPolicies(policies);
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const bookingCodesResponse = await axios.get(
        `${backendUrl}/api/listpolicy/bookingcodes`
      );
      const bookingCodes = bookingCodesResponse.data.map(
        (item) => item.bookingCode
      );
      setBookingCodes(["All", ...bookingCodes]);
      setSubBookingCodes([]);

      const sourcedMonthsResponse = await axios.get(
        `${backendUrl}/api/listpolicy/sourcedmonths`
      );
      setSourcedMonths(sourcedMonthsResponse.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const fetchSubBookingCodes = async (bookingCode) => {
    if (!bookingCode) {
      setSubBookingCodes([]);
      return;
    }
    try {
      const response = await axios.get(
        `${backendUrl}/api/listpolicy/subbookingcodes/${bookingCode}`
      );
      setSubBookingCodes(response.data);
    } catch (error) {
      console.error("Error fetching sub-booking codes:", error);
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.ContentHeader}>
        <h2 className={styles.title}>Policy List</h2>
        <div className={styles.searchBar}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search Name Register Number...//"
            value={searchParams.regNum}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                regNum: e.target.value,
                name: e.target.value,
              })
            }
          />
          <div className={styles.filer}>
            <button>
              {" "}
              Filter
              <i
                onClick={() => setFilter(!filter)}
                class={
                  filter ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"
                }
              ></i>
              <div
                className={`${styles.filter_container}  ${
                  filter ? styles.show_filter : ""
                }`}
              >
                <label htmlFor="">
                  <span>Policy Number</span>
                  <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search policy number...//"
                    value={searchParams.policyNum}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        policyNum: e.target.value,
                      })
                    }
                  />
                  <hr />
                </label>

                <label htmlFor="">
                  <span>Mode of Payment</span>
                  <div className={styles.MOP}>
                    <span>
                      <input
                        type="radio"
                        name="modeOfPayment"
                        className={styles.searchInput}
                        value={"online"}
                        onChange={(e) =>
                          setSearchParams({
                            ...searchParams,
                            modeOfPayment: e.target.value,
                          })
                        }
                      />
                      <p htmlFor="">Online</p>
                    </span>
                    <span>
                      <input
                        type="radio"
                        name="modeOfPayment"
                        className={styles.searchInput}
                        value={"offline"}
                        onChange={(e) =>
                          setSearchParams({
                            ...searchParams,
                            modeOfPayment: e.target.value,
                          })
                        }
                      />
                      <p htmlFor="">Offline</p>
                    </span>
                  </div>
                  <hr />
                </label>

                <label htmlFor="">
                  <span>Start Date</span>
                  <input
                    type="date"
                    className={styles.searchInput}
                    value={searchParams.startDate}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        startDate: e.target.value,
                      })
                    }
                  />
                  <hr />
                </label>

                <label htmlFor="">
                  <span>End Date</span>
                  <input
                    type="date"
                    className={styles.searchInput}
                    value={searchParams.endDate}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        endDate: e.target.value,
                      })
                    }
                  />
                  <hr />
                </label>

                <label htmlFor="">
                  <span>Company Code</span>
                  <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search Company Code...//"
                    value={searchParams.companyCode}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        companyCode: e.target.value,
                      })
                    }
                  />
                  <hr />
                </label>

                <label htmlFor="">
                  <span>Sourced Month</span>
                  <select className={styles.searchInput}>
                    {sourcedMonths.map((month, i) => (
                      <option key={i} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <hr />
                </label>

                <label htmlFor="">
                  <span>Booking Code</span>
                  <select
                    className={styles.searchInput}
                    onChange={(e) => {
                      setSearchParams({
                        ...searchParams,
                        bookingCode: e.target.value,
                      });
                      fetchSubBookingCodes(e.target.value);
                    }}
                  >
                    {bookingCodes.map((code, i) => (
                      <option key={i} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                  <hr />
                </label>

                <label htmlFor="">
                  <span>Sub Booking Code</span>
                  <select
                    className={styles.searchInput}
                    onChange={(e) => {
                      setSearchParams({
                        ...searchParams,
                        subBookingCode: e.target.value,
                      });
                    }}
                  >
                    {subBookingCodes.map((subCode, i) => (
                      <option key={i} value={subCode}>
                        {subCode}
                      </option>
                    ))}
                  </select>
                  <hr />
                </label>

                <label htmlFor="">
                  <span>Product Code</span>
                  <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search Product Code...//"
                    value={searchParams.productType}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        productType: e.target.value,
                      })
                    }
                  />
                  <hr />
                </label>

                <label htmlFor="">
                  <span>User Name</span>
                  <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search User Name...//"
                    value={searchParams.username}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        username: e.target.value,
                      })
                    }
                  />
                  <hr />
                </label>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.Content}>
        <div className={styles.Content}>
          {policies.length > 0 ? (
            policies.map((policy, i) => (
              <div
                className={styles.policy_card}
                key={i}
                onClick={() => {
                  policy.isOpen = !policy.isOpen;
                  setPolicies([...policies]);
                }}
              >
                <div className={styles.policy_card_head}>
                  <span>{policy.customerName}</span>
                  <span>{policy.policyNumber}</span>
                  <span>{policy.companyCode}</span>
                  <span>
                    <i
                      className={
                        policy.isOpen
                          ? "fa-solid fa-chevron-up"
                          : "fa-solid fa-chevron-down"
                      }
                    ></i>
                  </span>
                </div>
                <div
                  className={`${styles.policy_card_body} ${
                    policy.isOpen ? styles.policy_show : ""
                  }`}
                >
                  <div className={styles.policy_card_body_details}>
                    <p>
                      <strong>Customer Number :</strong> {policy.customerNumber}
                    </p>
                    <p>
                      <strong>Customer Email :</strong> {policy.customerEmail}
                    </p>
                    <p>
                      <strong>Registration Number :</strong>{" "}
                      {policy.registrationNumber}
                    </p>
                    <p>
                      <strong>Product Code :</strong> {policy.productType}
                    </p>
                    <p>
                      <strong>Make :</strong> {policy.make}
                    </p>
                    <p>
                      <strong>Model :</strong> {policy.model}
                    </p>
                    <p>
                      <strong>GVW :</strong> {policy.gvw}
                    </p>
                    <p>
                      <strong>Mode of Payment :</strong> {policy.modeOfPayment}
                    </p>
                    <p>
                      <strong>Policy Starts :</strong> {policy.policyStart}
                    </p>
                    <p>
                      <strong>Policy Ends :</strong> {policy.policyEnd}
                    </p>
                    <p>
                      <strong>Sourced Month :</strong> {policy.sourcedMonth}
                    </p>
                    <p>
                      <strong>Total TP Premium :</strong>{" "}
                      {policy.totalTpPremium}
                    </p>
                    <p>
                      <strong>Net Premium :</strong> {policy.netPremium}
                    </p>
                    <p>
                      <strong>Gross Premium :</strong> {policy.grossPremium}
                    </p>
                    <p>
                      <strong>Booking Code :</strong> {policy.bookingCode}
                    </p>
                    <p>
                      <strong>Sub Booking Code :</strong>{" "}
                      {policy.subBookingCode}
                    </p>
                    <p>
                      <strong>IDV :</strong> {policy.idv}
                    </p>
                    <p>
                      <strong>Username :</strong> {policy.username}
                    </p>
                    <p>
                      <strong>Date :</strong> {policy.date}
                    </p>
                  </div>
                  <div className={styles.policy_card_body_pdf}>
                    <a href={`${backendUrl}${policy.filePath}`}>
                      {" "}
                      Save <i class="fa-solid fa-download"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.no_policy}>
              <i className="fa-solid fa-circle-exclamation"></i>
              <p>No Policy Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPolicy;
