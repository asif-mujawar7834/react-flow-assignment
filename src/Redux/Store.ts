import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import messageNodesReducer from "./Reducers/MessageNode";
import ToastSlice from "./Reducers/ToastSlice";
const rootReducer = combineReducers({
  messageNodes: messageNodesReducer,
  toastify: ToastSlice,
});

export const Store = configureStore({
  reducer: rootReducer,
});

export const useAppDispatch: () => typeof Store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof Store.getState>
> = useSelector;
