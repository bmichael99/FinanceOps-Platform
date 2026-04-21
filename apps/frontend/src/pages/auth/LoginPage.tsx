import { Input } from '@/components/ui/input';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {redirect, useNavigate } from "react-router-dom";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from '@/hooks/useAuth'
import { useEffect, useRef, useState } from 'react';
import useRefreshToken from '@/hooks/useRefreshToken';
import GoogleLogInButton from './GoogleLogInButton';

const API_URL = import.meta.env.VITE_API_URL;

function LoginPage() {
  const navigate = useNavigate();
  const refresh = useRefreshToken();

  const {auth, setAuth} = useAuth();
  const [loadingRequest,setLoadingRequest] = useState(false);
  const isSubmitting = useRef(false);

  const FormSchema = z.object({
    username: z.string().min(4, {
      error: "username must be at least 4 characters."
    }),
    password: z.string().min(7, {
      error: "password must be at least 7 characters."
    }),
  })

  const {setError, clearErrors, register, handleSubmit, formState:{errors}} = useForm(
    {defaultValues: 
      {
        username: "",
        password: "",
      },
    resolver: zodResolver(FormSchema)});

  const  myHandleSubmit = async (data: z.infer<typeof FormSchema>) => {
    if(isSubmitting.current == true) return;
    isSubmitting.current = true;
    setLoadingRequest(true);
    clearErrors();

    const response = await fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    console.log("repsonse:", response);

    const responseData = await response.json();
    console.log("responseData:", responseData);

    if(response.ok){
      setAuth({accessToken: responseData.accessToken, user: responseData.user});
      await navigate('/dashboard');
    }else{
      if(responseData?.type == "password"){
        setError('password', {message: "Incorrect password."});
        
      }else if (responseData?.type == "username"){
        setError('username', {message: "Username does not exist."});
      } else{
        setError('password', {message: "Server error."});
        setError('username', {});
      }
    }
    setLoadingRequest(false);
    isSubmitting.current = false;
  }

  useEffect(() => {
    async function checkAuth(){
      const accessToken = await refresh();
      if(accessToken){
        await navigate("/dashboard");
      }
    }
    checkAuth();
  },[])

  return (
    <>
    <script src="https://accounts.google.com/gsi/client" async></script>
    <div className='min-h-svh flex justify-center items-center'>

        <Card className="w-full max-w-sm" >
        <CardHeader>
          <CardTitle>Log into your account</CardTitle>
          <CardDescription>Enter your username and password below to log in.</CardDescription>
          <CardAction>
            <Button variant="link"><a href="/sign-up">Sign Up</a></Button>
          </CardAction>
        </CardHeader>
        <CardContent>
            <form id="authForm" className="flex flex-col gap-6" onSubmit={handleSubmit(async (data) => {await myHandleSubmit(data)})}>
            <div className="grid gap-2">
              <Label className={errors.username && "text-red-600"}htmlFor="username">Username</Label>
              <Input aria-invalid={errors.username && 'true'} className={errors.username && "border-red-600"}type="text" id="username" {...register("username")}/>
              <p className="text-red-600 text-sm">{errors?.username?.message}</p>
            </div>
            <div className="grid gap-2">
              <Label className={errors.password && "text-red-600"}htmlFor="password">Password</Label>
              <Input aria-invalid={errors.password && 'true'} className={errors.password && "border-red-600"} type="password" id="password" {...register("password")}/>
              <p className="text-red-600 text-sm">{errors?.password?.message}</p>
            </div>
             </form>
          </CardContent>
          
          <CardFooter className='flex-col gap-2'>
            {(loadingRequest || errors?.password || errors?.username) ? 
            <Button type='submit' form ="authForm" className='w-full' disabled>Log In</Button> :
            <Button type='submit' form ="authForm" className='w-full'>Log In</Button>}
            <Button variant={'outline'} className='w-full' onClick={() => location.href='/sign-up'}>Sign Up Instead</Button>
            <GoogleLogInButton loginContext='LogIn'/>
          </CardFooter>
         
        
        </Card>
    </div>

    </>
  )
}

export default LoginPage
