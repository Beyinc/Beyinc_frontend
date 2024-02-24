import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import PieActiveArc from "./PieActiveArc";
import { ApiServices } from "../../../Services/ApiServices";

const Dashboard = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    ApiServices.getDashboardDetails()
      .then((res) => {
        console.log(res.data);
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
          <div className="dashboard-icon-container">
            <i class="fas fa-users dashboard-icon"></i>
          </div>
          <div className="dashboard-content">
            <label>Approved Connections</label>
            {/* <p>{data?.connections_approved}</p> */}
          </div>
        </div>

        <div className="card-2">
          <div className="dashboard-icon-container">
            <i class="fas fa-file dashboard-icon"></i>
          </div>
          <div className="dashboard-content">
            <label>Pending Connections</label>
            {/* <p>{data?.connections_pending}</p> */}
          </div>
        </div>

        <div className="card-3">
          <div className="dashboard-icon-container">
            <i class="fas fa-users dashboard-icon"></i>
          </div>
          <div className="dashboard-content">
            <label> Approved Pitches</label>
            {/* <p>{data?.pitches.approved}</p> */}
          </div>
        </div>

        <div className="card-4">
          <div className="dashboard-icon-container">
            <i class="fas fa-file dashboard-icon"></i>
          </div>
          <div className="dashboard-content">
            <label> Pending Pitches</label>
            {/* <p>{data?.pitches.pending}</p> */}
          </div>
        </div>
      </div>

      <div className="dashboard-section-2">
        <div className="piechart">
          <PieActiveArc data={data} />
        </div>
      </div>

      {/* section-3 */}

      {/* <div className="dashboard-section-3">
      </div> */}
    </div>
  );
};

export default Dashboard;
