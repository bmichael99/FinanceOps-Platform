import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import FileUploadStatus from './FileUploadStatus'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type FileResponseType } from '@finance-platform/types'
import { type UploadedFileType } from '../UploadInvoicePage';
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  uploadedFiles: UploadedFileType,
  loading: boolean
}

type tableProps = {
  uploadedFiles: UploadedFileType,
  loading: boolean
}

function LoadingSkeleton(){
  return Array.from({length: 3}).map((_val, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-[20px] w-[100px]" /></TableCell>
        <TableCell><Skeleton className="h-[20px] w-[300px]" /></TableCell>
        <TableCell><Skeleton className="h-[20px] w-[50px]" /></TableCell>
      </TableRow>
  ))
}

function UploadStatusTable({uploadedFiles, loading} : tableProps) {
  const [currTime, setCurrTime] = useState(new Date());
  // update component every 60 seconds.
  useEffect(() => {
    const refreshComponent = setInterval(() => {
      setCurrTime(new Date());
    }, 60000)
    return (() => {
      clearInterval(refreshComponent);
    })
  }, [])
  
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
        {loading ? <LoadingSkeleton /> :
        Object.values(uploadedFiles).sort((a,b) => (b.uploadTime.getTime() - a.uploadTime.getTime())).map((file: FileResponseType) => (
          <FileUploadStatus key={file.fileName} file={file}/>
        ))}
      </TableBody>
    </Table>
  )
}

function UploadStatusCard({uploadedFiles, loading}: Props) {
  return (
      <Card className='w-full max-w-6xl mb-4'>
        <CardHeader >
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>View status of recent uploads. (24hrs)</CardDescription>
        </CardHeader>
        <CardContent>
          <UploadStatusTable uploadedFiles={uploadedFiles} loading={loading}/>
        </CardContent>
      </Card>
  )
}

export default UploadStatusCard