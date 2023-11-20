import React, {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Provider} from "react-redux";
import {store} from "./redux/store.js";
import Loading from "./components/Loading/Loading.jsx";
import {ToastContainer} from "react-toastify";
import Toast from "./components/Toast/Toast.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
   <>
       <Provider store={store}>
           <Loading/>
           <Toast/>
           <App/>
       </Provider>
   </>
)
