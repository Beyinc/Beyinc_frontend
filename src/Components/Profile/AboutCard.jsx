// AboutCard.js
import { useEffect, useState } from "react";
import aboutService from "./aboutPageApi"; // Import the fetchAbout function from the api.js file
import EditAboutModal from "./EditAboutModal";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";

export const ABOUT_TEMPLATES = {
  startup: `🚀 About

TechVenture is an early-stage startup focused on building meaningful solutions to real-world problems. The team is driven by impact, clarity, and long-term value creation.

🎯 Problem Statement

Describe the core problem your target users face today. Focus on what is broken, inefficient, or missing in existing solutions.

🛠 What We’re Building

Explain what you’re building and how it helps users. Keep it outcome-driven and easy to understand.

💡 Value Proposition

Clearly state why your product matters and what value it delivers. Mention improvements like time saved, cost reduced, or efficiency gained if possible.
`,

  individual: `👤 About

John Foley is a motivated professional with experience working on web and digital products. He enjoys learning, building useful things, and solving real-world problems.

📌 Background

Briefly describe your experience, skills, or interests. Share what you’ve worked on and what you’re good at.

⚙️ What You Do

Explain what you currently work on or what you’re focused on learning or building.

🔍 What You’re Looking For

Share opportunities, collaborations, or goals you’re open to.
`,

  mentor: `🎓 About

John Foley is an experienced mentor who works with founders and individuals to build better products and teams. His guidance is practical, honest, and experience-driven.

🧠 Expertise

List your core skills, domains, or areas where you provide guidance.

🏆 Experience

Highlight your professional background, key roles, or notable achievements.

🤝 How You Help

Explain how you support founders, teams, or individuals and the impact you aim to create.
`,
};
const AboutCard = ({ selfProfile, setSelfProfile, role, profileData }) => {
  const {
    user_id,
    userName: loggedUserName,
    image: loggedImage,
  } = useSelector((store) => store.auth.loginDetails);

  const [profileAbout, setProfileAbout] = useState("");
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isAboutLoading, setIsAboutLoading] = useState(true);
  const { id } = useParams(); // Get the `id` from route params
  // console.log('id: ' + id);
  const navigate = useNavigate();

  const getDefaultTemplate = (role) => {
    if (role === "Startup") return ABOUT_TEMPLATES.startup;
    if (role === "Mentor") return ABOUT_TEMPLATES.mentor;
    return ABOUT_TEMPLATES.individual;
  };

  const defaultTemplate = getDefaultTemplate(role);
  const getAbout = async () => {
    try {
      setIsAboutLoading(true);

      const about = await aboutService.fetchAbout({ id, user_id });

      if (about && about.trim() !== "") {
        setProfileAbout(about);
      } else {
        setProfileAbout(""); // empty but intentional
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsAboutLoading(false);
    }
  };

  useEffect(() => {
    getAbout();
  }, []);

  const handleAboutSave = async (updatedAbout) => {
    setProfileAbout(updatedAbout);
    setErrorMessage("");

    // console.log("normal call");
    const hasAboutField =
      profileData && Object.prototype.hasOwnProperty.call(profileData, "about");

    if (!hasAboutField) {
      try {
        // console.log("calling when no about");
        await ApiServices.UpdateBeyincProfile({
          beyincProfile: role,
        });
      } catch (error) {
        console.error("Error updating beyincProfile:", error);
      }
    }

    navigate("/editProfile");
  };

  // console.log(role);
  return (
    <div className="w-full grow bg-white rounded-xl h-32 ">
      <div className="min-h-[100px] shadow-xl mt-6 border-2 border-black p-5 pt-2 rounded-xl">
        <div className="text-xl font-extrabold text-customPurple mt-4 flex justify-between">
          About
          <span onClick={() => setAboutModalOpen(true)}>
            {selfProfile && <i className="fas fa-pen"></i>}
          </span>
        </div>

        <div
          className="mt-4 text-container"
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {isAboutLoading ? (
            <div className="text-gray-300 italic">Loading about…</div>
          ) : profileAbout && profileAbout.trim() !== "" ? (
            profileAbout
          ) : (
            defaultTemplate
          )}
        </div>

        {errorMessage && (
          <div className="text-red-500 mt-4">{errorMessage}</div>
        )}
      </div>
      <EditAboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        initialValue={
          profileAbout && profileAbout.trim() !== ""
            ? profileAbout
            : defaultTemplate
        }
        onSave={handleAboutSave}
      />
    </div>
  );
};

export default AboutCard;
