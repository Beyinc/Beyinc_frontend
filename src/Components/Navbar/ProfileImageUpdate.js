import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material'; 
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
import { ApiServices } from '../../Services/ApiServices';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { setLoginData, setToast } from '../../redux/AuthReducers/AuthReducer';
import { jwtDecode } from 'jwt-decode';
import { ToastColors } from '../Toast/ToastColors';

const ProfileImageUpdate = ({ open, setOpen}) => {
    const { email, role, userName, image, verification, user_id } = useSelector(
        (store) => store.auth.loginDetails
      );
    const handleClose = () => {
        setOpen(false);
      };
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const [isLoading, setIsLoading] = useState(false);
      const [changeImage, setchangeImage] = useState("");
      const [originalImage, setOriginalImage] = useState("");
      const handleImage = (e) => {
        const file = e.target.files[0];
        if (file.size > 4 * 1024 * 1024) {
          alert(
            `File size should be less than ${(4 * 1024 * 1024) / (1024 * 1024)} MB.`
          );
          e.target.value = null; // Clear the selected file
          return;
        }
        setOriginalImage(file.name);
        setFileBase(file);
      };
      const setFileBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setchangeImage(reader.result);
        };
      };
    
      const submit = async (e) => {
        e.target.disabled = true;
        setIsLoading(true);
        await ApiServices.updateuserProfileImage({
          userId: user_id,
          image: changeImage, email: email
        })
          .then(async (res) => {
            // console.log(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            dispatch(setLoginData(jwtDecode(res.data.accessToken)));
            await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
            dispatch(
              setToast({
                message: "Image uploaded successfully",
                bgColor: ToastColors.success,
                visible: "yes",
              })
            );
            e.target.disabled = false;
            setIsLoading(false);
          })
          .catch((err) => {
            dispatch(
              setToast({
                message: "Error during image upload",
                bgColor: ToastColors.failure,
                visible: "yes",
              })
            );
            setIsLoading(false);
            e.target.disabled = false;
          });
    
      };
    
      const deleteImg = async (e) => {
        e.target.disabled = true;
        await ApiServices.deleteuserProfileImage({ userId: user_id })
          .then(async (res) => {
            localStorage.setItem("user", JSON.stringify(res.data));
            dispatch(setLoginData(jwtDecode(res.data.accessToken)));
            await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
            dispatch(
              setToast({
                message: "Image removed successfully",
                bgColor: ToastColors.success,
                visible: "yes",
              })
            );
            e.target.disabled = false;
          })
          .catch((err) => {
            dispatch(
              setToast({
                message: "Error during image delete",
                bgColor: ToastColors.failure,
                visible: "yes",
              })
            );
            e.target.disabled = false;
          });
    
      };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{}}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <b> {"Profile Picture"}</b>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div>
            <img
              style={{
                borderRadius: "50%",
                cursor: "pointer",
                height: "150px",
                width: "150px",
              }}
              src={
                image !== undefined && image !== ""
                  ? image
                  : "/profile.png"
              }
              alt="Profile"
            />
          </div>

          <div>
            <label htmlFor="profilePic" className="profileImage">
              <CloudUploadIcon />
              <span className="fileName">{originalImage || "Upload"}</span>
            </label>
            <input
              type="file"
              accept="image/*,.webp"
              name=""
              id="profilePic"
              onChange={handleImage}
              style={{ display: "none" }}
            />
          </div>

          <div
            style={{ display: "flex", gap: "2px", borderRadius: "10px", justifyContent: 'center', alignItems: 'center' }}
          >
            <button
              onClick={submit}
              style={{ whiteSpace: "nowrap", position: "relative" }}
              disabled={changeImage === "" && isLoading}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <div className="button-loader"></div>
                  <div><span style={{ marginLeft: "10px" }}>Updating...</span></div>
                </div>
              ) : (
                <>
                  <i
                    className="fas fa-upload"
                    style={{ marginRight: "5px", top: "-5px" }}
                  ></i>{" "}
                  Update
                </>
              )}
            </button>

            <button onClick={deleteImg}>
              <i
                className="fas fa-trash-alt"
                style={{ marginRight: "5px" }}
              ></i>{" "}
              Delete
            </button>
          </div>
        </DialogContentText>
      </DialogContent>
    </Dialog>
    
  );
};

export default ProfileImageUpdate;
