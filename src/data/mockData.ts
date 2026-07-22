import PurpleBellIcon from "../assets/icon/PurpleBellIcon.svg";
import BlueMellIcon from "../assets/icon/BlueMellIcon.svg";
import GreenCallIcon from "../assets/icon/GreenCallIcon.svg";
import GrayFileIcon from "../assets/icon/GrayFileIcon.svg";

export const activeProjectData = {
  projectName: "ABC Logistics Warehouse",
  projectCode: "PR-0987",
  siteLocation: "Baner, Pune",
  progressPercentage: "78% Completed",
  currentStatus: "Under Fabrication",
  nextMilestoneDate: "12 April 2026",
  assignedProjectManager: "Riya Sharma",
  pmPhone: "+91-0987654321",
  projectImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80",
  pmAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
};

// export const drawingApprovalsData = [
//   {
//     label: "Drawings Pending Review",
//     count: "6 pending",
//     subtext: "Shop, Structural, Erection",
//     color: "blue",
//   },
//   {
//     label: "Approved Drawings",
//     count: "32 approved",
//     subtext: "",
//     color: "yellow",
//   },
//   {
//     label: "Drawing Revisions Received",
//     count: "4 new revisions",
//     subtext: "",
//     color: "purple",
//   },
//   {
//     label: "Items Needing Clarification",
//     count: "2 RFIs raised by engineering team",
//     subtext: "",
//     color: "green",
//   },
// ];

export const drawingApprovalsByFilter: Record<string, Array<{ label: string; count: string; subtext: string; color: string }>> = {
  today: [
    {
      label: "Drawings Pending Review",
      count: "6 Pending",
      subtext: "Shop Structural Erection",
      color: "cyan",
    },
    {
      label: "Approved Drawings",
      count: "32 Approved",
      subtext: "",
      color: "yellow",
    },
    {
      label: "Drawing Revision Reseived",
      count: "4 New",
      subtext: "",
      color: "purple",
    },
    {
      label: "Items Needing Clarification",
      count: "2 RFIs raised",
      subtext: "",
      color: "green",
    },
  ],

  week: [
    {
      label: "Drawings Pending Review",
      count: "14 Pending",
      subtext: "Shop Structural Erection",
      color: "cyan",
    },
    {
      label: "Approved Drawings",
      count: "96 Approved",
      subtext: "",
      color: "yellow",
    },
    {
      label: "Drawing Revision Reseived",
      count: "18 New",
      subtext: "",
      color: "purple",
    },
    {
      label: "Items Needing Clarification",
      count: "9 RFIs raised",
      subtext: "",
      color: "green",
    },
  ],

  month: [
    {
      label: "Drawings Pending Review",
      count: "38 Pending",
      subtext: "Shop Structural Erection",
      color: "cyan",
    },
    {
      label: "Approved Drawings",
      count: "240 Approved",
      subtext: "",
      color: "yellow",
    },
    {
      label: "Drawing Revision Reseived",
      count: "42 New",
      subtext: "",
      color: "purple",
    },
    {
      label: "Items Needing Clarification",
      count: "15 RFIs raised",
      subtext: "",
      color: "green",
    },
  ],
};


export const mockLeadsData = {
  id: "Q-2025-1047",
  contactInfo: {
    fullName: "John Doe",
    email: "john.doe@gmail.com",
    phone: "(555) 123-4567",
    location: "Texas",
  },
  projectDetails: {
    buildingType: "Workshop",
    quoteValue: "$12,500",
    status: "Quotation Sent",
    createdOn: "2024-10-10",
  },
  assignment: {
    assignedTo: "Sarah Lee",
    role: "1 person working on this lead",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  contract: {
    status: "Signed contact/Agreement",
    date: "Signed on: 12 April 2025",
  },
  progress: {
    currentStep: 4,
    totalSteps: 7,
    steps: [
      { id: 1, label: "Initial Contact", status: "completed" },
      { id: 2, label: "Requirements Gathered", status: "completed" },
      { id: 3, label: "Proposal Sent", status: "completed" },
      { id: 4, label: "Negotiation", status: "current" },
      { id: 5, label: "Deal Closed", status: "pending" },
      { id: 6, label: "Payment Done", status: "pending" },
      { id: 7, label: "Delivered", status: "pending" },
    ],
  },
  recentActivity: [
    { text: "Last activity: 2024-10-18", type: "info" },
    { text: "Lead created: 2024-10-10", type: "info" },
    { text: "2 unread messages", type: "alert" },
  ],
  photos: [
    "https://imgs.search.brave.com/tHqgR22b7R8Q9j0r6QfX7y2V6V8y0r6QfX7y2V6V8y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/NDMyNTMyL3Bob3Rv/L3N0ZWVsLWJlYW1z/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz16XzR4XzR4XzR4/XzR4XzR4XzR4XzR4",
    "https://imgs.search.brave.com/tHqgR22b7R8Q9j0r6QfX7y2V6V8y0r6QfX7y2V6V8y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/NDMyNTMyL3Bob3Rv/L3N0ZWVsLWJlYW1z/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz16XzR4XzR4XzR4/XzR4XzR4XzR4XzR4",
    "https://imgs.search.brave.com/tHqgR22b7R8Q9j0r6QfX7y2V6V8y0r6QfX7y2V6V8y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/NDMyNTMyL3Bob3Rv/L3N0ZWVsLWJlYW1z/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz16XzR4XzR4XzR4/XzR4XzR4XzR4XzR4",
    "https://imgs.search.brave.com/tHqgR22b7R8Q9j0r6QfX7y2V6V8y0r6QfX7y2V6V8y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/NDMyNTMyL3Bob3Rv/L3N0ZWVsLWJlYW1z/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz16XzR4XzR4XzR4/XzR4XzR4XzR4XzR4",
  ],
};

export const mockQuotationData = {
  id: "Q-2025-1047",
  contactInfo: {
    fullName: "John Doe",
    email: "john@doe.com",
    phone: "+1 (555) 123-4567",
    location: "Dallas, TX",
  },
  buildingRequirements: {
    buildingType: "Workshop",
    dimensions: "30' x 40' x 12'",
    roofStyle: "Gable Roof",
    windLoad: "120 mph",
    snowLoad: "20 psf",
    estimatedDelivery: "4–6 weeks",
    priceRange: "$24,500 – $28,000",
  },
  leadManagement: {
    status: "In Pipeline",
    handlerType: "AI",
    leadScore: "HOT",
    assignedTo: "AI Assistant",
    lastContact: "2024-01-15",
    nextFollowUp: "2024-01-18",
  },
  aiHandlingSummary: {
    qualification: "Qualified – Budget OK, Timeline Realistic",
    quotationStatus: "Created by AI - sent",
    summaryPoints: [
      "Initial quote request received",
      "AI confirmed building specifications",
      "Customer interested in premium options",
    ],
  },
  includedMaterials: [
    "Frame",
    "Roof",
    "Panels",
    "Trim",
    "Fasteners",
    "Drawings",
    "Engineer Plans",
  ],
  optionalAddOns: ["Doors", "Windows", "Skylights"],
  activityLog: [
    {
      id: 1,
      title: "Lead created",
      description: "by System on 2024-01-15",
      type: "lead",
    },
    {
      id: 2,
      title: "AI qualification completed",
      description: "by AI Assistant on 2024-01-15",
      type: "ai",
    },
    {
      id: 3,
      title: "Quotation sent",
      description: "by AI Assistant on 2024-01-16",
      type: "quote",
    },
  ],
};

export const mockChatData = {
  id: "Q-2025-1047",
  leadName: "John Doe",
  handlerName: "Sarah Lee",
  buildingType: "Workshop",
  messages: [
    {
      id: 1,
      sender: "John Doe",
      content: "Hi, I need a quote for a 40*60 workshop in Texas.",
      timestamp: "2024-10-10 09:30 pm",
      isMe: false,
    },
    {
      id: 2,
      sender: "Sarah Lee",
      content:
        "Hello John! I'd be happy to help you with that. Can you tell me more about the intended use and any specific requirements?",
      timestamp: "2024-10-10 09:30 pm",
      isMe: true,
    },
    {
      id: 3,
      sender: "John Doe",
      content:
        "It will be used for automotive repair. I need overhead doors and good ventilation.",
      timestamp: "2024-10-10 09:30 pm",
      isMe: false,
    },
    {
      id: 4,
      sender: "Sarah Lee",
      content:
        "Perfect! I've prepared a detailed proposal for you. Please review the attached document.",
      timestamp: "2024-10-10 09:30 pm",
      isMe: true,
    },
  ],
};

export const mockFollowUpsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    description: "Discussed pricing options and implementation timeline",
    time: "2 hours ago",
    icon: PurpleBellIcon,
  },
  {
    id: 2,
    name: "Michael Chen",
    description: "Sent product demo video and case studies",
    time: "4 hours ago",
    icon: BlueMellIcon,
  },
  {
    id: 3,
    name: "Emily Davis",
    description: "30-min discovery call completed - high interest level",
    time: "6 hours ago",
    icon: GreenCallIcon,
  },
  {
    id: 4,
    name: "Robert Wilson",
    description: "Lead requested technical specifications document",
    time: "1 day ago",
    icon: GrayFileIcon,
  },
];

export const mockMeetingsData = [
  {
    id: 1,
    time: "09:00",
    title: "Follow up with Alice Johnson",
    company: "Tech Solutions Inc",
    duration: "30 min",
    type: "Call",
    accentColor: "#B91C1C",
    bgColor: "#FEF2F2",
    buttonColor: "bg-[#DCFCE7] text-[#16A34A]",
  },
  {
    id: 2,
    time: "14:30",
    title: "Send Proposal to marketing Pro",
    company: "Marketing Pro",
    duration: "15 min",
    type: "Email",
    accentColor: "#EAB308",
    bgColor: "#FEFCE8",
    buttonColor: "bg-[#DBEAFE] text-[#1D51A4]",
  },
];

export const mockPaymentsData = {
  id: "Q-2025-1047",
  summary: {
    totalPayment: "$15,000",
    totalPaid: "$0",
    outstandingBalance: "$15,000",
  },
  history: [
    {
      invoiceNo: "INV 2024-001",
      date: "27-01-2025",
      amount: "$12,500",
      dueDate: "27-01-2025",
      status: "Pending",
    },
    {
      invoiceNo: "INV 2024-001",
      date: "27-01-2025",
      amount: "$12,500",
      dueDate: "27-01-2025",
      status: "Paid",
    },
    {
      invoiceNo: "INV 2024-001",
      date: "27-01-2025",
      amount: "$12,500",
      dueDate: "27-01-2025",
      status: "Paid",
    },
    {
      invoiceNo: "INV 2024-001",
      date: "27-01-2025",
      amount: "$12,500",
      dueDate: "27-01-2025",
      status: "Paid",
    },
  ],
};





export const dashboardData = {
  today: {
    summary: {
      activeProjects: 12,
      projectsClosed: 42,
      drawingsAndApprovals: 74,
      projectTimeline: 12,
    },

    activeProject: {
      name: "Warehouse Building, Pune",
      projectId: "#W-98765432",
      location: "Baner, Pune",
      fabricationProgress: 78,
      status: "Under Fabrication",
      nextMilestone: "12 April 2026",
    },

    drawings: {
      pending: 6,
      approved: 32,
      revisions: 4,
      rfi: 2,
    },

    financial: {
      totalEquipmentValue: 8458798,
      availableEquipment: 4898878,
      inUseEquipment: 980097,
      underMaintenance: 980097,
    },

    messages: [
      {
        id: 1,
        title: "Mixer needed at Pune site ASAP.",
        team: "Team Steel company",
        time: "2:00 PM",
        priority: "high",
        type: "call",
      },
      {
        id: 2,
        title: "Invoice Received from team",
        team: "Team Steel company",
        time: "1:15 PM",
        priority: "high",
        type: "mail",
      },
    ],

    notifications: [
      {
        id: 1,
        text: "Need to Maintain",
        subText: "Equipment ID ME 98237",
        status: "info",
      },
      {
        id: 2,
        text: "New Maintenance request accepted by admin",
        subText: "Equipment ID ME 98237",
        status: "warning",
      },
      {
        id: 3,
        text: "Project status Updated #OR987654",
        subText: "2 minutes ago",
        status: "success",
      },
    ],
  },

  week: {
    summary: {
      activeProjects: 18,
      projectsClosed: 55,
      drawingsAndApprovals: 120,
      projectTimeline: 20,
    },

    activeProject: {
      name: "Industrial Plant, Mumbai",
      projectId: "#M-45892145",
      location: "Andheri, Mumbai",
      fabricationProgress: 62,
      status: "Steel Erection",
      nextMilestone: "20 April 2026",
    },

    drawings: {
      pending: 12,
      approved: 65,
      revisions: 10,
      rfi: 5,
    },

    financial: {
      totalEquipmentValue: 11250000,
      availableEquipment: 6400000,
      inUseEquipment: 3200000,
      underMaintenance: 1650000,
    },

    messages: [
      {
        id: 1,
        title: "Crane allocation required",
        team: "Mumbai Operations",
        time: "10:30 AM",
        priority: "medium",
        type: "mail",
      },
      {
        id: 2,
        title: "Inspection scheduled",
        team: "QA Team",
        time: "3:00 PM",
        priority: "low",
        type: "calendar",
      },
    ],

    notifications: [
      {
        id: 1,
        text: "New drawing uploaded #ST99012",
        subText: "5 minutes ago",
        status: "success",
      },
      {
        id: 2,
        text: "Equipment service due",
        subText: "Crane ID CR334",
        status: "warning",
      },
    ],
  },

  month: {
    summary: {
      activeProjects: 35,
      projectsClosed: 140,
      drawingsAndApprovals: 420,
      projectTimeline: 60,
    },

    activeProject: {
      name: "Logistics Hub, Bangalore",
      projectId: "#B-77112299",
      location: "Whitefield, Bangalore",
      fabricationProgress: 45,
      status: "Foundation Work",
      nextMilestone: "05 May 2026",
    },

    drawings: {
      pending: 28,
      approved: 210,
      revisions: 34,
      rfi: 18,
    },

    financial: {
      totalEquipmentValue: 28500000,
      availableEquipment: 14800000,
      inUseEquipment: 9800000,
      underMaintenance: 3900000,
    },

    messages: [
      {
        id: 1,
        title: "Monthly safety audit completed",
        team: "Compliance Team",
        time: "Yesterday",
        priority: "low",
        type: "mail",
      },
      {
        id: 2,
        title: "New vendor onboarding",
        team: "Procurement",
        time: "2 days ago",
        priority: "medium",
        type: "mail",
      },
    ],

    notifications: [
      {
        id: 1,
        text: "Monthly report generated",
        subText: "Finance department",
        status: "success",
      },
      {
        id: 2,
        text: "Multiple RFIs pending",
        subText: "Engineering team",
        status: "error",
      },
    ],
  },
};
