import { suppliersData } from "../../core/json/suppliers-data";
import PrimeDataTable from "../../components/data-table";
import SearchFromApi from "../../components/data-table/search";
import DeleteModal from "../../components/delete-modal";
import CommonSelect from "../../components/select/common-select";
import TableTopHead from "../../components/table-top-head";
import CommonFooter from "../../components/footer/commonFooter";
import { editSupplier } from "../../utils/imagepath";
import { useState } from "react";
import { Link } from "react-router";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const Suppliers = () => {
  const [listData, _setListData] = useState<any[]>(suppliersData);
  console.log('Suppliers listData:', listData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, _setTotalRecords] = useState<any>(5);
  const [rows, setRows] = useState<number>(10);
  const [_searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Party Form Data - Complete Schema
  const [partyData, setPartyData] = useState({
    party_billing_name: "",
    contact_person: "",
    mobile: "",
    other_numbers: "",
    email: "",
    party_address: "",
    party_city: "",
    party_state: "",
    party_default_user_id: "",
    party_default_cp_id: "",
    party_default_arch_id: ""
  });

  // OTP Validation state
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [mobileValidated, setMobileValidated] = useState(false);

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
  const [architects, setArchitects] = useState([
    { id: "arch_001", name: "Rajesh Kumar Sharma" },
    { id: "arch_002", name: "Priya Joshi" },
    { id: "arch_003", name: "Arjun Patel" },
    { id: "arch_004", name: "Neha Gupta" }
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

  const userOptions = [
    { label: "Select User", value: "" },
    ...users.map(user => ({ label: user.name, value: user.id }))
  ];

  const channelPartnerOptions = [
    { label: "Select Channel Partner", value: "" },
    { label: "NA", value: "NA" },
    ...channelPartners.map(cp => ({ label: cp.name, value: cp.id }))
  ];

  const architectOptions = [
    { label: "Select Architect", value: "" },
    { label: "NA", value: "NA" },
    ...architects.map(arch => ({ label: arch.name, value: arch.id }))
  ];

  // Validation Functions
  const validateMobile = (mobile: string) => {
    return /^[0-9]{10}$/.test(mobile);
  };

  const validateEmail = (email: string) => {
    return email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const sendOTP = () => {
    if (validateMobile(partyData.mobile)) {
      setShowOtpInput(true);
      console.log("OTP sent to:", partyData.mobile);
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

  // Dynamic dropdown handlers
  const handleCityChange = (value: string) => {
    if (value === "add-new-city") {
      setShowNewCity(true);
    } else {
      setPartyData({...partyData, party_city: value});
    }
  };

  const handleStateChange = (value: string) => {
    if (value === "add-new-state") {
      setShowNewState(true);
    } else {
      setPartyData({...partyData, party_state: value});
    }
  };

  const addNewCity = () => {
    if (newCity.trim()) {
      setCities([...cities, newCity.trim()]);
      setPartyData({...partyData, party_city: newCity.toLowerCase().replace(/\s+/g, '-')});
      setNewCity("");
      setShowNewCity(false);
    }
  };

  const addNewState = () => {
    if (newState.trim()) {
      setStates([...states, newState.trim()]);
      setPartyData({...partyData, party_state: newState.toLowerCase().replace(/\s+/g, '-')});
      setNewState("");
      setShowNewState(false);
    }
  };

  const countryOptions = [
    { label: "Select", value: "" },
    { label: "United States", value: "united-states" },
    { label: "Canada", value: "canada" },
    { label: "Germany", value: "germany" },
  ];

  const showConfirm = (record: any) => {
    Modal.confirm({
      title: "Are you sure delete this party?",
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
      header: "Party Name",
      field: "partyName",
      key: "partyName",
      body: (data: any) => (
        <div className="d-flex align-items-center">
          <div className="avatar avatar-md bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
            {data.partyName?.charAt(0)?.toUpperCase() || 'P'}
          </div>
          <div className="ms-2">
            <p className="text-gray-9 mb-0">
              <Link to="#">{data.partyName}</Link>
            </p>
          </div>
        </div>
      ),
    },
    { header: "Contact Person", field: "contact", key: "contact" },
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
    { 
      header: "Email", 
      field: "email", 
      key: "email",
      body: (data: any) => {
        console.log('Email data:', data);
        return (
          <span className="text-info">
            <i className="ti ti-mail me-1"></i>
            {data.email || 'N/A'}
          </span>
        );
      }
    },
    { header: "City", field: "city", key: "city" },
    { header: "State", field: "state", key: "state" },
    {
      header: "",
      field: "actions",
      key: "actions",
      sortable: false,
      body: (_row: any) => (
        <div className="edit-delete-action">
          <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#edit-party">
            <i className="feather icon-edit"></i>
          </Link>
          <Link className="confirm-text p-2" to="#" onClick={() => showConfirm(_row)}>
            <i className="feather icon-trash-2"></i>
          </Link>
        </div>
      ),
    },
  ];

  const handleSearch = (value: any) => {
    setSearchQuery(value);
  };

  return (
    <>
      {" "}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Parties</h4>
                <h6>Manage your parties</h6>
              </div>
            </div>
            <TableTopHead />
            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add-party"
              >
                <i className="ti ti-circle-plus me-1" />
                Add Party
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
      {/* Add Party */}
      <div className="modal fade" id="add-party">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Add Party</h4>
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
            <form action="suppliers.html">
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Party Billing Name <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={partyData.party_billing_name}
                        onChange={(e) => setPartyData({...partyData, party_billing_name: e.target.value})}
                        placeholder="Enter party billing name"
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
                        value={partyData.contact_person}
                        onChange={(e) => setPartyData({...partyData, contact_person: e.target.value})}
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
                          value={partyData.mobile}
                          onChange={(e) => setPartyData({...partyData, mobile: e.target.value})}
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          required
                        />
                        <button 
                          type="button" 
                          className="btn btn-outline-primary"
                          onClick={sendOTP}
                          disabled={!validateMobile(partyData.mobile)}
                        >
                          Send OTP
                        </button>
                      </div>
                      {!validateMobile(partyData.mobile) && partyData.mobile && (
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
                      <label className="form-label">Other Numbers</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={partyData.other_numbers}
                        onChange={(e) => setPartyData({...partyData, other_numbers: e.target.value})}
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
                        value={partyData.email}
                        onChange={(e) => setPartyData({...partyData, email: e.target.value})}
                        placeholder="Enter email address (optional)"
                      />
                      {!validateEmail(partyData.email) && partyData.email && (
                        <small className="text-danger">Please enter a valid email address</small>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Party Address <span className="text-danger">*</span>
                      </label>
                      <textarea 
                        className="form-control" 
                        rows={3}
                        value={partyData.party_address}
                        onChange={(e) => setPartyData({...partyData, party_address: e.target.value})}
                        placeholder="Enter complete party address"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Party City <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={cityOptions}
                        value={partyData.party_city}
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
                        Party State <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={stateOptions}
                        value={partyData.party_state}
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
                      <label className="form-label">
                        Default User <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={userOptions}
                        value={partyData.party_default_user_id}
                        onChange={(e) => setPartyData({...partyData, party_default_user_id: e.value})}
                        placeholder="Select Default User"
                        filter={true}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Default Channel Partner <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={channelPartnerOptions}
                        value={partyData.party_default_cp_id}
                        onChange={(e) => setPartyData({...partyData, party_default_cp_id: e.value})}
                        placeholder="Select Channel Partner or NA"
                        filter={true}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Default Architect <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={architectOptions}
                        value={partyData.party_default_arch_id}
                        onChange={(e) => setPartyData({...partyData, party_default_arch_id: e.value})}
                        placeholder="Select Architect or NA"
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
                  Add Party
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Party */}
      {/* Edit Supplier */}
      <div className="modal fade" id="edit-supplier">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Edit Supplier</h4>
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
              <form action="suppliers.html">
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="new-employee-field">
                        <div className="profile-pic-upload edit-pic">
                          <div className="profile-pic">
                            <span>
                              <img
                                src={editSupplier}
                                alt="Img"
                              />
                            </span>
                            <div className="close-img">
                              <i  className="feather icon-x info-img" />
                            </div>
                          </div>
                          <div className="mb-0">
                            <div className="image-upload mb-0">
                              <input type="file" />
                              <div className="image-uploads">
                                <h4>Change Image</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Apex"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Computers"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          defaultValue="carlevans@example.com"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={+15964712634}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="46 Perry Street"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-10 col-10">
                      <div className="mb-3">
                        <label className="form-label">
                          City <span className="text-danger">*</span>
                        </label>
                        <CommonSelect
                          className="w-100"
                          options={cityOptions}
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.value)}
                          placeholder="Select City"
                          filter={false}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-10 col-10">
                      <div className="mb-3">
                        <label className="form-label">
                          State <span className="text-danger">*</span>
                        </label>
                        <CommonSelect
                          className="w-100"
                          options={stateOptions}
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.value)}
                          placeholder="Select State"
                          filter={false}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-10 col-10">
                      <div className="mb-3">
                        <label className="form-label">
                          Country <span className="text-danger">*</span>
                        </label>
                        <CommonSelect
                          className="w-100"
                          options={countryOptions}
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.value)}
                          placeholder="Select Country"
                          filter={false}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Postal Code <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={10176}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-0">
                        <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                          <span className="status-label">Status</span>
                          <input
                            type="checkbox"
                            id="users6"
                            className="check"
                            defaultChecked
                          />
                          <label
                            htmlFor="users6"
                            className="checktoggle mb-0"
                          />
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
      </div>
      {/* /Edit Supplier */}
      <DeleteModal />
    </>
  );
};

export default Suppliers;
