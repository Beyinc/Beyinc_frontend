import React from "react";
import Navbar from "../Navbar/Navbar";
import { useSelector } from "react-redux";
import DashboardPitchTable from "./Dashboard/DashboardPitchTable";
import Dashboard from "./Dashboard/Dashboard";
const Home = () => {
  const { role, userName } = useSelector((store) => store.auth.loginDetails);
  return (
    <div>
      <center>
        {/* <h1>Welcome {userName} to Beyinc !</h1> */}
        <Dashboard />
        <DashboardPitchTable />
      </center>
    </div>
  );
};

export default Home;
