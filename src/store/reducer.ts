import { configureStore } from "@reduxjs/toolkit";
import circuitReducer from "./circuit";

const store = configureStore({
  reducer: {
    circuit: circuitReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
