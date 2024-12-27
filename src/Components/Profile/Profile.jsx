import React, { useEffect, useState } from 'react'
import About from './About'
import { Box, Tab } from '@mui/material';
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Activity from './Activity'
import TabsAndInvestment from '../Editprofile/TabsAndInvestment/TabsAndInvestment'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ApiServices } from '../../Services/ApiServices'
import Comment from './Comment';

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
  }, [
    dbExpertise,
    dbStages,
    dbIndustires,
  ]);

  useEffect(() => {
  
    // Fetch the user data on which profile is clicked
    const fetchUserData = async () => {
        const response = await ApiServices.getProfile({ id });
        const {
          expertise,
          industries,
          stages,
        } = response.data;

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
      <div className="EditProfileImageContainer">
        <img src="/Banner.png" alt="Banner" />
      </div>

      <TabsAndInvestment expertise={expertise} industries={industries} stages={stages}/>

      <TabContext value={value}>

      <Box>
        <TabList
          onChange={handleChange}
          aria-label="lab API tabs example"
        >
          <Tab label="About" value="1" className="Testing-Tab" />
          <Tab label="Activity" value="2" className="Testing-Tab" />
            <Tab
                label="Reviews"
                value="3"
                className="Testing-Tab"
            />
        </TabList>
      </Box>

      <TabPanel
      value="1">
      <div>
        <About/>
      </div>
      </TabPanel>

      <TabPanel
      value="2">
      <div>
        <Activity allPosts={allPosts} setAllPosts={setAllPosts}/>
      </div>
      </TabPanel>

      <TabPanel
      value="3">
      <div>
        <Comment/>
      </div>
      </TabPanel>
      
      </TabContext>
    </div>
  )
}

export default Profile