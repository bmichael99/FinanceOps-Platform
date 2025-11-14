import { type FileStatusType } from "./fileStatusType"

export type FileResponseType = {
    clientID?: string,
    fileName: string,
    originalFileName: string,
    status: FileStatusType,
    uploadTime: Date,
    error?: string
  }