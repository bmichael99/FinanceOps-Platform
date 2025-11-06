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

// function DataTable({uploadedFiles} : tableProps){

// }



function UploadStatusTable({uploadedFiles} : tableProps) {
  return (
    <Table containerClassName='overflow-y-auto max-h-96'>
      <TableCaption>A list of your recent invoice uploads.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead>File Name</TableHead>
          <TableHead>Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.values(uploadedFiles).sort((a,b) => (b.uploadTime.getTime() - a.uploadTime.getTime())).map((file: FileResponseType) => (
          <FileUploadStatus key= {file.fileName} file={file}/>
        ))}
      </TableBody>
    </Table>
  )
}

function UploadStatusCard({uploadedFiles}: Props) {
  return (
      <Card className='w-full max-w-6xl mb-4'>
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