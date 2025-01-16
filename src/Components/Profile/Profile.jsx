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
import BookSession from "../Editprofile/BookSession/BookSession2";
// import '../Editprofile/Editprofile.css'
import "../Editprofile/EditProfile.css";
import { CalendarServices } from '../../Services/CalendarServices';

const Profile = () => {
  const [value, setValue] = React.useState("1");
  const { id } = useParams();
  const [selfProfile, setSelfProfile] = useState(true);
 const [service, setService] = useState([])

 const [industries, setIndustries] = useState([]);
 const [stages, setStages] = useState([]);
 const [expertise, setExpertise] = useState([]);

 const [allPosts, setAllPosts] = useState([]);
const [profileData, setProfileData] = useState({})

  useEffect(() => {
    if (id) {
      setSelfProfile(false);
    }
  }, [id]); 

  const {
    user_id,
    userName: loggedUserName,
    image: loggedImage,
  } = useSelector((store) => store.auth.loginDetails);

  console.log('id',id)
  // const {
  //   expertise: dbExpertise,
  //   industries: dbIndustires,
  //   stages: dbStages,
  // } = useSelector((store) => store.auth.userDetails);


  // useEffect(() => {
  //   if (dbExpertise) setExpertise(dbExpertise);
  //   if (dbIndustires) setIndustries(dbIndustires);
  //   if (dbStages) setStages(dbStages);
  // }, [dbExpertise, dbStages, dbIndustires]);

  useEffect(() => {
    // Fetch the user data on which profile is clicked
    const fetchUserData = async () => {
      try {
        // Fetch profile using id or user_id
        const response = id
          ? await ApiServices.getProfile({ id })
          : await ApiServices.getProfile({ user_id });
  
        const { expertise, industries, stages } = response.data;
        console.log(response.data);
        setProfileData(response.data);

        if (expertise) setExpertise(expertise);
        if (industries) setIndustries(industries);
        if (stages) setStages(stages);
  
        // Fetch user's posts using id or user_id
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchAvailabilityData = async () => {
        try {
            const { data } = await CalendarServices.getAvailabilityData({ mentorId:id });
            // Logging the availability data
            console.log('Availability data:', JSON.stringify(data.availability));
            setService(data.availability.sessions)
            const availabilityData = data.availability;
            // Perform additional operations with availabilityData here
        } catch (error) {
            console.error("Error fetching availability data:", error);
        }
    };

    fetchAvailabilityData();
}, [id]); // Add dependencies if required

  return (
    <div>
      <div className="relative">
        <div className="lg:p-4">
          <img
            src="/Banner.png"
            alt="Banner"
            className="w-full h-48 lg:h-80 m-0 object-cover rounded-none lg:rounded-xl"
          />
        </div>
      
        <div className="flex justify-center items-start flex-col lg:flex-row lg:gap-5 top-20 lg:top-52">
          <div className="mb-4 lg:-mt-36 ">
            <ProfileCard 
            selfProfile={selfProfile}
            setSelfProfile ={setSelfProfile} 
            profileData={profileData}
          />

        {(profileData.beyincProfile === "Mentor"  || profileData.beyincProfile === "Co-Founder") && 
                    service.length > 0 && (
                      <div className="BookSessionCard">
                        <BookSession name={profileData.userName} mentorId={id} reschedule={false} />
                      </div>
                    )}
                </div>
              

          <div>
          {(profileData.beyincProfile === "Mentor"  || profileData.beyincProfile === "Co-Founder") && 
            <div>
              <TabsAndInvestment
                selfProfile={selfProfile}
                setSelfProfile ={setSelfProfile} 
                expertise={expertise}
                industries={industries}
                stages={stages}
              />
            </div>
             }
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
                  <About
                      selfProfile={selfProfile}
                      setSelfProfile ={setSelfProfile}
                      profileData={profileData}  />
                </TabPanel>

                <TabPanel value="2">
                  <Activity allPosts={allPosts} setAllPosts={setAllPosts} />
                </TabPanel>

                <TabPanel value="3">
                  <Comment />
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