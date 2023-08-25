import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import "./search.css";

const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("name");

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleOnChange = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      onSearchChange(searchType, search);
    }
  };

  return (
    <div className="search-container">
      <FormControl variant="outlined" className="search-select">
        <InputLabel>Search by</InputLabel>
        <Select
          value={searchType}
          onChange={handleSearchTypeChange}
          label="Search by"
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="phoneNumber">Phone Number</MenuItem>
        </Select>
      </FormControl>
      <TextField
        variant="outlined"
        fullWidth
        label={`Search by ${searchType === "name" ? "name" : "phone number"}`}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        className="search-bar"
      />
    </div>
  );
};

export default Search;
