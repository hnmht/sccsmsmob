import { createSlice } from "@reduxjs/toolkit";
import { saveDBID, saveIsOffLine, saveServerInfo, saveServerAddr, saveGlobalPath } from "../../db/crud/appInfo";
import { AppInfo } from "../../dataType/types/appInfo";

const initialState: AppInfo = {
    dbID: "",
    isOffline: 0,
    serverAddr: "",
    globalPath: "",
    serverInfo: {},
};

export const appinfoSlice = createSlice({
    name: "appInfo",
    initialState,
    reducers: {
        setDbid: (state, action) => {
            // Save dbIN into database
            saveDBID(action.payload);
            state.dbID = action.payload;
        },
        setGlobalPath: (state, action) => {
            saveGlobalPath(action.payload);
            state.globalPath = action.payload;
        },
        setIsOffline: (state, action) => {
            saveIsOffLine(action.payload);
            state.isOffline = action.payload;
        },
        setServerAddr: (state, action) => {
            saveServerAddr(action.payload);
            state.serverAddr = action.payload;
        },
        setServerInfo: (state, action) => {
            saveServerInfo(action.payload);
            state.serverInfo = action.payload;
        },
        setInfoFromDb: (state, action) => {
            state.serverInfo = action.payload.serverinfo;
            state.dbID = action.payload.dbid;
            state.isOffline = action.payload.isoffline;
            state.serverAddr = action.payload.serveraddr;
            state.globalPath = action.payload.globalpath;
        }
    }
});

export const { setDbid, setIsOffline, setServerInfo, setServerAddr, setInfoFromDb, setGlobalPath } = appinfoSlice.actions;

export default appinfoSlice.reducer;