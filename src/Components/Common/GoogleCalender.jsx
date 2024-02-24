import { Dialog, DialogContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { gridCSS } from "../CommonStyles";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";

import './GoogleCalender.css'
import useWindowDimensions from "./WindowSize";
import axios from "axios";
export const GoogleCalenderEvent = ({ gmeetLinkOpen, setGmeetLinkOpen, receiver }) => {
    const gapi = window.gapi;
    const google = window.google;
    const [startDate, setStartDate] = useState('')
    const [EndDate, setEndDate] = useState('')
    const dispatch = useDispatch()
    const { email } = useSelector(state => state.auth.loginDetails)
    const [selectedUserEvents, setSelectedUserEvent] = useState([])
    const [summary, setSummary] = useState('')
    const [desc, setdesc] = useState('')
    const [singleguestDetails, setsingleguestDetails] = useState([])

    const [guestDetails, setguestDetails] = useState([])




    const CLIENT_ID = process.env.REACT_APP_CALENDER_CLIENT_ID;
    const API_KEY = process.env.REACT_APP_CALENDER_API_KEY;
    const DISCOVERY_DOC =
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
    const SCOPES = "https://www.googleapis.com/auth/calendar";

    const [accessToken, setAccessToken] = useState(null);
    const [expiresIn, setExpiresIn] = useState(null);

    useEffect(() => {
        // console.log(localStorage.getItem("access_token"));
        setAccessToken(localStorage.getItem("access_token"))
        setExpiresIn(localStorage.getItem("expires_in"));
    }, [])

    const [gapiInited, setGapiInited] = useState(false);
    const [gisInited, setGisInited] = useState(false);
    const [tokenClient, setTokenClient] = useState(null);


    useEffect(() => {
        //const expiryTime = new Date().getTime() + expiresIn * 1000;
        if (receiver?.email !== undefined) {

            gapiLoaded();
            gisLoaded();
        }
    }, [accessToken, receiver?.email]);

    function gapiLoaded() {
        gapi.load("client", initializeGapiClient);
    }

    async function initializeGapiClient() {
        // console.log(accessToken);
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        setGapiInited(true)
        // gapiInited = true;

        if (accessToken && expiresIn) {
            gapi.client.setToken({
                access_token: accessToken,
                expires_in: expiresIn,
            });
            listUpcomingEvents();
        }
    }

    function gisLoaded() {
        // console.log(google?.accounts?.oauth2?.initTokenClient({
        //     client_id:
        //         CLIENT_ID,
        //     scope: SCOPES,
        //     callback: "", // defined later
        // }));
        setTokenClient(google?.accounts?.oauth2?.initTokenClient({
            client_id:
                CLIENT_ID,
            scope: SCOPES,
            callback: "", // defined later
        }));

        setGapiInited(true)
    }

    //Enables user interaction after all libraries are loaded.

    function handleAuthClick() {
        if (tokenClient !== null && tokenClient !== undefined) {
            tokenClient.callback = async (resp) => {
                if (resp.error) {
                    throw resp;
                }
                await listUpcomingEvents();
                const { access_token, expires_in } = gapi.client.getToken();
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("expires_in", expires_in);
                setAccessToken(access_token)
                setExpiresIn(expires_in);
            };

        }
        if (!(accessToken && expiresIn)) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            // console.log(tokenClient);
            tokenClient?.requestAccessToken({ prompt: "consent" });
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient?.requestAccessToken({ prompt: "" });
        }
    }

    //Sign out the user upon button click.

    function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken("");
            localStorage.clear();
        }
    }

    async function listUpcomingEvents() {
        let response;
        try {
            const request = {
                calendarId: "primary",
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                orderBy: "startTime",
            };
            response = await gapi.client.calendar.events.list(request);
        } catch (err) {
            // console.log(err);
            localStorage.removeItem('access_token')
            localStorage.removeItem("expires_in")
            setAccessToken('')
            setExpiresIn('')
            // document.getElementById("content").innerText = err.message;
            return;
        }

        const events = response.result.items;
        if (!events || events.length === 0) {
            // document.getElementById("content").innerText = "No events found.";
            return;
        }
        // // Flatten to string to display
        // const output = events.reduce(
        //     (str, event) =>
        //         `${str}${event.summary} (${event.start.dateTime || event.start.date
        //         })\n`,
        //     "<b>Events:</b>\n"
        // );
        // console.log(events, receiver?.email);
        // console.log(events.filter((event) => {
        //     const attendees = event.attendees || [];
        //     return attendees.some((attendee) => attendee.email === receiver?.email);
        // }));
        // console.log(events)
        setSelectedUserEvent(events.filter((event) => {
            const attendees = event.attendees || [];
            return attendees.some((attendee) => attendee.email === receiver?.email);
        }))
        // document.getElementById("content").innerText = output;
    }

    function addManualEvent(e) {
        e.target.disabled = true
        const event = {
            kind: "calendar#event",
            summary: summary,
            location: "",
            description: desc,
            start: {
                dateTime: new Date(startDate).toISOString(),
                timeZone: "Asia/Kolkata", // Update to your specific time zone
            },
            end: {
                dateTime: new Date(EndDate).toISOString(),
                timeZone: "Asia/Kolkata", // Update to your specific time zone
            },
            recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
            attendees: [...guestDetails?.map(g => ({ email: g, responseStatus: "needsAction" })),
            { email: receiver?.email, responseStatus: "needsAction" },
            ],
            reminders: {
                useDefault: true,
            },
            conferenceData: {
                createRequest: {
                    requestId: "sample123",
                    conferenceSolutionKey: {
                        type: "hangoutsMeet"
                    },
                }
            },
            guestsCanSeeOtherGuests: true,
        };
        const request = gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
            sendUpdates: "all",
        });
        request.execute(
            (event) => {
                // console.log(event);
                // console.log(`https://meet.google.com/${event.conferenceData.conferenceId}`);
                e.target.disabled = false
                setGmeetLinkOpen(false)
                dispatch(setToast({
                    visible: 'yes', message: 'Meeting created', bgColor: ToastColors.success
                }))
                setStartDate('')
                setEndDate('')
                setSummary('')
                setdesc('')
                setguestDetails([])
            },
            (error) => {
                console.error(error);
                e.target.disabled = false
            }
        );
        listUpcomingEvents()

    }
    const { height, width } = useWindowDimensions();

    return (
        <div>
            {/* <button
                id="authorize_button"
                hidden={accessToken && expiresIn}
                onClick={handleAuthClick}
            >
                Authorize
            </button>
            <button
                id="add_manual_event"
                hidden={!accessToken && !expiresIn}
                onClick={addManualEvent}
            >
                Add Event
            </button>
            <pre id="content" style={{ whiteSpace: "pre-wrap", display: 'none' }}></pre> */}

            <Dialog fullScreen={width < 700 && accessToken && expiresIn}
                open={gmeetLinkOpen}
                onClose={() => setGmeetLinkOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

                sx={gridCSS.tabContainer}
            // sx={ gridCSS.tabContainer }
            >
                <DialogContent style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    {accessToken && expiresIn && <i
                        className="fas fa-times cross" style={{ position: 'absolute', right: '0px' }}
                        onClick={() => setGmeetLinkOpen(false)}
                    ></i>}
                    <button className="schedulerbtnn"
                        id="authorize_button"
                        hidden={accessToken && expiresIn}
                        onClick={handleAuthClick}
                    >
                        Authorize to create meet
                    </button>
                    {/* <button
                        id="add_manual_event"
                        hidden={!accessToken && !expiresIn}
                        onClick={handleSignoutClick}
                    >
                        Signout
                    </button> */}
                    {(accessToken && expiresIn) &&
                        <div className="gmeetForm">
                            <h2>Schedule the meeting</h2>
                            <label>Summary*</label>
                            <input type="text" placeholder="Enter Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
                            <label>Description</label>
                            <input type="text" placeholder="Enter Description" value={desc} onChange={(e) => setdesc(e.target.value)} />
                            <label>Add Guest</label>
                            <div>
                                {guestDetails.length > 0 && (
                                    <div className="listedTeam">
                                        {guestDetails.map((t, i) => (
                                            <div className="singleMember">
                                                <div>{t}</div>
                                                <div
                                                    onClick={(e) => {
                                                        setguestDetails(guestDetails.filter((f, j) => i !== j));

                                                    }}
                                                >
                                                    <CloseIcon className="deleteMember" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <form action="" className="guestForm" onSubmit={(e) => {
                                e.preventDefault()
                                if (!guestDetails.includes(singleguestDetails)) {
                                    setguestDetails(prev => [...prev, singleguestDetails])
                                }
                                setsingleguestDetails('')
                            }}>
                                <input style={{ minWidth: '250px' }} type="text" placeholder="Enter Guest mails" value={singleguestDetails} onChange={(e) => setsingleguestDetails(e.target.value)} />
                                <div>
                                    <button className="schedulerbtnn" disabled={singleguestDetails == '' || !/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+/.test(singleguestDetails)} >Add guests</button>
                                </div>
                            </form>
                            <label>Start date and time*</label>
                            <input type="datetime-local" name="" value={startDate} id="" onChange={(e) => {
                                setStartDate(e.target.value)
                                setEndDate('')
                            }} />
                            <label>End date and time*</label>
                            <input type="datetime-local" min={startDate} value={EndDate} name="" id="" onChange={(e) => setEndDate(e.target.value)} />
                            <div>
                                <button className="schedulerbtnn"
                                    id="add_manual_event"
                                    hidden={!accessToken && !expiresIn}
                                    onClick={addManualEvent}
                                    disabled={startDate == '' || EndDate == '' || summary == ''}
                                >
                                    Add Event
                                </button>
                            </div>
                        </div>}

                    {/* <pre id="content" style={{ whiteSpace: "pre-wrap" }}></pre> */}
                    {selectedUserEvents.length > 0 && <>
                        <h5 style={{ margin: '5px 0px' }} className="meetsummary">Events with {receiver?.userName}</h5>
                        {/* <ol> */}
                        <div className='Totalmeetings'>
                            {selectedUserEvents.map((sel, i) => (
                                <div className='meetings'>
                                    <div className="meetsummary">{sel.summary}</div>
                                    <b>To:</b>
                                    {sel.attendees.map(a => (
                                        <div className="attendees">{a.email}</div>
                                    ))}
                                    <b>Start:</b>
                                    <div className="meetTime">{moment(sel.start?.dateTime).format("MMMM DD YYYY, h:mm:ss a")}</div>
                                    <b>End:</b>
                                    <div className="meetTime">{moment(sel.end?.dateTime).format("MMMM DD YYYY, h:mm:ss a")}</div>
                                    <a href={sel.hangoutLink} target="_blank">Meet Link</a>
                                    <a href={sel.htmlLink} target="_blank">Visit Calender</a>
                                </div>
                            ))}
                        </div>
                        {/* </ol> */}

                    </>}
                </DialogContent>
            </Dialog>
        </div>
    );
};
