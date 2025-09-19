import { customersData } from "../../core/json/customers-data";
import PrimeDataTable from "../../components/data-table";
import SearchFromApi from "../../components/data-table/search";
import DeleteModal from "../../components/delete-modal";
import CommonSelect from "../../components/select/common-select";
import TableTopHead from "../../components/table-top-head";
import { user41 } from "../../utils/imagepath";
import { useState } from "react";
import { Link } from "react-router";

const Customers = () => {
  const [listData, _setListData] = useState<any[]>(customersData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, _setTotalRecords] = useState<any>(5);
  const [rows, setRows] = useState<number>(10);
  const [_searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Channel Partner Form Data
  const [channelPartnerData, setChannelPartnerData] = useState({
    CP_Name: "",
    mobile: "",
    email: "",
    image: null as File | null,
    CP_Address: ""
  });

  // Validation state
  const [mobileValidated, setMobileValidated] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");

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
      header: "Channel Partner",
      field: "CP_Name",
      key: "CP_Name",
      body: (data: any) => (
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md me-2">
            <img src={data.avatar || "/default-avatar.png"} alt="partner" />
          </Link>
          <div>
            <Link to="#" className="fw-medium">{data.CP_Name}</Link>
            <br />
            <small className="text-muted">{data.partnerType}</small>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Person",
      field: "contactPerson",
      key: "contactPerson",
      body: (data: any) => (
        <div>
          <div className="fw-medium">{data.contactPerson?.firstName} {data.contactPerson?.lastName}</div>
          <small className="text-muted">{data.contactPerson?.designation}</small>
        </div>
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
      header: "Address",
      field: "CP_Address",
      key: "CP_Address",
      body: (data: any) => (
        <span className="text-muted" title={data.CP_Address}>
          {data.CP_Address?.length > 30 ? `${data.CP_Address.substring(0, 30)}...` : data.CP_Address}
        </span>
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
            <i className="feather icon-eye"></i>
          </Link>
          <Link
            className="me-2 p-2 d-flex align-items-center border rounded"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#edit-customer"
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

  const handleSearch = (value: any) => {
    setSearchQuery(value);
  };

  // Validation Functions
  const validateMobile = (mobile: string) => {
    return /^[0-9]{10}$/.test(mobile);
  };

  const sendOTP = () => {
    if (validateMobile(channelPartnerData.mobile)) {
      setShowOtpInput(true);
      // Here you would integrate with your OTP service
      console.log("OTP sent to:", channelPartnerData.mobile);
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const verifyOTP = () => {
    // Here you would verify OTP with your service
    if (otpValue.length === 6) {
      setMobileValidated(true);
      setShowOtpInput(false);
      console.log("OTP verified");
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  const validateIncentiveFactor = (type: string, value: number) => {
    if (type === "percentage") {
      return value >= 0.00 && value <= 99.99;
    } else if (type === "fixed") {
      return value >= 0.00;
    }
    return false;
  };

  const cityOptions = [
    { label: "Select", value: "" },
    { label: "Los Angles", value: "los-angles" },
    { label: "New York City", value: "new-york-city" },
    { label: "Houston", value: "houston" },
  ];

  const stateOptions = [
    { label: "Select", value: "" },
    { label: "California", value: "california" },
    { label: "New York", value: "new-york" },
    { label: "Texas", value: "texas" },
  ];

  const countryOptions = [
    { label: "Select", value: "" },
    { label: "United States", value: "united-states" },
    { label: "Canada", value: "canada" },
    { label: "Germany", value: "germany" },
  ];

  const incentiveTypeOptions = [
    { label: "Select Incentive Type", value: "" },
    { label: "Percentage", value: "percentage" },
    { label: "Fixed Amount", value: "fixed" },
  ];

  const brandOptions = [
    { label: "Select Brand", value: "" },
    { label: "Brand A", value: "brand-a" },
    { label: "Brand B", value: "brand-b" },
    { label: "Brand C", value: "brand-c" },
    { label: "Brand D", value: "brand-d" },
  ];

  return (
    <>
      {" "}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4 className="fw-bold">Channel Partners</h4>
                <h6>Manage your channel partners</h6>
              </div>
            </div>
            <TableTopHead />
            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-primary text-white"
                data-bs-toggle="modal"
                data-bs-target="#add-customer"
              >
                <i className="ti ti-circle-plus me-1" />
                Add Channel Partner
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
      {/* Add Channel Partner */}
      <div className="modal fade" id="add-customer">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Add Channel Partner</h4>
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
            <form action="customers.html">
              <div className="modal-body">
                {/* Channel Partner Information */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="fw-bold text-primary mb-3">Channel Partner Information</h6>
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
                              onChange={(e) => setChannelPartnerData({
                                ...channelPartnerData,
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

                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">
                        Channel Partner Name<span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={channelPartnerData.CP_Name}
                        onChange={(e) => setChannelPartnerData({
                          ...channelPartnerData,
                          CP_Name: e.target.value
                        })}
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
                          value={channelPartnerData.mobile}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setChannelPartnerData({
                              ...channelPartnerData,
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
                          disabled={!validateMobile(channelPartnerData.mobile) || mobileValidated}
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
                        value={channelPartnerData.email}
                        onChange={(e) => setChannelPartnerData({
                          ...channelPartnerData,
                          email: e.target.value
                        })}
                        placeholder="Enter email address (optional)"
                      />
                    </div>

                    <div className="col-lg-12 mb-3">
                      <label className="form-label">
                        Channel Partner Address<span className="text-danger ms-1">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={channelPartnerData.CP_Address}
                        onChange={(e) => setChannelPartnerData({
                          ...channelPartnerData,
                          CP_Address: e.target.value
                        })}
                        placeholder="Enter complete address"
                        required
                      />
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
                      !channelPartnerData.CP_Name ||
                      !mobileValidated ||
                      !channelPartnerData.CP_Address
                    }
                  >
                    Add Channel Partner
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Customer */}
      {/* Edit Customer */}
      <div className="modal fade" id="edit-customer">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header">
                  <div className="page-title">
                    <h4>Edit Customer</h4>
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
                <form action="customers.html">
                  <div className="modal-body">
                    <div className="new-employee-field">
                      <div className="profile-pic-upload image-field">
                        <div className="profile-pic p-2">
                          <img
                            src={user41}
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
                          defaultValue="Carl"
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Last Name<span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Evans"
                        />
                      </div>
                      <div className="col-lg-12 mb-3">
                        <label className="form-label">
                          Email<span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          defaultValue="carlevans@example.com"
                        />
                      </div>
                      <div className="col-lg-12 mb-3">
                        <label className="form-label">
                          Phone<span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          defaultValue={+12163547758}
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
                      className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary fs-13 fw-medium p-2 px-3"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Customer */}
      <DeleteModal />
    </>
  );
};

export default Customers;
