import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { useParams } from "react-router-dom";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

const UploadCard = ({selfProfile ,setSelfProfile}) => {
 
  const { user_id } = useSelector((store) => store.auth.loginDetails);

  const [changeResume, setChangeDocuments] = useState({
    resume: "",
  });
  const [oldDocs, setOldDocs] = useState({
    resume: "",
  });
  const [recentUploadedDocs, setRecentUploadedDocs] = useState({
    resume: "",
  });
  const { id } = useParams();
  const handleResume = (e) => {
    const file = e.target.files[0];
    setRecentUploadedDocs((prev) => ({ ...prev, [e.target.name]: file?.name }));
    setFileBase(e, file);
  };
 
  const submitAllData = async () => {
    try {
      const { resume } = changeResume;
      if (resume) {
        const documentData = {
          userId: user_id,
          resume: resume,
        };

        // Call the SaveDocuments API
        await ApiServices.SaveDocument(documentData);

        dispatch(
          setToast({
            message: "Document saved successfully!",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
      } else {
        dispatch(
          setToast({
            message: "No document to save!",
            bgColor: ToastColors.warning,
            visible: "yes",
          })
        );
      }
    } catch (error) {
      console.error("Error saving data:", error);
      dispatch(
        setToast({
          message: "Error saving document. Please try again.",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    }
  };

  const setFileBase = (e, file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setChangeDocuments((prev) => ({
        ...prev,
        [e.target.name]: reader.result,
      }));
    };
  };

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await ApiServices.getProfile({ id: id || user_id }); // Use id if present, else user_id
        if (response.data.documents !== undefined) {
          setOldDocs((prev) => ({
            ...prev,
            resume: response.data.documents.resume,
          }));
          setChangeDocuments((prev) => ({
            ...prev,
            resume: response.data.documents?.resume || "",
          }));
        }
      } catch (error) {
        dispatch(
          setToast({
            message: error?.response?.data?.message || "Something went wrong",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      }
    };
  
    // Call the fetchProfile function
    fetchProfile();
  }, [id, user_id]); // Add both `id` and `user_id` as dependencies
  
  return (
    <div className="w-full grow bg-white">
      <div className="shadow-xl mt-6 border-2 border-black p-5 pt-2 rounded-xl mb-4">
        <div className="text-xl font-extrabold text-customPurple mt-4 flex justify-between">
          Documents
        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              justifyContent: "space-between",
            }}
          >
            <label className="Input-Label">Pitchdeck</label>
            {oldDocs.resume && (
         
           <a
             href={oldDocs.resume?.secure_url}
             target="_blank"
             rel="noreferrer"
             className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
           >
             <InsertDriveFileOutlinedIcon />
             <span className="hidden md:block">Pitchdeck</span>
           </a>
           
            )}
          </div>


        { selfProfile && <div
            style={{
              display: "flex",
              alignItems: "center",
              gap:"20px"
            }}
          >
            <>
              <label htmlFor="resume" className="resume">
                <CloudUploadIcon />
                <span className="fileName">
                  {recentUploadedDocs?.resume || "Upload"}
                </span>
              </label>
              <input
                className="resume"
                type="file"
                name="resume"
                id="resume"
                onChange={handleResume}
                style={{ display: "none" }}
              />
            </>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={submitAllData}
                disabled={!changeResume.resume}
              >
                Save
              </Button>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default UploadCard;