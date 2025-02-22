// ExperiencesCard.js
import { useEffect, useState } from "react";
import aboutService from "./aboutPageApi";
import DeleteExperiencesModal from "./DeleteExperienceModal";
import AddExperienceModal from "./AddExperienceModal";
import UpdateExperienceModal from "./UpdateExperienceModal";
import { useParams } from "react-router-dom";

const ExperiencesCard = ({selfProfile ,setSelfProfile}) => {
    const [experiences, setExperiences] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState(false);

    // Modal variables
    const [isAddExperienceModalOpen, setIsAddExperienceModalOpen] = useState(false);
    const [isUpdateExperienceModalOpen, setIsUpdateExperienceModalOpen] = useState(false);
    const [updateItem, setUpdateItem] = useState();
  const { id } = useParams(); // Get the `id` from route params

    const userId = "675e7e41e424505620d8faee"; // User ID (could be dynamic or passed as a prop)

    const handleClickAdd = () => {
        setIsAddExperienceModalOpen(true);
    };

    const handleOpenUpdateModal = (item) => {
        setUpdateItem(item);
        setIsUpdateExperienceModalOpen(true);
    };

    // Fetch experiences
    const fetchAllExperiences = async () => {
        try {
            const fetchedExperiences = await aboutService.fetchExperiences({id});
            setExperiences(fetchedExperiences);
        } catch (error) {
            setErrorMessage("There was an error fetching experiences.");
        }
    };

    // Handle delete experience
    const handleDeleteExperiences = async (eduId) => {
        try {
            await aboutService.handleDeleteExperience(eduId);
            fetchAllExperiences(); // Re-fetch experiences after deletion
        } catch (error) {
            setErrorMessage("There was an error deleting the experience.");
        }
    };

    const handleDeleteModalOpen = (item) => {
        setIsDeleteModalOpen(true);
        setSelectedForDeletion(item);
    };

    useEffect(() => {
        fetchAllExperiences(); 
    }, []); // Run only once when the component mounts

    return (
      <div className="w-full lg:w-[60vw] bg-white rounded-xl">
        <div className="shadow-xl mt-6 border-2 border-black p-5 pt-2 rounded-xl mb-4">
          <div className="text-xl font-extrabold text-customPurple mt-4 flex justify-between">
            Experiences
          {selfProfile &&  <span onClick={handleClickAdd}>
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

          {/* Display error message if there is an error */}
          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage}</div>
          )}

          {/* Display experiences details or loading state */}
          <div className="mt-4">
            {experiences.length === 0 ? (
              <p>No experiences details found</p>
            ) : (
              experiences.map((item, index) => (
                <div key={index}>
                  {/* experiences Item */}
                  <div className="flex flex-row items-start space-x-4">
                    {/* SVG Icon */}
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
                        d="M16.6667 28.335H20.0001V31.6683H16.6667V28.335Z"
                        fill="var(--followBtn-bg)"
                      />
                      <path
                        d="M36.6667 8.3335H23.3333C22.4493 8.3335 21.6014 8.68469 20.9763 9.30981C20.3512 9.93493 20 10.7828 20 11.6668V21.6668H13.3333C11.495 21.6668 10 23.1618 10 25.0002V40.0002C10 40.4422 10.1756 40.8661 10.4882 41.1787C10.8007 41.4912 11.2246 41.6668 11.6667 41.6668H38.3333C38.7754 41.6668 39.1993 41.4912 39.5118 41.1787C39.8244 40.8661 40 40.4422 40 40.0002V11.6668C40 10.7828 39.6488 9.93493 39.0237 9.30981C38.3986 8.68469 37.5507 8.3335 36.6667 8.3335ZM13.3333 38.3335V25.0002H23.3333V38.3335H13.3333ZM28.3333 18.3335H25V15.0002H28.3333V18.3335ZM35 31.6668H31.6667V28.3335H35V31.6668ZM35 25.0002H31.6667V21.6668H35V25.0002ZM35 18.3335H31.6667V15.0002H35V18.3335Z"
                        fill="var(--followBtn-bg)"
                      />
                    </svg>

                    {/* Information Section */}
                    <div className="flex justify-between w-full ">
                      <div className=" text-sm">
                        <div className="font-semibold text-blue-700 ">
                          {item.company}
                        </div>
                        <div>
                          <span className="font-bold">Designation</span>{" "}
                          {item.designation}
                        </div>
                        <div>
                          <span className="font-bold">Date</span>{" "}
                          {item.startYear} - {item.endYear}
                        </div>
                        <div>
                          <span className="font-bold">
                            Total Work Experience
                          </span>{" "}
                          {item.startYear - item.endYear} years{" "}
                        </div>
                        <div>
                          <span className="font-bold">Company Location</span>{" "}
                          {item.CompanyLocation}
                        </div>
                      </div>

                      {selfProfile && <div className="text-blue-700 flex items-center">
                        <span
                          onClick={() => {
                            handleOpenUpdateModal(item);
                          }}
                        >
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
                  {index !== experiences.length - 1 && (
                    <hr className="my-4 border-t-1 border-gray-700" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modals */}
            <div>
              <AddExperienceModal
                setExperiences={setExperiences}
                isOpen={isAddExperienceModalOpen}
                onClose={() => setIsAddExperienceModalOpen(false)}
              />
              <UpdateExperienceModal
                setExperiences={setExperiences}
                item={updateItem}
                isOpen={isUpdateExperienceModalOpen}
                onClose={() => {
                  setIsUpdateExperienceModalOpen(false);
                }}
              />
              <DeleteExperiencesModal
                onDelete={handleDeleteExperiences}
                isOpen={isDeleteModalOpen}
                item={selectedForDeletion}
                onClose={() => setIsDeleteModalOpen(false)}
              />
            </div>
      </div>
    );
};

export default ExperiencesCard;
