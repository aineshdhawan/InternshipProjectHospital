import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";

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
import useDebounce from "./PatientDebounce";


function PatientSearch({ onSearchResult }) {
  let history = useHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const observer = useRef();

  useEffect(() => {
    if (debouncedSearchQuery && page) {
      fetchResults(debouncedSearchQuery, page);
    }
  }, [debouncedSearchQuery, page]);

  const fetchResults = async (query, page) => {
    setLoading(true);
    console.log(`Fetching page ${page} for query ${query}`);  // Add this line for debugging
    const response = await fetch(
      `http://localhost:3001/patients/search?searchQuery=${query}&page=${page}`
    );
    const data = await response.json();
    setLoading(false);
    if (data.length > 0) {
      setSearchResults(data);
    } else {
      setHasMore(false);
    }
    onSearchResult && onSearchResult(data);
  };


  const handleSearch = async () => {
    setLoading(true);
    const response = await fetch(
      `http://localhost:3001/patients/search?searchQuery=${searchQuery}&page=${page}`
    );
    const data = await response.json();
    console.log("Searching for:", searchQuery);
    if (data.length === 0) {
      setHasMore(false);
    } else {
      setSearchResults(data);  // Only set the new results
      setPage(1);  // Reset page to 1 for a new search
    }
    setLoading(false);
    onSearchResult && onSearchResult(data);
  };

  const handleRowClick = (patientId) => {
    history.push(`/patients/${patientId}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleNext = () => {
    if (!hasMore) return;
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  
  const handleRefresh = () => {
    setSearchQuery("");
    setSearchResults([]);
    setPage(0);
    setHasMore(true);
  };
  // const handleChange = (event) => {
  //   setSearchQuery(event.target.value);
  //   setSearchResults([]);  // Clear the results as soon as the query changes
  //   setPage(1);  // Reset page number to 1
  //   setHasMore(true);  // Assume more results are available
  // };

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          handleSearch();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, handleSearch]
  );

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
          // onChange={handleChange}
          onKeyPress={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleRefresh} aria-label="refresh">
                  <RefreshIcon/>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Render the TableContainer only if there are search results */}
      {searchResults.length > 0 && (
        <TableContainer component={Paper} sx={{ maxWidth: 800, margin: "auto" }}>
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
                  <TableCell align="right">{row.phoneNumber}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleRowClick(row.id)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button variant="contained" onClick={handlePrevious} disabled={page === 1}>
          Previous
        </Button>
        <Button variant="contained" onClick={handleNext} disabled={!hasMore}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default PatientSearch;

// function PatientSearch({ onSearchResult }) {
//   let history = useHistory();
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const debouncedSearchQuery = useDebounce(searchQuery, 500);

//   useEffect(() => {
//     if (debouncedSearchQuery) {
//       handleSearch(debouncedSearchQuery);
//     } else {
//       setSearchResults([]);
//     }
//   }, [debouncedSearchQuery]);

//   const handleSearch = async () => {
//     const response = await fetch(
//       `http://localhost:3001/patients/search?searchQuery=${searchQuery}&page=${page}`
//     );
//     const data = await response.json();
//     console.log("Searching for:", searchQuery);
//     if (data.length === 0) {
//       setHasMore(false);
//     } else {
//       setSearchResults((prevResults) => [...prevResults, ...data]);
//       setPage((prevPage) => prevPage + 1);
//     }

//     setLoading(false);
//   };
//   onSearchResult && onSearchResult(data); // Callback to pass results to parent component
// }
// const handleRowClick = (patientId) => {
//   history.push(`/patients/${patientId}`);
// };

// const handleKeyPress = (event) => {
//   if (event.key === "Enter") {
//     event.preventDefault();
//     handleSearch();
//   }
// };

// const observer = useRef();
// const lastElementRef = useCallback(
//   (node) => {
//     if (loading) return;
//     if (observer.current) observer.current.disconnect();

//     observer.current = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting && hasMore) {
//         handleSearch();
//       }
//     });

//     if (node) observer.current.observe(node);
//   },
//   [loading, hasMore]
// );

// const handleRefresh = () => {
//   setSearchQuery("");
//   setSearchResults([]);
// };

// return (
//   <div>
//     <Paper
//       component="form"
//       sx={{
//         p: "2px 4px",
//         display: "flex",
//         alignItems: "center",
//         width: "auto",
//         marginBottom: "20px",
//         marginLeft: "auto",
//         marginRight: "auto",
//       }}
//     >
//       <TextField
//         fullWidth
//         variant="outlined"
//         placeholder="Search for patients..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         onKeyPress={handleKeyPress}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               {/* <IconButton onClick={handleSearch} aria-label="search">
//                   <SearchIcon />
//                 </IconButton> */}
//               <IconButton onClick={handleRefresh} aria-label="refresh">
//                 <RefreshIcon />
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//       />
//     </Paper>

//     {/* Render the TableContainer only if there are search results */}
//     {searchResults.length > 0 && (
//       <TableContainer component={Paper} sx={{ maxWidth: 800, margin: "auto" }}>
//         <Table aria-label="search results">
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell align="right">Name</TableCell>
//               <TableCell align="right">Phone</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {searchResults.map((row) => (
//               <TableRow
//                 key={row.id}
//                 sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//               >
//                 <TableCell component="th" scope="row">
//                   {row.id}
//                 </TableCell>
//                 <TableCell align="right">{row.name}</TableCell>
//                 <TableCell align="right">{row.contact_info}</TableCell>
//                 <TableCell>
//                   <Button onClick={() => handleRowClick(row.id)}>
//                     View Details
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
      
//     )}
//     <div>
//     {searchResults.map((result, index) => (
//       <div key={result.id}>{result.name}</div>
//     ))}
//     {hasMore && (
//       <div ref={lastElementRef} style={{ height: '20px', textAlign: 'center' }}>
//         Loading more...
//       </div>
//     )}
//   </div>
//   </div>
  
// );


// export default PatientSearch;
