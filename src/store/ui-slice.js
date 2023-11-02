import { createSlice } from "@reduxjs/toolkit";
import { cookieParser } from "../lib/functions";

const initialState = {
  isSuccess: false,
  showPrompt: false,
  isUploaded: cookieParser()["isUploaded"] === "true",
  userLoggedIn: cookieParser()["userAuth"] === "true",
  showNotification: false,
};

const uiSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    success(state, action) {
      state.isSuccess = action.payload;
    },
    showPrompt(state, action) {
      state.showPrompt = action.payload ? true : false;
    },
    loginUser(state, action) {
      if (action.payload) {
        state.userLoggedIn = true;
        document.cookie = `userAuth=true; max-age=${60 * 60}`;
      } else {
        state.userLoggedIn = false;
        document.cookie = "userAuth=false; max-age=-60";
      }
    },
    isUploaded(state, action) {
      if (action.payload) {
        state.isUploaded = action.payload;
        document.cookie = `isUploaded=true; max-age=${60 * 60}`;
      } else {
        state.userToken = action.payload;
        document.cookie = "isUploaded=true; max-age=-60; path=/user";
      }
    },
    showNotification(state, action) {
      state.showNotification = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
