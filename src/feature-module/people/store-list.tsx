import { siteListData } from "../../core/json/store-list";
import PrimeDataTable from "../../components/data-table";
import SearchFromApi from "../../components/data-table/search";
import DeleteModal from "../../components/delete-modal";
import CommonSelect from "../../components/select/common-select";
import TableTopHead from "../../components/table-top-head";
import CommonFooter from "../../components/footer/commonFooter";
import { useState } from "react";
import { Link } from "react-router";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const StoreList = () => {
  const [listData, _setListData] = useState<any[]>(siteListData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, _setTotalRecords] = useState<any>(5);
  const [rows, setRows] = useState<number>(10);
  const [_searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  // Site Form Data - Complete Schema
  const [siteData, setSiteData] = useState({
    site_billing_name: "",
    contact_person: "",
    mobile: "",
    site_supervisor_name: "",
    site_supervisor_number: "",
    other_numbers: "",
    email: "",
    site_address: "",
    site_city: "",
    site_state: "",
    site_party_id: "",
    site_user_id: "",
    site_cp_id: ""
  });

  // OTP Validation state
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [mobileValidated, setMobileValidated] = useState(false);
  const [showSupervisorOtpInput, setShowSupervisorOtpInput] = useState(false);
  const [supervisorOtpValue, setSupervisorOtpValue] = useState("");
  const [supervisorMobileValidated, setSupervisorMobileValidated] = useState(false);

  // Dynamic dropdown management
  const [newCity, setNewCity] = useState("");
  const [showNewCity, setShowNewCity] = useState(false);
  const [newState, setNewState] = useState("");
  const [showNewState, setShowNewState] = useState(false);

  // Dynamic data arrays (would come from database in real app)
  const [cities, setCities] = useState([
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
  ]);
  const [states, setStates] = useState([
    "Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "West Bengal", "Gujarat", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh"
  ]);
  const [parties, setParties] = useState([
    { id: "party_001", name: "Delhi Traders" },
    { id: "party_002", name: "Mumbai Suppliers" },
    { id: "party_003", name: "Bangalore Electronics" },
    { id: "party_004", name: "Chennai Materials" }
  ]);
  const [users, setUsers] = useState([
    { id: "user_001", name: "Admin User" },
    { id: "user_002", name: "Manager User" },
    { id: "user_003", name: "Sales User" },
    { id: "user_004", name: "Regional Manager" }
  ]);
  const [channelPartners, setChannelPartners] = useState([
    { id: "cp_001", name: "NorthStar Distributors" },
    { id: "cp_002", name: "Eastern Electronics" },
    { id: "cp_003", name: "Metro Wholesale" },
    { id: "cp_004", name: "Prime Traders" }
  ]);

  const cityOptions = [
    { label: "Select City", value: "" },
    ...cities.map(city => ({ label: city, value: city.toLowerCase().replace(/\s+/g, '-') })),
    { label: "Add New City", value: "add-new-city" }
  ];

  const stateOptions = [
    { label: "Select State", value: "" },
    ...states.map(state => ({ label: state, value: state.toLowerCase().replace(/\s+/g, '-') })),
    { label: "Add New State", value: "add-new-state" }
  ];

  const partyOptions = [
    { label: "Select Party", value: "" },
    ...parties.map(party => ({ label: party.name, value: party.id }))
  ];

  const userOptions = [
    { label: "Select User", value: "" },
    ...users.map(user => ({ label: user.name, value: user.id }))
  ];

  const channelPartnerOptions = [
    { label: "Select Channel Partner", value: "" },
    { label: "NA", value: "NA" },
    ...channelPartners.map(cp => ({ label: cp.name, value: cp.id }))
  ];

  // Validation Functions
  const validateMobile = (mobile: string) => {
    return /^[0-9]{10}$/.test(mobile);
  };

  const validateEmail = (email: string) => {
    return email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const sendOTP = () => {
    if (validateMobile(siteData.mobile)) {
      setShowOtpInput(true);
      console.log("OTP sent to:", siteData.mobile);
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const verifyOTP = () => {
    if (otpValue.length === 6) {
      setMobileValidated(true);
      setShowOtpInput(false);
      console.log("OTP verified");
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  const sendSupervisorOTP = () => {
    if (validateMobile(siteData.site_supervisor_number)) {
      setShowSupervisorOtpInput(true);
      console.log("OTP sent to supervisor:", siteData.site_supervisor_number);
    } else {
      alert("Please enter a valid 10-digit supervisor mobile number");
    }
  };

  const verifySupervisorOTP = () => {
    if (supervisorOtpValue.length === 6) {
      setSupervisorMobileValidated(true);
      setShowSupervisorOtpInput(false);
      console.log("Supervisor OTP verified");
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  // Dynamic dropdown handlers
  const handleCityChange = (value: string) => {
    if (value === "add-new-city") {
      setShowNewCity(true);
    } else {
      setSiteData({...siteData, site_city: value});
    }
  };

  const handleStateChange = (value: string) => {
    if (value === "add-new-state") {
      setShowNewState(true);
    } else {
      setSiteData({...siteData, site_state: value});
    }
  };

  const addNewCity = () => {
    if (newCity.trim()) {
      setCities([...cities, newCity.trim()]);
      setSiteData({...siteData, site_city: newCity.toLowerCase().replace(/\s+/g, '-')});
      setNewCity("");
      setShowNewCity(false);
    }
  };

  const addNewState = () => {
    if (newState.trim()) {
      setStates([...states, newState.trim()]);
      setSiteData({...siteData, site_state: newState.toLowerCase().replace(/\s+/g, '-')});
      setNewState("");
      setShowNewState(false);
    }
  };

  const showConfirm = (record: any) => {
    Modal.confirm({
      title: "Are you sure delete this site?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };


  const handleSearch = (value: any) => {
    setSearchQuery(value);
  };
  const columns = [
    {
      header: (
        <label className="checkboxs">
          <input type="checkbox" id="select-all" />
          <span className="checkmarks" />
        </label>
      ),
      body: () => (
        <label className="checkboxs">
          <input type="checkbox" />
          <span className="checkmarks" />
        </label>
      ),
      sortable: false,
      key: "checked",
    },
    { 
      header: "Site Name", 
      field: "site_billing_name", 
      key: "site_billing_name",
      body: (data: any) => (
        <div className="d-flex align-items-center">
          <div className="avatar avatar-md bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
            {data.site_billing_name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div className="ms-2">
            <p className="text-gray-9 mb-0">
              <Link to="#">{data.site_billing_name}</Link>
            </p>
          </div>
        </div>
      )
    },
    { header: "Contact Person", field: "contact_person", key: "contact_person" },
    { 
      header: "Mobile", 
      field: "mobile", 
      key: "mobile",
      body: (data: any) => (
        <span className="text-success">
          <i className="ti ti-phone me-1"></i>
          {data.mobile}
        </span>
      )
    },
    { header: "Supervisor", field: "site_supervisor_name", key: "site_supervisor_name" },
    { header: "City", field: "site_city", key: "site_city" },
    { header: "State", field: "site_state", key: "site_state" },
    { header: "Party", field: "site_party_id", key: "site_party_id" },
    {
      header: "",
      field: "actions",
      key: "actions",
      sortable: false,
      body: (_row: any) => (
        <div className="edit-delete-action">
          <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#edit-store">
            <i className="feather icon-edit"></i>
          </Link>
          <Link className="confirm-text p-2" to="#" onClick={() => showConfirm(_row)}>
            <i className="feather icon-trash-2"></i>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Sites</h4>
                <h6>Manage your Sites</h6>
              </div>
            </div>
            <TableTopHead />
            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add-site"
              >
                <i className="ti ti-circle-plus me-1" />
                Add Site
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <SearchFromApi
                callback={handleSearch}
                rows={rows}
                setRows={setRows}
              />
              <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    Status
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Active
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Inactive
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <PrimeDataTable
                  column={columns}
                  data={listData}
                  rows={rows}
                  setRows={setRows}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalRecords={totalRecords}
                />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
        <CommonFooter />
      </div>
      {/* Add Site */}
      <div className="modal fade" id="add-site">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Add Site</h4>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form action="store-list.html">
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Site Billing Name <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={siteData.site_billing_name}
                        onChange={(e) => setSiteData({...siteData, site_billing_name: e.target.value})}
                        placeholder="Enter site billing name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Contact Person <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={siteData.contact_person}
                        onChange={(e) => setSiteData({...siteData, contact_person: e.target.value})}
                        placeholder="Enter contact person name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Mobile Number <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          value={siteData.mobile}
                          onChange={(e) => setSiteData({...siteData, mobile: e.target.value})}
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          required
                        />
                        <button 
                          type="button" 
                          className="btn btn-outline-primary"
                          onClick={sendOTP}
                          disabled={!validateMobile(siteData.mobile)}
                        >
                          Send OTP
                        </button>
                      </div>
                      {!validateMobile(siteData.mobile) && siteData.mobile && (
                        <small className="text-danger">Mobile number must be exactly 10 digits</small>
                      )}
                      {showOtpInput && (
                        <div className="mt-2">
                          <div className="input-group">
                            <input 
                              type="text" 
                              className="form-control" 
                              value={otpValue}
                              onChange={(e) => setOtpValue(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                            />
                            <button 
                              type="button" 
                              className="btn btn-success"
                              onClick={verifyOTP}
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      )}
                      {mobileValidated && (
                        <small className="text-success">✓ Mobile number verified</small>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Site Supervisor Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={siteData.site_supervisor_name}
                        onChange={(e) => setSiteData({...siteData, site_supervisor_name: e.target.value})}
                        placeholder="Enter supervisor name (optional)"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Site Supervisor Number</label>
                      <div className="input-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          value={siteData.site_supervisor_number}
                          onChange={(e) => setSiteData({...siteData, site_supervisor_number: e.target.value})}
                          placeholder="Enter supervisor mobile (optional)"
                          maxLength={10}
                        />
                        {siteData.site_supervisor_number && (
                          <button 
                            type="button" 
                            className="btn btn-outline-primary"
                            onClick={sendSupervisorOTP}
                            disabled={!validateMobile(siteData.site_supervisor_number)}
                          >
                            Send OTP
                          </button>
                        )}
                      </div>
                      {siteData.site_supervisor_number && !validateMobile(siteData.site_supervisor_number) && (
                        <small className="text-danger">Mobile number must be exactly 10 digits</small>
                      )}
                      {showSupervisorOtpInput && (
                        <div className="mt-2">
                          <div className="input-group">
                            <input 
                              type="text" 
                              className="form-control" 
                              value={supervisorOtpValue}
                              onChange={(e) => setSupervisorOtpValue(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                            />
                            <button 
                              type="button" 
                              className="btn btn-success"
                              onClick={verifySupervisorOTP}
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      )}
                      {supervisorMobileValidated && (
                        <small className="text-success">✓ Supervisor mobile verified</small>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Other Numbers</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={siteData.other_numbers}
                        onChange={(e) => setSiteData({...siteData, other_numbers: e.target.value})}
                        placeholder="Enter other contact numbers (optional)"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Email ID</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={siteData.email}
                        onChange={(e) => setSiteData({...siteData, email: e.target.value})}
                        placeholder="Enter email address (optional)"
                      />
                      {!validateEmail(siteData.email) && siteData.email && (
                        <small className="text-danger">Please enter a valid email address</small>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Site Address <span className="text-danger">*</span>
                      </label>
                      <textarea 
                        className="form-control" 
                        rows={3}
                        value={siteData.site_address}
                        onChange={(e) => setSiteData({...siteData, site_address: e.target.value})}
                        placeholder="Enter complete site address"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Site City <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={cityOptions}
                        value={siteData.site_city}
                        onChange={(e) => handleCityChange(e.value)}
                        placeholder="Select City"
                        filter={true}
                      />
                      {showNewCity && (
                        <div className="mt-2">
                          <div className="input-group">
                            <input 
                              type="text"
                              className="form-control"
                              value={newCity}
                              onChange={(e) => setNewCity(e.target.value)}
                              placeholder="Enter new city name"
                            />
                            <button 
                              type="button"
                              className="btn btn-primary"
                              onClick={addNewCity}
                            >
                              Add
                            </button>
                            <button 
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowNewCity(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Site State <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={stateOptions}
                        value={siteData.site_state}
                        onChange={(e) => handleStateChange(e.value)}
                        placeholder="Select State"
                        filter={true}
                      />
                      {showNewState && (
                        <div className="mt-2">
                          <div className="input-group">
                            <input 
                              type="text"
                              className="form-control"
                              value={newState}
                              onChange={(e) => setNewState(e.target.value)}
                              placeholder="Enter new state name"
                            />
                            <button 
                              type="button"
                              className="btn btn-primary"
                              onClick={addNewState}
                            >
                              Add
                            </button>
                            <button 
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowNewState(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Site GST Number</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={siteData.site_gstno}
                        onChange={(e) => setSiteData({...siteData, site_gstno: e.target.value})}
                        placeholder="Enter 15-character GST number (optional)"
                        maxLength={15}
                      />
                      {siteData.site_gstno && !validateGST(siteData.site_gstno) && (
                        <small className="text-danger">GST number must be exactly 15 characters</small>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Party <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={partyOptions}
                        value={siteData.site_party_id}
                        onChange={(e) => setSiteData({...siteData, site_party_id: e.value})}
                        placeholder="Select Party to whom site belongs"
                        filter={true}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Default User <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={userOptions}
                        value={siteData.site_user_id}
                        onChange={(e) => setSiteData({...siteData, site_user_id: e.value})}
                        placeholder="Select Default User"
                        filter={true}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Channel Partner <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={channelPartnerOptions}
                        value={siteData.site_cp_id}
                        onChange={(e) => setSiteData({...siteData, site_cp_id: e.value})}
                        placeholder="Select Channel Partner or NA"
                        filter={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-0">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="users5"
                          className="check"
                          defaultChecked
                        />
                        <label htmlFor="users5" className="checktoggle mb-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn me-2 btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Site
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Store */}
      {/* Edit Store */}
      <div className="modal fade" id="edit-store">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Edit Site</h4>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form action="store-list.html">
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Site Billing Name <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={siteData.site_billing_name}
                        onChange={(e) => setSiteData({...siteData, site_billing_name: e.target.value})}
                        placeholder="Enter site billing name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Contact Person <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={siteData.contact_person}
                        onChange={(e) => setSiteData({...siteData, contact_person: e.target.value})}
                        placeholder="Enter contact person name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Mobile Number <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          value={siteData.mobile}
                          onChange={(e) => setSiteData({...siteData, mobile: e.target.value})}
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          required
                        />
                        <button 
                          type="button" 
                          className="btn btn-outline-primary"
                          onClick={sendOTP}
                          disabled={!validateMobile(siteData.mobile)}
                        >
                          Send OTP
                        </button>
                      </div>
                      {!validateMobile(siteData.mobile) && siteData.mobile && (
                        <small className="text-danger">Mobile number must be exactly 10 digits</small>
                      )}
                      {showOtpInput && (
                        <div className="mt-2">
                          <div className="input-group">
                            <input 
                              type="text" 
                              className="form-control" 
                              value={otpValue}
                              onChange={(e) => setOtpValue(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                            />
                            <button 
                              type="button" 
                              className="btn btn-success"
                              onClick={verifyOTP}
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      )}
                      {mobileValidated && (
                        <small className="text-success">✓ Mobile number verified</small>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Site Supervisor Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={siteData.site_supervisor_name}
                        onChange={(e) => setSiteData({...siteData, site_supervisor_name: e.target.value})}
                        placeholder="Enter supervisor name (optional)"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Site Supervisor Number</label>
                      <div className="input-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          value={siteData.site_supervisor_number}
                          onChange={(e) => setSiteData({...siteData, site_supervisor_number: e.target.value})}
                          placeholder="Enter supervisor mobile (optional)"
                          maxLength={10}
                        />
                        {siteData.site_supervisor_number && (
                          <button 
                            type="button" 
                            className="btn btn-outline-primary"
                            onClick={sendSupervisorOTP}
                            disabled={!validateMobile(siteData.site_supervisor_number)}
                          >
                            Send OTP
                          </button>
                        )}
                      </div>
                      {siteData.site_supervisor_number && !validateMobile(siteData.site_supervisor_number) && (
                        <small className="text-danger">Mobile number must be exactly 10 digits</small>
                      )}
                      {showSupervisorOtpInput && (
                        <div className="mt-2">
                          <div className="input-group">
                            <input 
                              type="text" 
                              className="form-control" 
                              value={supervisorOtpValue}
                              onChange={(e) => setSupervisorOtpValue(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                            />
                            <button 
                              type="button" 
                              className="btn btn-success"
                              onClick={verifySupervisorOTP}
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      )}
                      {supervisorMobileValidated && (
                        <small className="text-success">✓ Supervisor mobile verified</small>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Other Numbers</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={siteData.other_numbers}
                        onChange={(e) => setSiteData({...siteData, other_numbers: e.target.value})}
                        placeholder="Enter other contact numbers (optional)"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Email ID</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={siteData.email}
                        onChange={(e) => setSiteData({...siteData, email: e.target.value})}
                        placeholder="Enter email address (optional)"
                      />
                      {!validateEmail(siteData.email) && siteData.email && (
                        <small className="text-danger">Please enter a valid email address</small>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Site Address <span className="text-danger">*</span>
                      </label>
                      <textarea 
                        className="form-control" 
                        rows={3}
                        value={siteData.site_address}
                        onChange={(e) => setSiteData({...siteData, site_address: e.target.value})}
                        placeholder="Enter complete site address"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Site City <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={cityOptions}
                        value={siteData.site_city}
                        onChange={(e) => handleCityChange(e.value)}
                        placeholder="Select City"
                        filter={true}
                      />
                      {showNewCity && (
                        <div className="mt-2">
                          <div className="input-group">
                            <input 
                              type="text"
                              className="form-control"
                              value={newCity}
                              onChange={(e) => setNewCity(e.target.value)}
                              placeholder="Enter new city name"
                            />
                            <button 
                              type="button"
                              className="btn btn-primary"
                              onClick={addNewCity}
                            >
                              Add
                            </button>
                            <button 
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowNewCity(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Site State <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={stateOptions}
                        value={siteData.site_state}
                        onChange={(e) => handleStateChange(e.value)}
                        placeholder="Select State"
                        filter={true}
                      />
                      {showNewState && (
                        <div className="mt-2">
                          <div className="input-group">
                            <input 
                              type="text"
                              className="form-control"
                              value={newState}
                              onChange={(e) => setNewState(e.target.value)}
                              placeholder="Enter new state name"
                            />
                            <button 
                              type="button"
                              className="btn btn-primary"
                              onClick={addNewState}
                            >
                              Add
                            </button>
                            <button 
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowNewState(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Site GST Number</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={siteData.site_gstno}
                        onChange={(e) => setSiteData({...siteData, site_gstno: e.target.value})}
                        placeholder="Enter 15-character GST number (optional)"
                        maxLength={15}
                      />
                      {siteData.site_gstno && !validateGST(siteData.site_gstno) && (
                        <small className="text-danger">GST number must be exactly 15 characters</small>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Party <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={partyOptions}
                        value={siteData.site_party_id}
                        onChange={(e) => setSiteData({...siteData, site_party_id: e.value})}
                        placeholder="Select Party to whom site belongs"
                        filter={true}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Default User <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={userOptions}
                        value={siteData.site_user_id}
                        onChange={(e) => setSiteData({...siteData, site_user_id: e.value})}
                        placeholder="Select Default User"
                        filter={true}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Channel Partner <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={channelPartnerOptions}
                        value={siteData.site_cp_id}
                        onChange={(e) => setSiteData({...siteData, site_cp_id: e.value})}
                        placeholder="Select Channel Partner or NA"
                        filter={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-0">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="user1"
                          className="check"
                          defaultChecked
                        />
                        <label htmlFor="user1" className="checktoggle mb-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn me-2 btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Store */}
     <DeleteModal />
    </>
  );
};

export default StoreList;
