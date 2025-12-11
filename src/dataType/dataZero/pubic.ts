export function getEmptyQueryParams<T>(ts:string): T {
    const emptyParam = {
        queryTs:ts,
        resultNumber:0,
        delItems:[],
        updateItems:[],
        newItems:[],
        resultTs:ts
    } as T;
    return emptyParam;
}