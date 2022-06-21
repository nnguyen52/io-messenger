import React from "react";
import { Box, FormControl, TextField, InputAdornment } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";

const useStyles = makeStyles((theme) => ({
  root: {},
}));
const Search = ({ handleSumitSearch, handleChangeSearch }) => {
  const classes = useStyles();
  return (
    <Box>
      <form onSubmit={handleSumitSearch}>
        <FormControl fullWidth>
          <TextField
            variant="standard"
            onChange={handleChangeSearch}
            aria-label="search"
            placeholder="Search"
            name="search"
            type="text"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </form>
    </Box>
  );
};

export default Search;
