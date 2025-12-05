import { configureStore, Store } from "@reduxjs/toolkit";
import appinfoReducer from "./slice/appInfo";
import userReducer from "./slice/user";
import reqStatusReducer from "./slice/reqStatus";
// import dynamicDataReducer from "./slice/dynamicData";
// import loadStatusReducer from "./slice/loadStatus";
// import swapPosition from "./slice/swapPosition";

export const store = configureStore({
    reducer: {
        appInfo: appinfoReducer,
        user: userReducer,
        reqStatus: reqStatusReducer,
        // dynamicdata: dynamicDataReducer,
        // loadstatus: loadStatusReducer,
        // swapposition: swapPosition
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
