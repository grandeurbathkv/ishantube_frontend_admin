import { user02, user33, user34, user35, user36 } from "../../utils/imagepath";

export const customersData = [
  {
    CP_id: "CP001",
    CP_Name: "NorthStar Distributors Pvt Ltd",
    avatar: user33,
    partnerType: "Distributor",
    contactPerson: {
      firstName: "Ravi",
      lastName: "Kumar",
      designation: "Sales Head"
    },
    mobile: "+919812345678",
    mobileVerified: true,
    email: "ravi@northstar.com",
    CP_Address: "Plot 12, Industrial Area, Near Tech Park, Gurgaon, Haryana, 122001",
    regionCoverage: ["Haryana", "Delhi", "Punjab"],
    status: "Active",
    onboardDate: "2025-09-01T00:00:00.000Z",
    agreement: {
      agreementId: "AGR-NORTH-2025-001",
      signedAt: "2025-08-20T00:00:00.000Z",
      expiresAt: "2026-08-19T00:00:00.000Z",
      documentUrl: "https://s3.amazonaws.com/your-bucket/agreements/agr-north-2025-001.pdf"
    },
    commissionStructure: {
      type: "percentage",
      value: 8,
      currency: "INR"
    },
    brand: "Brand A",
    bankDetails: {
      bankName: "State Bank of India",
      accountNumber: "XXXXXXXXXXXX",
      ifscSwift: "SBIN0000123",
      accountName: "NorthStar Distributors Pvt Ltd"
    },
    productsOrServices: ["consumer-electronics", "home-appliances"],
    assignedAccountManagerId: "user_5f8d0d55",
    tags: ["gold", "priority"]
  },
  {
    CP_id: "CP002",
    CP_Name: "Eastern Electronics Retailers",
    avatar: user02,
    partnerType: "Retailer",
    contactPerson: {
      firstName: "Priya",
      lastName: "Sharma",
      designation: "Business Manager"
    },
    mobile: "+919876543210",
    mobileVerified: true,
    email: "priya@eastern-electronics.com",
    CP_Address: "123 Main Street, Commercial Complex, Mumbai, Maharashtra, 400001",
    regionCoverage: ["Maharashtra", "Gujarat"],
    status: "Active",
    onboardDate: "2025-08-15T00:00:00.000Z",
    agreement: {
      agreementId: "AGR-EAST-2025-002",
      signedAt: "2025-08-10T00:00:00.000Z",
      expiresAt: "2026-08-09T00:00:00.000Z",
      documentUrl: "https://s3.amazonaws.com/your-bucket/agreements/agr-east-2025-002.pdf"
    },
    commissionStructure: {
      type: "fixed",
      value: 5000,
      currency: "INR"
    },
    brand: "Brand B",
    bankDetails: {
      bankName: "HDFC Bank",
      accountNumber: "YYYYYYYYYYYY",
      ifscSwift: "HDFC0000456",
      accountName: "Eastern Electronics Retailers"
    },
    productsOrServices: ["consumer-electronics"],
    assignedAccountManagerId: "user_5f8d0d56",
    tags: ["regular"]
  },
  {
    CP_id: "CP003",
    CP_Name: "Metro Wholesale Suppliers",
    avatar: user34,
    partnerType: "Wholesaler",
    contactPerson: {
      firstName: "Amit",
      lastName: "Gupta",
      designation: "Operations Head"
    },
    mobile: "+919123456789",
    mobileVerified: false,
    email: "amit@metro-wholesale.com",
    CP_Address: "456 Industrial Road, Sector 15, Noida, Uttar Pradesh, 201301",
    regionCoverage: ["Uttar Pradesh", "Delhi", "Rajasthan"],
    status: "Active",
    onboardDate: "2025-07-20T00:00:00.000Z",
    agreement: {
      agreementId: "AGR-METRO-2025-003",
      signedAt: "2025-07-15T00:00:00.000Z",
      expiresAt: "2026-07-14T00:00:00.000Z",
      documentUrl: "https://s3.amazonaws.com/your-bucket/agreements/agr-metro-2025-003.pdf"
    },
    commissionStructure: {
      type: "percentage",
      value: 6.5,
      currency: "INR"
    },
    brand: "Brand C",
    bankDetails: {
      bankName: "ICICI Bank",
      accountNumber: "ZZZZZZZZZZZ",
      ifscSwift: "ICIC0000789",
      accountName: "Metro Wholesale Suppliers"
    },
    productsOrServices: ["home-appliances", "fashion-apparel"],
    assignedAccountManagerId: "user_5f8d0d57",
    tags: ["premium"]
  },
  {
    CP_id: "CP004",
    CP_Name: "Southern Tech Vendors",
    avatar: user35,
    partnerType: "Vendor",
    contactPerson: {
      firstName: "Lakshmi",
      lastName: "Nair",
      designation: "Regional Manager"
    },
    mobile: "+919987654321",
    mobileVerified: true,
    email: "lakshmi@southern-tech.com",
    CP_Address: "789 Tech Park, Electronic City, Bangalore, Karnataka, 560100",
    regionCoverage: ["Karnataka", "Tamil Nadu", "Kerala"],
    status: "Inactive",
    onboardDate: "2025-06-10T00:00:00.000Z",
    agreement: {
      agreementId: "AGR-SOUTH-2025-004",
      signedAt: "2025-06-05T00:00:00.000Z",
      expiresAt: "2026-06-04T00:00:00.000Z",
      documentUrl: "https://s3.amazonaws.com/your-bucket/agreements/agr-south-2025-004.pdf"
    },
    commissionStructure: {
      type: "percentage",
      value: 7.2,
      currency: "INR"
    },
    brand: "Brand D",
    bankDetails: {
      bankName: "Axis Bank",
      accountNumber: "AAAAAAAAAAAA",
      ifscSwift: "UTIB0001234",
      accountName: "Southern Tech Vendors"
    },
    productsOrServices: ["consumer-electronics", "books-media"],
    assignedAccountManagerId: "user_5f8d0d58",
    tags: ["vip"]
  },
  {
    CP_id: "CP005",
    CP_Name: "Central India Distributors",
    avatar: user36,
    partnerType: "Distributor",
    contactPerson: {
      firstName: "Rahul",
      lastName: "Patel",
      designation: "Director"
    },
    mobile: "+919876098760",
    mobileVerified: true,
    email: "rahul@central-india.com",
    CP_Address: "101 Business Center, MP Nagar, Bhopal, Madhya Pradesh, 462011",
    regionCoverage: ["Madhya Pradesh", "Chhattisgarh"],
    status: "Active",
    onboardDate: "2025-05-25T00:00:00.000Z",
    agreement: {
      agreementId: "AGR-CENTRAL-2025-005",
      signedAt: "2025-05-20T00:00:00.000Z",
      expiresAt: "2026-05-19T00:00:00.000Z",
      documentUrl: "https://s3.amazonaws.com/your-bucket/agreements/agr-central-2025-005.pdf"
    },
    commissionStructure: {
      type: "fixed",
      value: 7500,
      currency: "INR"
    },
    brand: "Brand A",
    bankDetails: {
      bankName: "Punjab National Bank",
      accountNumber: "BBBBBBBBBBBB",
      ifscSwift: "PUNB0005678",
      accountName: "Central India Distributors"
    },
    productsOrServices: ["health-beauty", "sports-fitness"],
    assignedAccountManagerId: "user_5f8d0d59",
    tags: ["gold", "regular"]
  },
];
