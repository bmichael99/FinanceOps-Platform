import { TableCell, TableRow } from '@/components/ui/table';
import React, { useEffect, useState } from 'react'
import { type FileResponseType } from '@finance-platform/types';
import { type FileStatus } from "@finance-platform/types";
import { Spinner } from '@/components/ui/spinner';


type Props = {
  file: FileResponseType
}

function FileUploadStatus({file}: Props) {
  const timeSinceUpload = new Date().getTime() - file.uploadTime.getTime();
  const ageMinutes = Math.floor(timeSinceUpload/60000);
  let age = "now";
  if(ageMinutes >= 1 && ageMinutes <= 59){
    age = ageMinutes + "m";
  }else if(ageMinutes >= 60){
    age = Math.floor(ageMinutes/60) + "h";
  }


  return (
    <TableRow>
      <TableCell className={`flex items-center gap-2 ${file.status == "COMPLETED" && "font-medium"} ${file.status == "FAILED" && "text-red-700"}`}>
        {(file.status == "PROCESSING" || file.status == "SAVING" || file.status == "UPLOADING") && <Spinner/>}
        {file.status == "PENDING" ? "In Queue" : file.status.charAt(0).toUpperCase() + file.status.slice(1).toLowerCase()}
      </TableCell>
      <TableCell>{file.originalFileName}</TableCell>
      <TableCell className="text-muted-foreground">{age}</TableCell>
    </TableRow>
  )
}

export default FileUploadStatus