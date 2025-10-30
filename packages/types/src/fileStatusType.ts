const FileStatus ={
  UPLOADING: "UPLOADING",
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SAVING: "SAVING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

export type FileStatus = keyof typeof FileStatus;