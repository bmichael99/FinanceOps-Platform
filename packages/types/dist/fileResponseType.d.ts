import { type FileStatus } from "./fileStatusType";
export type FileResponseType = {
    clientID?: string;
    fileName: string;
    originalFileName: string;
    status: FileStatus;
    uploadTime: Date;
    error?: string;
};
