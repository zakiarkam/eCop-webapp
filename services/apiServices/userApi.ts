export type UserData = {
  id: string;
  rmbname: string;
  rmbdistrict: string;
  rmbprovince: string;
  email: string;
  mobilenumber: string;
  idnumber: string;
  role: string;
  isApproved: boolean;
  approvedAt: string;
  updatedAt: string;
};

export type UpdateUserData = {
  rmbname: string;
  rmbdistrict: string;
  email: string;
  mobilenumber: string;
  idnumber: string;
  role: string;
  isApproved: boolean;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
};

export type GetUsersParams = {
  role?: string;
  isApproved?: string;
};

class UserApiService {
  private baseUrl = "/api/other/user";

  //Fetch all users with optional filtering

  async getAllUsers(params?: GetUsersParams): Promise<ApiResponse<UserData[]>> {
    try {
      const searchParams = new URLSearchParams();

      if (params?.role) {
        searchParams.append("role", params.role);
      }

      if (params?.isApproved !== undefined && params.isApproved !== "") {
        searchParams.append("isApproved", params.isApproved);
      }

      const url = `${this.baseUrl}/getAllUser${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<UserData[]> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error(
        `Failed to fetch users: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Update a user by ID

  async updateUser(
    userId: string,
    userData: UpdateUserData
  ): Promise<ApiResponse<UserData>> {
    try {
      const response = await fetch(`${this.baseUrl}/editUser/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<UserData> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update user");
      }

      return result;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error(
        `Failed to update user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  //Delete a user by ID

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/deleteUser/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<void> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete user");
      }

      return result;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error(
        `Failed to delete user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Get a single user by ID

  async getUserById(userId: string): Promise<ApiResponse<UserData>> {
    try {
      const response = await fetch(`${this.baseUrl}/getUser/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<UserData> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch user");
      }

      return result;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error(
        `Failed to fetch user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export const userApiService = new UserApiService();

export default UserApiService;
