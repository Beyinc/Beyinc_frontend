import axios from "axios";
import { useEffect, useState } from "react";

const SkillsCard = () => {
    const [skills, setSkills] = useState([]);
    const [errorMessage, setErrorMessage] = useState(""); // New state for error handling


    const fetchAbout = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/getSkills', {
                userId: "675e7e41e424505620d8faee"
            });
            if (response.data && response.data.skills) {
                setSkills(response.data.skills);
                console.log("This is the about from backend: ", response.data.skills);
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
        console.log(skills)
    }, []);

    return (
        <div>
            <div className="h-[100px] w-[800px] shadow-xl mt-6 border-2 border-black p-3 pt-2 rounded-xl">
                <div className="text-xl font-extrabold text-blue-600 mt-4 flex justify-between">
                    Skills
                    <span >
                        <i className="fas fa-pen"></i>
                    </span>
                </div>
                <div className="mt-4">
                    {/* {profileAbout ? profileAbout : "Loading..."} */}
                </div>
                {errorMessage && (
                    <div className="text-red-500 mt-4">{errorMessage}</div> // Display error message if any
                )}
            </div>

        </div>
    )
}

export default SkillsCard;