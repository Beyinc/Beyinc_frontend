import axios from "axios";
import { useEffect, useState } from "react";
import EditAboutModal from "./EditAboutModal";
import AboutCard from "./AboutCard";
import SkillsCard from "./SkillsCard";
import EducationCard from "./EducationCard";
import ExperiencesCard from "./ExperienceCard";
import aboutService from "./aboutPageApi";

const About = () => {
    const [profileAbout, setProfileAbout] = useState("");
    const [aboutModalOpen, setAboutModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // New state for error handling

    // const fetchAbout = async () => {
    //     try {
    //         const response = await axios.post('http://localhost:4000/api/getabout', {
    //             userId: "675e7e41e424505620d8faee"
    //         });
    //         if (response.data && response.data.about) {
    //             setProfileAbout(response.data.about);
    //             // console.log("This is the about from backend: ", response.data.about);
    //         } else {
    //             console.log("No about data found in the response.");
    //         }
    //     } catch (error) {
    //         console.error("There was an error fetching about: ", error);
    //         setErrorMessage("Failed to load About data. Please try again.");
    //     }
    // };

    useEffect(() => {
        aboutService.fetchAbout();
    }, []);

    const handleAboutSave = (updatedAbout) => {
        setProfileAbout(updatedAbout); // Update the profileAbout state with the new text
        setErrorMessage(""); // Clear any previous error message
    };

    return (
        <div className="flex justify-center items-center flex-col">
            <div className="EditProfileImageContainer">
                <img src="/Banner.png" alt="Banner" />
            </div>
            <div>
                <AboutCard />
            </div>
            <div className="">
                <SkillsCard />
            </div>
            <div className="">
                <EducationCard />
            </div>
            <div>
                <ExperiencesCard />
            </div>

        </div>
    );
};

export default About;
