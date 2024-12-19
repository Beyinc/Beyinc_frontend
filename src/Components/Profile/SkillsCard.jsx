import axios from "axios";
import { useEffect, useState } from "react";

const SkillsCard = () => {
    const [skills, setSkills] = useState([]);
    const [errorMessage, setErrorMessage] = useState(""); // New state for error handling


    const fetchSkills = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/getSkills', {
                userId: "675e7e41e424505620d8faee"
            });
            if (response.data && response.data.skills) {
                setSkills(response.data.skills);
                console.log("This is the about from backend: ", skills);
            } else {
                console.log("No about data found in the response.");
            }
        } catch (error) {
            console.error("There was an error fetching about: ", error);
            setErrorMessage("Failed to load About data. Please try again.");
        }
    };

    useEffect(() => {
        fetchSkills();
        console.log(skills)
    }, []);

    return (
        <div>
            <div className="h-[100px] w-[800px] shadow-xl mt-6 border-2 border-black p-5 pt-2  rounded-xl">
                <div className="text-xl font-extrabold text-blue-600 mt-4 flex justify-between">
                    Skills
                    <span >
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
                    <div className="text-red-500 mt-4">{errorMessage}</div> // Display error message if any
                )}
            </div>

        </div>
    )
}

export default SkillsCard;