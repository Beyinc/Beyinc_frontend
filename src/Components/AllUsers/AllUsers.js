import React, { useEffect, useState, useCallback } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { Country } from "country-state-city";
import CachedIcon from "@mui/icons-material/Cached";
import SingleUserDetails from "./SingleUserDetails";
import "./users.css";
import { allLanguages, allskills, fetchRating } from "../../Utils";
import AddReviewStars from "../LivePitches/AddReviewStars";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { setLoading } from "../../redux/AuthReducers/AuthReducer";

import CloseIcon from "@mui/icons-material/Close";
import {
  Checkbox,
  Collapse,
  Drawer,
  FormControlLabel,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
// import { FilterPanel } from "./FilterPanel";
import useWindowDimensions from "../Common/WindowSize";
// import { FilterCheckBoxes } from "./FilterCheckBox";
import { Search } from "@mui/icons-material";
import { getAllHistoricalConversations } from "../../redux/Conversationreducer/ConversationReducer";
// import AddPitch from "../Common/AddPitch";
import AddConversationPopup from "../Common/AddConversationPopup";
import FilterSidebar from "./FilterSidebar";
import TopFilterBar from "./TopFilterBar";
import StartupFilter from "./StartupFilter";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const tabs = ["Role", "Name", "Skills", "Country", "Language", "Other"];
const AllUsers = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const totalRoles = useSelector((state) => state.auth.totalRoles);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const [IsAdmin, setIsAdmin] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [data, setData] = useState([]);
  const [tag, settag] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { email, user_id } = useSelector((state) => state.auth.loginDetails);
  const [filledStars, setFilledStars] = useState(0);
  const [search, setSearch] = useState("");
  const [receiverRole, setreceiverRole] = useState("");
  const [pitchSendTo, setPitchSendTo] = useState("");
  // const [filters, setFilters] = useState({
  //   role: [],
  //   languagesKnown: [],
  //   skills: [],
  //   email: [],
  //   state: [],
  //   country: [],
  //   userColleges: [],
  //   verification: false,
  //   userName: [],
  //   review: 0,
  // });
  useEffect(() => {
    setFilters((prev) => ({ ...prev, review: filledStars }));
  }, [filledStars]);
  // const [universities, setUniversities] = useState([])
  // useEffect(() => {
  //     axios.get('http://universities.hipolabs.com/search').then(res => {
  //         setUniversities(res.data)
  //     })
  // }, [])
  useEffect(() => {
    dispatch(setLoading({ visible: "yes" }));
    ApiServices.getAllUsers({ type: "" }).then((res) => {
      // console.log(JSON.stringify(res.data));
      const filteredUsers = res.data.filter(
        (user) => user.beyincProfile && user.beyincProfile.trim() !== ""
      );

      setData(filteredUsers);
      dispatch(setLoading({ visible: "no" }));
    });
  }, []);

  // useEffect(() => {
  //   if (data.length > 0) {
  //     filterUsers();
  //   }
  // }, [data, filters]);

  // const filterUsers = () => {
  //   let filteredData = [...data];
  //   // console.log(filters);
  //   if (Object.keys(filters).length > 0) {
  //     Object.keys(filters).map((ob) => {
  //       if (filters[ob].length > 0 || ob === "verification" || ob === "review") {
  //         if (
  //           ob !== "tags" &&
  //           ob !== "verification" &&
  //           ob !== "email" &&
  //           ob !== "userName" &&
  //           ob !== "industry2" &&
  //           ob !== "userColleges" &&
  //           ob !== "country" &&
  //           ob !== "state" &&
  //           ob !== "skills" &&
  //           ob !== "languagesKnown" &&
  //           ob !== "review" &&
  //           ob !== "role"
  //         ) {
  //           filteredData = filteredData.filter((f) =>
  //             filters[ob].includes(f[ob])
  //           );
  //         } else if (
  //           ob === "tags" ||
  //           ob == "skills" ||
  //           ob == "languagesKnown"
  //         ) {
  //           filteredData = filteredData.filter((item) => {
  //             const itemdata = item[ob].map((t) => t.toLowerCase()) || [];
  //             return filters[ob].some((tag) =>
  //               itemdata.includes(tag.toLowerCase())
  //             );
  //           });
  //         } else if (ob == "userColleges") {
  //           filteredData = filteredData.filter((item) => {
  //             const itemdata =
  //               item["educationDetails"]?.map((t) => t.college) || [];
  //             return filters[ob].some((tag) => itemdata.includes(tag));
  //           });
  //         } else if (ob == "verification") {
  //           if (filters[ob]) {
  //             filteredData = filteredData.filter((item) => {
  //               return item.verification == "approved";
  //             });
  //           }
  //         } else if (
  //           ob == "userName" ||
  //           ob == "industry2" ||
  //           ob == "country" ||
  //           ob == "state" ||
  //           ob == "email" ||
  //           ob == "role"
  //         ) {
  //           filteredData = filteredData.filter((f) => {
  //             return filters[ob].some((fs) => fs === f[ob]);
  //           });
  //         } else if (ob == "review") {
  //           if (filters[ob] !== 0) {
  //             filteredData = filteredData.filter((f) => {
  //               return fetchRating(f) <= filters[ob];
  //             });
  //           }
  //         }

  //       }
  //     });
  //   }
  //   filteredData.sort((a, b) => {
  //     return fetchRating(b) - fetchRating(a);
  //   });
  //   setFilteredData(filteredData);
  // };

  const [isSpinning, setSpinning] = useState(false);
  const handleReloadClick = () => {
    setSpinning(true);
    setFilters({
      role: [],
      email: [],
      state: [],
      country: [],
      skills: [],
      languagesKnown: [],
      userColleges: [],
      verification: false,
      userName: [],
      review: 0,
    });
    setFilledStars(0);
  };
  const [connectStatus, setConnectStatus] = useState({});
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const historicalConversations = useSelector(
    (state) => state.conv.historicalConversations
  );
  useEffect(() => {
    dispatch(getAllHistoricalConversations(user_id));
  }, []);

  useEffect(() => {
    // console.log(historicalConversations.reduce(
    //   (prev, cur) => ({
    //     ...prev,
    //     [cur.members.filter((f) => f._id !== user_id)[0]._id]: {
    //       status: cur.status,
    //       id: cur._id,
    //     },
    //   }),
    //   {}
    // ));
    setConnectStatus(
      historicalConversations.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.members.filter((f) => f._id !== user_id)[0]?._id]: {
            status: cur.status,
            id: cur._id,
          },
        }),
        {}
      )
    );
  }, [historicalConversations]);

  // iqra
  // Add this with your other useState declarations
  const [viewMode, setViewMode] = useState("startups"); // Mentor disabled - upcoming feature
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    expertise: [],
    userName: "",
    stages: [],
    industries: [],
    categories: [], // Added categories filter
  });
  const [computedIndustrySkillCounts, setComputedIndustrySkillCounts] =
    useState({});
  // NEW STATE FOR STARTUPS - ADD THIS
  const [startups, setStartups] = useState([]);
  const [startupFilters, setStartupFilters] = useState({
    userName: "",
    industries: [],
    stage: "",
    targetMarket: [],
    seekingOptions: [],
  });

  // Function to fetch user data from backend based on filters
  const fetchUsers = async () => {
    try {
      const response = await ApiServices.FilterData(filters);
      // Filter users to only include those with the desired fields
      const filteredUsers = response.data.filter((user) => {
        return (
          user.beyincProfile || // Check if beyincProfile is present
          (user.industries && user.industries.length > 0) || // Check if industries array is not empty
          (user.expertise && user.expertise.length > 0) || // Check if expertise array is not empty
          (user.stages && user.stages.length > 0) // Check if stages array is not empty
          // || (user.investmentRange !== undefined)
        );
      });
      setUsers(filteredUsers);
      console.log();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // NEW FUNCTION FOR STARTUPS -
  const fetchStartups = async () => {
    try {
      const response = await ApiServices.FilterStartups(startupFilters);
      setStartups(response.data); // Backend already filtered by beyincProfile: "Startup"
    } catch (error) {
      console.error("Error fetching startups:", error);
    }
  };
  useEffect(() => {
    dispatch(setLoading({ visible: "yes" }));

    ApiServices.getAllUsers({ type: "" }).then((res) => {
      console.log(JSON.stringify(res.data));

      // 1️⃣ Filter FIRST
      const filteredUsers = res.data.filter(
        (user) =>
          user.beyincProfile &&
          user.beyincProfile.trim() !== "" &&
          user.beyincProfile === "Mentor"
      );

      const industrySkillCounts = {};
      // exclude the currently logged-in user from the computed counts
      const usersForCounts = filteredUsers.filter(
        (u) => u._id !== user_id && u.id !== user_id
      );
      usersForCounts.forEach((u) => {
        const me = u.mentorExpertise;
        if (Array.isArray(me)) {
          me.forEach((entry) => {
            const industry = entry.industry;
            if (!industry) return;

            if (!industrySkillCounts[industry]) {
              industrySkillCounts[industry] = { industryCount: 0, skills: {} };
            }

            industrySkillCounts[industry].industryCount += 1;

            const skills = Array.isArray(entry.skills) ? entry.skills : [];
            skills.forEach((s) => {
              if (!industrySkillCounts[industry].skills[s]) {
                industrySkillCounts[industry].skills[s] = 0;
              }
              industrySkillCounts[industry].skills[s] += 1;
            });
          });
        }
      });

      // setData(filteredUsers);
      setUsers(filteredUsers);
      setComputedIndustrySkillCounts(industrySkillCounts);
      dispatch(setLoading({ visible: "no" }));
    });
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [filters]);

  // NEW useEffect FOR STARTUPS - ADD THIS
  useEffect(() => {
    fetchStartups();
  }, [startupFilters]);
  // Function to update filters based on user input
  const updateFilters = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);
  // NEW - for startups
  const updateStartupFilters = useCallback((newFilters) => {
    setStartupFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  return (
    <>
      {/* <Dialog
       sx={{width:"500px" , height:"700px"}}
        maxWidth={"md"}
        fullWidth={true}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <>Filter</>
          <CachedIcon
            style={{ cursor: "pointer" }}
            className={isSpinning ? "spin" : ""}
            onClick={() => {
              handleReloadClick();
            }}
          />
        </DialogTitle>
        <FilterSidebar updateFilters={updateFilters} open={open}/>

       
        <DialogActions>
          <Button
            sx={{ width: "fit-content" }}
            variant="contained"
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
      {/* MOBILE FILTER DRAWER (SLIDE-IN SIDEBAR) */}
      <Drawer
        anchor="left" // Slides in from the left
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: "85%", maxWidth: "320px" } // Width of the sidebar
        }}
      >
        <div className="p-4 h-full overflow-y-auto bg-white">
          {/* Header with Title and Close Button */}
          <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 m-0">Filters</h2>
            <CloseIcon 
              onClick={handleClose} 
              className="cursor-pointer text-gray-500 hover:text-red-500" 
            />
          </div>

          {/* The Actual Filter Component */}
          <FilterSidebar
            updateFilters={updateFilters}
            updateStartupFilters={updateStartupFilters}
            open={true} // Always "open" inside the drawer
            viewMode={viewMode}
            industrySkillCounts={computedIndustrySkillCounts}
            startups={startups}
          />

          {/* Footer Actions */}
          <div className="mt-6 flex justify-center pb-4">
            <Button
              variant="contained"
              fullWidth
              onClick={handleClose}
              sx={{ backgroundColor: "#4f55c7" }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Drawer>

      <div className="users-main-box bg-red-500 overflow-x-hidden pr-4 sm:pr-5 md:pr-6">
        {width <= 1210 && (
          <div className="user-nav-bar">
            <div style={{ display: "flex", alignItems: "center" }}>
              <button className="nav-bar-buttons" onClick={handleClickOpen}>
                <i style={{ marginRight: 3 }} class="fa fa-filter" /> Filter
              </button>
              {/* <button className="nav-bar-buttons">
              <i class="fa fa-sort-amount-desc"></i>
              Sort by
            </button> */}
              <input
                type="text"
                style={{ marginTop: "2px", marginLeft: "8px", width: "150px" }}
                className="nav-bar-buttons"
                value={search}
                placeholder="Search user"
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value !== "") {
                    setFilteredData(
                      filteredData.filter((f) => {
                        return f.userName.includes(e.target.value);
                      })
                    );
                  } else {
                    setFilteredData(data);
                  }
                }}
                label="Search.."
                variant="standard"
              />
            </div>
          </div>
        )}
        {/* NEW TABS SECTION - Add this right after mobile nav */}
        <div className="w-full bg-gray-50 border-b border-gray-200 sticky top-0 z-10 pr-4 sm:pr-5 md:pr-6" style={{ marginLeft: width > 1210 ? "15rem" : 0 }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 mt-4 p-1 bg-gray-100 rounded-full w-fit border border-gray-300">
              <button
                onClick={() => setViewMode("startups")}
                className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  viewMode === "startups"
                    ? "bg-white text-[#4f55c7] shadow-sm hover:text-white hover:bg-[#4f55c7]"
                    : "bg-transparent text-gray-900 hover:text-white hover:bg-[#4f55c7]"
                }`}
              >
                Startup
              </button>
              <button
                disabled
                title="Coming soon"
                className="px-6 py-1.5 rounded-full text-sm font-semibold bg-gray-200 text-gray-500 cursor-not-allowed flex items-center gap-1.5"
              >
                Mentor
                <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-300 text-gray-600">
                  Upcoming
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="usersWrapper">
          {width > 1210 && (
            <div className="filterContainer">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2 className="text-xl font-bold !text-gray-900 m-0">
                  Filter By :
                </h2>
                <div title="Reset filters">
                  <CachedIcon
                    style={{ cursor: "pointer" }}
                    className={isSpinning ? "spin" : ""}
                    onClick={() => {
                      handleReloadClick();
                    }}
                  />
                </div>
              </div>
              <FilterSidebar
                updateFilters={updateFilters}
                updateStartupFilters={updateStartupFilters}
                viewMode={viewMode}
                industrySkillCounts={computedIndustrySkillCounts}
                startups={startups}
              />
              {/* Role */}
              {/* <div className="tagFilter">
                <div className="filter-header">
                  <b>Role</b>
                </div>

                <FilterCheckBoxes
                  dataKey={"role"}
                  rawData={totalRoles}
                  setFilters={setFilters}
                  filters={filters}
                />
              </div>
              <hr /> */}

              {/* Domain */}
              {/* <div className="tagFilter">
                <div className="filter-header">
                  <b>User Names</b>
                </div>
                <FilterCheckBoxes
                  showSearch={true}
                  dataKey={"userName"}
                  rawData={data}
                  setFilters={setFilters}
                  filters={filters}
                />
              </div> */}
              {/* <hr />
              <div className="tagFilter">
                <div className="filter-header">
                  <b>Skills</b>
                </div>
                <FilterCheckBoxes
                  showSearch={true}
                  rawData={allskills}
                  dataKey={"skills"}
                  isFlat={true}
                  setFilters={setFilters}
                  filters={filters}
                />
              </div>
              <hr /> */}
              {/* country */}
              {/* <div className="tagFilter">
                <div className="filter-header">
                  <b>Country</b>
                </div>
                <FilterCheckBoxes
                  showSearch={true}
                  rawData={Country?.getAllCountries()}
                  isCountry={true}
                  setFilters={setFilters}
                  filters={filters}
                />
              </div> */}

              {/* <hr />
              <div className="tagFilter">
                <div className="filter-header">
                  <b>Languages known</b>
                </div>
                <FilterCheckBoxes
                  showSearch={true}
                  rawData={allLanguages}
                  dataKey={"languagesKnown"}
                  isFlat={true}
                  setFilters={setFilters}
                  filters={filters}
                />
              </div>
              <hr /> */}
              {/* Rating */}
              {/* <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  fontSize: 14,
                }}
              >
                <div style={{ marginLeft: 8 }} className="filter-rating-label">
                  <b> Rating:</b>
                </div>
                <div className="inputTag" style={{ marginLeft: 10 }}>
                  <AddReviewStars
                    filledStars={filledStars}
                    setFilledStars={setFilledStars}
                  />
                </div>
              </div> */}

              {/* <div className="verificationFilter">
                <div
                  className="filter-options-label"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    fontSize: 14,
                    marginLeft: 8,
                  }}
                >
                  <b> Verified:</b>
                  <input
                    type="checkbox"
                    style={{ width: "20px", marginLeft: 20, marginBottom: 0 }}
                    checked={filters.verification}
                    onChange={() => {
                      setFilters((prev) => ({
                        ...prev,
                        verification: !filters.verification,
                      }));
                    }}
                  />
                </div>
              </div> */}
            </div>
          )}
          {/* {viewMode} */}
          <div className="user-cards-panel pr-4 sm:pr-5 md:pr-6 box-border" style={{ width: width > 1210 ? "80%" : "100%", maxWidth: width > 1210 ? "none" : "100%" }}>
            <div className="mt-4 userscontainer w-full !flex flex-wrap justify-center lg:justify-start gap-4">
  {viewMode === "mentors" && (
      <div
        className="no-users w-full"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div className="text-gray-500 font-medium text-lg">Mentor</div>
        <div className="text-gray-400 text-sm mt-1">Upcoming feature — stay tuned!</div>
      </div>
    )}
    
  {viewMode === "startups" &&
    (startups.length > 0 ? (
      startups.map((startup) => (
        <SingleUserDetails
          key={startup._id}
          user={startup}
          viewMode={viewMode}
        />
      ))
    ) : (
      <div
        className="no-users w-full"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src="/Search.gif" alt="Loading" />
        <div>No startups available</div>
      </div>
    ))}
</div>
          </div>
        </div>
        <AddConversationPopup
          receiverId={pitchSendTo}
          setReceiverId={setPitchSendTo}
          receiverRole={receiverRole}
          IsAdmin={IsAdmin}
        />
      </div>
    </>
  );
};

export default AllUsers;
