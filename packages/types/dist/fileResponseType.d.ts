import { type FileStatus } from "./fileStatusType";
export type FileResponseType = {
    clientID: string;
    fileName: string;
    originalFileName: string;
    status: FileStatus;
    error?: string;
};
