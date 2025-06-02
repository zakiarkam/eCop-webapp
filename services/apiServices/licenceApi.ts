export type LicenceHolder = {
  _id: string;
  fullName: string;
  nameWithInitials: string;
  dob: string;
  age: number;
  issueDate: string;
  expiryDate: string;
  idNumber: string;
  licenceNumber: string;
  permanentAddress: string;
  currentAddress: string;
  bloodGroup: string;
  vehicleCategories: Array<{
    category: string;
    issueDate: string;
    expiryDate: string;
  }>;
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
  license?: {
    id: string;
    fullName: string;
    licenceNumber: string;
    idNumber: string;
  };
  errors?: string[];
}

export interface CreateLicenceData {
  fullName: string;
  nameWithInitials: string;
  dob: string;
  age: string;
  issueDate: string;
  expiryDate: string;
  idNumber: string;
  licenceNumber: string;
  permanentAddress: string;
  currentAddress: string;
  bloodGroup: string;
  vehicleCategories: string[];
  issueDatePerCategory: Record<string, string>;
  expiryDatePerCategory: Record<string, string>;
}

export interface UpdateLicenceData {
  fullName: string;
  nameWithInitials: string;
  dob: string;
  age: string;
  issueDate: string;
  expiryDate: string;
  idNumber: string;
  licenceNumber: string;
  permanentAddress: string;
  currentAddress: string;
  bloodGroup: string;
  vehicleCategories: string[];
  issueDatePerCategory: Record<string, string>;
  expiryDatePerCategory: Record<string, string>;
}

class LicenceService {
  private baseUrl = "/api/other/licence";

  // Fetch all licence holders
  async getAllLicenceHolders(): Promise<ApiResponse<LicenceHolder[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/getAllHolder`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<LicenceHolder[]> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching licence holders:", error);
      throw new Error("Failed to fetch licence holders");
    }
  }

  // Get a specific licence holder by ID
  async getLicenceHolderById(id: string): Promise<ApiResponse<LicenceHolder>> {
    try {
      const response = await fetch(`${this.baseUrl}/getHolder/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<LicenceHolder> = await response.json();
      return result;
    } catch (error) {
      console.error(`Error fetching licence holder with ID ${id}:`, error);
      throw new Error("Failed to fetch licence holder");
    }
  }

  // Create a new licence holder
  async createLicenceHolder(data: CreateLicenceData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/createHolder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error creating licence holder:", error);
      throw error;
    }
  }

  // Update an existing licence holder
  async updateLicenceHolder(
    id: string,
    data: UpdateLicenceData
  ): Promise<ApiResponse<LicenceHolder>> {
    try {
      const response = await fetch(`${this.baseUrl}/editHolder/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<LicenceHolder> = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error(`Error updating licence holder with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a licence holder
  async deleteLicenceHolder(id: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/deleteHolder/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      return result;
    } catch (error) {
      console.error("Error deleting licence holder:", error);
      throw new Error("Failed to delete licence holder");
    }
  }
}

export const licenceService = new LicenceService();
export default licenceService;
