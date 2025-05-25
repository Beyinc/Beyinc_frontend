import axios from "axios";
import { useEffect, useState } from "react";
import EditSkillsModal from "./EditSkillsModal";
import aboutService from './aboutPageApi'
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
const SkillsCard = ({selfProfile ,setSelfProfile}) => {
 const { id } = useParams();
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
            const fetchedSkills = await aboutService.fetchSkills({user_id,id});
            setSkills(fetchedSkills);
        } catch (error) {
            setErrorMessage("Failed to load Skills data. Please try again.");
        }
    };




    useEffect(() => {
        fetchSkills();
        console.log(skills)
    }, [user_id,id]);

    return (
      <div className="w-full lg:w-[60vw] bg-white rounded-xl">
        <div className="shadow-xl mt-6 border-2 border-black p-5 pt-2  rounded-xl">
          <div className="text-xl font-extrabold text-customPurple mt-4 flex justify-between">
            Skills
            <span onClick={() => setIsModalOpen(true)}>
           { selfProfile &&  <i className="fas fa-pen"></i>}
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