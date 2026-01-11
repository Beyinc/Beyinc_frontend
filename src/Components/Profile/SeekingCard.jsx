import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EditSeekingModal from "./EditSeekingModal";
import seekingOptionsService from "./seekingOptionsApi";

const SeekingCard = ({ selfProfile }) => {
  const { user_id } = useSelector((store) => store.auth.loginDetails);
  const { id } = useParams();

  const [selectedSeeking, setSelectedSeeking] = useState([]);
  const [seekingModalOpen, setSeekingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch seeking options on component mount
  const getSeekingOptions = async () => {
    try {
      setIsLoading(true);
      const options = await seekingOptionsService.fetchSeekingOptions({
        id,
        user_id,
      });
      setSelectedSeeking(options);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSeekingOptions();
  }, []);

  const handleSeekingSave = async (updatedSeeking) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      await seekingOptionsService.saveSeekingOptions(updatedSeeking);

      setSelectedSeeking(updatedSeeking);
      setSuccessMessage("Seeking options updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="w-full grow bg-white rounded-xl">
      <div className="min-h-[100px] shadow-xl mt-6 border-2 border-black p-5 pt-2 rounded-xl">
        <div className="text-xl font-extrabold text-customPurple mt-4 flex justify-between">
          What We're Seeking
          <span onClick={() => setSeekingModalOpen(true)}>
            {selfProfile && <i className="fas fa-pen cursor-pointer "></i>}
          </span>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <div className="text-gray-300 italic">Loading...</div>
          ) : selectedSeeking.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSeeking.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 italic">
              Click the edit icon to select what you're seeking
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="text-red-500 mt-4 text-sm">{errorMessage}</div>
        )}

        {successMessage && (
          <div className="text-green-500 mt-4 text-sm">{successMessage}</div>
        )}
      </div>

      <EditSeekingModal
        isOpen={seekingModalOpen}
        onClose={() => setSeekingModalOpen(false)}
        currentSeeking={selectedSeeking}
        onSave={handleSeekingSave}
      />
    </div>
  );
};

export default SeekingCard;
