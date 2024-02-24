import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const LoadingData = () => {
  const { visible } = useSelector((state) => state.auth.LoadingDetails);
  const dispatch = useDispatch();
  useEffect(() => {
    if (visible == "yes") {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' 
      });
      document.getElementsByTagName("body")[0].style.overflowY = "hidden";
    } else {
      document.getElementsByTagName("body")[0].style.overflowY = "scroll";
    }
  }, [visible]);
  return (
    <div
      className="loadingContainer"
      style={{ display: visible == "yes" ? "block" : "none" }}
    >
      <div className="Loading">
            <div class="loader">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
    </div>
  );
};

export default LoadingData;
