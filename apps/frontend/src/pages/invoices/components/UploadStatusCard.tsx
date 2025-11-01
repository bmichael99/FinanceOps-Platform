import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useState } from 'react'
import FileUploadStatus from './FileUploadStatus'
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type FileResponseType } from '@finance-platform/types'
import { type UploadedFileType } from '../UploadInvoicePage';

type Props = {
  uploadedFiles: UploadedFileType
}

type tableProps = {
  uploadedFiles: UploadedFileType
}

function UploadStatusTable({uploadedFiles} : tableProps) {
  return (
    <Table>
      <TableCaption>A list of your recent invoice uploads.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead>File Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.values(uploadedFiles).map((file: FileResponseType) => (
          <FileUploadStatus key= {file.fileName} file={file}/>
        ))}
      </TableBody>
    </Table>
  )
}

function UploadStatusCard({uploadedFiles}: Props) {
  console.log(uploadedFiles);
  return (
      <Card className='w-full max-w-6xl'>
        <CardHeader >
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>View status of recent uploads. (24hrs)</CardDescription>
        </CardHeader>
        <CardContent>
          <UploadStatusTable uploadedFiles={uploadedFiles}/>
        </CardContent>
      </Card>
  )
}

export default UploadStatusCard