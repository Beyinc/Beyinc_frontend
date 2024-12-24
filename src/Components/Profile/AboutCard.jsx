// AboutCard.js
import { useEffect, useState } from "react";
import aboutService from './aboutPageApi';  // Import the fetchAbout function from the api.js file
import EditAboutModal from "./EditAboutModal";

const AboutCard = () => {
    const [profileAbout, setProfileAbout] = useState("");
    const [aboutModalOpen, setAboutModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getAbout = async () => {
        try {
            const about = await aboutService.fetchAbout("675e7e41e424505620d8faee"); // Pass the user ID
            setProfileAbout(about);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        getAbout();
    }, []);

    const handleAboutSave = (updatedAbout) => {
        setProfileAbout(updatedAbout);
        setErrorMessage("");
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
                    <div className="text-red-500 mt-4">{errorMessage}</div> 
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
