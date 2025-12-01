import { open, QueryResult, QuickSQLiteConnection } from "react-native-quick-sqlite";
import { dbName, appVersion, name } from "../../app.json";
import { createTableSQL, dropAllTableSQL } from "./schema";
import { UserInfo } from "../dataType/types/user";
import { getLocales, Locale } from "react-native-localize"

// Open or Create Database
export const DB: QuickSQLiteConnection = open({ name: dbName, location: "default" });

// Initialize database
export function initDb() {
    // Check if the DB exist
    if (!DB) {
        console.error("Open Database failed!")
        return
    }
    // Check if the sysinfo exist
    let res: QueryResult = DB.execute("select name from sqlite_master where type='table' and name='appinfo'");
    if (res.rows && res.rows.length === 0) {
        // create table
        DB.executeBatch(createTableSQL);
    }
    // Check if there is data in the sysinfo table
    res = DB.execute(`select isfinish from appinfo where appname='${name}'`);
    if (res.rows && res.rows.length === 0) {
        const emptyUserInfo: UserInfo = {
            id: 0,
            code: "",
            name: "",
            avatar: { id: 0 },
            token: "",
            menuList: [],
            person: { id: 0 },
            department: { id: 0 }
        };
        const userStr: string = JSON.stringify(emptyUserInfo)
        DB.execute(`insert into appinfo(appname,appversion,dbid,serveraddr,globalpath,
            token,serverinfo,isoffline,isfinish,userinfo) 
        VALUES('${name}','${appVersion}','','','',
        '','${JSON.stringify({})}',0,1,'${userStr}')`);
    }
    // Check if the locale table contains data
    res = DB.execute(`select appname from locale where appname='${name}'`);
    if (res.rows && res.rows.length === 0) {
        // Get the current device language
        const locales = getLocales();
        const currentLocale: Locale = locales[0];
        const isRTL: number = currentLocale.isRTL ? 1 : 0; 

        DB.execute(`insert into locale(appname,countrycode,languagecode,languagetag,isrtl) 
            VALUES('${name}','${currentLocale.countryCode}','${currentLocale.languageCode}','${currentLocale.languageTag}',${isRTL})`);
    }
    console.log("Complete DB Initialize...");

    //Drop all Table
    //  DB.executeBatch(dropAllTableSQL)
}

// Close Database
export function closeDB() {
    if (DB) {
        DB.close();
    }
}
// Execute Query
export function executeSQL(sqlString: string): QueryResult {
    return DB.execute(sqlString);
}

// Get latest data TS
export function queryDataTs(dataName: string): string {
    const sqlStr = `select ts from tsinfo where docname='${dataName}' limit 1`;
    let { rows } = DB.execute(sqlStr);
    let ts = "";
    if (rows && rows.length > 0) {
        ts = rows._array[0].ts;
    }
    return ts;
}

// Add Data ts
export function addDataTs(dataName: string, ts: string): QueryResult {
    const sqlStr = `insert into tsinfo(docname,ts) values('${dataName}','${ts}')`;
    return DB.execute(sqlStr);
}

// Update Data ts 
export function updateDataTs(dataName: string, ts: string): QueryResult {
    const sqlStr = `update tsinfo set ts='${ts}' where docname='${dataName}'`;
    return DB.execute(sqlStr);
}