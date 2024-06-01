import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const toastSlice = createSlice({
  name: "toast",
  initialState: {},
  reducers: {
    showToast: (_, action) => {
      const { message, type } = action.payload;
      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "warn":
          toast.warn(message);
          break;
        case "info":
          toast.info(message);
          break;
        default:
          toast(message);
      }
    },
  },
});

export const { showToast } = toastSlice.actions;
export default toastSlice.reducer;
