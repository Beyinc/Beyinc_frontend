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

const About = ({ profileData, selfProfile, setSelfProfile }) => {
  const [profileAbout, setProfileAbout] = useState("");
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // New state for error handling
  const [role, setRole] = useState("");

  useEffect(() => {
    aboutService.fetchAbout();
  }, []);

  const handleAboutSave = (updatedAbout) => {
    setProfileAbout(updatedAbout); // Update the profileAbout state with the new text
    setErrorMessage(""); // Clear any previous error message
  };
  console.log("profile role", profileData.role);
  useEffect(() => {
    setRole(profileData?.role);
  }, [profileData]);

  return (
    <div>
      {/* <div className="EditProfileImageContainer">
                <img src="/Banner.png" alt="Banner" />
            </div> */}
      <div>
        {/* <div className="flex-col">
                    <ProfileCard />
                </div> */}
        <div>
          <div>
            <AboutCard
              selfProfile={selfProfile}
              setSelfProfile={setSelfProfile}
              role={role}
            />
          </div>

          {(profileData.role === "Mentor" ||
            profileData.role === "Individual/Entrepreneur") && (
            <div>
              {/* <div className=""> */}
              {/*   <SkillsCard */}
              {/*     selfProfile={selfProfile} */}
              {/*     setSelfProfile={setSelfProfile} */}
              {/*   /> */}
              {/* </div> */}

              <div>
                <ExperiencesCard
                  selfProfile={selfProfile}
                  setSelfProfile={setSelfProfile}
                />
              </div>
              <div className="">
                <EducationCard
                  selfProfile={selfProfile}
                  setSelfProfile={setSelfProfile}
                />
              </div>
            </div>
          )}
          <div>
            <UploadCard
              selfProfile={selfProfile}
              setSelfProfile={setSelfProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
