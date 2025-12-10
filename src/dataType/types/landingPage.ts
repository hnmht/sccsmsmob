import { File } from "./file";
import { Person } from "./person";
// Landing Page Info
export interface LandingPageInfo {
    sysNameDisp: string;
    introText: string;
    file: File;
    modifyDate: string;
    modifier: Person;
    ts: string;
}