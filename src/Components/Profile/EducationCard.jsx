import { useEffect, useState } from "react";
import EditEducationModal from "./EditEducationModal";
import DeleteEducationModal from "./DeleteEducationModal";
import UpdateEducationModal from "./UpdateEducationModal";
import aboutService from './aboutPageApi'
import { useParams } from "react-router-dom";
const EducationCard = ({selfProfile ,setSelfProfile}) => {
    const [education, setEducation] = useState([]);
    const [isEditEducationModalOpen, setIsEditEducationModalOpen] = useState(false); 
    const [errorMessage, setErrorMessage] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState(false);
    const [eduItem, setEduItem] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);


    const { id } = useParams(); // Get the `id` from route params

    const fetchEducationData = async () => {
        try {
        // This could be dynamic
            const data = await aboutService.fetchEducation({id});  // Use the service method to fetch education data
            setEducation(data);
        } catch (error) {
            console.log("Error fetching education data: ", error);
            setErrorMessage(error.message);
        }
    };

    const handleDeleteEducation = async (eduId) => {
        try {
            const userId = "675e7e41e424505620d8faee";  // This could be dynamic
            const success = await aboutService.handleDeleteEducation(userId, eduId);  // Use the service method to delete the education item

            if (success) {
                fetchEducationData();  // Refetch the education data after deletion
            }
        } catch (error) {
            console.log("Error deleting education: ", error);
        }
    };

    const handleDeleteModalOpen = (item) => {
        setIsDeleteModalOpen(true);
        setSelectedForDeletion(item);
    };

    const handleOpenUpdateModal = (item) => {
        setEduItem(item);
        setIsUpdateModalOpen(true);
    };

    useEffect(() => {
        fetchEducationData();  // Fetch education data when the component mounts
    }, []);

    useEffect(() => {
        if (eduItem) {
            console.log("Updated eduItem: ", eduItem); 
        }
    }, [eduItem]);

    return (
      <div className="w-full lg:w-[60nw] bg-white rounded-xl">
        <div className="shadow-xl mt-6 border-2 border-black p-5 pt-2 rounded-xl mb-4">
          <div className="text-xl font-extrabold text-customPurple mt-4 flex justify-between">
            Education
           {selfProfile && <span onClick={() => setIsEditEducationModalOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </span>}
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
                    <span>
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
                        <div className="font-semibold text-blue-700 ">
                          {item.college}
                        </div>
                        <div>{item.grade}</div>
                        <div>
                          {item.Edstart} - {item.Edend}
                        </div>
                      </div>
                     {selfProfile && <div className="text-blue-700 flex items-center">
                        <span onClick={() => handleOpenUpdateModal(item)}>
                          <i className="fas fa-pen"></i>
                        </span>
                        <span
                          className="hover:scale-125 transition-transform"
                          onClick={() => handleDeleteModalOpen(item)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={4}
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </span>
                      </div>}
                    </div>
                  </div>

                  {/* Horizontal line between items, not after the last one */}
                  {index !== education.length - 1 && (
                    <hr className="my-4 border-t-1 border-gray-200" />
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

        <DeleteEducationModal
          onDelete={handleDeleteEducation}
          isOpen={isDeleteModalOpen}
          item={selectedForDeletion}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      </div>
    );
};

export default EducationCard;
