import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelectCheckmarks({
  names,
  filterName,
  setFilters,
  filters,
}) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (value[value.length - 1] === "Select All") {
      const str = ["Select All"];
      names.map((r) => {
        str.push(r);
      });
      // setFilters(prev => ({ ...prev, [filterName]: [...names] }))
      setFilters((prev) => ({ ...prev, [filterName]: [...str] }));
    } else if (
      filters[filterName]?.includes("Select All") &&
      !value.includes("Select All")
    ) {
      setFilters((prev) => ({ ...prev, [filterName]: [] }));
    } else if (
      filters[filterName]?.includes("Select All") &&
      value.length !== names.length - 1
    ) {
      const tepVal = Array.from(value);
      tepVal.splice(tepVal.indexOf("Select All"), 1);
      setFilters((prev) => ({ ...prev, [filterName]: tepVal }));
    } else if (
      !filters[filterName]?.includes("Select All") &&
      value.length == names.length
    ) {
      setFilters((prev) => ({
        ...prev,
        [filterName]: ["Select All", ...names],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterName]: typeof value === "string" ? value.split(",") : value,
      }));
    }
  };

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="demo-multiple-checkbox-label">{filterName}</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={filters[filterName]}
        onChange={handleChange}
        input={<OutlinedInput label="Tag" />}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        <MenuItem value={"Select All"}>
          <Checkbox checked={filters[filterName].includes("Select All")} />
          <ListItemText primary={"Select All"} />
        </MenuItem>
        {names.map((name) => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={filters[filterName].indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
