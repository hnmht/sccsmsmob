import { ErrMsg } from "./scInput";

export type ToErrorType<T> = {
    [K in keyof T]: ErrMsg
}