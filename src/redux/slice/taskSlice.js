import {IDLE, PENDING} from "../../constant/apiStatus.js";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {apiClient} from "../../services/api.js";

const initialState = {
    data: {},
    error: null,
    status: IDLE
};

export const fetchTask = createAsyncThunk("task/fetch", async (requestParams = null, thunkApi) => {
    try {
        const response = await apiClient.get("/tasks");
        return response.data;
    } catch (e) {
        console.log(e);
        return thunkApi.rejectWithValue({
            code: e.response.status,
            message: e.response.data.message
        })
    }
})

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        reset: (state) => {
            state.error = null;
            state.data = {};
        }
    },
    extraReducers: (builder) => {
        // --- Xử lý trong reducer với case pending / fulfilled / rejected ---
        builder
            .addCase(fetchTask.pending, (state) => {
                state.status = PENDING;
            })
            .addCase(fetchTask.fulfilled, (state, action) => {
                state.status = IDLE;
                state.data = action.payload;
                state.error = null
            })
            .addCase(fetchTask.rejected, (state, action) => {
                state.status = IDLE;
                state.error = action.payload;
            })
    }
});