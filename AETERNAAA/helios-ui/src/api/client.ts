// src/api/client.ts
// Simple Fetch wrapper to emulate Axios/ApiClient
export const api = {
  get: async (url: string) => {
    // In a real app, this would be fetch(BASE_URL + url)
    // For now, we mock the response for the dashboard metrics
    if (url === "/status") {
      return {
        data: {
          activeNodes: 243,
          entropyLevel: 0.12,
          systemStatus: "OPERATIONAL",
        },
      };
    }
    throw new Error("Endpoint not mocked");
  },
};
