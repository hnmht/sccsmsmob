import { ToErrorType } from "../../dataType/types/errors";

export function checkObjectError<T extends object>(errors: ToErrorType<T>): boolean {
    let number = 0;
    for (let key of Object.keys(errors) as Array<keyof T>) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};