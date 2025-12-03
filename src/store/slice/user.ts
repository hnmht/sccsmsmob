import { createSlice } from "@reduxjs/toolkit";
import { saveToken } from "../../db/crud/appInfo";
import { saveUserInfo } from "../../db/crud/userInfo";
import { UserInfo } from "../../dataType/types/user";
import { getEmptyPerson } from "../../dataType/dataZero/person";
import { getEmptySimpDept } from "../../dataType/dataZero/department";
import { getEmptyFile } from "../../dataType/dataZero/file";

const initialState: UserInfo = {
    id: 0,
    code: "",
    name: "",
    avatar: { id: 0 },
    token: "",
    menuList: [],
    person: getEmptyPerson(),
    department: getEmptySimpDept(),
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserToken: (state, action) => {
            // Save Token into database
            saveToken(action.payload);
            state.token = action.payload;
        },
        setUserTokenFromDb: (state, action) => {
            state.token = action.payload;
        },
        setUserInfo: (state, action) => {
            let userInfo = action.payload;
            saveUserInfo(userInfo);
            // Change State
            state.id = userInfo.id;
            state.code = userInfo.code;
            state.name = userInfo.name;
            state.avatar = userInfo.avatar;
            state.menuList = userInfo.menuList;
            state.person = userInfo.person;
            state.department = userInfo.department;
        },
        setUserInfoFromDb: (state, action) => {
            let userInfo = action.payload;
            // Change State
            state.id = userInfo.id;
            state.code = userInfo.code;
            state.name = userInfo.name;
            state.avatar = userInfo.avatar;
            state.menuList = userInfo.menuList;
            state.person = userInfo.person;
            state.department = userInfo.department;
        },
        resetUser: (state) => {
            const userInfo: UserInfo = {
                id: 0,
                code: "",
                name: "",
                avatar: getEmptyFile(),
                token: "",
                menuList: [],
                person: getEmptyPerson(),
                department: getEmptySimpDept(),
            };
            // Save Empty UserInfo into database
            saveUserInfo(userInfo);
            // Change state
            state.id = userInfo.id;
            state.token = userInfo.token;
            state.code = userInfo.code;
            state.name = userInfo.name;
            state.avatar = userInfo.avatar;
            state.menuList = userInfo.menuList;
            state.person = userInfo.person;
            state.department = userInfo.department;
        }
    }
});

export const { setUserToken, setUserTokenFromDb, setUserInfo, setUserInfoFromDb, resetUser } = userSlice.actions;
export default userSlice.reducer;