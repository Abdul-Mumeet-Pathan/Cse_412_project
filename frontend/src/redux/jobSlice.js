import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        filteredJobs: [], // Add this line
        filters: {
            locations: [],
            industries: [],
            salaryRange: null,
        },
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
            state.filteredJobs = action.payload; // Initialize filteredJobs with all jobs
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = action.payload;
        },
        // In your jobSlice.js
setSingleJob: (state, action) => {
    state.singleJob = action.payload;
},
        setFilteredJobs: (state, action) => {
            state.filteredJobs = action.payload;
        }
    }
});

export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    setFilters,
    setFilteredJobs,
} = jobSlice.actions;

export default jobSlice.reducer;