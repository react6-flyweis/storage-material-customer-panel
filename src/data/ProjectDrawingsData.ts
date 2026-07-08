export interface Drawing {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "dwg" | "docx";
  status: "Approved" | "Pending Review" | "Revision Required";
}
export interface Document {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "dwg" | "docx";
  status: "Approved" | "Pending Review" | "Revision Required";
}

export interface ProjectWithDrawings {
  projectName: string;
  projectCode: string;
  uploadedBy: string;
  siteLocation: string;
  lastUpdate: string;
  drawings: Drawing[];
}
export interface ProjectWithDocuments {
  projectName: string;
  projectCode: string;
  uploadedBy: string;
  siteLocation: string;
  lastUpdate: string;
  documents: Document[];
}

export const projectDrawingsMockData: ProjectWithDrawings[] = [
  {
    projectName: "ABC Logistics Warehouse",
    projectCode: "PEB-1021",
    uploadedBy: "Rahul Sharma",
    siteLocation: "Pune, Maharashtra",
    lastUpdate: "25-April-2025",
    drawings: [
      {
        id: "1",
        name: "Architectural Plans.pdf",
        size: "15.2 MB",
        type: "pdf",
        status: "Pending Review",
      },
      {
        id: "2",
        name: "Structural Drawings.dwg",
        size: "15.2 MB",
        type: "dwg",
        status: "Approved",
      },
      {
        id: "3",
        name: "Specifications.docx",
        size: "15.2 MB",
        type: "docx",
        status: "Revision Required",
      },
    ],
  },
  {
    projectName: "Metro Cast Factory Shed",
    projectCode: "PEB-0998",
    uploadedBy: "Rahul Sharma",
    siteLocation: "Ahmedabad, Gujarat",
    lastUpdate: "25-April-2025",
    drawings: [
      {
        id: "4",
        name: "Architectural Plans.pdf",
        size: "15.2 MB",
        type: "pdf",
        status: "Approved",
      },
      {
        id: "5",
        name: "Structural Drawings.dwg",
        size: "15.2 MB",
        type: "dwg",
        status: "Approved",
      },
      {
        id: "6",
        name: "Specifications.docx",
        size: "15.2 MB",
        type: "docx",
        status: "Approved",
      },
    ],
  },
  {
    projectName: "Pebson Agro Storage",
    projectCode: "PEB-0872",
    uploadedBy: "Rahul Sharma",
    siteLocation: "Indore, MP",
    lastUpdate: "25-April-2025",
    drawings: [
      {
        id: "4",
        name: "Architectural Plans.pdf",
        size: "15.2 MB",
        type: "pdf",
        status: "Approved",
      },
      {
        id: "5",
        name: "Structural Drawings.dwg",
        size: "15.2 MB",
        type: "dwg",
        status: "Approved",
      },
      {
        id: "6",
        name: "Specifications.docx",
        size: "15.2 MB",
        type: "docx",
        status: "Approved",
      },
    ],
  },
];

export const projectDocumentsMockData: ProjectWithDocuments[] = [
  {
    projectName: "ABC Logistics Warehouse",
    projectCode: "PEB-1021",
    uploadedBy: "Rahul Sharma",
    siteLocation: "Pune, Maharashtra",
    lastUpdate: "25-April-2025",
    documents: [
      {
        id: "1",
        name: "Agreement",
        size: "15.2 MB",
        type: "pdf",
        status: "Pending Review",
      },
      {
        id: "2",
        name: "Contract",
        size: "15.2 MB",
        type: "dwg",
        status: "Approved",
      },
      {
        id: "3",
        name: "Invoice",
        size: "15.2 MB",
        type: "docx",
        status: "Revision Required",
      },
    ],
  },
  {
    projectName: "Metro Cast Factory Shed",
    projectCode: "PEB-0998",
    uploadedBy: "Rahul Sharma",
    siteLocation: "Ahmedabad, Gujarat",
    lastUpdate: "25-April-2025",
    documents: [
      {
        id: "4",
        name: "Agreement",
        size: "15.2 MB",
        type: "pdf",
        status: "Pending Review",
      },
      {
        id: "5",
        name: "Contract",
        size: "15.2 MB",
        type: "dwg",
        status: "Approved",
      },
      {
        id: "6",
        name: "Invoice",
        size: "15.2 MB",
        type: "docx",
        status: "Approved",
      },
    ],
  },
  {
    projectName: "Pebson Agro Storage",
    projectCode: "PEB-0872",
    uploadedBy: "Rahul Sharma",
    siteLocation: "Indore, MP",
    lastUpdate: "25-April-2025",
    documents: [
      {
        id: "4",
        name: "Agreement",
        size: "15.2 MB",
        type: "pdf",
        status: "Approved",
      },
      {
        id: "5",
        name: "Contract",
        size: "15.2 MB",
        type: "dwg",
        status: "Approved",
      },
      {
        id: "6",
        name: "Invoice",
        size: "15.2 MB",
        type: "docx",
        status: "Approved",
      },
    ],
  },
];
