import React, { useState, useEffect} from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box } from "@mui/material";


export default function PieActiveArc({ data }) {
  
  
  const [defaultConnectionColor, setDefaultConnectionColor] = useState({
    Mentor: '#4e54c7', Entrepreneur: '#ff6824', Investor: '#1799ac', Admin: 'green'
  })

  const [defaultPitchesColor, setDefaultPitchesColor] = useState({
    approved: 'green', pending: 'orange', rejected: 'red'
  })


  const [connectionColors, setConnectionColors] = useState([]);
  const [pitchesColors, setPitchesColors] = useState([]);
  const [ConnectionsData, setConnectionsData] = useState([
  ]);
  const [pitchesData, setPitchesData] = useState([
  ]);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      const tempData1 = [];
      const connections = Object.keys(data?.connections);
      console.log(connections)
      for (let i = 0; i < Object.keys(data?.connections).length; i++) {
        tempData1.push({ id: i, value: data?.connections[connections[i]], label: connections[i]});
        setConnectionColors(prev => [...prev, defaultConnectionColor[connections[i]]])
      }
      setConnectionsData(tempData1)
    }
  }, [data]);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      const tempData2 = [];
      const pitches = Object.keys(data?.pitches);
      console.log(pitches)
      for (let i = 0; i < Object.keys(data?.pitches).length; i++) {
        tempData2.push({ id: i, value: data?.pitches[pitches[i]], label: pitches[i]});
        setPitchesColors(prev => [...prev, defaultPitchesColor[pitches[i]]])
      }
      setPitchesData(tempData2)
    }
  }, [data]);


  return (
    <div>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <Box sx={{ width: 1, maxWidth: 600, marginRight: "20px",display: 'flex', flexDirection:'column'  }}>
          <label style={{alignSelf: 'center', width: '200px'}}>Connections</label>
          {ConnectionsData.length > 0 ? (
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
          ) : (
            <p>No connections</p>
          )}
        </Box>
        <Box sx={{ width: 1, maxWidth: 600,display: 'flex', flexDirection:'column'  }}>
          <label style={{alignSelf: 'center', width: '150px'}}>Pitches</label>
          {pitchesData.length > 0 ? (
            <PieChart
              colors={pitchesColors}
              series={[
                {
                  data: pitchesData,
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
          ) : (
            <p>No pitches</p>
          )}
        </Box>
      </Box>
    </div>
  );
}
