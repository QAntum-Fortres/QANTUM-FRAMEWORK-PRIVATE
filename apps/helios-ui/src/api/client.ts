import axios from "axios";

// Mock API client for demonstration
export const api = axios.create({
  baseURL: "/api",
});

// Add mock interceptor to simulate data
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Mock response for the demo hook
    if (error.config.url === "/status") {
      return {
        data: {
          activeNodes: 1024,
          entropyLevel: 0.12,
          systemStatus: "OPERATIONAL",
        },
      };
    }
    return Promise.reject(error);
  }
);
