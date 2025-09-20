import { customersData } from "../../core/json/customers-data";
import PrimeDataTable from "../../components/data-table";
import SearchFromApi from "../../components/data-table/search";
import DeleteModal from "../../components/delete-modal";
import CommonSelect from "../../components/select/common-select";
import TableTopHead from "../../components/table-top-head";
import { user41 } from "../../utils/imagepath";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";
import type { RootState } from "../../core/redux/store";

const Customers = () => {
  const [listData, setListData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<any>(0);
  const [rows, setRows] = useState<number>(10);
  const [_searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Get token from Redux store
  const { userToken } = useSelector((state: RootState) => state.auth);

  // Channel Partner Form Data
  const [channelPartnerData, setChannelPartnerData] = useState({
    CP_Name: "",
    mobile: "",
    email: "",
    image: null as File | null,
    CP_Address: ""
  });

  // Image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mobileValidated, setMobileValidated] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Partner States
  const [editPartnerData, setEditPartnerData] = useState({
    CP_Name: "",
    mobile: "",
    email: "",
    image: null as File | null,
    CP_Address: "",
    status: true,
    CP_id: ""
  });
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editMobileValidated, setEditMobileValidated] = useState(false);
  const [editShowOtpInput, setEditShowOtpInput] = useState(false);
  const [editOtpValue, setEditOtpValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingEditData, setIsLoadingEditData] = useState(false);

  // View Partner States
  const [viewPartnerData, setViewPartnerData] = useState<any>(null);

  // API Service for fetching Channel Partners
  const fetchChannelPartners = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${API_URL}/channelpartner`,
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        }
      );
      
      // Type assertion for the API response
      const apiResponse = response.data as {
        data?: any[];
        count?: number;
        message?: string;
      };
      
      if (apiResponse && apiResponse.data) {
        setListData(apiResponse.data);
        setTotalRecords(apiResponse.count || apiResponse.data.length);
      }
    } catch (error: any) {
      console.error("Error fetching channel partners:", error);
      setError("Failed to fetch channel partners");
      
      // Fallback to static data if API fails
      setListData(customersData);
      setTotalRecords(customersData.length);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (userToken) {
      fetchChannelPartners();
    } else {
      // If no token, use static data
      setListData(customersData);
      setTotalRecords(customersData.length);
      setLoading(false);
    }
  }, [userToken]);

  // Reset edit form when modal is closed
  useEffect(() => {
    const editModal = document.getElementById('edit-customer');
    if (editModal) {
      const handleModalHidden = () => {
        // Reset edit form data
        setEditPartnerData({
          CP_Name: "",
          mobile: "",
          email: "",
          image: null,
          CP_Address: "",
          status: true,
          CP_id: ""
        });
        setEditImagePreview(null);
        setEditMobileValidated(false);
        setEditShowOtpInput(false);
        setEditOtpValue("");
        setIsLoadingEditData(false);
      };

      editModal.addEventListener('hidden.bs.modal', handleModalHidden);
      
      return () => {
        editModal.removeEventListener('hidden.bs.modal', handleModalHidden);
      };
    }
  }, []);

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
            <img 
              src={data.Image && typeof data.Image === 'string' 
                ? (data.Image.startsWith('http') 
                    ? data.Image 
                    : `http://localhost:5000/${data.Image.replace(/\\/g, '/')}`)
                : "https://via.placeholder.com/40x40/007bff/ffffff?text=CP"
              } 
              alt="partner"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/40x40/007bff/ffffff?text=CP";
              }}
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
          </Link>
          <div>
            <Link 
              to="#" 
              className={`fw-medium ${data.status ? 'text-success' : 'text-danger'}`}
              data-bs-toggle="modal"
              data-bs-target="#view-customer"
              onClick={() => handleViewClick(data)}
              style={{
                color: data.status ? '#28a745' : '#dc3545',
                textDecoration: 'none'
              }}
            >
              {data.CP_Name}
            </Link>
            <br />
            <small className="text-muted">ID: {data.CP_id}</small>
          </div>
        </div>
      ),
    },
    {
      header: "Mobile Number",
      field: "Mobile Number",
      key: "Mobile Number",
      body: (data: any) => (
        <div>
          <div>{data["Mobile Number"]}</div>
          <small className="text-success">✓ Verified</small>
        </div>
      ),
    },
    { 
      header: "Email", 
      field: "Email id", 
      key: "Email id",
      body: (data: any) => data["Email id"] || "N/A"
    },
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
      header: "Status",
      field: "status",
      key: "status",
      body: (data: any) => (
        <span className={`badge ${data.status ? 'bg-success' : 'bg-danger'}`}>
          {data.status ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: "Created Date",
      field: "createdAt",
      key: "createdAt",
      body: (data: any) => (
        <span>{new Date(data.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      header: "",
      field: "actions",
      key: "actions",
      sortable: false,
      body: (row: any) => (
        <div className="edit-delete-action d-flex align-items-center">
          <Link
            className="me-2 p-2 d-flex align-items-center border rounded"
            to="#"
            onClick={() => handleEditClick(row)}
          >
            <i className="feather icon-edit"></i>
          </Link>
          <button
            className="p-2 d-flex align-items-center border rounded bg-transparent"
            onClick={() => handleDeleteClick(row)}
            style={{ border: '1px solid #dee2e6' }}
          >
            <i className="feather icon-trash-2"></i>
          </button>
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

  // Handle image selection and preview
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      
      setChannelPartnerData({
        ...channelPartnerData,
        image: file
      });
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Remove image
  const removeImage = () => {
    setChannelPartnerData({
      ...channelPartnerData,
      image: null
    });
    setImagePreview(null);
  };

  // Handle edit image selection and preview
  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      
      setEditPartnerData({
        ...editPartnerData,
        image: file
      });
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setEditImagePreview(previewUrl);
    }
  };

  // Remove edit image
  const removeEditImage = () => {
    setEditPartnerData({
      ...editPartnerData,
      image: null
    });
    setEditImagePreview(null);
  };

  const sendOTP = () => {
    if (validateMobile(channelPartnerData.mobile)) {
      setShowOtpInput(true);
      // Static OTP sent to WhatsApp
      alert(`OTP 112233 sent to WhatsApp number: ${channelPartnerData.mobile}`);
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const verifyOTP = () => {
    // Static OTP verification - expecting "112233"
    if (otpValue === "112233") {
      setMobileValidated(true);
      setShowOtpInput(false);
      alert("OTP verified successfully!");
    } else {
      alert("Invalid OTP. Please enter 112233");
    }
  };

  // Edit form OTP functions
  const sendEditOTP = () => {
    if (validateMobile(editPartnerData.mobile)) {
      setEditShowOtpInput(true);
      // Static OTP sent to WhatsApp
      alert(`OTP 112233 sent to WhatsApp number: ${editPartnerData.mobile}`);
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const verifyEditOTP = () => {
    // Static OTP verification - expecting "112233"
    if (editOtpValue === "112233") {
      setEditMobileValidated(true);
      setEditShowOtpInput(false);
      alert("OTP verified successfully!");
    } else {
      alert("Invalid OTP. Please enter 112233");
    }
  };

  // API Service for Channel Partner Creation
  const createChannelPartner = async (formData: FormData) => {
    const API_URL = import.meta.env.VITE_API_URL;
    
    const response = await axios.post(
      `${API_URL}/channelpartner`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          // Don't set Content-Type for FormData, axios will set it automatically with boundary
        },
      }
    );
    
    return response.data;
  };

  // API Service for Channel Partner Deletion
  const deleteChannelPartner = async (partnerId: string) => {
    const API_URL = import.meta.env.VITE_API_URL;
    
    const response = await axios.delete(
      `${API_URL}/channelpartner/${partnerId}`,
      {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'accept': 'application/json',
        },
      }
    );
    
    return response.data;
  };

  // API Service for Channel Partner Update
  const updateChannelPartner = async (partnerId: string, formData: FormData) => {
    const API_URL = import.meta.env.VITE_API_URL;
    
    console.log("Update API - Partner ID:", partnerId); // Debug log
    console.log("Update API - Full URL:", `${API_URL}/channelpartner/${partnerId}`); // Debug log
    
    if (!partnerId) {
      throw new Error("Partner ID is required for update");
    }
    
    const response = await axios.put(
      `${API_URL}/channelpartner/${partnerId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          // Don't set Content-Type for FormData, axios will set it automatically with boundary
        },
      }
    );
    
    return response.data;
  };

  // API Service for fetching single Channel Partner
  const getChannelPartner = async (partnerId: string) => {
    const API_URL = import.meta.env.VITE_API_URL;
    
    const response = await axios.get(
      `${API_URL}/channelpartner/${partnerId}`,
      {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'accept': 'application/json',
        },
      }
    );
    
    return response.data;
  };

  // Handle Delete Confirmation
  const handleDeleteClick = (partner: any) => {
    setSelectedPartner(partner);
    
    // Open the delete modal
    const modalElement = document.getElementById('delete-modal');
    
    if (modalElement) {
      // Check if Bootstrap is available
      if (typeof (window as any).bootstrap !== 'undefined') {
        const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
        bootstrapModal.show();
      } else {
        // Fallback: manually trigger modal
        modalElement.classList.add('show');
        modalElement.style.display = 'block';
        document.body.classList.add('modal-open');
        
        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.id = 'delete-modal-backdrop';
        document.body.appendChild(backdrop);
      }
    }
  };

  // Handle Edit Click
  const handleEditClick = async (partner: any) => {
    // Set loading state and open modal immediately
    setIsLoadingEditData(true);
    
    // Open modal first
    const modalElement = document.getElementById('edit-customer');
    if (modalElement) {
      // Check if Bootstrap is available
      if (typeof (window as any).bootstrap !== 'undefined') {
        const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
        bootstrapModal.show();
      } else {
        // Fallback: manually trigger modal
        modalElement.classList.add('show');
        modalElement.style.display = 'block';
        document.body.classList.add('modal-open');
        
        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.id = 'edit-modal-backdrop';
        document.body.appendChild(backdrop);
      }
    }

    // Then fetch data
    try {
      await fetchPartnerForEdit(partner.CP_id);
    } catch (error) {
      console.error("Error in handleEditClick:", error);
      // Close modal on error
      if (modalElement) {
        if (typeof (window as any).bootstrap !== 'undefined') {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
        } else {
          modalElement.classList.remove('show');
          modalElement.style.display = 'none';
          document.body.classList.remove('modal-open');
          const backdrop = document.getElementById('edit-modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
      }
    }
  };

  // Fetch partner data for editing
  const fetchPartnerForEdit = async (partnerId: string): Promise<void> => {
    try {
      setIsLoadingEditData(true);
      const response = await getChannelPartner(partnerId);
      
      // Type cast response to any to avoid TypeScript errors
      const apiResponse = response as any;
      
      // The API response structure is {message: '...', data: {partner: {...}}}
      let partnerData;
      if (apiResponse.data && apiResponse.data.partner) {
        partnerData = apiResponse.data.partner;
      } else if (apiResponse.partner) {
        partnerData = apiResponse.partner;
      } else if (apiResponse.data) {
        partnerData = apiResponse.data;
      } else {
        partnerData = apiResponse;
      }
      
      console.log("Fetched partner data for edit:", apiResponse); // Debug log
      console.log("Extracted partner data:", partnerData); // Debug log

      // Update state with new data
      const updatedData = {
        CP_Name: partnerData.CP_Name || "",
        mobile: partnerData["Mobile Number"] || partnerData.mobile || "",
        email: partnerData["Email id"] || partnerData.email || "",
        image: null,
        CP_Address: partnerData.CP_Address || partnerData.address || "",
        status: partnerData.status !== undefined ? partnerData.status : true,
        CP_id: partnerData.CP_id || partnerData.id || ""
      };

      console.log("Setting edit partner data:", updatedData); // Debug log

      setEditPartnerData(updatedData);

      // Set existing image if available
      if (partnerData.Image || partnerData.image) {
        const imageField = partnerData.Image || partnerData.image;
        const imageUrl = imageField.startsWith('http') 
          ? imageField 
          : `http://localhost:5000/${imageField.replace(/\\/g, '/')}`;
        setEditImagePreview(imageUrl);
      } else {
        setEditImagePreview(null);
      }

      // Reset validation states
      setEditMobileValidated(true); // Assume existing mobile is already validated
      setEditShowOtpInput(false);
      setEditOtpValue("");

    } catch (error) {
      console.error("Error fetching partner data:", error);
      alert("Failed to fetch partner data");
      throw error;
    } finally {
      setIsLoadingEditData(false);
    }
  };

  // Handle View Click
  const handleViewClick = (partner: any) => {
    // Fetch fresh data from API
    fetchPartnerForView(partner.CP_id);
  };

  // Fetch partner data for viewing
  const fetchPartnerForView = async (partnerId: string) => {
    try {
      const response = await getChannelPartner(partnerId);
      
      // Type cast response to any to avoid TypeScript errors
      const apiResponse = response as any;
      
      // The API response structure is {message: '...', data: {partner: {...}}}
      let partnerData;
      if (apiResponse.data && apiResponse.data.partner) {
        partnerData = apiResponse.data.partner;
      } else if (apiResponse.partner) {
        partnerData = apiResponse.partner;
      } else if (apiResponse.data) {
        partnerData = apiResponse.data;
      } else {
        partnerData = apiResponse;
      }
      
      setViewPartnerData(partnerData);
    } catch (error) {
      console.error("Error fetching partner data:", error);
      alert("Failed to fetch partner data");
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!selectedPartner) {
      return;
    }

    setIsDeleting(true);
    
    try {
      await deleteChannelPartner(selectedPartner.CP_id);
      
      // Success handling
      alert("Channel Partner deleted successfully!");
      
      // Refresh the data list
      await fetchChannelPartners();
      
      // Close modal
      const modalElement = document.getElementById('delete-modal');
      if (modalElement) {
        if (typeof (window as any).bootstrap !== 'undefined') {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
        } else {
          // Fallback close method
          modalElement.classList.remove('show');
          modalElement.style.display = 'none';
          document.body.classList.remove('modal-open');
          
          // Remove backdrop
          const backdrop = document.getElementById('delete-modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
      }
      
      setSelectedPartner(null);
      
    } catch (error: any) {
      console.error("Error deleting channel partner:", error);
      
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to delete channel partner. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!channelPartnerData.CP_Name || !mobileValidated || !channelPartnerData.CP_Address) {
      alert("Please fill in all required fields and verify mobile number");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("CP_Name", channelPartnerData.CP_Name);
      formData.append("Mobile Number", channelPartnerData.mobile);
      formData.append("Email id", channelPartnerData.email);
      formData.append("CP_Address", channelPartnerData.CP_Address);
      formData.append("status", "true");
      
      // Handle image upload
      if (channelPartnerData.image) {
        formData.append("Image", channelPartnerData.image, channelPartnerData.image.name);
      }

      const response = await createChannelPartner(formData);
      
      // Success handling
      alert("Channel Partner created successfully!");
      
      // Refresh the data list
      await fetchChannelPartners();
      
      // Reset form
      setChannelPartnerData({
        CP_Name: "",
        mobile: "",
        email: "",
        image: null,
        CP_Address: ""
      });
      setMobileValidated(false);
      setShowOtpInput(false);
      setOtpValue("");
      setImagePreview(null);
      
      // Close modal
      const modalElement = document.getElementById('add-customer');
      if (modalElement) {
        const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }
      
    } catch (error: any) {
      console.error("Error creating channel partner:", error);
      
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to create channel partner. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Form Submission Handler
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Edit submit - editPartnerData:", editPartnerData); // Debug log
    console.log("Edit submit - CP_id:", editPartnerData.CP_id); // Debug log
    
    if (!editPartnerData.CP_Name || !editMobileValidated || !editPartnerData.CP_Address) {
      alert("Please fill in all required fields and verify mobile number");
      return;
    }

    if (!editPartnerData.CP_id) {
      alert("Partner ID is missing. Please try again.");
      return;
    }

    setIsUpdating(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("CP_Name", editPartnerData.CP_Name);
      formData.append("Mobile Number", editPartnerData.mobile);
      formData.append("Email id", editPartnerData.email);
      formData.append("CP_Address", editPartnerData.CP_Address);
      formData.append("status", editPartnerData.status.toString());
      
      // Handle image upload only if new image is selected
      if (editPartnerData.image) {
        formData.append("Image", editPartnerData.image, editPartnerData.image.name);
      }

      console.log("Calling updateChannelPartner with ID:", editPartnerData.CP_id); // Debug log

      const response = await updateChannelPartner(editPartnerData.CP_id, formData);
      
      // Success handling
      alert("Channel Partner updated successfully!");
      
      // Refresh the data list
      await fetchChannelPartners();
      
      // Reset edit form
      setEditPartnerData({
        CP_Name: "",
        mobile: "",
        email: "",
        image: null,
        CP_Address: "",
        status: true,
        CP_id: ""
      });
      setEditMobileValidated(false);
      setEditShowOtpInput(false);
      setEditOtpValue("");
      setEditImagePreview(null);
      
      // Close modal with improved error handling
      const modalElement = document.getElementById('edit-customer');
      if (modalElement) {
        try {
          // Try Bootstrap method first
          if (typeof (window as any).bootstrap !== 'undefined' && (window as any).bootstrap.Modal) {
            const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (bootstrapModal) {
              bootstrapModal.hide();
            } else {
              // Create new instance and hide
              const newModal = new (window as any).bootstrap.Modal(modalElement);
              newModal.hide();
            }
          } else {
            // Fallback: manually close modal
            modalElement.classList.remove('show');
            modalElement.style.display = 'none';
            modalElement.setAttribute('aria-hidden', 'true');
            modalElement.removeAttribute('aria-modal');
            modalElement.removeAttribute('role');
            
            document.body.classList.remove('modal-open');
            
            // Remove backdrop
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
          }
        } catch (modalError) {
          console.log("Modal close error, using fallback method:", modalError);
          // Force close modal manually
          modalElement.classList.remove('show');
          modalElement.style.display = 'none';
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
      }
      
    } catch (error: any) {
      console.error("Error updating channel partner:", error);
      
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to update channel partner. Please try again.");
      }
    } finally {
      setIsUpdating(false);
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

  // Handle modal close
  const handleCloseModal = () => {
    const modalElement = document.getElementById('delete-modal');
    if (modalElement) {
      if (typeof (window as any).bootstrap !== 'undefined') {
        const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      } else {
        // Fallback close method
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        document.body.classList.remove('modal-open');
        
        // Remove backdrop
        const backdrop = document.getElementById('delete-modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    }
    setSelectedPartner(null);
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
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger m-3">
                  <div className="d-flex align-items-center">
                    <i className="feather icon-alert-circle me-2"></i>
                    <span>{error}</span>
                    <button 
                      className="btn btn-sm btn-outline-primary ms-auto"
                      onClick={fetchChannelPartners}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
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
              )}
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
            <form onSubmit={handleSubmit}>
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
                        {imagePreview ? (
                          <div className="profile-pic-preview position-relative">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="rounded"
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                border: '2px solid #ddd'
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute"
                              style={{ top: '-5px', right: '-5px' }}
                              onClick={removeImage}
                            >
                              ×
                            </button>
                            <div className="mt-2">
                              <small className="text-success">✓ Image selected: {channelPartnerData.image?.name}</small>
                            </div>
                          </div>
                        ) : (
                          <div className="profile-pic">
                            <span>
                              <i className="feather icon-plus-circle plus-down-add" /> Add Image
                            </span>
                          </div>
                        )}
                        <div className="mb-3">
                          <div className="image-upload mb-0">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageSelect}
                            />
                            <div className="image-uploads">
                              <h4>{imagePreview ? 'Change Image' : 'Upload Image'}</h4>
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
                      !channelPartnerData.CP_Address ||
                      isSubmitting
                    }
                  >
                    {isSubmitting ? "Creating..." : "Add Channel Partner"}
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Customer */}
      {/* Edit Customer */}
      <div className="modal fade" id="edit-customer">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Edit Channel Partner</h4>
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
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                {isLoadingEditData ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                    <div className="text-center">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted">Loading partner data...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Channel Partner Information */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <h6 className="fw-bold text-primary mb-3">Channel Partner Information</h6>
                      </div>

                  {/* Profile Image Upload */}
                  <div className="col-12 mb-3">
                    <div className="new-employee-field">
                      <div className="profile-pic-upload">
                        {editImagePreview ? (
                          <div className="profile-pic-preview position-relative">
                            <img 
                              src={editImagePreview} 
                              alt="Preview" 
                              className="rounded"
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                border: '2px solid #ddd'
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute"
                              style={{ top: '-5px', right: '-5px' }}
                              onClick={removeEditImage}
                            >
                              ×
                            </button>
                            <div className="mt-2">
                              <small className="text-success">
                                {editPartnerData.image ? `✓ New image: ${editPartnerData.image.name}` : '✓ Current image'}
                              </small>
                            </div>
                          </div>
                        ) : (
                          <div className="profile-pic">
                            <span>
                              <i className="feather icon-plus-circle plus-down-add" /> Add Image
                            </span>
                          </div>
                        )}
                        <div className="mb-3">
                          <div className="image-upload mb-0">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleEditImageSelect}
                            />
                            <div className="image-uploads">
                              <h4>{editImagePreview ? 'Change Image' : 'Upload Image'}</h4>
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
                        value={editPartnerData.CP_Name}
                        onChange={(e) => setEditPartnerData({
                          ...editPartnerData,
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
                          className={`form-control ${editMobileValidated ? 'border-success' : ''}`}
                          value={editPartnerData.mobile}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setEditPartnerData({
                              ...editPartnerData,
                              mobile: value
                            });
                            setEditMobileValidated(false);
                          }}
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={sendEditOTP}
                          disabled={!validateMobile(editPartnerData.mobile) || editMobileValidated}
                        >
                          {editMobileValidated ? 'Verified' : 'Send OTP'}
                        </button>
                      </div>
                      {editMobileValidated && (
                        <small className="text-success">✓ Mobile number verified</small>
                      )}
                    </div>

                    {editShowOtpInput && (
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Enter OTP<span className="text-danger ms-1">*</span>
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={editOtpValue}
                            onChange={(e) => setEditOtpValue(e.target.value.slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                          />
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={verifyEditOTP}
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
                        value={editPartnerData.email}
                        onChange={(e) => setEditPartnerData({
                          ...editPartnerData,
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
                        value={editPartnerData.CP_Address}
                        onChange={(e) => setEditPartnerData({
                          ...editPartnerData,
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
                        id="edit-user-status"
                        className="check"
                        checked={editPartnerData.status}
                        onChange={(e) => setEditPartnerData({
                          ...editPartnerData,
                          status: e.target.checked
                        })}
                      />
                      <label htmlFor="edit-user-status" className="checktoggle">
                        {" "}
                      </label>
                    </div>
                  </div>
                </div>
                </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
                  data-bs-dismiss="modal"
                  disabled={isLoadingEditData}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary fs-13 fw-medium p-2 px-3"
                  disabled={
                    isLoadingEditData ||
                    !editPartnerData.CP_Name ||
                    !editMobileValidated ||
                    !editPartnerData.CP_Address ||
                    isUpdating
                  }
                >
                  {isUpdating ? "Updating..." : "Update Channel Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Customer */}
      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Delete Channel Partner</h4>
              </div>
              <button
                type="button"
                className="close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-order">
                <div className="delete-image text-center mb-3">
                  <i className="feather icon-trash-2 text-danger" style={{ fontSize: '48px' }}></i>
                </div>
                <div className="delete-order-content text-center">
                  <h5>Are you sure you want to delete this channel partner?</h5>
                  {selectedPartner && (
                    <div className="mt-3">
                      <p className="mb-1"><strong>Partner Name:</strong> {selectedPartner.CP_Name}</p>
                      <p className="mb-1"><strong>Mobile:</strong> {selectedPartner["Mobile Number"]}</p>
                      <p className="mb-1"><strong>Partner ID:</strong> {selectedPartner.CP_id}</p>
                    </div>
                  )}
                  <p className="text-muted mt-3">This action cannot be undone.</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger fs-13 fw-medium p-2 px-3"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Partner"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
      {/* View Customer */}
      <div className="modal fade" id="view-customer">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>View Channel Partner Details</h4>
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
            <div className="modal-body">
              {viewPartnerData && (
                <div className="row">
                  {/* Profile Image */}
                  <div className="col-12 text-center mb-4">
                    <img 
                      src={viewPartnerData.Image && typeof viewPartnerData.Image === 'string' 
                        ? (viewPartnerData.Image.startsWith('http') 
                            ? viewPartnerData.Image 
                            : `http://localhost:5000/${viewPartnerData.Image.replace(/\\/g, '/')}`)
                        : "https://via.placeholder.com/150x150/007bff/ffffff?text=CP"
                      } 
                      alt="partner"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/150x150/007bff/ffffff?text=CP";
                      }}
                      className="rounded-circle"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Partner Details */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-bold">Channel Partner Name</label>
                    <p className="form-control-plaintext border rounded p-2 bg-light">
                      {viewPartnerData.CP_Name}
                    </p>
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-bold">Partner ID</label>
                    <p className="form-control-plaintext border rounded p-2 bg-light">
                      {viewPartnerData.CP_id}
                    </p>
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-bold">Mobile Number</label>
                    <p className="form-control-plaintext border rounded p-2 bg-light">
                      {viewPartnerData["Mobile Number"]}
                      <span className="badge bg-success ms-2">✓ Verified</span>
                    </p>
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-bold">Email ID</label>
                    <p className="form-control-plaintext border rounded p-2 bg-light">
                      {viewPartnerData["Email id"] || "N/A"}
                    </p>
                  </div>

                  <div className="col-lg-12 mb-3">
                    <label className="form-label fw-bold">Address</label>
                    <p className="form-control-plaintext border rounded p-2 bg-light">
                      {viewPartnerData.CP_Address}
                    </p>
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-bold">Status</label>
                    <p className="form-control-plaintext">
                      <span className={`badge ${viewPartnerData.status ? 'bg-success' : 'bg-danger'}`}>
                        {viewPartnerData.status ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>

                  <div className="col-lg-6 mb-3">
                    <label className="form-label fw-bold">Created Date</label>
                    <p className="form-control-plaintext border rounded p-2 bg-light">
                      {new Date(viewPartnerData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="col-lg-12 mb-3">
                    <label className="form-label fw-bold">Last Updated</label>
                    <p className="form-control-plaintext border rounded p-2 bg-light">
                      {new Date(viewPartnerData.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#edit-customer"
                onClick={() => viewPartnerData && handleEditClick(viewPartnerData)}
              >
                Edit Partner
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /View Customer */}
      <DeleteModal />
    </>
  );
};

export default Customers;
