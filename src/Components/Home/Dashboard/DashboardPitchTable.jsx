
import './DashboardPitchTable.css';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
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
import { setUserAllPitches, setUserLivePitches } from '../../../redux/Conversationreducer/ConversationReducer';
import AddPitch from '../../Common/AddPitch';
import { useNavigate } from 'react-router';
export default function BasicTable() {
    const rows = useSelector(state => state.conv.userAllPitches)
    const [open, setOpen] = React.useState(false)
    const [confirmPopup, setconfirmPopup] = React.useState(false)
    const [selectedId, setSelectedId] = React.useState('')
    const [type, setType] = React.useState('')
    const dispatch = useDispatch()
    const { width } = useWindowDimensions()
    const deletePitch = async () => {
        await ApiServices.deletePitch({ pitchId: selectedId }).then(async (res) => {
            dispatch(setToast({ message: 'Pitch Deleted', visible: 'yes', bgColor: ToastColors.success }))
            setSelectedId('')
            setconfirmPopup(false)
            await ApiServices.getuserPitches().then(res => {
                dispatch(setUserAllPitches(res.data))
            }).catch(err => {
                dispatch(setToast({
                    message: "Error while fetching pitches",
                    bgColor: ToastColors.failure,
                    visible: "yes",
                }))
            })
        }).catch(err => {
            dispatch(setToast({ message: 'Eror occured', visible: 'yes', bgColor: ToastColors.failure }))
            setSelectedId('')
            setconfirmPopup(false)

        })
    }
    const navigate = useNavigate()
    return (
        <><TableContainer className='tableContainer' component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px'}}>

                       
                        <button style={{whiteSpace: 'noWrap'}} onClick={() => {
                            setSelectedId('')
                            setOpen(true)
                        }}>Add New Pitch</button>
                    </TableRow>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Heading</TableCell>
                        <TableCell>stage</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>Created At</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>Updated At</TableCell>

                        <TableCell>Actions</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length > 0 ? (rows?.map((row) => (
                        <TableRow
                            key={row.title}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" style={{ whiteSpace: 'nowrap' }}>
                                {row.title}
                            </TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{row.heading.length > 20 ? `${row.heading.slice(0, 20)}...` : row.heading}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{row.stage}</TableCell>
                            <TableCell >
                                <span
                                    onClick={() => {
                                        if (row.status == 'approved') {
                                            navigate(`/livePitches/${row._id}`)
                                        }
                                    }}
                                    style={{
                                    fontSize: "14px",
                                    marginLeft: "5px",
                                    cursor: row.status == "approved" && 'pointer',
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
                                }}>
                                    {row.status.split('')[0].toUpperCase() + row.status.slice(1,)}
                                </span></TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{moment(row.createdAt).format('MMM D, YYYY ')}</TableCell>
                                                        <TableCell style={{ whiteSpace: 'nowrap' }}>{moment(row.updatedAt).format('MMM D, YYYY ')}</TableCell>

                            {row.associatedTo.length == 0 &&
                                <TableCell style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', height: '100%' }}>
                                    <div onClick={() => {
                                        setOpen(true)
                                        setSelectedId(row._id)
                                    }} style={{
                                        cursor: 'pointer'
                                    }}>
                                        <EditIcon />
                                    </div>
                                    <div onClick={() => {
                                        setconfirmPopup(true)
                                        setSelectedId(row._id)
                                    }} style={{
                                        cursor: 'pointer'
                                    }}>
                                        <DeleteIcon />
                                    </div>
                                </TableCell>}

                        </TableRow>
                    ))) : <p>No Pitches Recorded</p>}
                </TableBody>
            </Table>
        </TableContainer>
            <Dialog
                fullWidth={width < 700}
                open={confirmPopup}
                onClose={() => {

                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xl"
                sx={gridCSS.tabContainer}
            >
                <DialogContent
                    style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div className='addconvSelect'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '18px', marginBottom: '5px' }}>
                            <div>Are you want to delete the Pitch ?</div>

                        </div>
                        <div>

                            <div className="confirmPopup">
                                <button
                                    type=""
                                    onClick={deletePitch}
                                >
                                    Yes
                                </button>
                                <button
                                    type=""
                                    onClick={() => setconfirmPopup(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <AddPitch open={open} setOpen={setOpen} id={selectedId} setId={setSelectedId} />
        </>
    );
}