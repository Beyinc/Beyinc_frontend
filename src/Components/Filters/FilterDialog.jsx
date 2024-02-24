import { Tab, Tabs, Typography } from "@mui/material";
import useWindowDimensions from "../Common/WindowSize";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { FilterPanel } from "../AllUsers/FilterPanel";
import CachedIcon from "@mui/icons-material/Cached";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function FilterDialog({
  tabs,
  filters,
  setFilters,
  handleReloadClick,
  isSpinning,
}) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const { height, width } = useWindowDimensions();

  return (
    <>
      <Dialog
        fullScreen={width <= 400}
        maxWidth={"md"}
        fullWidth={true}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <>Filter</>
          <CachedIcon
            style={{ cursor: "pointer" }}
            className={isSpinning ? "spin" : ""}
            onClick={() => {
              handleReloadClick();
            }}
          />
        </DialogTitle>
        <DialogContent sx={{ overflow: "hidden" }} style={{ padding: 0 }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexGrow: 1,
              bgcolor: "background.paper",
              height: width <= 400 ? "100%" : 400,
              overflowY: "scroll",
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              className="tabs-vertical"
              sx={{
                borderRight: 1,
                borderColor: "divider",
                position: "sticky",
                top: 0,
                left: 0,
              }}
            >
              {tabs.map((v, i) => (
                <Tab
                  className="filter-tab-style"
                  label={<div className="filter-tab-text">{v.name}</div>}
                  {...a11yProps(i)}
                />
              ))}
            </Tabs>
            {tabs.map((v, i) => (
              <TabPanel value={value} index={i}>
                <FilterPanel
                  rawData={v.data}
                  isFlat={true}
                  dataKey={v.dataKey}
                  filters={filters}
                  setFilters={setFilters}
                />
              </TabPanel>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ width: "fit-content" }}
            variant="contained"
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {width < 770 && (
        <div className="user-nav-bar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <button className="nav-bar-buttons" onClick={handleClickOpen}>
              <i style={{ marginRight: 3 }} class="fa fa-filter" /> Filter
            </button>
          </div>
        </div>
      )}
    </>
  );
}
