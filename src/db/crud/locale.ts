import { Locale } from "react-native-localize";
import { QueryResult } from "react-native-quick-sqlite";
import { name } from "../../../app.json"
import { executeSQL } from "../db";

// Get Locale
export function getLocale(): Locale {
    const sqlStr = `select countrycode,languagecode,languagetag,isrtl from locale where appname='${name}'`;
    const { rows } = executeSQL(sqlStr);
    let locale: Locale = {
        countryCode: "US",
        languageCode: "en",
        languageTag: "en-US",
        isRTL: false,
    };
    if (rows && rows.length > 0) {
        locale = JSON.parse(rows._array[0].value);
    }
    return locale;
}

// Set Locale
export function setLocale(locale: Locale): QueryResult {
    const isRTL: number = locale.isRTL ? 1 : 0;
    const sqlStr = `update locale(contrycode,languagecode,languagetag,isrtl) 
    values('${locale.countryCode}','${locale.languageCode}','${locale.languageTag}',${isRTL})`;
    return executeSQL(sqlStr);
}
