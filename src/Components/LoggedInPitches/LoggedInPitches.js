import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import MultipleSelectCheckmarks from "../Admin/UserRequests/FIlterExample";
import PitchCard from "../Admin/pitchDecider/PitchCard";
import LoggedInPitchCard from "./LoggedPitchCard";
import CachedIcon from "@mui/icons-material/Cached";
import { FilterCheckBoxes } from "./Filters";
import useWindowDimensions from "../Common/WindowSize";
import FilterDialog from "../Filters/FilterDialog";
const LoggedInPitches = () => {
  const { email } = useSelector((state) => state.auth.loginDetails);
  const dispatch = useDispatch();
  const [filteredData, setFilteredData] = useState([]);
  const [data, setdata] = useState([]);
  useEffect(() => {
    ApiServices.getuserPitches({ email: email })
      .then((res) => {
        setdata(res.data);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occured",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  }, []);
  const [filters, setFilters] = useState({
    status: ["pending"],
    pitchRequiredStatus: [],
  });
  useEffect(() => {
    if (data.length > 0) {
      filterUsers();
    }
  }, [data]);

  const filterUsers = () => {
    let filteredData = [...data];
    if (Object.keys(filters).length > 0) {
      Object.keys(filters).map((ob) => {
        if (filters[ob].length > 0) {
          filteredData = filteredData.filter((f) =>
            filters[ob].includes(f[ob])
          );
        }
      });
    }
    setFilteredData(filteredData);
  };

  const [isSpinning, setSpinning] = useState(false);
  const handleReloadClick = () => {
    setSpinning(true);
    setFilters({
      status: ["pending"],
      pitchRequiredStatus: [],
    });
  };

  useEffect(() => {
    filterUsers();
  }, [filters]);

  const { height, width } = useWindowDimensions();

  return (
    <div className="usersWrapper">
      <FilterDialog
        filters={filters}
        handleReloadClick={handleReloadClick}
        isSpinning={isSpinning}
        setFilters={setFilters}
        tabs={[
          {
            name: "Status",
            dataKey: "status",
            data: ["pending", "approved", "rejected"],
          },

          {
            name: "Visibility",
            dataKey: "pitchRequiredStatus",
            data: ["hide", "show"],
          },
        ]}
      />
      {width > 770 && (
        <div style={{ height: "83vh" }} className="filterContainer">
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
                onClick={handleReloadClick}
              />
            </div>
          </div>
          <div className="tagFilter">
            <div className="filter-header">
              <b>Status</b>
            </div>

            <FilterCheckBoxes
              rawData={["pending", "approved", "rejected"]}
              dataKey="status"
              filters={filters}
              setFilters={setFilters}
            />
          </div>
          <hr />
          <div className="tagFilter">
            <div className="filter-header">
              <b>Pitch Hide/Show</b>
            </div>

            <FilterCheckBoxes
              rawData={["hide", "show"]}
              dataKey="pitchRequiredStatus"
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>
      )}

      <div className="filteredUsers">
        {filteredData?.length > 0 ? (
          filteredData?.map((d) => <LoggedInPitchCard d={d} />)
        ) : (
          <div className="pitch-container">
            <img className="no-requests" src="/no-requests.png" />
            <div>No Requests Found !</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoggedInPitches;
