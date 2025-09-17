import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { getPreloadedState, saveToLocalStorage } from "./localStorage";
import sidebarSlice from "./sidebarSlice";
import commonSlice from "./commonSlice";
import MainReducer from "./reducer";
import themeSettingSlice from "./themeSettingSlice";
import authSlice from "./authSlice";

const combinedReducer = combineReducers({
  sidebar: sidebarSlice,
  common: commonSlice,
  rootReducer: MainReducer,
  themeSetting: themeSettingSlice,
  auth: authSlice,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "login/logout" || action.type === "auth/logout") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: getPreloadedState(),
});

// persist state to localStorage
store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

// ✅ Inferred types (type-only exports)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;