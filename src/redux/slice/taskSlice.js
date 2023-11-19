import {IDLE, PENDING} from "../../constant/apiStatus.js";
import {createAsyncThunk, createSlice, current} from "@reduxjs/toolkit";
import {apiClient} from "../../services/api.js";

const initialState = {
    data: null,
    error: null,
    status: IDLE,
    success: false,
};

const resolveResponse = (data) => {
    if (data && data.columns && data.tasks) {
        const columns = data.columns;
        const tasks = data.tasks;
        return columns.map(column => {
            const tasksFiltered = tasks.filter(task => column.column === task.column)
            console.log(tasksFiltered)
            return {
                ...column,
                tasks: tasksFiltered
            }
        });
    }
}

export const fetchTask = createAsyncThunk("task/fetch", async (requestParams = null, thunkApi) => {
    try {
        const response = await apiClient.get("/tasks");
        const data = response.data
        return resolveResponse(data)
    } catch (e) {
        console.log(e);
        return thunkApi.rejectWithValue({
            code: e.response.status,
            message: e.response.data.message
        })
    }
})
export const updateTask = createAsyncThunk("task/update", async (body, thunkApi) => {
    try {
        const response = await apiClient.post("/tasks", body);
        const data = response.data
        return resolveResponse(data)
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
        changeColumn: (state, action) => {
            const source = action.payload.source;
            const destination = action.payload.destination;

            const sourceColumn = state.data.find(column => {
                return column.column === source.droppableId
            })
            const destinationColumn = state.data.find(column => {
                return column.column === destination.droppableId
            })

            const [reorderedTask] = sourceColumn.tasks.splice(source.index, 1);
            reorderedTask.column = destinationColumn.column
            destinationColumn.tasks.splice(destination.index, 0, reorderedTask)

            const taskList = state.data.reduce((result, column) => {
                const tasks = column.tasks.map(task => {
                    return {
                        column: task.column,
                        content: task.content,
                        columnName: column.columnName
                    }
                })
                return [...result, ...tasks]
            }, [])
            apiClient.post("/tasks", taskList)
        },
        reset: (state) => {
            state.error = null;
            state.data = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTask.pending, (state) => {
                state.status = PENDING;
            })
            .addCase(fetchTask.fulfilled, (state, action) => {
                state.status = IDLE;
                state.data = action.payload;
                state.success = true
                state.error = null
            })
            .addCase(fetchTask.rejected, (state, action) => {
                state.status = IDLE;
                state.error = action.payload;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.status = IDLE;
                state.data = action.payload
                state.error = null
            })
    }
});
