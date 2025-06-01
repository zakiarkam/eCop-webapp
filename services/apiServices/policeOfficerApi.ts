export interface PoliceOfficerFormData {
  fullName: string;
  nameWithInitials: string;
  dob: string;
  policeNumber: string;
  idNumber: string;
  permanentAddress: string;
  district: string;
  province: string;
  policeStation: string;
  badgeNo: string;
  phoneNumber: string;
  rank: string;
  joiningDate: string;
  bloodGroup: string;
  age: string;
}

export interface PoliceOfficer extends PoliceOfficerFormData {
  _id: string;
  age: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  officer?: {
    id: string;
    fullName: string;
    policeNumber: string;
    badgeNo: string;
  };
  errors?: string[];
  total?: number;
}

class PoliceOfficerAPI {
  private baseUrl = "/api/other/policeOfficer";

  // Create a new police officer

  async createOfficer(formData: PoliceOfficerFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/createOfficer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error creating police officer:", error);
      throw error;
    }
  }

  // Get all police officers

  async getAllOfficers(): Promise<ApiResponse<PoliceOfficer[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/getAllOfficers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<PoliceOfficer[]> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching police officers:", error);
      throw error;
    }
  }

  //Get a single police officer by ID

  async getOfficer(officerId: string): Promise<ApiResponse<PoliceOfficer>> {
    try {
      const response = await fetch(`${this.baseUrl}/getOfficer/${officerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<PoliceOfficer> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching police officer:", error);
      throw error;
    }
  }

  //Update a police officer

  async updateOfficer(
    officerId: string,
    formData: Partial<PoliceOfficerFormData>
  ): Promise<ApiResponse<PoliceOfficer>> {
    try {
      const response = await fetch(`${this.baseUrl}/editOfficer/${officerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error updating police officer:", error);
      throw error;
    }
  }

  //Delete a police officer

  async deleteOfficer(officerId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/deleteOfficer/${officerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok && !result.success) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error deleting police officer:", error);
      throw error;
    }
  }
}

export const policeOfficerAPI = new PoliceOfficerAPI();

export const {
  createOfficer,
  getAllOfficers,
  getOfficer,
  updateOfficer,
  deleteOfficer,
} = policeOfficerAPI;
