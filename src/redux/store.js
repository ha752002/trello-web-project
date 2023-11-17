import { configureStore } from "@reduxjs/toolkit";
import {authSlice} from "./slice/authSlice.js";
import {loadingSlice} from "./slice/loadingSlice.js";
import {taskSlice} from "./slice/taskSlice.js";
const rootReducer = {
    reducer: {
        auth: authSlice.reducer,
        loading: loadingSlice.reducer,
        task : taskSlice.reducer
    },
};
export const store = configureStore(rootReducer);