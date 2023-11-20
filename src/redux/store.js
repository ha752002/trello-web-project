import {configureStore, createListenerMiddleware, isAnyOf} from "@reduxjs/toolkit";
import {authSlice} from "./slice/authSlice.js";
import {loadingSlice} from "./slice/loadingSlice.js";
import {taskSlice, updateTask} from "./slice/taskSlice.js";
import {apiClient} from "../services/api.js";
import {customToast} from "../utils/toastUtil.js";
const {reset: taskReset,removeTask, reorderTask, reorderColumn, addTask,removeColumn, editTitleColumn, editContentTask} = taskSlice.actions;

const rootReducer = {
    auth: authSlice.reducer,
    loading: loadingSlice.reducer,
    task : taskSlice.reducer
};

const taskListenerMiddleware = createListenerMiddleware()
taskListenerMiddleware.startListening({
    matcher: isAnyOf(reorderColumn,removeTask, reorderTask, addTask, removeColumn, editTitleColumn, editContentTask),
    effect: async (action, listenerApi) => {
        const taskList = listenerApi.getState().task.data.reduce((result, column) => {
            const tasks = column.tasks.map(task => {
                return {
                    column: task.column,
                    content: task.content,
                    columnName: column.columnName
                }
            })
            return [...result, ...tasks]
        }, [])
        listenerApi.dispatch(updateTask(taskList));
    }
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(taskListenerMiddleware.middleware)
});