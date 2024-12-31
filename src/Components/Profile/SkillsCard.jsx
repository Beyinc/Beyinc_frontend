import axios from "axios";
import { useEffect, useState } from "react";
import EditSkillsModal from "./EditSkillsModal";
import aboutService from './aboutPageApi'
import { useSelector } from "react-redux";

const SkillsCard = () => {

    const {
        user_id,
        userName: loggedUserName,
        image: loggedImage,
    } = useSelector((store) => store.auth.loginDetails);

    const [skills, setSkills] = useState([]);
    const [errorMessage, setErrorMessage] = useState(""); 
    const [isModalOpen, setIsModalOpen] = useState(false);


    const fetchSkills = async () => {
        try {
            const fetchedSkills = await aboutService.fetchSkills(user_id);
            setSkills(fetchedSkills);
        } catch (error) {
            setErrorMessage("Failed to load Skills data. Please try again.");
        }
    };


    // const handleSaveSkills = async (skills) => {
    //     try{
    //         const response = await axios.post('http://localhost:4000/api/addSkills',{
    //             skills: skills,
    //             userId: "675e7e41e424505620d8faee"

    //         })
    //         return response;
    //     }catch(error){
    //         console.log("There was an error while adding skills: ", error);

    //     }
    //     setSkills(skills);
    // }

    useEffect(() => {
        fetchSkills();
        console.log(skills)
    }, []);

    return (
      <div lassName=" w-[60vw]">
        <div className="shadow-xl mt-6 border-2 border-black p-5 pt-2  rounded-xl">
          <div className="text-xl font-extrabold text-customPurple mt-4 flex justify-between">
            Skills
            <span onClick={() => setIsModalOpen(true)}>
              <i className="fas fa-pen"></i>
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-200 py-3 px-4 rounded-lg text-sm cursor-pointer"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p>No skills available</p>
            )}
          </div>
          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage}</div>
          )}
        </div>
        <EditSkillsModal
          setSkills={setSkills}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          savedSkills={skills}
        />
      </div>
    );
}

export default SkillsCard;