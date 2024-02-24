import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import React from 'react'
import { useState, useEffect } from "react";

const SideConnectionStats = ({ Tdata, status }) => {
    const [defaultConnectionColor, setDefaultConnectionColor] = useState({
        Mentor: '#4e54c7', Entrepreneur: '#ff6824', Investor: '#1799ac', Admin: 'green'
    })

    const [connectionColors, setConnectionColors] = useState([]);
    const [userFlowdata, setUserFlowData] = useState({})
    const [data, setdata] = useState([]);
    useEffect(() => {
        if (Object.keys(Tdata).length > 0) {
            const tempData1 = [];
            const tempUserFlowdata = {}
            const connections = Object.keys(Tdata?.connections);
            for (let i = 0; i < Object.keys(Tdata?.connections).length; i++) {
                tempData1.push({ id: i, value: Tdata?.connections[connections[i]][status], label: connections[i] });
                if (tempUserFlowdata[`userCreatedConv-${status}`]) {
                    tempUserFlowdata[`userCreatedConv-${status}`] = tempUserFlowdata[`userCreatedConv-${status}`] + Tdata?.connections[connections[i]][`userCreatedConv-${status}`]
                } else {
                    tempUserFlowdata[`userCreatedConv-${status}`] = Tdata?.connections[connections[i]][`userCreatedConv-${status}`]
                }
                if (tempUserFlowdata[`userReceivedConv-${status}`]) {
                    tempUserFlowdata[`userReceivedConv-${status}`] = tempUserFlowdata[`userReceivedConv-${status}`] + Tdata?.connections[connections[i]][`userReceivedConv-${status}`]
                } else {
                    tempUserFlowdata[`userReceivedConv-${status}`] = Tdata?.connections[connections[i]][`userReceivedConv-${status}`]
                }

                setConnectionColors(prev => [...prev, defaultConnectionColor[connections[i]]])
            }
            console.log(tempUserFlowdata)

            setUserFlowData({ ...tempUserFlowdata })
            console.log(tempData1)
            setdata(tempData1)
        }
    }, [Tdata]);

    return (
        <div>

            <div style={{ zindex: '999' }} className='requestDecider'>
                <div title='Sent by you'>
                    <ArrowUpwardIcon className='sentByyou' />
                    {userFlowdata[`userCreatedConv-${status}`]}
                </div>
                <div title='Received by you'>
                    <ArrowDownwardIcon className='receivedByyou' />
                    {userFlowdata[`userReceivedConv-${status}`]}
                </div>

            </div>
            <PieChart
                colors={connectionColors}
                series={[
                    {
                        startAngle: -79,
                        endAngle: 90,
                        paddingAngle: 5,
                        innerRadius: 60,
                        outerRadius: 80,
                        data
                    },
                ]}
                margin={{ right: 5 }}
                width={200}
                height={200}
                slotProps={{
                    legend: { hidden: true },
                }}
            />

        </div>
    )
}

export default SideConnectionStats
