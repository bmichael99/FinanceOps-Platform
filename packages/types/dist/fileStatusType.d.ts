declare const FileStatus: {
    UPLOADING: string;
    PENDING: string;
    PROCESSING: string;
    SAVING: string;
    COMPLETED: string;
    FAILED: string;
};
export type FileStatus = keyof typeof FileStatus;
export {};
