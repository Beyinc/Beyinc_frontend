import { Button } from "@mui/material";
import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ApiServices } from "../../Services/ApiServices";
import { useSelector } from "react-redux";

const UploadCard = () => {

    const { user_id } = useSelector(
      (store) => store.auth.loginDetails
    );

    
  const [files, setchangeDocuments] = useState({
    resume: ""
  });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFileBase(e, e.target.files[0]);

        const f = e.target.files
        console.log(e.target.files[0]);
        console.log(f,"F");
        
        console.log(files);
          const response = await ApiServices.uploadFile({resume : f, id: user_id });
          alert(response);
    };

  return (
    <div className="container">
      <div className="h-[130px] w-[800px] shadow-xl mt-6 border-2 border-black p-3 pt-2 rounded-xl">
        <div className="text-xl font-extrabold text-blue-600 mt-4 flex justify-between">
          Documents
        </div>
        <div>
          <label>File to be Pitched</label>
          <label htmlFor="resume" className="resume">
            <CloudUploadIcon />
            <span className="fileName">Upload
            </span>
          </label>
          <input
          className="resume"
          type="file"
          name="resume"
          id="resume"
          onChange={handleSubmit}
          style={{ display: "none" }}
        />
        </div>
      </div>
    </div>
  );
};

export default UploadCard;