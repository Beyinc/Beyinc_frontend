import React, { useEffect, useState } from "react";
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
  FormControlLabel,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { FilterPanel } from "./FilterPanel";
import useWindowDimensions from "../Common/WindowSize";
import { FilterCheckBoxes } from "./FilterCheckBox";
import { Search } from "@mui/icons-material";
import { getAllHistoricalConversations } from "../../redux/Conversationreducer/ConversationReducer";
import AddPitch from "../Common/AddPitch";
import AddConversationPopup from "../Common/AddConversationPopup";
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
  const [IsAdmin, setIsAdmin] = useState(false)

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
  const [filters, setFilters] = useState({
    role: [],
    languagesKnown: [],
    skills: [],
    email: [],
    state: [],
    country: [],
    userColleges: [],
    verification: false,
    userName: [],
    review: 0,
  });
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
      // console.log(res.data);
      setData(res.data);
      dispatch(setLoading({ visible: "no" }));
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      filterUsers();
    }
  }, [data, filters]);

  const filterUsers = () => {
    let filteredData = [...data];
    // console.log(filters);
    if (Object.keys(filters).length > 0) {
      Object.keys(filters).map((ob) => {
        if (filters[ob].length > 0 || ob == "verification" || ob == "review") {
          if (
            ob !== "tags" &&
            ob !== "verification" &&
            ob !== "email" &&
            ob !== "userName" &&
            ob !== "industry2" &&
            ob !== "userColleges" &&
            ob !== "country" &&
            ob !== "state" &&
            ob !== "skills" &&
            ob !== "languagesKnown" &&
            ob !== "review" &&
            ob !== "role"
          ) {
            filteredData = filteredData.filter((f) =>
              filters[ob].includes(f[ob])
            );
          } else if (
            ob === "tags" ||
            ob == "skills" ||
            ob == "languagesKnown"
          ) {
            filteredData = filteredData.filter((item) => {
              const itemdata = item[ob].map((t) => t.toLowerCase()) || [];
              return filters[ob].some((tag) =>
                itemdata.includes(tag.toLowerCase())
              );
            });
          } else if (ob == "userColleges") {
            filteredData = filteredData.filter((item) => {
              const itemdata =
                item["educationDetails"]?.map((t) => t.college) || [];
              return filters[ob].some((tag) => itemdata.includes(tag));
            });
          } else if (ob == "verification") {
            if (filters[ob]) {
              filteredData = filteredData.filter((item) => {
                return item.verification == "approved";
              });
            }
          } else if (
            ob == "userName" ||
            ob == "industry2" ||
            ob == "country" ||
            ob == "state" ||
            ob == "email" ||
            ob == "role"
          ) {
            filteredData = filteredData.filter((f) => {
              return filters[ob].some((fs) => fs === f[ob]);
            });
          } else if (ob == "review") {
            if (filters[ob] !== 0) {
              filteredData = filteredData.filter((f) => {
                return fetchRating(f) <= filters[ob];
              });
            }
          }

        }
      });
    }
    filteredData.sort((a, b) => {
      return fetchRating(b) - fetchRating(a);
    });
    setFilteredData(filteredData);
  };

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
          [cur.members.filter((f) => f._id !== user_id)[0]._id]: {
            status: cur.status,
            id: cur._id,
          },
        }),
        {}
      )
    );
  }, [historicalConversations]);
  return (
    <>
      <Dialog
        fullScreen={width <= 400}
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
        <DialogContent sx={{ overflow: "hidden" }} style={{ padding: 0 }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexGrow: 1,
              bgcolor: "background.paper",
              height: width <= 400 ? "100%" : 400,
              overflowY: "scroll",
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              className="tabs-vertical"
              sx={{
                borderRight: 1,
                borderColor: "divider",
                position: "sticky",
                top: 0,
                left: 0,
              }}
            >
              {tabs.map((v, i) => (
                <Tab
                  className="filter-tab-style"
                  label={<div className="filter-tab-text">{v}</div>}
                  {...a11yProps(i)}
                />
              ))}
            </Tabs>
            <TabPanel value={value} index={0}>
              <FilterPanel
                rawData={totalRoles}
                dataKey={"role"}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <FilterPanel
                rawData={data}
                dataKey={"userName"}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>{" "}
            <TabPanel value={value} index={2}>
              <FilterPanel
                rawData={allskills}
                dataKey={"skills"}
                isFlat={true}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <FilterPanel
                rawData={Country?.getAllCountries()}
                isCountry={true}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <FilterPanel
                rawData={allLanguages}
                dataKey={"languagesKnown"}
                isFlat={true}
                filters={filters}
                setFilters={setFilters}
              />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <div className="filter-rating-label">Rating:</div>
                  <div className="inputTag" style={{ marginLeft: 20 }}>
                    <AddReviewStars
                      filledStars={filledStars}
                      setFilledStars={setFilledStars}
                    />
                  </div>
                </div>

                <div className="verificationFilter">
                  <div
                    className="filter-options-label"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <> Verified: </>
                    <input
                      type="checkbox"
                      style={{ width: "20px", marginLeft: 20 }}
                      checked={filters.verification}
                      onChange={() => {
                        setFilters((prev) => ({
                          ...prev,
                          verification: !filters.verification,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ width: "fit-content" }}
            variant="contained"
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <div className="users-main-box">
        {width < 770 && (
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
        <div className="usersWrapper">
          {width > 770 && (
            <div className="filterContainer">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div className="filterHeader">Filter By:</div>
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
              {/* Role */}
              <div className="tagFilter">
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
              <hr />

              {/* Domain */}
              <div className="tagFilter">
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
              </div>
              <hr />
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
              <hr />
              {/* country */}
              <div className="tagFilter">
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
              </div>

              <hr />
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
              <hr />
              {/* Rating */}
              <div
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
              </div>

              <div className="verificationFilter">
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
              </div>
            </div>
          )}
          <div className="user-cards-panel">
            {width > 770 && (
              <Box
                className="search-box"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 3,
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <Search sx={{ color: "action.active", width: 20, mx: 1 }} />
                <input
                  className="search-input"
                  style={{ height: 10, padding: 10, margin: 0 }}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setFilteredData(
                      e.target.value !== ""
                        ? filteredData.filter((f) =>
                          f.userName
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase())
                        )
                        : data
                    );
                  }}
                  placeholder="Search Users.."
                  variant="standard"
                />
              </Box>
            )}
            <div className="userscontainer">
              {filteredData.length > 0 ? (
                filteredData?.map((d) => (
                  <SingleUserDetails
                    d={d} setIsAdmin={setIsAdmin}
                    connectStatus={connectStatus}
                    setPitchSendTo={setPitchSendTo}
                    pitchSendTo={pitchSendTo}
                    receiverRole={receiverRole}
                    setreceiverRole={setreceiverRole}
                  />
                ))
              ) : (
                <div className="no-users"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: 'column',
                    alignItems: "center",

                  }}
                >
                  <img src="/Search.gif" />
                  <div>No users available</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <AddConversationPopup receiverId={pitchSendTo}
          setReceiverId={setPitchSendTo}
          receiverRole={receiverRole}
          IsAdmin={IsAdmin} />
      </div>
    </>
  );
};

export default AllUsers;
