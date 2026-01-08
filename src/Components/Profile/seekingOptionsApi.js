// seekingOptionsApi.js - Use axiosInstance like aboutService.js

import axiosInstance from "../axiosInstance";

const seekingOptionsService = {
  // Fetch seeking options
  fetchSeekingOptions: async (obj) => {
    try {
      const response = await axiosInstance.post("/getSeekingOptions", obj);

      if (response.data && response.data.seekingOptions) {
        return response.data.seekingOptions;
      } else {
        console.log("No seeking options found in the response.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching seeking options:", error);
      throw new Error("Failed to load seeking options. Please try again.");
    }
  },

  // Save seeking options
  saveSeekingOptions: async (seekingOptions) => {
    try {
      const response = await axiosInstance.post("/saveSeekingOptions", {
        seekingOptions,
      });

      return response.data;
    } catch (error) {
      console.error("Error saving seeking options:", error);
      throw new Error(
        error.response?.data?.message || "Failed to save seeking options",
      );
    }
  },
};

export default seekingOptionsService;
