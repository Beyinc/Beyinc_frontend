// aboutService.js
import axios from 'axios';
import axiosInstance from '../axiosInstance';

const aboutService = {
    // Function to fetch the About data
    fetchAbout: async (obj) => {
        try {
            const response = await axiosInstance.post('/getabout', obj);
            if (response.data && response.data.about) {
                return response.data.about;
            } else {
                console.log("No about data found in the response.");
                return null;
            }
        } catch (error) {
            console.error("There was an error fetching about: ", error);
            throw new Error("Failed to load About data. Please try again.");
        }
    },

    // Function to save about information
    saveAbout: async (userId, aboutText) => {
        try {
            const response = await axiosInstance.post('/createAbout', {
                
                about: aboutText
            });

            if (response.status === 200 && response.data.success) {
                return response.data.about;  // Return the updated about data
            } else {
                throw new Error(response.data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            throw new Error(error.response ? error.response.data.message : "Network error. Please check your connection.");
        }
    },
    fetchEducation: async (obj) => {
        try {
            const response = await axiosInstance.post('/getEducationDetails',obj);

            if (response.data && response.data.educationDetails) {
                return response.data.educationDetails;  // Return education details if found
            } else {
                return [];  // Return an empty array if no education details are found
            }
        } catch (error) {
            console.error("There was an error fetching education: ", error);
            throw new Error(error.response?.data || error.message);
        }
    },

    // Function to delete an education item
    handleDeleteEducation: async (userId, eduId) => {
        try {
            const response = await axiosInstance.post('/deleteEducationDetails', {
                _id: eduId
            });

            if (response.status === 200 && response.data.success) {
                return true; // Successfully deleted
            } else {
                throw new Error(response.data.message || "Failed to delete education.");
            }
        } catch (error) {
            console.error("There was an error while deleting the education: ", error);
            throw new Error(error.response?.data || error.message);
        }
    },
    saveEducation: async (userId, educationDetails) => {
        try {
            const response = await axiosInstance.post('/saveEducationDetails', {
                education: educationDetails
            });

            if (response.status === 200) {
                return response.data.educationDetails; // Return saved education details
            } else {
                throw new Error(response.data.message || "Failed to save education.");
            }
        } catch (error) {
            throw new Error(error.response?.data.message || "Network error. Please check your connection.");
        }
    },

    // Function to update education details
    saveUpdatedEducation: async (educationDetails) => {
        try {
            const response = await axiosInstance.post('/updateEducationDetails', {
                education: educationDetails
            });

            if (response.status === 200) {
                return response.data.educationDetails;  // Return the updated education details
            } else {
                throw new Error(response.data.message || "Failed to update education.");
            }
        } catch (error) {
            console.error("There was an error while updating education: ", error);
            throw new Error(error.response?.data.message || "Network error. Please check your connection.");
        }
    },

    saveUpdatedEducation: async (payload) => {
        try {
            // console.log("This is the start year: ", startYear);
            const response = await axiosInstance.post('/updateEducationDetails', {
                payload
            });

            if (response.status === 200) {
                return response.data.educationDetails;
            } else {
                throw new Error("Failed to update education");
            }
        } catch (error) {
            console.error("There was an error while saving Experience", error);
            throw error;  // Re-throw the error so it can be handled by the caller
        }
    },
    fetchExperiences: async (obj) => {
        try {
            const response = await axiosInstance.post('/getExperienceDetails',obj);

            if (response.data && response.data.experienceDetails) {
                return response.data.experienceDetails;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error fetching experiences: ", error);
            throw error;  // Re-throw the error to be handled in the calling component
        }
    },

    // Function to handle deleting experiences
    handleDeleteExperience: async (eduId) => {
        try {
            console.log("This is the eduId of the experience: ", eduId);
            const response = await axiosInstance.post('/deleteExperienceDetails', {
                _id: eduId
            });

            return response.data;  // Assuming the response contains the updated experiences or success message
        } catch (error) {
            console.error("Error deleting experience: ", error);
            throw error;  // Re-throw the error to be handled in the calling component
        }
    },
    addExperience: async (experienceData) => {
        try {
            const response = await axiosInstance.post('/saveExperienceDetails', {
                experience: experienceData,
            });
            return response.data; // Assuming the API response contains success status and experience details
        } catch (error) {
            console.error('Error adding experience: ', error);
            throw error; // Re-throw error for handling in component
        }
    },
    handleUpdateExperience: async (item, startYear, endYear, company, designation, location, setExperiences, onClose) => {
        try {
            const response = await axiosInstance.post('/updateExperienceDetails', {
                experience: {
                    _id: item._id,
                    startYear,
                    endYear,
                    company,
                    designation,
                    CompanyLocation: location
                }
            });

            console.log("This is the response: ", response);
            if (response.data && response.data.success === true) {
                setExperiences(response.data.experienceDetails);
                onClose();
            }
        } catch (error) {
            console.log("There was an error Updating the Experience: ", error);
        }
    },
    fetchSkills: async (obj) => {
        try {
            const response = await axiosInstance.post('/getSkills', obj);

            if (response.data && response.data.skills) {
                return response.data.skills;
            } else {
                console.log("No skills data found in the response.");
                return [];
            }
        } catch (error) {
            console.error("There was an error fetching skills: ", error);
            throw new Error("Failed to load skills. Please try again.");
        }
    },
    handleAddSkill: async (setSelectedSkills, selectedSkills, skillsToDelete, setSkills, onClose) => {
        try {
            console.log("Skills To Delete: ", skillsToDelete);
            console.log("Selected Skills: ", selectedSkills);

            let response;

            // Add selected skills
            if (selectedSkills.length > 0) {
                response = await axiosInstance.post('/addskills', {
                    skills: selectedSkills
                });
            }

            // If response is successful
            if (response && response.status === 200) {
                setSkills(response.data.skills);
            }

            // Delete skills if there are any
            if (skillsToDelete.length > 0) {
                await aboutService.handleDeleteSkill(skillsToDelete, setSkills, onClose);
            }

            // Close modal and reset selected skills
            setSelectedSkills([]);
            onClose();
        } catch (error) {
            console.log("There was some error while adding skills: ", error);
        }
    },

    handleDeleteSkill: async (skillsToDelete, setSkills, onClose) => {
        try {
            const response = await axiosInstance.post('/deleteSkill', {
                skillsToDelete
            });

            if (response.data.skills) {
                setSkills(response.data.skills);
                onClose();
            }
        } catch (error) {
            console.log("There was an error while deleting the skill: ", error);
        }
    }
};

export default aboutService;
