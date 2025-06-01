export type RuleType = {
  _id: string;
  section: string;
  provision: string;
  fine: string;
  points: number;
  createdAt: string;
};

export interface ApiResponse {
  message: string;
  rule?: RuleType;
  rules?: RuleType[];
  errors?: string[];
}

export interface CreateRuleData {
  section: string;
  provision: string;
  fine: string;
  points: number;
}

export interface UpdateRuleData extends CreateRuleData {
  _id: string;
}

class RulesApiService {
  private baseUrl = "/api/other/rules";

  //Fetch all rules from the server

  async getAllRules(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/getAllRules`);
      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error fetching rules:", error);
      throw error;
    }
  }

  //Create a new rule

  async createRule(ruleData: CreateRuleData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/createRule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...ruleData,
          points: Number(ruleData.points),
        }),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error creating rule:", error);
      throw error;
    }
  }

  //Update an existing rule

  async updateRule(
    ruleId: string,
    ruleData: CreateRuleData
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/editRule/${ruleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...ruleData,
          points: Number(ruleData.points),
        }),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error updating rule:", error);
      throw error;
    }
  }

  // Delete a rule

  async deleteRule(ruleId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/deleteRule/${ruleId}`, {
        method: "DELETE",
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error deleting rule:", error);
      throw error;
    }
  }

  //Get a single rule by ID

  async getRuleById(ruleId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/getRule/${ruleId}`);
      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error fetching rule:", error);
      throw error;
    }
  }

  // Validate rule data before submission

  validateRuleData(ruleData: Partial<CreateRuleData>): string | null {
    if (
      !ruleData.section ||
      !ruleData.provision ||
      !ruleData.fine ||
      ruleData.points === undefined
    ) {
      return "All fields are required!";
    }

    const points = Number(ruleData.points);
    if (isNaN(points) || points < 0 || points > 10) {
      return "Points must be between 0 and 10!";
    }

    return null;
  }
}

export const rulesApiService = new RulesApiService();

export default RulesApiService;
