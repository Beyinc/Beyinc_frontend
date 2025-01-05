import { Button } from "@mui/material";
import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { useParams } from "react-router-dom";

const UploadCard = () => {

  const { id } = useParams();
    const { user_id } = useSelector(
      (store) => store.auth.loginDetails
    );

    const [changeResume, setchangeDocuments] = useState({
      resume: ""
    });
    const [oldDocs, setOldDocs] = useState({
      resume: ""
    });
  
    const [recentUploadedDocs, setRecentUploadedDocs] = useState({
      resume: ""
    });

    const handleResume = async (e) => {
      const file = e.target.files[0];
      setRecentUploadedDocs((prev) => ({ ...prev, [e.target.name]: file?.name }));
      setFileBase(e, file);

      await submitAllData();

    };

    const submitAllData = async () => {
      try {
        const { resume } = changeResume;
  
        console.log(resume);
        if (resume) {
          const documentData = {
            userId: user_id,
            resume: resume,
          };
          console.log("saving document with id " + user_id);
  
          // Call the SaveDocuments API
          await ApiServices.SaveDocument(documentData);
          alert("Documents saved successfully!");
        }
      } catch (error) {
        console.error("Error saving data:", error);
        alert("There was an error saving your data. Please try again.");
      }
    };
  
    const setFileBase = (e, file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setchangeDocuments((prev) => ({
          ...prev,
          [e.target.name]: reader.result,
        }));
      };
    };

    const dispatch = useDispatch();
    useEffect(() => {
          ApiServices.getProfile({ id: user_id })
            .then((res) => {
              
  
              if (res.data.documents !== undefined) {
                setOldDocs((prev) => ({
                  ...prev,
                  resume: res.data.documents.resume
                }));
                setchangeDocuments((prev) => ({
                  ...prev,
                  resume: res.data.documents?.resume || ""
                }));
              }
            })
  
            .catch((error) => {
              dispatch(
                setToast({
                  message: error?.response?.data?.message,
                  bgColor: ToastColors.failure,
                  visible: "yes",
                })
              );
            });
    }, [id]);

  return (
    <div className="container">
      <div className="h-[130px] w-[800px] shadow-xl mt-6 border-2 border-black p-3 pt-2 rounded-xl">
        <div className="text-xl font-extrabold text-blue-600 mt-4 flex justify-between">
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
              <label className="Input-Label">Resume</label>
              {oldDocs.resume !== "" &&
                oldDocs.resume !== undefined &&
                Object.keys(oldDocs.resume).length !== 0 && (
                  <attr title="view previous resume">
                    <a
                      href={oldDocs.resume?.secure_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        marginRight: "30px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30px"
                        height="30px"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="var(--followBtn-bg)"
                          d="M5 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5.414a1.5 1.5 0 0 0-.44-1.06L9.647 1.439A1.5 1.5 0 0 0 8.586 1zM4 3a1 1 0 0 1 1-1h3v2.5A1.5 1.5 0 0 0 9.5 6H12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm7.793 2H9.5a.5.5 0 0 1-.5-.5V2.207z"
                        />
                      </svg>
                    </a>
                  </attr>
                )}
            </div>
            {(
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
            )}
          </div>
      </div>
    </div>
  );
};

export default UploadCard;