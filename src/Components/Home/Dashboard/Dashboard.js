import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import PieActiveArc from "./PieActiveArc";
import { ApiServices } from "../../../Services/ApiServices";
import SideConnectionStats from "./SideConnectionStats";

const Dashboard = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    ApiServices.getDashboardDetails()
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-section-1">
        <div className="card-1">
          <div className="dashboard-content connections">
            <div>
              <label>Approved Connections</label>
              <p>{data?.connections_approved || 0}</p>
            </div>
            <div>
              <SideConnectionStats Tdata={data} status='approved'/>
            </div>
          </div>
        </div>

        <div className="card-2">
          <div className="dashboard-content connections">
            <div>
              <label>Pending Connections</label>
              <p>{data?.connections_pending || 0}</p>
            </div>
            <div>
              <SideConnectionStats Tdata={data} status='pending' />
            </div>
          </div>
        </div>

        <div className="card-3">
          {/* <div className="dashboard-icon-container">
            <i class="fas fa-users dashboard-icon"></i>
          </div> */}
          <div className="dashboard-content">
            <div>
              <label> Approved Pitches</label>
              <p>{data?.pitches?.approved || 0}</p>
            </div>
          </div>
        </div>

        <div className="card-4">
          {/* <div className="dashboard-icon-container">
            <i class="fas fa-file dashboard-icon"></i>
          </div> */}
          <div className="dashboard-content">
            <div>
              <label> Pending Pitches</label>
              <p>{data?.pitches?.pending || 0}</p>
           </div>
          </div>
        </div>
      </div>

      {/* <div className="dashboard-section-2">
        <div className="piechart">
          <PieActiveArc data={data} />
        </div>
      </div> */}

      {/* section-3 */}

      {/* <div className="dashboard-section-3">
      </div> */}
    </div>
  );
};

export default Dashboard;
