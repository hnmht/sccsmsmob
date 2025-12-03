import { configureStore } from "@reduxjs/toolkit";
import appinfoReducer from "./slice/appInfo";
import userReducer from "./slice/user";
import reqStatusReducer from "./slice/reqStatus";
// import dynamicDataReducer from "./slice/dynamicData";
// import loadStatusReducer from "./slice/loadStatus";
// import swapPosition from "./slice/swapPosition";

export default configureStore({
    reducer: {
        appinfo: appinfoReducer,
        user: userReducer,
        reqstatus: reqStatusReducer,
        // dynamicdata: dynamicDataReducer,
        // loadstatus: loadStatusReducer,
        // swapposition: swapPosition
    }
});
