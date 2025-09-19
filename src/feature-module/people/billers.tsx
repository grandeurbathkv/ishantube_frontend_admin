import { billersData } from "../../core/json/billers-data";
import PrimeDataTable from "../../components/data-table";
import SearchFromApi from "../../components/data-table/search";
import DeleteModal from "../../components/delete-modal";
import CommonSelect from "../../components/select/common-select";
import TableTopHead from "../../components/table-top-head";
import { user46 } from "../../utils/imagepath";
import { useState } from "react";
import { Link } from "react-router";

const Biller = () => {
  const [listData, _setListData] = useState<any[]>(billersData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, _setTotalRecords] = useState<any>(5);
  const [rows, setRows] = useState<number>(10);
  const [_searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Architect Form Data
  const [architectData, setArchitectData] = useState({
    arch_name: "",
    mobile: "",
    email: "",
    arch_type: "",
    arch_category: "",
    image: null as File | null,
    arch_address: "",
    arch_city: "",
    arch_state: ""
  });

  // OTP Validation state (optional)
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [mobileValidated, setMobileValidated] = useState(false);

  // Dynamic dropdown management
  const [newArchType, setNewArchType] = useState("");
  const [showNewArchType, setShowNewArchType] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [showNewCity, setShowNewCity] = useState(false);
  const [newState, setNewState] = useState("");
  const [showNewState, setShowNewState] = useState(false);

  // Dynamic data arrays (would come from database in real app)
  const [archTypes, setArchTypes] = useState([
    "Residential Architect",
    "Commercial Architect", 
    "Landscape Architect",
    "Interior Architect"
  ]);
  const [cities, setCities] = useState([
    "Los Angeles", "New York City", "Houston", "Phoenix", "Philadelphia"
  ]);
  const [states, setStates] = useState([
    "California", "New York", "Texas", "Arizona", "Pennsylvania"
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

  const countryOptions = [
    { label: "Select", value: "" },
    { label: "United States", value: "united-states" },
    { label: "Canada", value: "canada" },
    { label: "Germany", value: "germany" },
  ];

  const archTypeOptions = [
    { label: "Select Architect Type", value: "" },
    ...archTypes.map(type => ({ label: type, value: type.toLowerCase().replace(/\s+/g, '-') })),
    { label: "Add New Type", value: "add-new-type" }
  ];

  const archCategoryOptions = [
    { label: "Select Category", value: "" },
    { label: "Category A", value: "A" },
    { label: "Category B", value: "B" },
    { label: "Category C", value: "C" },
    { label: "Category D", value: "D" }
  ];

  // Validation Functions
  const validateMobile = (mobile: string) => {
    return /^[0-9]{10}$/.test(mobile);
  };

  const sendOTP = () => {
    if (validateMobile(architectData.mobile)) {
      setShowOtpInput(true);
      console.log("OTP sent to:", architectData.mobile);
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
  const handleArchTypeChange = (value: string) => {
    if (value === "add-new-type") {
      setShowNewArchType(true);
    } else {
      setArchitectData({...architectData, arch_type: value});
    }
  };

  const handleCityChange = (value: string) => {
    if (value === "add-new-city") {
      setShowNewCity(true);
    } else {
      setArchitectData({...architectData, arch_city: value});
    }
  };

  const handleStateChange = (value: string) => {
    if (value === "add-new-state") {
      setShowNewState(true);
    } else {
      setArchitectData({...architectData, arch_state: value});
    }
  };

  const addNewArchType = () => {
    if (newArchType.trim()) {
      setArchTypes([...archTypes, newArchType.trim()]);
      setArchitectData({...architectData, arch_type: newArchType.toLowerCase().replace(/\s+/g, '-')});
      setNewArchType("");
      setShowNewArchType(false);
    }
  };

  const addNewCity = () => {
    if (newCity.trim()) {
      setCities([...cities, newCity.trim()]);
      setArchitectData({...architectData, arch_city: newCity.toLowerCase().replace(/\s+/g, '-')});
      setNewCity("");
      setShowNewCity(false);
    }
  };

  const addNewState = () => {
    if (newState.trim()) {
      setStates([...states, newState.trim()]);
      setArchitectData({...architectData, arch_state: newState.toLowerCase().replace(/\s+/g, '-')});
      setNewState("");
      setShowNewState(false);
    }
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
      header: "Architect",
      field: "arch_name",
      key: "arch_name",
      body: (data: any) => (
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md me-2">
            <img src={data.avatar || "/default-avatar.png"} alt="architect" />
          </Link>
          <div>
            <Link 
              to="#" 
              className={`fw-medium ${data.status === "Active" ? "text-success" : "text-danger"}`}
            >
              {data.arch_name}
            </Link>
            <br />
            <small className="text-muted">{data.arch_type}</small>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      field: "arch_category",
      key: "arch_category",
      body: (data: any) => (
        <span className={`badge bg-primary text-white px-2 py-1`}>
          Category {data.arch_category}
        </span>
      ),
    },
    { 
      header: "Mobile", 
      field: "mobile", 
      key: "mobile",
      body: (data: any) => (
        <div>
          <div>{data.mobile}</div>
          {data.mobileVerified && <small className="text-success">✓ Verified</small>}
        </div>
      ),
    },
    { header: "Email", field: "email", key: "email" },
    {
      header: "Location",
      field: "location",
      key: "location",
      body: (data: any) => (
        <div>
          <div className="fw-medium">{data.arch_city}</div>
          <small className="text-muted">{data.arch_state}</small>
        </div>
      ),
    },
    {
      header: "",
      field: "actions",
      key: "actions",
      sortable: false,
      body: (_row: any) => (
        <div className="edit-delete-action d-flex align-items-center">
          <Link
            className="me-2 p-2 d-flex align-items-center border rounded"
            to="#"
          >
            <i  className="feather icon-eye"></i>
          </Link>
          <Link
            className="me-2 p-2 d-flex align-items-center border rounded"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#edit-biller"
          >
            <i className="feather icon-edit"></i>
          </Link>
          <Link
            data-bs-toggle="modal"
            data-bs-target="#delete-modal"
            className="p-2 d-flex align-items-center border rounded"
            to="#"
          >
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
                <h4 className="fw-bold">Architects</h4>
                <h6>Manage your architects</h6>
              </div>
            </div>
            <TableTopHead />
            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-primary text-white"
                data-bs-toggle="modal"
                data-bs-target="#add-biller"
              >
                <i className="ti ti-circle-plus me-1" />
                Add Architect
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
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0 text-gray-9">
            2014 - 2025 © DreamsPOS. All Right Reserved
          </p>
          <p>
            Designed &amp; Developed by{" "}
            <Link to="#" className="text-primary">
              Dreams
            </Link>
          </p>
        </div>
      </div>
      {/* Add Architect */}
      <div className="modal fade" id="add-biller">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header">
                  <div className="page-title">
                    <h4>Add Architect</h4>
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
                <form action="billers.html.html">
                  <div className="modal-body">
                    {/* Architect Information */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <h6 className="fw-bold text-primary mb-3">Architect Information</h6>
                      </div>

                      {/* Image Upload */}
                      <div className="col-12 mb-3">
                        <div className="new-employee-field">
                          <div className="profile-pic-upload">
                            <div className="profile-pic">
                              <span>
                                <i className="feather icon-plus-circle plus-down-add" />{" "}
                                Add Image
                              </span>
                            </div>
                            <div className="mb-3">
                              <div className="image-upload mb-0">
                                <input 
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setArchitectData({
                                    ...architectData, 
                                    image: e.target.files?.[0] || null
                                  })}
                                />
                                <div className="image-uploads">
                                  <h4>Upload Image</h4>
                                </div>
                              </div>
                              <p className="mt-2">JPEG, PNG up to 2 MB (Optional)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Architect Name<span className="text-danger ms-1">*</span>
                        </label>
                        <input 
                          type="text" 
                          className="form-control"
                          value={architectData.arch_name}
                          onChange={(e) => setArchitectData({
                            ...architectData, 
                            arch_name: e.target.value
                          })}
                          placeholder="Enter Architect Name"
                          required
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Mobile Number (WhatsApp)<span className="text-danger ms-1">*</span>
                        </label>
                        <div className="input-group">
                          <input 
                            type="tel" 
                            className={`form-control ${mobileValidated ? 'border-success' : ''}`}
                            value={architectData.mobile}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setArchitectData({
                                ...architectData, 
                                mobile: value
                              });
                              setMobileValidated(false);
                            }}
                            placeholder="Enter 10-digit mobile number"
                            maxLength={10}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={sendOTP}
                            disabled={!validateMobile(architectData.mobile) || mobileValidated}
                          >
                            {mobileValidated ? 'Verified' : 'Send OTP (Optional)'}
                          </button>
                        </div>
                        {mobileValidated && (
                          <small className="text-success">✓ Mobile number verified</small>
                        )}
                      </div>

                      {showOtpInput && (
                        <div className="col-lg-6 mb-3">
                          <label className="form-label">
                            Enter OTP
                          </label>
                          <div className="input-group">
                            <input 
                              type="text" 
                              className="form-control"
                              value={otpValue}
                              onChange={(e) => setOtpValue(e.target.value.slice(0, 6))}
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                            />
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={verifyOTP}
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Email ID
                        </label>
                        <input 
                          type="email" 
                          className="form-control"
                          value={architectData.email}
                          onChange={(e) => setArchitectData({
                            ...architectData, 
                            email: e.target.value
                          })}
                          placeholder="Enter email address (optional)"
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Architect Type<span className="text-danger ms-1">*</span>
                        </label>
                        {showNewArchType ? (
                          <div className="input-group">
                            <input 
                              type="text" 
                              className="form-control"
                              value={newArchType}
                              onChange={(e) => setNewArchType(e.target.value)}
                              placeholder="Enter new architect type"
                            />
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={addNewArchType}
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowNewArchType(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <CommonSelect
                            className="w-100"
                            options={archTypeOptions}
                            value={architectData.arch_type}
                            onChange={(e) => handleArchTypeChange(e.value)}
                            placeholder="Select Architect Type"
                            filter={false}
                          />
                        )}
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Architect Category<span className="text-danger ms-1">*</span>
                        </label>
                        <CommonSelect
                          className="w-100"
                          options={archCategoryOptions}
                          value={architectData.arch_category}
                          onChange={(e) => setArchitectData({
                            ...architectData, 
                            arch_category: e.value
                          })}
                          placeholder="Select Category"
                          filter={false}
                        />
                      </div>

                      <div className="col-lg-12 mb-3">
                        <label className="form-label">
                          Architect Address<span className="text-danger ms-1">*</span>
                        </label>
                        <textarea 
                          className="form-control"
                          rows={3}
                          value={architectData.arch_address}
                          onChange={(e) => setArchitectData({
                            ...architectData, 
                            arch_address: e.target.value
                          })}
                          placeholder="Enter complete address"
                          required
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          City<span className="text-danger ms-1">*</span>
                        </label>
                        {showNewCity ? (
                          <div className="input-group">
                            <input 
                              type="text" 
                              className="form-control"
                              value={newCity}
                              onChange={(e) => setNewCity(e.target.value)}
                              placeholder="Enter new city"
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
                        ) : (
                          <CommonSelect
                            className="w-100"
                            options={cityOptions}
                            value={architectData.arch_city}
                            onChange={(e) => handleCityChange(e.value)}
                            placeholder="Select City"
                            filter={false}
                          />
                        )}
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          State<span className="text-danger ms-1">*</span>
                        </label>
                        {showNewState ? (
                          <div className="input-group">
                            <input 
                              type="text" 
                              className="form-control"
                              value={newState}
                              onChange={(e) => setNewState(e.target.value)}
                              placeholder="Enter new state"
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
                        ) : (
                          <CommonSelect
                            className="w-100"
                            options={stateOptions}
                            value={architectData.arch_state}
                            onChange={(e) => handleStateChange(e.value)}
                            placeholder="Select State"
                            filter={false}
                          />
                        )}
                      </div>

                      <div className="col-lg-12">
                        <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                          <span className="status-label">Status</span>
                          <input
                            type="checkbox"
                            id="user1"
                            className="check"
                            defaultChecked
                          />
                          <label htmlFor="user1" className="checktoggle">
                            {" "}
                          </label>
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
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={
                        !architectData.arch_name || 
                        !validateMobile(architectData.mobile) ||
                        !architectData.arch_type ||
                        !architectData.arch_category ||
                        !architectData.arch_address ||
                        !architectData.arch_city ||
                        !architectData.arch_state
                      }
                    >
                      Add Architect
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add biller */}
      {/* Edit biller */}
      <div className="modal fade" id="edit-biller">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Edit Biller</h4>
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
            <form action="billers.html">
              <div className="modal-body">
                <div className="new-employee-field">
                  <div className="profile-pic-upload image-field">
                    <div className="profile-pic p-2">
                      <img
                        src={user46}
                        className="object-fit-cover h-100 rounded-1"
                        alt="user"
                      />
                      <button type="button" className="close rounded-1">
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                    <div className="mb-3">
                      <div className="image-upload mb-0">
                        <input type="file" />
                        <div className="image-uploads">
                          <h4>Change Image</h4>
                        </div>
                      </div>
                      <p className="mt-2">JPEG, PNG up to 2 MB</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">
                      First Name<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Shaun"
                    />
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">
                      Last Name<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Farley"
                    />
                  </div>
                  <div className="col-lg-12 mb-3">
                    <label className="form-label">
                      Company Name<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="GreenTech Industries"
                    />
                  </div>
                  <div className="col-lg-12 mb-3">
                    <label className="form-label">
                      Email<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      defaultValue="shaun@example.com"
                    />
                  </div>
                  <div className="col-lg-12 mb-3">
                    <label className="form-label">
                      Phone<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      defaultValue={+18647961254}
                    />
                  </div>
                  <div className="col-lg-12 mb-3">
                    <label className="form-label">
                      Address<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="87 Griffin Street"
                    />
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">
                      City<span className="text-danger ms-1">*</span>
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
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">
                      State<span className="text-danger ms-1">*</span>
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
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">
                      Country<span className="text-danger ms-1">*</span>
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
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">
                      Postal Code<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={90001}
                    />
                  </div>
                  <div className="col-lg-12">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="user2"
                        className="check"
                        defaultChecked
                      />
                      <label htmlFor="user2" className="checktoggle">
                        {" "}
                      </label>
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
      {/* /Edit biller */}
      <DeleteModal />
    </>
  );
};

export default Biller;
