import "./DashboardPitchTable.css";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import useWindowDimensions from '../../Common/WindowSize';
import { ApiServices } from '../../../Services/ApiServices';
import { setToast } from '../../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../../Toast/ToastColors';
import { Dialog, DialogContent } from '@mui/material';
import { gridCSS } from '../../CommonStyles';
import { setUserAllPitches, setUserLivePitches, setUserReceivedPitches } from '../../../redux/Conversationreducer/ConversationReducer';
import AddPitch from '../../Common/AddPitch';
import { useNavigate } from 'react-router';
export default function ReceivedPitches() {
    const rows = useSelector(state => state.conv.userReceivedPitches)

    const dispatch = useDispatch()
    React.useEffect(() => {
        ApiServices.getReceivedPitches().then(res => {
            dispatch(setUserReceivedPitches(res.data))
        }).catch(err => {
            console.log('No Pitches received')
        })
    }, [])

    const navigate = useNavigate()
    return (
        <div className="tableHolder" style={{ marginTop: '10px' }} >
            <div className="HeadingHolder">
                <div>Pitches Recieved By You</div>
            </div>
            {rows.length > 0 ? <TableContainer className='tableContainer' component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px' }}>



                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <strong>Created By</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Title</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Heading</strong>
                            </TableCell>
                            <TableCell>
                                <strong>stage</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Status</strong>
                            </TableCell>
                            <TableCell style={{ whiteSpace: "nowrap" }}>
                                <strong>Created At</strong>
                            </TableCell>
                            <TableCell style={{ whiteSpace: "nowrap" }}>
                                <strong>Updated At</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Actions</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length > 0 && (
                            rows?.map((row) => (
                                <TableRow
                                    key={row.title}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{ whiteSpace: "nowrap" }}
                                    >
                                        {row?.userInfo?.userName}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{ whiteSpace: "nowrap" }}
                                    >
                                        {row.title}
                                    </TableCell>
                                    <TableCell style={{ whiteSpace: "nowrap" }}>
                                        {row.heading.length > 20
                                            ? `${row.heading.slice(0, 20)}...`
                                            : row.heading}
                                    </TableCell>
                                    <TableCell style={{ whiteSpace: "nowrap" }}>
                                        {row.stage}
                                    </TableCell>
                                    <TableCell>
                                        <div
                                            onClick={() => {
                                                if (row.status == 'approved') {
                                                    navigate(`/livePitches/${row._id}`)
                                                }
                                            }}
                                            style={{
                                                fontSize: "14px",
                                                marginLeft: "5px",
                                                cursor: row.status == 'approved' && 'pointer',
                                                color:
                                                    row.status == "approved"
                                                        ? "green"
                                                        : row.status == "pending"
                                                            ? "orange"
                                                            : "red",
                                                border: `1px dotted ${row.status == "approved"
                                                    ? "green"
                                                    : row.status == "pending"
                                                        ? "orange"
                                                        : "red"
                                                    }`,
                                                borderRadius: 5,
                                                padding: "3px",
                                                width: '70px', textAlign: 'center'
                                            }}
                                        >
                                            {row.status.split("")[0].toUpperCase() +
                                                row.status.slice(1)}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{ whiteSpace: "nowrap" }}>
                                        {moment(row.createdAt).format("MMM D, YYYY ")}
                                    </TableCell>
                                    <TableCell style={{ whiteSpace: "nowrap" }}>
                                        {moment(row.updatedAt).format("MMM D, YYYY ")}
                                    </TableCell>
                                    <TableCell>
                                        {row.status == 'approved' ? <div onClick={() => navigate(`/livePitches/${row?._id}`)} style={{ background: 'green', padding: '5px', borderRadius: '5px', width: '60px', color: 'white', textAlign: 'center', cursor: 'pointer' }}>
                                            View
                                        </div>: ''}
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer> :
                <div>
                    <img src="/no-requests.png" style={{ width: '300px', height: '300px' }} width={300} height={300} alt="" />
                    <div>No pitches Received </div>
                </div>
            }


        </div>
    );
}
