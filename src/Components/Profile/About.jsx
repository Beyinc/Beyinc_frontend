import axios from "axios";
import { useEffect, useState } from "react";
import EditAboutModal from "./EditAboutModal";
import AboutCard from "./AboutCard";
import SkillsCard from "./SkillsCard";
import EducationCard from "./EducationCard";
import ExperiencesCard from "./ExperienceCard";
import aboutService from "./aboutPageApi";
import ProfileCard from "./ProfileCard";
import UploadCard from "./UploadCard";

const About = () => {
    const [profileAbout, setProfileAbout] = useState("");
    const [aboutModalOpen, setAboutModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // New state for error handling

    useEffect(() => {
        aboutService.fetchAbout();
    }, []);

    const handleAboutSave = (updatedAbout) => {
        setProfileAbout(updatedAbout); // Update the profileAbout state with the new text
        setErrorMessage(""); // Clear any previous error message
    };

    return (
        <div className="flex flex-col w-full">
            {/* <div className="EditProfileImageContainer">
                <img src="/Banner.png" alt="Banner" />
            </div> */}
            <div className="flex gap-10">
                {/* <div className="flex-col">
                    <ProfileCard />
                </div> */}
                <div className="flex-col">
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
                    <div>
                        <UploadCard/>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default About;
