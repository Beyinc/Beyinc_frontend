import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";

const Navigation = ({
  step,
  setStep,
  startupName,
  startupTagline,
  founderName,
  startupEmail,
  visibilityMode,
  startupStage,
  startupTeamSize,
  selectedStartupIndustries,
  targetMarket,
  image,
}) => {
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- AUTH ---------------- */
  const loginDetails = useSelector((store) => store.auth.loginDetails);
  const [email, setEmail] = useState(null);
  const [user_id, setUserId] = useState(null);

  useEffect(() => {
    if (loginDetails?.email && loginDetails?.user_id) {
      setEmail(loginDetails.email);
      setUserId(loginDetails.user_id);
    }
  }, [loginDetails]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (image) {
        await ApiServices.updateuserProfileImage({
          userId: user_id,
          image,
          email,
        });
      }
      await ApiServices.StartupEntryData({
        startupName,
        startupTagline,
        founderName,
        startupEmail,
        visibilityMode,
        startupStage,
        startupTeamSize,
        industries: selectedStartupIndustries,
        targetMarket,
      });
      alert("Startup created successfully!");
      window.location.href = "/posts";
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const isStep2Invalid =
    !startupName?.trim() ||
    !founderName?.trim() ||
    !startupEmail?.trim() ||
    !visibilityMode?.trim();

  const isStep3Invalid =
    !startupStage.trim() ||
    !startupTeamSize.trim() ||
    selectedStartupIndustries.length === 0 ||
    selectedStartupIndustries.every((i) => !i.trim()) ||
    !targetMarket.trim();

  const isCurrentStepInvalid =
    (step === 2 && isStep2Invalid) || (step === 3 && isStep3Invalid);

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNext = () => {
    if (step === 3) {
      handleSubmit();
      return;
    }

    setStep(step + 1);
  };
  return (
    <>
      <div className="flex gap-4 mt-8">
        <button
          onClick={handlePrevious}
          disabled={step === 1}
          className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-200 hover:bg-slate-300 text-slate-900"
        >
          Previous
        </button>

        <div className="flex-1 flex gap-2">
          {step === 1 && (
            <button
              onClick={() => {
                // Save logic for later
                alert("Saved!");
              }}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Save
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={isCurrentStepInvalid || submitting}
            className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all
    disabled:opacity-50 disabled:cursor-not-allowed
    bg-indigo-600 hover:bg-indigo-700 text-white
    flex items-center justify-center gap-2"
          >
            {step === 3 ? (
              <>
                <span>Complete Profile</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
