import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import axiosInstance from "../axiosInstance";
import {
  setLoginData,
  setToast,
  setUserDetails,
} from "../../redux/AuthReducers/AuthReducer";
import { jwtDecode } from "jwt-decode";
import { ToastColors } from "../Toast/ToastColors";

const ProfileImageUpdate = ({ open, setOpen }) => {
  const { image, user_id } = useSelector((store) => store.auth.loginDetails);

  const userDetails = useSelector((store) => store.auth.userDetails);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [changeImage, setchangeImage] = useState("");
  const [originalImage, setOriginalImage] = useState("");

  const handleClose = () => setOpen(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("File too large. Max 4MB");
      return;
    }

    setOriginalImage(file.name);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setchangeImage(reader.result);
  };

  const submit = async () => {
    if (!changeImage) return;

    setIsLoading(true);
    try {
      const res = await ApiServices.updateuserProfileImage({
        userId: user_id,
        image: changeImage,
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      // Decode the new token
      const decodedUser = jwtDecode(res.data.accessToken);

      // ✅ UPDATE BOTH PLACES
      dispatch(setLoginData(decodedUser)); // Updates loginDetails

      // ✅ ALSO UPDATE userDetails with new image
      dispatch(
        setUserDetails({
          ...userDetails, // Keep all other data
          image: { url: decodedUser.image }, // Update only image
        }),
      );

      await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
      dispatch(
        setToast({
          message: "Image uploaded successfully",
          bgColor: ToastColors.success,
          visible: "yes",
        }),
      );
      handleClose();
    } catch (err) {
      dispatch(
        setToast({
          message: "Error uploading image",
          bgColor: ToastColors.failure,
          visible: "yes",
        }),
      );
    }
    setIsLoading(false);
  };

  const deleteImg = async () => {
    setIsLoading(true);
    try {
      const res = await ApiServices.deleteuserProfileImage({ userId: user_id });
      localStorage.setItem("user", JSON.stringify(res.data));
      const decodedUser = jwtDecode(res.data.accessToken);

      // ✅ UPDATE BOTH PLACES
      dispatch(setLoginData(decodedUser));

      // ✅ Set image to empty object or undefined
      dispatch(
        setUserDetails({
          ...userDetails,
          image: undefined, // ✅ CHANGED from { url: "" } to undefined
        }),
      );

      await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
      dispatch(
        setToast({
          message: "Image removed successfully",
          bgColor: ToastColors.success,
          visible: "yes",
        }),
      );
      handleClose();
    } catch (err) {
      dispatch(
        setToast({
          message: "Error deleting image",
          bgColor: ToastColors.failure,
          visible: "yes",
        }),
      );
    }
    setIsLoading(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ display: "flex", justifyContent: "center" }}>
        <b>Profile Picture</b>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div>
            <img
              style={{
                borderRadius: "50%",
                height: "150px",
                width: "150px",
              }}
              src={changeImage || image || "/profile.png"}
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
              accept="image/*"
              id="profilePic"
              onChange={handleImage}
              style={{ display: "none" }}
            />
          </div>

          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button onClick={submit} disabled={!changeImage || isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </button>
            <button onClick={deleteImg} disabled={isLoading}>
              Delete
            </button>
          </div>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileImageUpdate;
