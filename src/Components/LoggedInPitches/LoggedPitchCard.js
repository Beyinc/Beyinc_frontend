import React, { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ToastColors } from "../Toast/ToastColors";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import PitchDetailsReadOnly from "../Common/PitchDetailsReadOnly";
import { ApiServices } from "../../Services/ApiServices";
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export default function LoggedInPitchCard({ d }) {
  const navigate = useNavigate();

  const [pitchDetails, setPitchdetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);
  // const [image, setImage] = React.useState('')
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();
  const { image } = useSelector((state) => state.auth.loginDetails);

  const update = async (e) => {
    if (status == "") {
      setOpen(false);
      return;
    }
    e.target.disabled = true;
    await ApiServices.updatePitch({ pitchId: d._id, status: status })
      .then((res) => {
        dispatch(
          setToast({
            message: `Pitch Status Updated`,
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        setOpen(false);
        d.status = "pending";
        setPitchdetails((prev) => ({ ...prev, status: "pending" }));
        e.target.disabled = false;
      })
      .catch((err) => {
        setToast({
          message: "Error occured when updating Pitch",
          bgColor: ToastColors.failure,
          visible: "yes",
        });
        e.target.disabled = false;
      });

  };

  useEffect(() => {
    ApiServices.fetchSinglePitch({ pitchId: d._id }).then((res) => {
      setPitchdetails(res.data);
    });
  }, [d]);

  const openUser = () => navigate(`/user/${d.email}`);

  return (
    <div
      className={
        "user-card-main-container " +
        (d?.userInfo.role === "Entrepreneur"
          ? "margin-entrepreneur"
          : d?.userInfo.role === "Mentor"
            ? "margin-mentor"
            : "")
      }
    >
      <div className="user-card-details">
        <div className="user-card-img-rating-container">
          <div className="user-card-image" onClick={openUser}>
            <img
              alt="user-pic"
              src={
                image !== undefined && image !== "" ? image : "/profile.png"
              }
              
            />
          </div>
        </div>
        <div className="user-card-details-text">
          <span className="user-name" onClick={openUser}>
            {d?.userInfo.userName}
          </span>
          <span>
            <b>Status</b>:{" "}
            <span
              style={{
                fontSize: "14px",
                marginLeft: "5px",
                color:
                  d.status == "approved"
                    ? "green"
                    : d.status == "pending"
                      ? "orange"
                      : "red",
                border: `1px dotted ${d.status == "approved"
                  ? "green"
                  : d.status == "pending"
                    ? "orange"
                    : "red"
                  }`,
                borderRadius: 5,
                padding: "3px",
              }}
            >
              {d.status ? capitalizeFirstLetter(d.status) : d.status}
            </span>
          </span>
        </div>
      </div>
      <div className="user-card-actions">
        <div
          style={{
            fontWeight: "400",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <span>{d?.userInfo.role}</span>
          <span>
            {d?.userInfo.verification === "approved" && (
              <img
                src="/verify.png"
                alt=""
                style={{ width: "15px", height: "15px", marginLeft: "5px" }}
              />
            )}
          </span>
        </div>
        <button onClick={() => setOpen(true)}>View</button>{" "}
        {open && (
          <PitchDetailsReadOnly
            status={status}
            setStatus={setStatus}
            approve="Update"
            reject="Cancel"
            open={open}
            setOpen={setOpen}
            update={update}
            value={value}
            setValue={setValue}
            pitchDetails={pitchDetails}
          />
        )}
      </div>
    </div>
  );
  // return (
  //     <Card sx={{ maxWidth: 280,  boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(0, 0, 0, 0.1)'}}>
  //         <div style={{ display: 'flex', fontSize: '24px', flexWrap: 'wrap', gap: '5px' }}>
  //             <img className='userCardImage'
  //                 src={image !== undefined && image !== "" ? image : "/profile.jpeg"}
  //                 title={d.email}
  //             />
  //             <div style={{fontWeight: '600', marginTop: '40px', marginLeft: '30px'}}>{d.role}
  //                 <div title={d.status}>
  //                     <span style={{
  //                         fontSize: '14px', marginLeft: '5px', color: d.status == 'approved' ? 'green' : (d.status == 'pending' ? 'orange' : 'red'),
  //                         border: `1px dotted ${d.status == 'approved' ? 'green' : (d.status == 'pending' ? 'orange' : 'red')}`,
  //                         padding: '3px'
  //                     }}>{d.status}</span>
  //                 </div>
  //             </div>

  //         </div>
  //         <CardContent>
  //             <Typography gutterBottom variant="h5" component="div" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
  //                 {d?.userInfo?.userName}
  //             </Typography>
  //         </CardContent>
  //         <CardActions>
  //             <Button size="small" id='view-request' onClick={() => setOpen(true)}>View Pitch Request</Button>
  //             {/* <Button size="small">Learn More</Button> */}
  //             {open &&
  //                 <PitchDetailsReadOnly status={status} setStatus={setStatus} approve='Update' reject='Cancel' open={open} setOpen={setOpen} update={update} value={value} setValue={setValue} pitchDetails={pitchDetails} />
  //             }
  //         </CardActions>
  //     </Card>
  // );
}
