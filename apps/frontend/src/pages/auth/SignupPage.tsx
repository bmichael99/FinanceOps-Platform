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
import {useNavigate } from "react-router-dom";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {userSchema, type userType} from "@finance-platform/schemas";
import { useEffect, useRef, useState } from 'react';
import useRefreshToken from '@/hooks/useRefreshToken';
import GoogleLogInButton from './GoogleLogInButton';

// const API_URL = import.meta.env.VITE_API_URL;

function SignupPage() {
  const navigate = useNavigate();
  const refresh = useRefreshToken();
  const [loadingRequest,setLoadingRequest] = useState(false);
  const isSubmitting = useRef(false);

  const {setError, clearErrors, register, handleSubmit, formState:{errors}} = useForm(
    {defaultValues: 
      {firstName: "",
        username: "",
        password: "",
      },
    resolver: zodResolver(userSchema)});

  const  myHandleSubmit = async (data: userType) =>{
    if(isSubmitting.current == true) return;
    isSubmitting.current = true;
    setLoadingRequest(true);
    clearErrors();
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    console.log(response);

    if(response.ok){
      await navigate('/dashboard')
    } else {
      const responseData = await response.json();

      if(responseData && response.status == 409){
        setError('username', {message: "A user with that username already exists."});
      }else if(response.status == 429){
        setError('password', {message: "Too many attempts. Please try again later."});
        setError('username', {});
      } else {
        setError('firstName', {});
        setError('username', {});
        setError('password', {message: "Server error."});
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
          <CardTitle>Create new account</CardTitle>
          <CardDescription>Enter your username and password below to sign up.</CardDescription>
          <CardAction>
            <Button variant="link"><a href="/log-in">Log In</a></Button>
          </CardAction>
        </CardHeader>
        <CardContent>
            <form id="authForm" className="flex flex-col gap-6" onSubmit={handleSubmit(async (data) => {await myHandleSubmit(data)})}>
            <div className="grid gap-2">
              <Label className={errors.firstName && "text-red-600"} htmlFor="firstName">First Name</Label>
              <Input aria-invalid={errors.firstName && 'true'} className={errors.firstName && "border-red-600"} type="text" id="firstName" {...register("firstName")}/>
              <p className="text-red-600 text-sm">{errors?.firstName?.message}</p>
            </div>
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

            {(loadingRequest || errors?.username || errors?.password) ? 
            <Button type='submit' form ="authForm" className='w-full' disabled>Sign Up</Button> :
            <Button type='submit' form ="authForm" className='w-full'>Sign Up</Button>}
            <Button variant={'outline'} className='w-full' onClick={() => location.href='/log-in'}>Log In Instead</Button>
            <GoogleLogInButton loginContext='SignUp'/>
          </CardFooter>
         
        
        </Card>
    </div>
    </>
  )
}

export default SignupPage
