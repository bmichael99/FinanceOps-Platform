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
import { CloudUpload, FileText, FileTextIcon, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react'
import * as z from "zod";

function UploadInvoicePage() {
  type fileType = {
    id: string,
    file: File,
  }

  const [error, setError] = useState<any>();
  const [files, setFiles] = useState<fileType[]>([]);
  const [dragOver,setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fetchPrivate = useFetchPrivate();
  
  const fileSchema = z.array(
    z.object({
      id: z.string(),
      file: z.file()
            .max(4_000_000, {error: "Files must be smaller than 4MB."})
            .mime(["application/pdf"], {error: "Files must be in .pdf format."}),
    })
  )
  .min(1, { error: "Must upload at least 1 file." })
  .max(5, { error: "Cannot upload more than 5 files at once." });

  const upload = async () => {
    const formData = new FormData();

    for(let i = 0; i < files.length; i++){
      console.log(files[i].file.name);
      formData.append("files", files[i].file);
      
    }


    const response = await fetchPrivate("/invoices","POST", formData);

    if (response.ok) {
      console.log("Upload successful");
      console.log(response);
    } else {
      console.error("Upload failed");
    }
    
  }

  function validateFiles(newFiles: fileType[]) : boolean{
    const parse = fileSchema.safeParse(newFiles);
    if(!parse.success){
      const errors : any[] = JSON.parse(parse.error.message);
      setError(errors.map((error) => error.message));
      return false;
    }
    setError(null);
    return true;
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    if(e.dataTransfer.files && e.dataTransfer.files.length > 0){
      //convert FileList (e.dataTransfer.files) into an array of Files and then use map to 
      //convert each file object into an object that contains key value pairs of id and file.
      //append these new objects to our already existing array of objects currFiles
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        id: crypto.randomUUID(),
        file: file,
      }));

      if(!validateFiles(newFiles)){
        e.dataTransfer.clearData();
        return;
      }

      setFiles((currFiles) => [...currFiles, ...newFiles]);
      e.dataTransfer.clearData();
    }
  }

  const handleClickToBrowse = (e : React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0){
      const newFiles = Array.from(e.target.files).map(file => ({
          id: crypto.randomUUID(),
          file: file,
      }));

      if(!validateFiles(newFiles)){
        return;
      }

      setFiles((currFiles) => [...currFiles, ...newFiles]);
    }
  }

  const handleDeleteFileItem = (id : string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newFileArr = files.filter((file) => file.id != id);
    setFiles(newFileArr);
  }

  return (
    <div className='flex flex-col justify-center items-center'>
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
          {error && <p className="text-red-600">{error}</p>}
        </CardContent>
      </Card>
    </div>
    
  )
}

export default UploadInvoicePage