export type ViolationRecord = {
  _id: string;
  username: string;
  licenceNumber: string;
  vehicleNumber: string;
  mobileNumber: string;
  sectionOfAct: string;
  provision: string;
  fineAmount: number;
  policeNumber: string;
  policeStation: string;
  violationArea: string;
  violationDate: string;
  status: "Pending" | "Paid" | "Overdue" | "Cancelled";
  points: number;
  notes?: string;
};

export interface ViolationApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
  errors?: string[];
}

export interface CreateViolationData {
  licenceNumber: string;
  policeNumber: string;
  phoneNumber: string;
  vehicleNumber: string;
  placeOfViolation: string;
  ruleId: string;
  notes?: string;
}

export interface ViolationFilters {
  licenceNumber?: string;
  policeNumber?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

class ViolationService {
  private baseUrl = "/api/other/violations";

  async createViolation(
    data: CreateViolationData
  ): Promise<ViolationApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ViolationApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error creating violation:", error);
      throw error;
    }
  }

  // Get all violations with optional filters
  async getAllViolations(
    filters?: ViolationFilters
  ): Promise<ViolationApiResponse<ViolationRecord[]>> {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, value);
          }
        });
      }

      const url = queryParams.toString()
        ? `${this.baseUrl}/getAll?${queryParams.toString()}`
        : `${this.baseUrl}/getAll`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ViolationApiResponse<ViolationRecord[]> =
        await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching violations:", error);
      throw new Error("Failed to fetch violations");
    }
  }

  // Get violations by licence holder ID
  async getViolationsByLicenceHolder(
    licenceHolderId: string
  ): Promise<ViolationApiResponse<ViolationRecord[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/licence/${licenceHolderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ViolationApiResponse<ViolationRecord[]> =
        await response.json();
      return result;
    } catch (error) {
      console.error(
        `Error fetching violations for licence holder ${licenceHolderId}:`,
        error
      );
      throw new Error("Failed to fetch licence holder violations");
    }
  }

  // Get violations by police officer ID
  async getViolationsByPoliceOfficer(
    policeOfficerId: string
  ): Promise<ViolationApiResponse<ViolationRecord[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/police/${policeOfficerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ViolationApiResponse<ViolationRecord[]> =
        await response.json();
      return result;
    } catch (error) {
      console.error(
        `Error fetching violations for police officer ${policeOfficerId}:`,
        error
      );
      throw new Error("Failed to fetch police officer violations");
    }
  }

  // Get violations by licence number
  async getViolationsByLicenceNumber(
    licenceNumber: string
  ): Promise<ViolationApiResponse<ViolationRecord[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/licenceNumber/${licenceNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ViolationApiResponse<ViolationRecord[]> =
        await response.json();
      return result;
    } catch (error) {
      console.error(
        `Error fetching violations for licence number ${licenceNumber}:`,
        error
      );
      throw new Error("Failed to fetch violations by licence number");
    }
  }

  // Get a specific violation by ID
  async getViolationById(
    id: string
  ): Promise<ViolationApiResponse<ViolationRecord>> {
    try {
      const response = await fetch(`${this.baseUrl}/get/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ViolationApiResponse<ViolationRecord> =
        await response.json();
      return result;
    } catch (error) {
      console.error(`Error fetching violation with ID ${id}:`, error);
      throw new Error("Failed to fetch violation");
    }
  }

  // Validate violation data before submission
  validateViolationData(data: Partial<CreateViolationData>): string | null {
    if (
      !data.licenceNumber ||
      !data.policeNumber ||
      !data.phoneNumber ||
      !data.vehicleNumber ||
      !data.placeOfViolation ||
      !data.ruleId
    ) {
      return "All required fields must be filled!";
    }

    // Validate vehicle number format (basic Sri Lankan format)
    const vehicleNumberPattern = /^[A-Z]{2,3}-\d{4}$/;
    if (!vehicleNumberPattern.test(data.vehicleNumber?.toUpperCase() || "")) {
      return "Invalid vehicle number format! Use format like: ABC-1234";
    }

    // Validate phone number (Sri Lankan format)
    const phonePattern = /^(?:\+94|0)?[0-9]{9}$/;
    if (!phonePattern.test(data.phoneNumber?.replace(/\s/g, "") || "")) {
      return "Invalid phone number format!";
    }

    return null;
  }
}

export const violationService = new ViolationService();
export default violationService;
