import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IState } from "../types";

const initialState: IState = {
  event: undefined,
  elements: [],
  modalWindow: {
    status: false,
    value: ""
  },
  contextMenu: {
    status: false,
    content: []
  }
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    modalWindowOpen(state) {
      state.modalWindow.status = true;
    },
    modalWindowClose(state) {
      state.modalWindow.status = false;
    },
    modalWindowChangeValue(state, action: PayloadAction<string>) {
      state.modalWindow.value = action.payload;
    },
    contextMenuAddElement(state, action) {
      state.contextMenu.content.push(action.payload);
    },
    contextMenuOpen(state) {
      state.contextMenu.status = true;
    },
    contextMenuClose(state) {
      state.contextMenu.status = false;
    },
    contextMenuClearElements(state) {
      state.contextMenu.content.length = 0;
    },
    eventChange(state, action) {
      state.event = action.payload;
    },
    elementsArray(state, action) {
      state.elements = [...action.payload];
    }
  }
});

export default appSlice.reducer;
export const {
  contextMenuAddElement,
  contextMenuClearElements,
  contextMenuClose,
  contextMenuOpen,
  elementsArray
} = appSlice.actions;
