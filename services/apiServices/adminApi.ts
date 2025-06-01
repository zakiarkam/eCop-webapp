interface PendingUser {
  _id: string;
  rmbname: string;
  email: string;
  rmbdistrict: string;
  rmbprovince: string;
  role: string;
  createdAt?: string;
}

interface FetchPendingUsersResponse {
  pendingUsers: PendingUser[];
}

interface ApproveUserRequest {
  userId: string;
  approved: boolean;
}

interface ApproveUserResponse {
  message?: string;
}

export class PendingUsersApiService {
  private static baseUrl = "/api/admin";

  /**
   * Fetch all pending users
   */
  static async fetchPendingUsers(): Promise<PendingUser[]> {
    try {
      const response = await fetch(`${this.baseUrl}/pending-users`);

      if (!response.ok) {
        throw new Error(`Failed to fetch pending users: ${response.status}`);
      }

      const data: FetchPendingUsersResponse = await response.json();
      return data.pendingUsers || [];
    } catch (error) {
      console.error("Error fetching pending users:", error);
      throw error;
    }
  }

  /**
   * Approve or reject a single user
   */
  static async approveUser(
    userId: string,
    approved: boolean
  ): Promise<ApproveUserResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/approve-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, approved } as ApproveUserRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error processing request");
      }

      return await response.json();
    } catch (error) {
      console.error("Error processing user approval:", error);
      throw error;
    }
  }

  /**
   * Bulk approve or reject multiple users
   */
  static async bulkApproveUsers(
    userIds: string[],
    approved: boolean
  ): Promise<void> {
    try {
      const promises = userIds.map((userId) =>
        this.approveUser(userId, approved)
      );

      await Promise.all(promises);
    } catch (error) {
      console.error("Error in bulk action:", error);
      throw error;
    }
  }
}

export const fetchPendingUsers = PendingUsersApiService.fetchPendingUsers;
export const approveUser = PendingUsersApiService.approveUser;
export const bulkApproveUsers = PendingUsersApiService.bulkApproveUsers;
