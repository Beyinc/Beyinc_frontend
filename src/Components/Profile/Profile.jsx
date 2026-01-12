import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import About from "./About";
import Activity from "./Activity";
import TabsAndInvestment from "../Editprofile/TabsAndInvestment/TabsAndInvestment";
import Comment from "./Comment";
import ProfileCard from "./ProfileCard";
import BookSession from "../Editprofile/BookSession/BookSession2";

import { ApiServices } from "../../Services/ApiServices";
import { CalendarServices } from "../../Services/CalendarServices";

import "../Editprofile/EditProfile.css";
import StartupProfileCard from "../Startup/StartupProfileCard";
import MainContent from "../OnboardComponents/Startup/MainContent";

const Profile = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editPostToggler = params.get("editPostToggler");

  const { id } = useParams();
  const {
    user_id,
    userName: loggedUserName,
    image: loggedImage,
  } = useSelector((store) => store.auth.loginDetails);

  const [value, setValue] = useState(editPostToggler === "posts" ? "2" : "1");
  const [selfProfile, setSelfProfile] = useState(!id);
  const [service, setService] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [stages, setStages] = useState([]);
  const [expertise, setExpertise] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [role, setRole] = useState("");

  useEffect(() => {
    setSelfProfile(!id);
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = id
          ? await ApiServices.getProfile({ id })
          : await ApiServices.getProfile({ user_id });

        const { expertise, industries, stages } = response.data;

        setProfileData(response.data);
        setRole(response.data.role);
        if (expertise) setExpertise(expertise);
        if (industries) setIndustries(industries);
        if (stages) setStages(stages);

        const responsePost = id
          ? await ApiServices.getUsersPost({ user_id: id })
          : await ApiServices.getUsersPost({ user_id });

        setAllPosts(responsePost.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id, user_id]);

  useEffect(() => {
    const fetchAvailabilityData = async () => {
      try {
        const { data } = await CalendarServices.getAvailabilityData({
          mentorId: id,
        });
        setService(data.availability?.sessions || []);
      } catch (error) {
        console.error("Error fetching availability data:", error);
      }
    };

    if (id) fetchAvailabilityData();
  }, [id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="h-full bg-customBackground relative ">
      <div className="relative">
        <div>
          <img
            src="/Banner.png"
            alt="Banner"
            className="w-full h-48 lg:h-80 object-cover rounded-none m-2"
          />
        </div>
        <div className="flex flex-col lg:flex-row lg:gap-5 justify-center items-start lg:ml-10 relative ">
          <div className="mb-4 -mt-36 ml-2">
            <ProfileCard
              selfProfile={selfProfile}
              setSelfProfile={setSelfProfile}
              profileDataObj={profileData}
              profileRole={role}
            />

            {(profileData.beyincProfile === "Mentor" ||
              profileData.beyincProfile === "Co-Founder") &&
              service.length > 0 && (
                <div className="BookSessionCard">
                  <BookSession
                    name={profileData.userName}
                    mentorId={id}
                    reschedule={false}
                  />
                </div>
              )}
          </div>

          <div className="grow space-y-3">
            <TabsAndInvestment
              role={role}
              selfProfile={selfProfile}
              setSelfProfile={setSelfProfile}
              profileData={profileData}
            />

            <TabContext value={value}>
              <Box className="">
                <TabList
                  onChange={handleChange}
                  aria-label="profile tabs"
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "90%",
                    margin: "0 auto",
                    color: "#4E54C6",
                  }}
                >
                  {["About", "Activity"].map((label, idx) => (
                    <Tab
                      key={label}
                      label={label}
                      value={`${idx + 1}`}
                      sx={{
                        fontSize: "20px",
                        color: "gray",
                        flex: 1,
                        fontWeight: "bold",
                        textAlign: "center",
                        textTransform: "none",
                        "&.Mui-selected": { color: "#4E54C6" },
                        "&:hover": { color: "white" },
                      }}
                    />
                  ))}
                </TabList>
              </Box>

              <TabPanel value="1">
                <About
                  selfProfile={selfProfile}
                  setSelfProfile={setSelfProfile}
                  profileData={profileData}
                />
              </TabPanel>
              <TabPanel value="2">
                <Activity allPosts={allPosts} setAllPosts={setAllPosts} />
              </TabPanel>
              {/* {role === "Startup" && ( */}
              {/*   <TabPanel value="3"> */}
              {/*     <Comment /> */}
              {/*   </TabPanel> */}
              {/* )} */}
            </TabContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
