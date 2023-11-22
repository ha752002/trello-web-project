import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {apiClient} from "../../services/api.js";
import {getLocalStorage, setLocalStorage} from "../../utils/localStorage.js";
import {IDLE, PENDING} from "../../constant/apiStatus.js";

const initialState = {
    userInfo: {},
    error: null,
    status: IDLE,
    errorForm : {},
};

export const authLogin = createAsyncThunk("auth/login", async (requestParams, thunkApi) => {
    try {
        const response = await apiClient.get("/api-key", requestParams);
        const apiKey = response.data.apiKey;
        if(apiKey){
            setLocalStorage("apiKey", apiKey)
            return apiKey;
        }
    } catch (e){
        return thunkApi.rejectWithValue({
            code: e.response.status,
            message: e.response.data.message
        })
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.error = {};
            state.userInfo = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(authLogin.pending, (state) => {
                state.status = PENDING;
            })
            .addCase(authLogin.fulfilled, (state, action) => {
                state.status = IDLE;
                state.userInfo.apiKey = action.payload;
                state.error = {};
            })
            .addCase(authLogin.rejected, (state, action) => {
                state.status = IDLE;
                state.error = action.payload;
            })
    }
});