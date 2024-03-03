import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import PieActiveArc from "./BarActiveArc";
import { ApiServices } from "../../../Services/ApiServices";
import BarActiveArc from "./BarActiveArc";

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
          <div className="dashboard-content">
            {/* <div className="dashboard-icon-container">
            <i class="fas fa-file dashboard-icon"></i>
          </div> */}
            <div>

              <div className="numItems">
                <div className="dashboard-icon-container approved">
                  <i class="far fa-user dashboard-icon" style={{ color: '#519065' }}></i>
                </div>
                <div>
                  <label>Approved Connections</label>
                  <p>{data?.connections_approved || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-2">
          <div className="dashboard-content">
            {/* <div className="dashboard-icon-container">
            <i class="fas fa-file dashboard-icon"></i>
          </div> */}
            <div>

              <div className="numItems">
                <div className="dashboard-icon-container">
                  <i class="far fa-user dashboard-icon"></i>
                </div>
                <div >
                  <label>Pending Connections</label>
                  <p>{data?.connections_pending || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-3">
          <div className="dashboard-content">
            <div className="numItems">
              <div className="dashboard-icon-container approved">
                <i class="far fa-file dashboard-icon" style={{ color: '#519065' }}></i>
              </div>
              <div >
                <label>Approved Pitches</label>
                <p>{data?.pitches?.approved || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-4">

          <div className="dashboard-content">
            {/* <div className="dashboard-icon-container">
            <i class="fas fa-file dashboard-icon"></i>
          </div> */}
            <div>

              <div className="numItems">
                <div className="dashboard-icon-container">
                  <i class="far fa-file dashboard-icon"></i>
                </div>
                <div >
                  <label>Pending Pitches</label>
                  <p>{data?.pitches?.pending || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section-2">
        <div className="piechart">
          <BarActiveArc Tdata={data} />
        </div>
        
      </div>

      {/* section-3 */}

      {/* <div className="dashboard-section-3">
      </div> */}
    </div>
  );
};

export default Dashboard;
