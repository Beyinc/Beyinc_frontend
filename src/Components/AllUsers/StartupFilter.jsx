import React, { useState, useEffect, useCallback } from "react";
import { ApiServices } from "../../Services/ApiServices";
const StartupFilter = () => {
  const [startups, setStartups] = useState([]);
  const [filters, setFilters] = useState({
    userName: "",
    industries: [],
    stage: "",
    targetMarket: [],
    seekingOptions: [],
  });

  // Available filter options
  const industryOptions = [
    "Web3 / AI",
    "Real Estate",
    "Mobility / Logistics",
    "E-commerce",
    "SaaS",
    "FinTech",
    "HealthTech",
    "EdTech",
    "FoodTech",
    "AgriTech",
  ];

  const stageOptions = [
    { value: "idea-stage", label: "Idea Stage" },
    { value: "mvp-development", label: "MVP Development" },
    { value: "early-traction", label: "Early Traction" },
    { value: "scaling-growth", label: "Scaling/Growth" },
    { value: "established", label: "Established" },
  ];

  const targetMarketOptions = [
    "Marketplace",
    "B2B",
    "B2C",
    "B2B2C",
    "Enterprise",
    "SMB",
    "Consumer",
  ];

  const seekingOptions = [
    "Funding",
    "Mentorship",
    "Co-founder",
    "Advisors",
    "Partnerships",
    "Talent",
  ];

  // Function to fetch startup data from backend based on filters
  const fetchStartups = async () => {
    console.log("Current filters:", filters);
    try {
      const response = await ApiServices.FilterStartups(filters);
      setStartups(response.data);
    } catch (error) {
      console.error("Error fetching startups:", error);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [filters]);

  // Function to update filters based on user input
  const updateFilters = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  // Handle checkbox toggle for multi-select filters
  const handleToggleFilter = (filterKey, value) => {
    setFilters((prevFilters) => {
      const currentValues = prevFilters[filterKey];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prevFilters,
        [filterKey]: newValues,
      };
    });
  };

  // Handle text input
  const handleTextInput = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      userName: value,
    }));
  };

  // Handle stage selection (single select)
  const handleStageSelect = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      stage: prevFilters.stage === value ? "" : value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      userName: "",
      industries: [],
      stage: "",
      targetMarket: [],
      seekingOptions: [],
    });
  };

  return {
    startups,
    filters,
    updateFilters,
    handleToggleFilter,
    handleTextInput,
    handleStageSelect,
    clearFilters,
    industryOptions,
    stageOptions,
    targetMarketOptions,
    seekingOptions,
  };
};

export default StartupFilter;
