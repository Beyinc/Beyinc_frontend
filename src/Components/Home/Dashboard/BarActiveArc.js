import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import useWindowDimensions from '../../Common/WindowSize';



export default function BarActiveArc({ Tdata }) {
  const [pending, setPending] = React.useState([]);
  const [approved, setApproved] = React.useState([]);
  const [xLabels, setXLabels] = React.useState([]);


  const [defaultConnectionColor, setDefaultConnectionColor] = React.useState({
    Mentor: '#4e54c7', Entrepreneur: '#ff6824', Investor: '#1799ac', Admin: 'green'
  })
  const { width } = useWindowDimensions()
  React.useEffect(() => {
    console.log(Tdata)
    if (Object.keys(Tdata).length > 0) {

      setXLabels(Object.keys(Tdata?.connections))
      Object.keys(Tdata?.connections).length > 0 && Object.keys(Tdata?.connections)?.map(obj => {
        setPending(prev => [...prev, Tdata?.connections?.[obj]?.pending])
        setApproved(prev => [...prev, Tdata?.connections?.[obj]?.approved])

      })
    }
  }, [Tdata]);
  return (
    <div>
      <label style={{ padding: '5px 25px' }}>Connection Summary</label>
      {(pending.length > 0 && approved.length > 0) &&
        <BarChart
          width={width < 768 ? 350 : 500}
          height={300}
          series={[
            { data: pending, label: 'Pending', id: 'pvId' },
            { data: approved, label: 'Approved', id: 'uvId' },
          ]}
          xAxis={[{ data: xLabels, scaleType: 'band' }]}
        /> 
      }
    </div>

  );
}