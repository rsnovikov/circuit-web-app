import { createSlice } from "@reduxjs/toolkit";
import { IState } from "../types";

const initialState: IState = {
  circElements: []
};

const circuitSlice = createSlice({
  name: "circuit",
  initialState,
  reducers: {
    addElement(state, action) {
      state.circElements.push(action.payload);
    },
    removeElement(state, action) {
      state.circElements = state.circElements.filter(
        (elem) => elem.id !== action.payload.id
      );
    }
  }
});

export const { addElement, removeElement } = circuitSlice.actions;

const circuitReducer = circuitSlice.reducer;
export default circuitReducer;
