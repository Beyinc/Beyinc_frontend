import React, { useEffect, useState } from "react";
import About from "./About";
import { Box, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Activity from "./Activity";
import TabsAndInvestment from "../Editprofile/TabsAndInvestment/TabsAndInvestment";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import Comment from "./Comment";
import ProfileCard from "./ProfileCard";

const Profile = () => {
  const [value, setValue] = React.useState("1");
  const { id } = useParams();
  const {
    user_id,
    userName: loggedUserName,
    image: loggedImage,
  } = useSelector((store) => store.auth.loginDetails);
  const {
    expertise: dbExpertise,
    industries: dbIndustires,
    stages: dbStages,
  } = useSelector((store) => store.auth.userDetails);

  const [industries, setIndustries] = useState([]);
  const [stages, setStages] = useState([]);
  const [expertise, setExpertise] = useState([]);

  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    if (dbExpertise) setExpertise(dbExpertise);
    if (dbIndustires) setIndustries(dbIndustires);
    if (dbStages) setStages(dbStages);
  }, [dbExpertise, dbStages, dbIndustires]);

  useEffect(() => {
    // Fetch the user data on which profile is clicked
    const fetchUserData = async () => {
      const response = await ApiServices.getProfile({ id });
      const { expertise, industries, stages } = response.data;

      if (expertise) setExpertise(expertise);
      if (industries) setIndustries(industries);
      if (stages) setStages(stages);
      const responsePost = id
        ? await ApiServices.getUsersPost({ user_id: id })
        : await ApiServices.getUsersPost({ user_id });

      setAllPosts(responsePost.data);
    };

    fetchUserData();
  }, [id, user_id]); // Add id to dependencies

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div className="relative">
        <div className="p-4">
          <img src="/Banner.png" alt="Banner" className="w-full m-0 h-auto" />
        </div>

        <div className="flex gap-5 absolute top-64 left-14 ">
          <div>
            <ProfileCard />
          </div>
          <div className="mt-36">
            <div>
              <TabsAndInvestment
                expertise={expertise}
                industries={industries}
                stages={stages}
              />
            </div>
            <div className="w-full">
              <TabContext value={value}>
                <Box>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    sx={{
                      borderBottom: 1,
                      borderColor: "white",
                      color: "#4E54C6",
                      display: "flex",
                      justifyContent: "space-around",
                      width: "90%",
                      margin: "0 auto",
                    }}
                  >
                    <Tab
                      label="About"
                      value="1"
                      sx={{
                        fontSize: "20px",
                        color: "#4E54C6",
                        flex: 1,
                        fontWeight: "bold",
                        textAlign: "center",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                        },
                        "&.Mui-selected": {
                          color: "#4E54C6",
                        },
                      }}
                    />
                    <Tab
                      label="Activity"
                      value="2"
                      sx={{
                        fontSize: "20px",
                        color: "#4E54C6",
                        flex: 1,
                        fontWeight: "bold",
                        textAlign: "center",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                        },
                        "&.Mui-selected": {
                          color: "#4E54C6",
                        },
                      }}
                    />
                    <Tab
                      label="Reviews"
                      value="3"
                      sx={{
                        fontSize: "20px",
                        color: "#4E54C6",
                        flex: 1,
                        fontWeight: "bold",
                        textAlign: "center",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                        },
                        "&.Mui-selected": {
                          color: "#4E54C6",
                        },
                      }}
                    />
                  </TabList>
                </Box>

                <TabPanel value="1">
                  <div>
                    <About />
                  </div>
                </TabPanel>

                <TabPanel value="2">
                  <div>
                    <Activity allPosts={allPosts} setAllPosts={setAllPosts} />
                  </div>
                </TabPanel>

                <TabPanel value="3">
                  <div>
                    <Comment />
                  </div>
                </TabPanel>
              </TabContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
