import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import '../Conversation/Users/searchBox.css'
import '../Conversation/Notification/Notification.css'
import { Box, Dialog, DialogContent, Tab, Tabs, Typography } from '@mui/material'
import { gridCSS } from '../CommonStyles';
import { useSelector } from 'react-redux'
import { Country, State, City } from 'country-state-city';
import { domain_subdomain, idealUserRole, stages } from '../../Utils'
import './AddPitch.css'
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


function TabPanel(props) {
    const { className, children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            className={className}
        >
            {value === index && (
                <Box sx={{ p: 0 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
const PitchDetailsReadOnly = ({ open, setOpen, value, setValue, pitchDetails, update, approve, reject, setStatus, status }) => {
    const { role } = useSelector(state => state.auth.loginDetails)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const totalRoles = useSelector(state => state.auth.totalRoles)
    // console.log(pitchDetails);
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div>
            <Dialog fullScreen
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xl"
                sx={gridCSS.tabContainer}
            // sx={ gridCSS.tabContainer }
            >
                <DialogContent
                    style={{
                        height: "90vh",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    


                    <div className="addPitchHeader">
                        <div className={`addPitchIcons ${value == 1 && 'addPitchIconsselected'}`} onClick={() => setValue(1)}>Company Info</div>
                        <div className={`addPitchIcons ${value == 2 && 'addPitchIconsselected'}`} onClick={() => setValue(2)}>Pitch & Deal</div>
                        <div className={`addPitchIcons ${value == 3 && 'addPitchIconsselected'}`} onClick={() => setValue(3)}>Team</div>
                        <div className={`addPitchIcons ${value == 4 && 'addPitchIconsselected'}`} onClick={() => setValue(4)}>Image & videos</div>
                        <div className={`addPitchIcons ${value == 5 && 'addPitchIconsselected'}`} onClick={() => setValue(5)}>Documents</div>
                        <div className={`addPitchIcons ${value == 6 && 'addPitchIconsselected'}`} onClick={() => setValue(6)}>Requirements</div>
                        <div
                          
                            onClick={() => {
                                setOpen(false)
                            }}
                        >
                            <CloseIcon />
                        </div>
                    </div>
                    {value == 1 && <div className="pitchForm">
                        <div className="pitchformFields">
                            <div>
                                <label>Pitch title*</label>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="title"
                                    value={pitchDetails?.title} disabled
                                    placeholder="Enter title for pitch"
                                />
                            </div>
                        </div>

                        <div className="pitchformFields">
                            <div>
                                <label>Website</label>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="website"
                                    value={pitchDetails?.website} disabled
                                    placeholder="Enter your website with https:// or http://"
                                />
                            </div>
                        </div>

                        <div className="pitchformFields">
                            <div>
                                <label>Where is management located ?</label>
                            </div>
                            <div>
                                <select
                                    name="memberscountry"
                                    value={pitchDetails?.memberscountry} disabled
                                >
                                    <option value="">Select</option>
                                    {Country?.getAllCountries().length > 0 && Country?.getAllCountries().map(c => (
                                        <option value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pitchformFields">
                            <div>
                                <label>Domain</label>
                            </div>
                            <div>
                                <select
                                    name="industry1"
                                    value={pitchDetails?.industry1} disabled
                                >
                                    <option value="">Select</option>
                                    {Object.keys(domain_subdomain).map(d => (
                                        <option value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        <div className="pitchformFields">
                            <div>
                                <label>Sub domain</label>
                            </div>
                            <div>
                                <select
                                    name="industry2"
                                    value={pitchDetails?.industry2} disabled
                                >
                                    <option value="">Select</option>
                                    {domain_subdomain[pitchDetails?.industry1]?.map(d => (
                                        <option value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pitchformFields">
                            <div>
                                <label>Stage</label>
                            </div>
                            <div>
                                <select
                                    name="stage"
                                    value={pitchDetails?.stage} disabled
                                >
                                    <option value="">Select</option>
                                    {stages.map(d => (
                                        <option value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pitchformFields">
                            <div><label>User Type</label></div>
                            <div>
                                <select name="userType" value={pitchDetails?.userType} disabled
                                >
                                    <option value="">Select</option>

                                    {totalRoles.map(d => (
                                        <option value={d.role}>{d.role}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pitchformFields">
                            <div>
                                <label>Ideal User Role</label>
                            </div>
                            <div>
                                <select
                                    name="idealInvestor"
                                    value={pitchDetails?.idealInvestor} disabled
                                >
                                    <option value="">Select</option>
                                    {idealUserRole.map(d => (
                                        <option value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pitchformFields">
                            <div>
                                <label>How much in total have you raised till now?</label>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="previousRoundRaise"
                                    value={pitchDetails?.previousRoundRaise} disabled
                                    placeholder="Enter how much did you raise in previous? *"
                                />
                            </div>
                        </div>

                        <div className="pitchformFields">
                            <div>
                                <label style={{ width: '300px', whiteSpace: 'wrap' }}>How much total equity in % is diluted for raising above amount?</label>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="raising"
                                    value={pitchDetails?.raising} disabled
                                    placeholder="Enter How much total equity in % is diluted for raising above amount?"
                                />
                            </div>
                        </div>

                        {/* <div>
                <div>
                  <label>How much of this total you have raised?</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="raised"
                    value={pitchDetails?.raised}
                    disabled
                    placeholder="Enter how much of this total you have raised?"
                  />
                </div>
              </div> */}

                        <div className="pitchformFields">
                            <div>
                                <label style={{ width: '650px', whiteSpace: 'wrap' }}>What and estimated amount you are offering to User (Entrepreneur/Mentor/Investor) who
                                    accept this Pitch? Like: Equity , Cash etc.</label>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="minimumInvestment"
                                    value={pitchDetails?.minimumInvestment} disabled
                                    placeholder="Enter the minimum investment per investor?"
                                />
                            </div>
                        </div>
                    </div>}

                    {value == 2 && <div className="pitchForm">
                        <div className="pitchformFields">
                            <div>
                                <label>Overview of Startup</label>
                            </div>
                            <div>
                                <textarea
                                    type="text"
                                    name="overViewOfStartup"
                                    value={pitchDetails?.overViewOfStartup} disabled
                                    rows={10}
                                    cols={50}
                                ></textarea>
                            </div>
                        </div>
                        <div className="pitchformFields">
                            <div>
                                <label>Business Model</label>
                            </div>
                            <div>
                                <textarea
                                    type="text"
                                    name="businessModel"
                                    value={pitchDetails?.businessModel}
                                    disabled
                                    rows={10}
                                    cols={80}
                                ></textarea>
                            </div>
                        </div>


                        <div className="pitchformFields">
                            <div>
                                <label>Revenue Model</label>
                            </div>
                            <div>
                                <textarea
                                    type="text"
                                    name="revenueModel"
                                    value={pitchDetails?.revenueModel}
                                    disabled
                                    rows={10}
                                    cols={80}
                                ></textarea>
                            </div>
                        </div>

                        <div className="pitchformFields">
                            <div>
                                <label>Target Market</label>
                            </div>
                            <div>
                                <textarea
                                    type="text"
                                    name="targetMarket"
                                    value={pitchDetails?.targetMarket}
                                    disabled
                                    rows={10}
                                    cols={50}
                                ></textarea>
                            </div>
                        </div>
                        <div className="pitchformFields">
                            <div>
                                <label>Target Users</label>
                            </div>
                            <div>
                                <textarea
                                    type="text"
                                    name="targetUsers"
                                    value={pitchDetails?.targetUsers}
                                    disabled
                                    rows={10}
                                    cols={50}
                                ></textarea>
                            </div>
                        </div>
                        <div className="pitchformFields">
                            <div>
                                <label>usp</label>
                            </div>
                            <div>
                                <textarea
                                    type="text"
                                    name="usp"
                                    value={pitchDetails?.usp}
                                    disabled
                                    rows={10}
                                    cols={50}
                                ></textarea>
                            </div>
                        </div>

                        <div className="pitchformFields">
                            <div>
                                <label>Competitor Analysis</label>
                            </div>
                            <div>
                                <textarea
                                    type="text"
                                    name="competitorAnalysis"
                                    value={pitchDetails?.competitorAnalysis}
                                    disabled
                                    rows={10}
                                    cols={50}
                                ></textarea>
                            </div>
                        </div>


                    </div>}
                    {value == 3 && <div className="pitchForm">
                        <div className="pitchformFields">
                            <div>
                                <label>Team Overview</label>
                            </div>
                            <div>
                                <textarea
                                    type="text"
                                    name="teamOverview"
                                    value={pitchDetails?.teamOverview}
                                    disabled
                                    rows={10}
                                    cols={70}
                                ></textarea>
                            </div>
                        </div>
                        <div className="pitchformFields">
                            <div>
                                <label>Team Members</label>
                            </div>
                            {pitchDetails?.teamMembers.length > 0 && (
                                <div className="listedTeam">
                                    {pitchDetails?.teamMembers.map((t, i) => (
                                        <div className="singleMember">
                                            {t?.memberPic?.secure_url !== undefined && (
                                                <div>
                                                    <img src={t.memberPic?.secure_url} alt="" />
                                                </div>
                                            )}
                                            <div>{t.name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>}

                    {value == 4 && <div className="pitchForm">
                        <div>
                            <div
                                style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}
                            >
                                <label>Logo*</label>
                                {pitchDetails?.logo?.secure_url !== undefined &&
                                    pitchDetails?.logo?.secure_url !== "" && (
                                        <a target='_blank'
                                            href={pitchDetails?.logo.secure_url}
                                            style={{ display: "inline-block" }}
                                        >
                                            <img title='view Previous Logo'
                                                style={{
                                                    height: "30px",
                                                    width: "30px",
                                                    // marginLeft: '270px'
                                                }}
                                                src="/view.png"
                                                
                                            />
                                        </a>
                                    )}
                            </div>
                        </div>

                        <div>
                            <div
                                style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}
                            >
                                <label>Banner Image</label>
                                {pitchDetails?.banner?.secure_url !== undefined &&
                                    pitchDetails?.banner?.secure_url !== "" && (
                                        <a target='_blank'
                                            href={pitchDetails?.banner.secure_url}
                                            style={{ display: "inline-block" }}
                                        >
                                            <img title='view Previous Banner Image'
                                                style={{
                                                    height: "30px",
                                                    width: "30px",
                                                }}
                                                src="/view.png"
                                                
                                            />
                                        </a>
                                    )}
                            </div>
                        </div>
                    </div>}

                    {value == 5 && <div className="pitchForm">
                        <div>
                            <div
                                style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}
                            >
                                <label>Pitch Docs/Business Plan*</label>
                                {pitchDetails?.pitch?.secure_url !== undefined &&
                                    pitchDetails?.pitch?.secure_url !== "" && (
                                        <a target='_blank'
                                            href={pitchDetails?.pitch.secure_url}
                                            style={{ display: "inline-block" }}
                                        >
                                            <img title='view Previous Business Plan'
                                                style={{
                                                    height: "30px",
                                                    width: "30px",
                                                }}
                                                src="/view.png"
                                                
                                            />
                                        </a>
                                    )}
                            </div>
                        </div>

                        <div>
                            <div
                                style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}
                            >
                                <label>Financials*</label>
                                {pitchDetails?.financials?.secure_url !== undefined &&
                                    pitchDetails?.financials?.secure_url !== "" && (
                                        <a target='_blank'
                                            href={pitchDetails?.financials.secure_url}
                                            style={{ display: "inline-block" }}
                                        >
                                            <img title='view Previous Financials'
                                                style={{
                                                    height: "30px",
                                                    width: "30px",
                                                }}
                                                src="/view.png"
                                                
                                            />
                                        </a>
                                    )}
                            </div>
                        </div>
                    </div>}
                    {value == 6 && <div className="pitchForm">
                        <div className="pitchformFields">
                            <div>
                                <label>Heading*</label>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="heading"
                                    value={pitchDetails?.heading}
                                    disabled
                                    placeholder="Enter heading to show pitch"
                                />
                            </div>
                        </div>

                        <div>
                            <div>
                                <label>People needed ?</label>
                                {pitchDetails?.hiringPositions.length > 0 && (
                                    <div className="listedTeam">
                                        {pitchDetails?.hiringPositions.map((t, i) => (
                                            <div className="singleMember">

                                                <div>{t}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className="pitchformFields">
                            <div>
                                <label>Description*</label>
                            </div>
                            <div>
                                <textarea
                                    type="text"
                                    name="description"
                                    value={pitchDetails?.description}
                                    disabled
                                    rows={10}
                                    cols={80}
                                ></textarea>
                            </div>
                        </div>
                        <div>
                            <div>
                                <label>Tags*</label>
                            </div>
                            <div>
                                {pitchDetails?.tags.length > 0 && (
                                    <div className="listedTeam">
                                        {pitchDetails?.tags.map((t, i) => (
                                            <div className="singleMember">
                                                <div>{t}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            
                        </div>
                    
                        <div className='showHide'>
                                <div>
                                    <label>Do you want pich hide/show ?</label>
                                </div>
                                <div >
                                    <select
                                        name="pitchRequiredStatus" value={(status == '' || status == undefined) ? pitchDetails?.pitchRequiredStatus : status}
                                        disabled={role == 'Admin' || window.location.pathname !== '/userPitches' || (pitchDetails?.status !== 'approved')}
                                        onChange={(e) => {
                                            setStatus(e.target.value);
                                        }}
                                    >
                                        <option value="">Select</option>
                                        <option value="hide">Hide</option>
                                        <option value="show">Show</option>
                                    </select>
                                </div>
                            </div>

                    </div>}





                {value == 6 ? <div className='pitchSubmit' style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
                    {approve && <button type="submit" onClick={(e) => update(e, 'approved')}>
                        {approve}
                    </button>}
                    {reject && <button type="submit" style={{ background: 'red' }} onClick={(e) => update(e, 'rejected')}>
                        {reject}
                    </button>}
                </div> : <div className='pitchSubmit'>
                    <button type="submit" onClick={() => {
                        if (value < 6) {
                            setValue(prev => prev + 1)
                        }
                    }}>
                        Next
                    </button>
                </div>}

                   
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PitchDetailsReadOnly