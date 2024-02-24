import { Search } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export function FilterCheckBoxes({
  rawData,
  filters,
  setFilters,
  dataKey,
  isCountry,
  showSearch,
}) {
  const [data, setData] = useState(rawData);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const prepQuery = query.toLowerCase();
    setData(() => rawData.filter((v) => v.toLowerCase().includes(prepQuery)));
  }, [query, rawData, dataKey, isCountry]);
  return (
    <div className="inputTag">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showSearch && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginY: 1,
            }}
          >
            <Search sx={{ color: "action.active", width: 20, mx: 1 }} />
            <input
              style={{ width: 150, height: 10, padding: 10, margin: 0 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search.."
              variant="standard"
            />
          </Box>
        )}
        <ul>
          {data.map((v) => (
            <li>
              <input
                id={`${v}-${dataKey}-check`}
                class="filter-checkbox-input"
                type="checkbox"
                name="type-set"
                checked={filters[dataKey].includes(v)}
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    [dataKey]: prev[dataKey].includes(v)
                      ? prev[dataKey].filter((g) => g !== v)
                      : [...prev[dataKey], v],
                  }));
                }}
              />
              <label id={`${v}-${dataKey}-check`} class="filter-checkbox-label">
                {v}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
