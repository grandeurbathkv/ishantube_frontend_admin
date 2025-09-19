
import { useState } from "react";
import { Link } from "react-router";
import PrimeDataTable from "../../components/data-table";
import TableTopHead from "../../components/table-top-head";
import SearchFromApi from "../../components/data-table/search";
import CommonSelect from "../../components/select/common-select";
import DeleteModal from "../../components/delete-modal";
import { channelPartnerIncentiveData } from "../../core/json/channel-partner-incentive-data";

const ChannelPartnerIncentive = () => {
  const [listData, _setListData] = useState<any[]>(channelPartnerIncentiveData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, _setTotalRecords] = useState<any>(5);
  const [rows, setRows] = useState<number>(10);
  const [_searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  // Form state for Channel Partner Incentive
  const [incentiveData, setIncentiveData] = useState({
    cp_name: "",
    mobile: "",
    email: "",
    image: "",
    cp_address: "",
    brand: "",
    incentive_type: "",
    incentive_factor: ""
  });

  // Validation states
  const [incentiveFactorError, setIncentiveFactorError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileValidated, setMobileValidated] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const handleSearch = (value: any) => {
    setSearchQuery(value);
  };

  const incentiveTypeOptions = [
    { label: "Select Incentive Type", value: "" },
    { label: "Percentage", value: "Percentage" },
    { label: "Fixed Amount", value: "Fixed Amount" },
  ];

  // Validation functions
  const validateMobile = (mobile: string) => {
    if (!mobile) {
      return "Mobile number is required";
    }
    if (!/^\d{10}$/.test(mobile)) {
      return "Mobile number must be exactly 10 digits";
    }
    return "";
  };

  const validateEmail = (email: string) => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Validation function for incentive factor
  const validateIncentiveFactor = (value: string, type: string) => {
    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      return "Please enter a valid number";
    }

    if (type === "Percentage") {
      if (numValue < 0.00 || numValue > 99.99) {
        return "Percentage must be between 0.00 to 99.99";
      }
    } else if (type === "Fixed Amount") {
      if (numValue < 0.00) {
        return "Fixed amount cannot be less than 0.00";
      }
    }

    return "";
  };

  const handleMobileChange = (value: string) => {
    setIncentiveData({ ...incentiveData, mobile: value });
    const error = validateMobile(value);
    setMobileError(error);
  };

  const handleEmailChange = (value: string) => {
    setIncentiveData({ ...incentiveData, email: value });
    const error = validateEmail(value);
    setEmailError(error);
  };

  // OTP Functions
  const sendOTP = () => {
    if (validateMobile(incentiveData.mobile) === "") {
      setShowOtpInput(true);
      // Here you would integrate with your OTP service
      alert("OTP sent to " + incentiveData.mobile);
    }
  };

  const verifyOTP = () => {
    // Here you would verify the OTP with your service
    if (otpValue.length === 6) {
      setMobileValidated(true);
      setShowOtpInput(false);
      alert("Mobile number verified successfully!");
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  const handleIncentiveFactorChange = (value: string) => {
    setIncentiveData({ ...incentiveData, incentive_factor: value });

    if (incentiveData.incentive_type) {
      const error = validateIncentiveFactor(value, incentiveData.incentive_type);
      setIncentiveFactorError(error);
    }
  };

  const handleIncentiveTypeChange = (type: string) => {
    setIncentiveData({ ...incentiveData, incentive_type: type });

    if (incentiveData.incentive_factor) {
      const error = validateIncentiveFactor(incentiveData.incentive_factor, type);
      setIncentiveFactorError(error);
    }
  };

  const showConfirm = (text: any) => {
    // Confirmation logic for delete
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
      header: "CP Name",
      field: "cp_name",
      key: "cp_name",
      body: (data: any) => (
        <div className="d-flex align-items-center">
          <div className="avatar avatar-md bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
            {data.cp_name?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div>
            <Link to="#" className="fw-medium">{data.cp_name}</Link>
          </div>
        </div>
      ),
    },
    {
      header: "Mobile",
      field: "mobile",
      key: "mobile",
      body: (data: any) => (
        <span className="fw-medium">{data.mobile}</span>
      ),
    },
    {
      header: "Email",
      field: "email",
      key: "email",
      body: (data: any) => (
        <span className="text-muted">{data.email || 'N/A'}</span>
      ),
    },
    {
      header: "Address",
      field: "cp_address",
      key: "cp_address",
      body: (data: any) => (
        <span className="text-muted" title={data.cp_address}>
          {data.cp_address?.length > 30 ? `${data.cp_address.substring(0, 30)}...` : data.cp_address}
        </span>
      ),
    },
    {
      header: "Brand",
      field: "brand",
      key: "brand",
      body: (data: any) => (
        <span className="fw-medium">{data.brand}</span>
      ),
    },
    {
      header: "Incentive Type",
      field: "incentive_type",
      key: "incentive_type",
      body: (data: any) => (
        <span
          className={`d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white fs-10 ${data.incentive_type === "Percentage"
              ? "bg-primary"
              : "bg-success"
            }`}
        >
          <i className="ti ti-point-filled me-1 fs-11"></i>
          {data.incentive_type}
        </span>
      ),
    },
    {
      header: "Incentive Factor",
      field: "incentive_factor",
      key: "incentive_factor",
      body: (data: any) => (
        <div>
          <span className="fw-medium">
            {data.incentive_type === "Percentage"
              ? `${data.incentive_factor}%`
              : `₹${parseFloat(data.incentive_factor).toLocaleString()}`
            }
          </span>
          <br />
          <small className="text-muted">{data.incentive_type}</small>
        </div>
      )
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
            <i className="feather icon-eye"></i>
          </Link>
          <Link
            className="me-2 p-2 d-flex align-items-center border rounded"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#edit-incentive"
          >
            <i className="feather icon-edit"></i>
          </Link>
          <Link
            className="p-2 d-flex align-items-center border rounded"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#delete-modal"
          >
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
                <h4>Channel Partner Incentive</h4>
                <h6>Manage Channel Partner Incentives</h6>
              </div>
            </div>
            <TableTopHead />
            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add-incentive"
              >
                <i className="ti ti-circle-plus me-1" />
                Add Incentive
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
                    Incentive Type
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Percentage
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Fixed Amount
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
      </div>

      {/* Add Channel Partner Incentive Modal */}
      <div className="modal fade" id="add-incentive">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Add Channel Partner Incentive</h4>
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
            <form action="#">
              <div className="modal-body">
                {/* Channel Partner Information */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="fw-bold text-primary mb-3">Channel Partner Incentive (Default)</h6>
                  </div>

                  {/* Profile Image Upload */}
                  <div className="col-12 mb-3">
                    <div className="new-employee-field">
                      <div className="profile-pic-upload">
                        <div className="profile-pic">
                          <span>
                            <i className="feather icon-plus-circle plus-down-add" /> Add Image
                          </span>
                        </div>
                        <div className="mb-3">
                          <div className="image-upload mb-0">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setIncentiveData({ ...incentiveData, image: file.name });
                                }
                              }}
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
                      Channel Partner Name<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={incentiveData.cp_name}
                      onChange={(e) => setIncentiveData({ ...incentiveData, cp_name: e.target.value })}
                      placeholder="Enter Channel Partner Name"
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
                        value={incentiveData.mobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setIncentiveData({ ...incentiveData, mobile: value });
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
                        disabled={validateMobile(incentiveData.mobile) !== "" || mobileValidated}
                      >
                        {mobileValidated ? 'Verified' : 'Send OTP'}
                      </button>
                    </div>
                    {mobileValidated && (
                      <small className="text-success">✓ Mobile number verified</small>
                    )}
                  </div>

                  {showOtpInput && (
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">
                        Enter OTP<span className="text-danger ms-1">*</span>
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
                      value={incentiveData.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="Enter email address (optional)"
                    />
                    {emailError && (
                      <div className="text-danger small">
                        {emailError}
                      </div>
                    )}
                  </div>

                  <div className="col-lg-12 mb-3">
                    <label className="form-label">
                      Channel Partner Address<span className="text-danger ms-1">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={incentiveData.cp_address}
                      onChange={(e) => setIncentiveData({ ...incentiveData, cp_address: e.target.value })}
                      placeholder="Enter complete address"
                      required
                    />
                  </div>
                  {/* </div> */}

                  {/* Channel Partner Incentive (Default) */}
                  {/* <div className="row mb-4"> */}
                  {/* <div className="col-12">
                    <h6 className="fw-bold text-primary mb-3">Channel Partner Incentive (Default)</h6>
                  </div> */}

                  <div className="col-lg-6 mb-3">
                    <label className="form-label">
                      Brand<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={incentiveData.brand}
                      onChange={(e) => setIncentiveData({ ...incentiveData, brand: e.target.value })}
                      placeholder="Enter brand name"
                      required
                    />
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Incentive Type <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={incentiveTypeOptions}
                        value={incentiveData.incentive_type}
                        onChange={(e) => handleIncentiveTypeChange(e.value)}
                        placeholder="Select Incentive Type"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Incentive Factor <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        {incentiveData.incentive_type === "Fixed Amount" && (
                          <span className="input-group-text">₹</span>
                        )}
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${incentiveFactorError ? 'is-invalid' : ''}`}
                          value={incentiveData.incentive_factor}
                          onChange={(e) => handleIncentiveFactorChange(e.target.value)}
                          placeholder={
                            incentiveData.incentive_type === "Percentage"
                              ? "Enter percentage (0.00 - 99.99)"
                              : "Enter amount"
                          }
                          required
                        />
                        {incentiveData.incentive_type === "Percentage" && (
                          <span className="input-group-text">%</span>
                        )}
                      </div>
                      {incentiveFactorError && (
                        <div className="invalid-feedback d-block">
                          {incentiveFactorError}
                        </div>
                      )}
                      {incentiveData.incentive_type === "Percentage" && (
                        <small className="text-muted">
                          Percentage should be between 0.00 to 99.99
                        </small>
                      )}
                      {incentiveData.incentive_type === "Fixed Amount" && (
                        <small className="text-muted">
                          Amount should be 0.00 or greater
                        </small>
                      )}
                    </div>
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
                  className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary fs-13 fw-medium p-2 px-3"
                  disabled={
                    !incentiveData.cp_name ||
                    !mobileValidated ||
                    !incentiveData.cp_address ||
                    !incentiveData.brand ||
                    !incentiveData.incentive_type ||
                    !incentiveData.incentive_factor
                  }
                >
                  Add Channel Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Channel Partner Incentive Modal */}

      {/* Edit Channel Partner Incentive Modal */}
      <div className="modal fade" id="edit-incentive">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Edit Channel Partner Incentive</h4>
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
            <form action="#">
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        CP Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={incentiveData.cp_name}
                        onChange={(e) => setIncentiveData({ ...incentiveData, cp_name: e.target.value })}
                        placeholder="Enter Channel Partner Name"
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
                          className={`form-control ${mobileError ? 'is-invalid' : ''}`}
                          value={incentiveData.mobile}
                          onChange={(e) => handleMobileChange(e.target.value)}
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => alert("OTP validation feature will be implemented")}
                        >
                          Verify OTP
                        </button>
                      </div>
                      {mobileError && (
                        <div className="invalid-feedback d-block">
                          {mobileError}
                        </div>
                      )}
                      <small className="text-muted">
                        This mobile will be used for WhatsApp notifications
                      </small>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Email ID
                      </label>
                      <input
                        type="email"
                        className={`form-control ${emailError ? 'is-invalid' : ''}`}
                        value={incentiveData.email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="Enter email address (optional)"
                      />
                      {emailError && (
                        <div className="invalid-feedback d-block">
                          {emailError}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        CP Address <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={incentiveData.cp_address}
                        onChange={(e) => setIncentiveData({ ...incentiveData, cp_address: e.target.value })}
                        placeholder="Enter Channel Partner Address"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Image
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIncentiveData({ ...incentiveData, image: file.name });
                          }
                        }}
                      />
                      <small className="text-muted">Upload Channel Partner image (optional)</small>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Brand <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={incentiveData.brand}
                        onChange={(e) => setIncentiveData({ ...incentiveData, brand: e.target.value })}
                        placeholder="Enter brand name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Incentive Type <span className="text-danger">*</span>
                      </label>
                      <CommonSelect
                        className="w-100"
                        options={incentiveTypeOptions}
                        value={incentiveData.incentive_type}
                        onChange={(e) => handleIncentiveTypeChange(e.value)}
                        placeholder="Select Incentive Type"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Incentive Factor <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        {incentiveData.incentive_type === "Fixed Amount" && (
                          <span className="input-group-text">₹</span>
                        )}
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${incentiveFactorError ? 'is-invalid' : ''}`}
                          value={incentiveData.incentive_factor}
                          onChange={(e) => handleIncentiveFactorChange(e.target.value)}
                          placeholder={
                            incentiveData.incentive_type === "Percentage"
                              ? "Enter percentage (0.00 - 99.99)"
                              : "Enter amount"
                          }
                          required
                        />
                        {incentiveData.incentive_type === "Percentage" && (
                          <span className="input-group-text">%</span>
                        )}
                      </div>
                      {incentiveFactorError && (
                        <div className="invalid-feedback d-block">
                          {incentiveFactorError}
                        </div>
                      )}
                      {incentiveData.incentive_type === "Percentage" && (
                        <small className="text-muted">
                          Percentage should be between 0.00 to 99.99
                        </small>
                      )}
                      {incentiveData.incentive_type === "Fixed Amount" && (
                        <small className="text-muted">
                          Amount should be 0.00 or greater
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-0">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="incentive2"
                          className="check"
                          defaultChecked
                        />
                        <label htmlFor="incentive2" className="checktoggle mb-0" />
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
      {/* /Edit Channel Partner Incentive Modal */}

      <DeleteModal />
    </>
  );
};

export default ChannelPartnerIncentive;
