import { Search } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export function FilterPanel({
  rawData,
  filters,
  setFilters,
  dataKey,
  isCountry,
  isFlat,
  isPitch,
}) {
  const [data, setData] = useState(rawData);
  const [query, setQuery] = useState("");
  useEffect(() => {
    // console.log(query);
    if (query !== '') {
      const prepQuery = query?.toLowerCase();
      setData(() =>
        isFlat
          ? rawData.filter((v) => v?.toLowerCase().includes(prepQuery))
          : !isCountry
            ? rawData.filter((v) => v[dataKey]?.toLowerCase().includes(prepQuery))
            : rawData.filter((v) => v?.name?.toLowerCase().includes(prepQuery))
      );
   }
  }, [query, rawData, dataKey, isCountry, isFlat]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-end", marginTop: -5 }}>
        <Search sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          label="Search.."
          variant="standard"
        />
      </Box>
      {!isCountry
        ? isFlat
          ? data.map((h) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    value={h}
                    checked={filters[dataKey].includes(h)}
                    onChange={() =>
                      setFilters(() => ({
                        ...filters,
                        [dataKey]: filters[dataKey]?.includes(h)
                          ? filters[dataKey].filter((v) => v !== h)
                          : [...filters[dataKey], h],
                      }))
                    }
                  />
                }
                label={<div className="filter-options-label">{h}</div>}
              />
            );
          })
          : data.map((h) => (
            <FormControlLabel
              control={
                <Checkbox
                  value={h[dataKey]}
                  checked={filters[dataKey].includes(h[dataKey])}
                  onChange={() => {
                    setFilters((prev) => ({
                      ...prev,
                      [dataKey]: prev[dataKey].includes(h[dataKey])
                        ? prev[dataKey].filter((v) => v !== h[dataKey])
                        : [...filters[dataKey], h[dataKey]],
                    }));
                  }}
                />
              }
              label={<div className="filter-options-label">{h[dataKey]}</div>}
            />
          ))
        : data.map((h) => (
          <FormControlLabel
            control={
              <Checkbox
                value={`${h.name}-${h.isoCode}`}
                checked={filters[isPitch ? "country" : "userName"].includes(
                  `${h.name}-${h.isoCode}`
                )}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    [isPitch ? "country" : "userName"]: prev[
                      isPitch ? "country" : "userName"
                    ].includes(`${h.name}-${h.isoCode}`)
                      ? prev[isPitch ? "country" : "userName"].filter(
                        (v) => v !== `${h.name}-${h.isoCode}`
                      )
                      : [
                        ...filters[isPitch ? "country" : "userName"],
                        `${h.name}-${h.isoCode}`,
                      ],
                  }))
                }
              />
            }
            label={<div className="filter-options-label">{h.name}</div>}
          />
        ))}
    </div>
  );
}
