import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useFetchPrivate from '@/hooks/useFetchPrivate';
import { CloudUpload, FileText, FileTextIcon, FileType, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'
import * as z from "zod";
import UploadStatusCard from './components/UploadStatusCard';
import { type FileResponseType } from '@finance-platform/types';

const API_URL = import.meta.env.VITE_API_URL;

type FileType = {
  id: string,
  file: File,
}

export type UploadedFileType = Record<string, FileResponseType>;

function UploadInvoicePage() {
  const [errors, setErrors] = useState<string[] | null>();
  const [files, setFiles] = useState<FileType[]>([]); //files before upload
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileType>({}); //response from server, file data
  const [dragOver,setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fetchPrivate = useFetchPrivate();
  const [loading, setLoading] = useState(true);

  const fileSchema = z.array(
    z.object({
      id: z.string(),
      file: z.file()
            .max(4_000_000, {error: "Files must be smaller than 4MB."})
            .mime(["application/pdf"], {error: "Files must be in .pdf format."})
    })
  )
  .min(1, { error: "Must upload at least 1 file." })
  .max(5, { error: "Cannot upload more than 5 files at once." });

  async function upload() {
    const formData = new FormData();
    for(let i = 0; i < files.length; i++){
      console.log(files[i].file.name);
      formData.append("files", files[i].file);
      formData.append("clientIds", files[i].id);
    }

    //Optimistic loading for instantly telling the user that their files are uploading.
    const optimisticData = Object.fromEntries(
      files.map((file) => {
        const mockData: FileResponseType = {clientID: file.id, fileName: file.file.name, originalFileName: file.file.name, uploadTime: new Date(), status: "UPLOADING"};
        return [file.id, mockData];
      })
    );
    setUploadedFiles((currfiles) => ({...currfiles, ...optimisticData}))
    setFiles([]);
    const response = await fetchPrivate({endpoint: "/unprocessed-invoices", method: "POST", bodyData: formData});
    if (response.ok) {
      console.log("Upload successful");
      const uploadResponse: FileResponseType[] = await response.json();
      setUploadedFiles((prev) => {
        const updateCurrFiles = {...prev};
        for(let file of uploadResponse){
          if(file.clientID){
            delete updateCurrFiles[file.clientID];
            file.uploadTime = new Date(file.uploadTime); //dates are converted to string over json and type is not preserved, convert back to date.
            updateCurrFiles[file.fileName] = file;
          }
        }
        return updateCurrFiles;
      })
    } else {
      setErrors(["Upload failed"]);
      console.error("Upload failed");
    }
  }

  function checkDuplicateFiles(newFiles: FileType[]) : FileType[]{
    files.forEach((file) => {
      newFiles = newFiles.filter((newFile) => {
        //we want users to be able to upload invoices with the same file name from different folders, in the case of generic names being used. This improves UX and prevents user friction. We add a system to notify the user when there are duplicate invoice ID's, and give options for the user to resolve them.
        return (newFile.file.name != file.file.name || newFile.file.size != file.file.size) 
      })
    })
    return newFiles;
  }

  function validateFiles(newFiles: FileType[]) : boolean{
    const parse = fileSchema.safeParse(newFiles);
    if(!parse.success){
      const uniqueIssues : string[] = Array.from(
        new Set(JSON.parse(parse.error.message).map((error : z.ZodError) => error.message))
      )
      console.log(uniqueIssues);
      setErrors(uniqueIssues);
      return false;
    }
    setErrors(null);
    return true;
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if(e.dataTransfer.files && e.dataTransfer.files.length > 0){
      //convert FileList (e.dataTransfer.files) into an array of Files and then use map to 
      //convert each file object into an object that contains key value pairs of id and file.
      //append these new objects to our already existing array of objects currFiles
      let newFiles : FileType[] = Array.from(e.dataTransfer.files).map(file => ({
        id: crypto.randomUUID(),
        file: file,
      }));
      newFiles = checkDuplicateFiles(newFiles);
      const allFiles = [...files, ...newFiles];
      if(!validateFiles(allFiles)){
        e.dataTransfer.clearData();
        return;
      }
      setFiles((currFiles) => [...currFiles, ...newFiles]);
      e.dataTransfer.clearData();
    }
  }

  function handleClickToBrowse(e : React.ChangeEvent<HTMLInputElement>) {
    if(e.target.files && e.target.files.length > 0){
      let newFiles : FileType[] = Array.from(e.target.files).map(file => ({
          id: crypto.randomUUID(),
          file: file,
      }));
      newFiles = checkDuplicateFiles(newFiles);
      const allFiles = [...files, ...newFiles];
      //need to validate all files, not just new, to make sure <= 5 files.
      if(!validateFiles(allFiles)){
        e.target.value = "";
        return;
      }
      setFiles((currFiles) => [...currFiles, ...newFiles]);
      e.target.value = "";
    }
  }

  function handleDeleteFileItem(id : string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const newFileArr = files.filter((file) => file.id != id);
    setFiles(newFileArr);
  }

  useEffect(() => {
    //SSE for file processing status updates
    const evtSource = new EventSource(API_URL + '/unprocessed-invoices/status', {
      withCredentials: true,
    });
    evtSource.addEventListener("fileStatus", (event) => {
      const data: {userId: number, fileName: string, originalFileName: string, uploadTime: Date, status: "UPLOADING" | "PENDING" | "PROCESSING" | "SAVING" | "COMPLETED" | "FAILED"} = JSON.parse(event.data);
      setUploadedFiles((files) => ({
        ...files,
        [data.fileName]: {
          ...files[data.fileName], 
          status: data.status,
          originalFileName: data.originalFileName,
          uploadTime: new Date(data.uploadTime),
        },
      }));
    })

    //Fetch uploads within the past 24 hours on page load
    const controller = new AbortController();
    async function getRecentUploadedFiles(){
      let aborted = false;
      try{
        const oneDayAgo = new Date(Date.now() - 1000*60*60*24);
        const view = "SUMMARY";
        const response = await fetchPrivate({endpoint: `/unprocessed-invoices?since=${oneDayAgo}&view=${view}`, method: "GET", abortController: controller});
        if(response.ok){
          const recentUploadedFiles: FileResponseType[] = await response.json();
          console.log(recentUploadedFiles);
          let recentObj: UploadedFileType = {};
          for(let file of recentUploadedFiles){
            recentObj[file.fileName] = {
              ...file,
              uploadTime: new Date(file.uploadTime)
            };
          }
          setUploadedFiles(recentObj);
        }
      }catch(err: any) {
        if(err.name === "AbortError"){
          console.error("Request aborted");
          aborted = true;
          return;
        }
        console.error(err);
        setErrors(["Unable to fetch data from the server, please refresh to try again"])
      }finally { 
        if(!aborted)
          setLoading(false);
      }
    }
    getRecentUploadedFiles();
    return(()=>{
      controller.abort();
      evtSource.close();
    })
  }, [])

  return (
    <div className='flex flex-col justify-center items-center'>
      {/* File upload section */}
      {/* TODO: Move into its own component */}
      <Card className='w-full max-w-6xl my-4'>
        <CardHeader>
          <CardTitle className='flex gap-1 items-center'><CloudUpload/>Upload files here</CardTitle>
          <CardDescription>Upload files to be processed.</CardDescription>
        </CardHeader>
        {/*Drag & Drop Area*/}
        <CardContent className='flex flex-col'>
          <input className = 'hidden' id='fileUploadField' ref={fileInputRef} type="file"  onChange={handleClickToBrowse} multiple/>
          <label 
          onDragOver={(e) => {e.preventDefault(); setDragOver(true);}} 
          onDragLeave={(e) => {e.preventDefault(); setDragOver(false);}} 
          onDrop={handleDrop}
          htmlFor="fileUploadField" 
          className={`border-dashed border-2 flex flex-col gap-2 items-center text-center px-2 py-10 my-4 hover:bg-muted rounded-2xl transition-colors ${dragOver ? "bg-muted border-black" : "hover:bg-muted"}`}>
            <div className='border-black border-2 rounded-4xl p-4'><Upload /></div>
            <p className='font-bold'>Drag & drops files here</p>
            <p className='text-muted-foreground'>Or click to browse (max 5 files, up to 4MB each)</p>
          </label>

          <Button type="button" onClick={upload} disabled={!files}>Upload</Button>
          {/*List of files to upload*/}
          {/*We can refactor this into a fileList component and we would eventually want to pass in status as well for displaying current file status (uploading, processing, finished, etc)*/}
          {files.map((file) => 
          <div key={file.id} className='flex flex-1 justify-between items-center p-2'>
          <div className = 'flex gap-2 items-center'>
            <FileTextIcon></FileTextIcon>
            <p>{file.file.name}</p>
          </div>
          <Button variant={'outline'} onClick={(e) => handleDeleteFileItem(file.id,e)}><X/></Button>
          </div>
          )}
          {errors && errors.map((currError : string, index : Number) => <p key={index.toString()} className="text-red-600">{currError}</p>)}
        </CardContent>
      </Card>


      {/*Display recent upload status(24hr)*/}
      
      <UploadStatusCard uploadedFiles={uploadedFiles} loading={loading}/>

    </div>
    
  )
}

export default UploadInvoicePage
