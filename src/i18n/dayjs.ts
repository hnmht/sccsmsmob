import { Dayjs } from "dayjs";
import { i18n, dayjs } from "./i18n";

export const EpochTime = dayjs.utc('1970-01-01 00:00:00').toISOString();
export const DateTimeFormat = (date :Dayjs = dayjs(new Date()), formats :string = "L") => {
    return dayjs(date).format(formats);
};

export {
    i18n,
    dayjs
}