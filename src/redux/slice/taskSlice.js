import {FULFILLED, IDLE, PENDING, REJECTED} from "../../constant/apiStatus.js";
import {createAsyncThunk, createSlice, current} from "@reduxjs/toolkit";
import {apiClient} from "../../services/api.js";
import {v4 as uuidv4} from 'uuid';
import column from "../../pages/Home/components/Column.jsx";
import _debounce from "lodash/debounce";

const initialState = {
    data: null,
    error: null,
    status: IDLE,
};

const resolveResponse = (data) => {
    if (data && data.columns && data.tasks) {
        const columns = data.columns;
        const tasks = data.tasks;
        return columns.map(column => {
            const tasksFiltered = tasks.filter(task => column.column === task.column)
            // console.log(tasksFiltered)
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
export const updateTask = createAsyncThunk("task/update",
    async (body, thunkApi) => {
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
export const initTask = createAsyncThunk("task/init", async (body, thunkApi) => {
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
        reorderTask: (state, action) => {
            console.log(action.payload)
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
            destinationColumn.tasks.splice(destination.index, 0, reorderedTask);
        },
        reorderColumn: (state, action) => {
            const source = action.payload.source;
            const destination = action.payload.destination;
            const [reorderedColumn] = state.data.splice(source.index, 1);
            state.data.splice(destination.index, 0, reorderedColumn);
        },
        reset: (state) => {
            state.error = {};
            state.data = {};
        },
        addColumn: (state) => {
            state.data.push({
                column: uuidv4(),
                columnName: "New column",
                tasks: []
            })
        },

        addTask: (state, action) => {
            // console.log(action.payload.column);
            const exitColumn = state.data.find((column) => {
                    return column.column === action.payload.column
                }
            )
            exitColumn.tasks.push({
                "_id": uuidv4(),
                "content": "new Task",
                "column": exitColumn.column,
            })
        },

        removeColumn: (state, action) => {
            state.data.splice(action.payload, 1)
        },

        removeTask :  (state, action) => {
            state.data[action.payload.columnIndex].tasks.splice(action.payload.index, 1)
        },

        editTitleColumn: (state, action) => {
            state.data.find((column) => {
                return column.column === action.payload.id
            }).columnName = action.payload.value;
        },

        editContentTask: (state, action) => {
            console.log(action.payload);
            state.data[action.payload.columnIndex].tasks[action.payload.index].content = action.payload.value
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTask.pending, (state) => {
                state.status = PENDING;
            })
            .addCase(fetchTask.fulfilled, (state, action) => {
                state.status = FULFILLED;
                state.data = action.payload;
                state.error = {}
            })
            .addCase(fetchTask.rejected, (state, action) => {
                state.status = REJECTED;
                state.error = action.payload;
            })
            .addCase(initTask.pending, (state) => {
                state.status = PENDING;
            })
            .addCase(initTask.fulfilled, (state, action) => {
                state.status = FULFILLED;
                state.data = action.payload;
                state.error = {}
            })
            .addCase(initTask.rejected, (state, action) => {
                state.status = REJECTED;
                state.error = action.payload;
            })
            .addCase(updateTask.pending, (state) => {
                state.status = PENDING;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.status = FULFILLED;
                // state.data = action.payload;
                state.error = {}
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.status = REJECTED;
                state.error = action.payload;
            })
    }
});