import { TableCell, TableRow } from '@/components/ui/table';
import React, { useState } from 'react'
import { type FileResponseType } from '@finance-platform/types';
import { type FileStatus } from "@finance-platform/types";


type Props = {
  file: FileResponseType
}

function FileUploadStatus({file}: Props) {
  // const [fileStatus, setFileStatus] = useState<FileStatus>("UPLOADING");


  return (
    <TableRow>
      <TableCell>{file.status}</TableCell>
      <TableCell>{file.originalFileName}</TableCell>
    </TableRow>
  )
}

export default FileUploadStatus