import React, { useState, useEffect} from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box } from "@mui/material";

const PitchesData = [
  { id: 0, value: 5, label: "Accepted" },
  { id: 1, value: 25, label: "Pending" },
  { id: 2, value: 15, label: "Rejected" },
];


const pitchesColors = ["green", "orange", "red"];

export default function PieActiveArc({ data }) {
  const [defaultConnectionColor, setDefaultConnectionColor] = useState({
    Mentor: '#4e54c7', Entrepreneur: '#ff6824', Investor: '#1799ac', Admin: 'green'
  })
  const [connectionColors, setConnectionColors] = useState([]);
  const [ConnectionsData, setConnectionData] = useState([
  ]);
  useEffect(() => {
    if (Object.keys(data).length>0) {
      const tempData = [];
      const connections = Object.keys(data?.connections);
      console.log(connections)
      for (let i = 0; i < Object.keys(data?.connections).length; i++) {
        tempData.push({ id: i, value: data?.connections[connections[i]], label: connections[i]});
        setConnectionColors(prev=>[...prev,defaultConnectionColor[connections[i]]])
      }
      setConnectionData(tempData)
    }
  }, [data]);

  return (
    <div>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <Box sx={{ width: 1, maxWidth: 600, marginRight: "20px" }}>
          <label>Connections</label>
          <PieChart
            colors={connectionColors}
            series={[
              {
                data: ConnectionsData,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            height={200}
          />
        </Box>
        <Box sx={{ width: 1, maxWidth: 600 }}>
          <label>Pitches</label>
          <PieChart
            colors={pitchesColors}
            series={[
              {
                data: PitchesData,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            height={200}
          />
        </Box>
      </Box>
    </div>
  );
}
