import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  isSidebarOpen: boolean;
}

const initialState: initialStateType = {
  isSidebarOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
