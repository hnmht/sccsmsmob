import { SimpDept } from "./department";
import { File } from "./file";
import { Person } from "./person";
import { SystemMenus } from "./sysMenu";
// User Information
export interface UserInfo {
    id: number,
    code: string,
    name: string,
    avatar: File,
    token: string,
    menuList: SystemMenus,
    person: Person,
    department: SimpDept
}
