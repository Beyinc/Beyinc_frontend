// AboutCard.js
import { useEffect, useState } from "react";
import aboutService from './aboutPageApi';  // Import the fetchAbout function from the api.js file
import EditAboutModal from "./EditAboutModal";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
const AboutCard = ( {selfProfile ,setSelfProfile} ) => {
    
    const {
        user_id,
        userName: loggedUserName,
        image: loggedImage,
    } = useSelector((store) => store.auth.loginDetails);

    const [profileAbout, setProfileAbout] = useState("");
    const [aboutModalOpen, setAboutModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
   

    const { id } = useParams(); // Get the `id` from route params
    // console.log('id: ' + id);
    const getAbout = async () => {
      try {
          const about = await aboutService.fetchAbout({  id , user_id }); // Pass an object with the key 'id'
          console.log('about', about);
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
      <div className="w-full grow bg-white rounded-xl">
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
              maxHeight: "200px", // Set a max height for the container
              overflowY: "auto", // Enable vertical scrolling if content exceeds maxHeight
              wordWrap: "break-word", // Ensure long words or URLs wrap properly
              whiteSpace: "pre-wrap", // Preserve whitespace and line breaks
            }}
          >
            {profileAbout || "No information provided."}
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
    );
}

export default AboutCard;
