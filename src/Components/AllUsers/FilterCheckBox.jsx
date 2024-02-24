import { Search } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export function FilterCheckBoxes({
  rawData,
  filters,
  setFilters,
  dataKey,
  isCountry,
  isFlat,
  isPitch,
  showSearch,
}) {
  const [data, setData] = useState(rawData);
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (query.length === 0 && showSearch) {
      setData(rawData.slice(0, 5));
      return;
    }
    const prepQuery = query.toLowerCase();
    setData(() =>
      isFlat
        ? rawData.filter((v) => v.toLowerCase().includes(prepQuery))
        : !isCountry
          ? rawData.filter((v) => v[dataKey].toLowerCase().includes(prepQuery))
          : rawData.filter((v) => v.name.toLowerCase().includes(prepQuery))
    );
  }, [query, rawData, dataKey, isCountry, isFlat, showSearch]);
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
          {!isCountry
            ? isFlat
              ? data.map((v) => (
                <li>
                  <input
                    id={`${v}-${dataKey}-check`}
                    class="filter-checkbox-input"
                    type="checkbox"
                    name="type-set"
                    checked={filters[dataKey].includes(v)}
                    onClick={() => {
                      setFilters((prev) => {
                        // console.log(
                        //   prev[dataKey].includes(v),
                        //   v,
                        //   prev[dataKey].filter((g) => g !== v)
                        // );
                        return {
                          ...prev,
                          [dataKey]: prev[dataKey].includes(v)
                            ? prev[dataKey].filter((g) => g !== v)
                            : [...prev[dataKey], v],
                        };
                      });
                    }}
                  />
                  <label
                    id={`${v}-${dataKey}-check`}
                    class="filter-checkbox-label"
                  >
                    {v}
                  </label>
                </li>
              ))
              : data.map((v) => (
                <li>
                  <input
                    id={`${v[dataKey]}-${dataKey}-check`}
                    class="filter-checkbox-input"
                    type="checkbox"
                    name="type-set"
                    checked={filters[dataKey].includes(v[dataKey])}
                    onClick={() => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          [dataKey]: prev[dataKey].includes(v[dataKey])
                            ? prev[dataKey].filter((g) => g !== v[dataKey])
                            : [...prev[dataKey], v[dataKey]],
                        };
                      });
                    }}
                  />
                  <label
                    id={`${v[dataKey]}-${dataKey}-check`}
                    class="filter-checkbox-label"
                  >
                    {v[dataKey]}
                  </label>
                </li>
              ))
            : data.map((h) => (
              <li>
                <input
                  id={`${h.name}-country-check`}
                  class="filter-checkbox-input"
                  type="checkbox"
                  name="type-set"
                  checked={filters["country"].includes(
                    `${h.name}-${h.isoCode}`
                  )}
                  onClick={() =>
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
                <label
                  id={`${h.name}-country-check`}
                  class="filter-checkbox-label"
                >
                  {h.name}
                </label>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
