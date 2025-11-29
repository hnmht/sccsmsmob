import { open, QueryResult, QuickSQLiteConnection } from "react-native-quick-sqlite";
import { dbName, appVersion, name } from "../../app.json";
import { createTableSql } from "./schema";
import { UserInfo } from "../dataType/types/user";

// Open or Create Database
export const DB: QuickSQLiteConnection = open({ name: dbName, location: "default" });

// Initialize database
export function initDb() {
    // Check if the DB exist
    if (!DB) {
        console.log("Open Database failed!")
        return
    }
    // Check if the sysinfo exist
    let res: QueryResult = DB.execute("select name from sqlite_master where type='table' and name='appinfo'");
    if (res.rows && res.rows.length === 0) {
        // create table
        console.log("开始创建表");
        DB.executeBatch(createTableSql);

    }
    // Check if there is data in the sysinfo table
    console.log("开始检查sysinfo表")
    res = DB.execute(`select isfinish from appinfo where appname='${name}'`)
    if (res.rows && res.rows.length === 0) {
       console.log("向sysinfo表中插入数据");
        const emptyUserInfo: UserInfo = {
            id: 0,
            code: "",
            name: "",
            avatar: { id: 0 },
            token:"",
            menuList:[],
            person:{id:0},
            department:{id:0}
        };
        const userStr:string = JSON.stringify(emptyUserInfo)
        DB.execute(`insert into appinfo(appname,appversion,dbid,serveraddr,globalpath,token,serverinfo,isoffline,isfinish,userinfo) 
        VALUES('${name}','${appVersion}','','','','','${JSON.stringify({})}',0,1,'${userStr}')`); 
    }

}
