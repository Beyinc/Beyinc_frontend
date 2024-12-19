import axios from "axios";
import { useEffect, useState } from "react";
import EditAboutModal from "./EditAboutModal"; // Import the EditAboutModal component

const AboutCard = () => {
    const [profileAbout, setProfileAbout] = useState("");
    const [aboutModalOpen, setAboutModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // New state for error handling

    const fetchAbout = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/getabout', {
                userId: "675e7e41e424505620d8faee"
            });
            if (response.data && response.data.about) {
                setProfileAbout(response.data.about);
                console.log("This is the about from backend: ", response.data.about);
            } else {
                console.log("No about data found in the response.");
            }
        } catch (error) {
            console.error("There was an error fetching about: ", error);
            setErrorMessage("Failed to load About data. Please try again.");
        }
    };

    useEffect(() => {
        fetchAbout();
    }, []);

    const handleAboutSave = (updatedAbout) => {
        setProfileAbout(updatedAbout); // Update the profileAbout state with the new text
        setErrorMessage(""); // Clear any previous error message
    };

    return (
        <div>
            <div className="h-[100px] w-[800px] shadow-xl mt-6 border-2 border-black p-3 pt-2 rounded-xl">
                <div className="text-xl font-extrabold text-blue-600 mt-4 flex justify-between">
                    About
                    <span onClick={() => setAboutModalOpen(true)}>
                        <i className="fas fa-pen"></i>
                    </span>
                </div>
                <div className="mt-4">
                    {profileAbout ? profileAbout : "Loading..."}
                </div>
                {errorMessage && (
                    <div className="text-red-500 mt-4">{errorMessage}</div> // Display error message if any
                )}
            </div>
            <EditAboutModal 
                isOpen={aboutModalOpen} 
                onClose={() => setAboutModalOpen(false)} 
                initialValue={profileAbout}
                onSave={handleAboutSave}
            />
        </div>
    )
}

export default AboutCard;
