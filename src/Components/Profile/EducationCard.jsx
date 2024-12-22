import axios from "axios";
import { useEffect, useState } from "react";
import EditEducationModal from "./EditEducationModal";
import DeleteEducationModal from "./DeleteEducationModal";
import UpdateEducationModal from "./UpdateEducationModal";

const EducationCard = () => {
    const [education, setEducation] = useState([]);
    const [isEditEducationModalOpen, setIsEditEducationModalOpen] = useState(false); 
    const [errorMessage, setErrorMessage] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState(false);
    const [eduItem, setEduItem] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);


    const fetchEducation = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/getEducationDetails', {
                userId: "675e7e41e424505620d8faee"
            });

            if (response.data && response.data.educationDetails) {
                setEducation(response.data.educationDetails);
            } else {
                setEducation([]);
            }
        } catch (error) {
            console.log("There was an error while fetching education: ", error);
            setErrorMessage(error.response?.data || error.message); 
        }
    };

    const handleDeleteEducation = async (eduId) => {
        try {
            const response = await axios.post('http://localhost:4000/api/deleteEducationDetails', {
                userId: "675e7e41e424505620d8faee",
                _id: eduId
            })

            fetchEducation();



        } catch (error) {
            console.log("There was an error while deleting the education: ", error);
        }
    }

    const handleDeleteModalOpen = (item) => {
        setIsDeleteModalOpen(true);
        setSelectedForDeletion(item);
    }

    const handleOpenUpdateModal = (item) => {
        setEduItem(item);
        setIsUpdateModalOpen(true);

    }

    
    useEffect(() => {
        if (eduItem) {
            console.log("Updated eduItem: ", eduItem); 
        }
    }, [eduItem]);

    useEffect(() => {
        fetchEducation(); 
    }, []); 

    // useEffect(() => {
    //     console.log("Updated Education Data:", education);
    // }, [education]);

    return (
        <div>
            <div className="w-[800px] shadow-xl mt-6 border-2 border-black p-5 pt-2 rounded-xl mb-4">
                <div className="text-xl font-extrabold text-blue-600 mt-4 flex justify-between">
                    Education
                    <span onClick={() => {
                        setIsEditEducationModalOpen(true)

                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </span>

                </div>

                {/* error message  */}
                {errorMessage && (
                    <div className="text-red-500 mt-4">{errorMessage}</div>
                )}

                <div className="mt-4">
                    {education.length === 0 ? (
                        <p>No education details found</p>
                    ) : (
                        education.map((item, index) => (
                            <div key={index}>
                                {/* Education Item */}
                                <div className="flex flex-row items-start space-x-4">
                                    {/* SVG Icon */}
                                    <span >
                                        <svg
                                            width="50"
                                            height="50"
                                            viewBox="0 0 50 50"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect
                                                width="50"
                                                height="50"
                                                rx="5"
                                                fill="var(--followBtn-bg)"
                                                fillOpacity="0.3"
                                            />
                                            <path
                                                d="M25.0001 10L6.66675 20L25.0001 30L40.0001 21.8167V33.3333H43.3334V20M13.3334 26.9667V33.6333L25.0001 40L36.6667 33.6333V26.9667L25.0001 33.3333L13.3334 26.9667Z"
                                                fill="var(--followBtn-bg)"
                                            />
                                        </svg>
                                    </span>
                                    {/* Information Section */}
                                    <div className="flex justify-between w-full ">
                                        <div className="-space-y-1 text-base">
                                            <div className="font-semibold text-blue-700 ">{item.college}</div>
                                            <div>{item.grade}</div>
                                            <div>{item.Edstart} - {item.Edend}</div>
                                        </div>
                                        <div className="text-blue-700 flex items-center">
                                            <span onClick={() => handleOpenUpdateModal(item)}>
                                                <i className="fas fa-pen"></i>
                                            </span>
                                            <span className="hover:scale-125 transition-transform" onClick={() => handleDeleteModalOpen(item)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </span>

                                        </div>
                                    </div>
                                </div>

                                {/* Horizontal line between items, not after the last one */}
                                {index !== education.length - 1 && (
                                    <hr className="my-4 border-t-1 border-gray-700" />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <EditEducationModal
                
                setEducation={setEducation}
                isOpen={isEditEducationModalOpen}
                onClose={() => setIsEditEducationModalOpen(false)}
            />
            <UpdateEducationModal 
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            setEducation={setEducation}

            item={eduItem}
            />
            
            <DeleteEducationModal onDelete={handleDeleteEducation} isOpen={isDeleteModalOpen} item={selectedForDeletion} onClose={() => setIsDeleteModalOpen(false)} />
        </div >
    );
};

export default EducationCard;
