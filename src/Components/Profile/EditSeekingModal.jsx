import { useState, useEffect } from "react";
import { STARTUP_SEEKING_OPTIONS } from "../../Utils";

// Temporary - you'll replace this with your actual constant later

const EditSeekingModal = ({ isOpen, onClose, currentSeeking, onSave }) => {
  const [selectedSeeking, setSelectedSeeking] = useState(currentSeeking || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedSeeking(currentSeeking || []);
    }
  }, [isOpen, currentSeeking]);

  const handleSeekingToggle = (option) => {
    if (selectedSeeking.includes(option)) {
      setSelectedSeeking(selectedSeeking.filter((s) => s !== option));
    } else {
      setSelectedSeeking([...selectedSeeking, option]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(selectedSeeking);
      onClose();
    } catch (error) {
      console.error("Error saving seeking options:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit What You're Seeking
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Select what you're looking for. Selected: {selectedSeeking.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STARTUP_SEEKING_OPTIONS.map((option) => {
              const isSelected = selectedSeeking.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSeekingToggle(option)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all text-left border-2 ${
                    isSelected
                      ? "bg-indigo-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{option}</span>
                    {isSelected && (
                      <i className="fas fa-check-circle text-white"></i>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSeekingModal;
