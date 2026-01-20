import { Dayjs } from "dayjs";
import { i18n, dayjs } from "./i18n";

const currentTimezone = dayjs.tz.guess();

export const EpochTime = dayjs.utc('1970-01-01 00:00:00').toISOString();

export const DateTimeFormat = (date: Dayjs | Date = dayjs(new Date()), formats: string = "L") => {
    return dayjs(date).format(formats);
};

export const ConvertToUnixSecond = (date: Dayjs |string |Date = dayjs(new Date())) => {
    return dayjs(date).unix();
};

export {
    i18n,
    dayjs
}