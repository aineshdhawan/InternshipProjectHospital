import React, { useState } from "react";
import {
  TextField,
  Paper,
  IconButton,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

function PatientSearch({ onSearchResult }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const response = await fetch(
      `http://localhost:3001/patients/search?searchQuery=${searchQuery}`
    );
    const data = await response.json();
    console.log("Searching for:", searchQuery);
    setSearchResults(data);
    onSearchResult && onSearchResult(data); // Callback to pass results to parent component
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };
  const handleRefresh = () => {
    setSearchQuery(""); 
    setSearchResults([]); 
  };

  return (
    <div>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "auto",
          marginBottom: "20px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <IconButton onClick={handleRefresh} aria-label="refresh">
                  <RefreshIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Render the TableContainer only if there are search results */}
      {searchResults.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 800, margin: "auto" }}
        >
          <Table aria-label="search results">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="right">{row.name}</TableCell>
                  <TableCell align="right">{row.contact_info}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default PatientSearch;
