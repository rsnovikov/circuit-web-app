import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./state";

const store = configureStore({
  reducer: {
    state: appSlice
  }
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
