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

const API_URL = import.meta.env.VITE_API_URL;

function SignupPage() {
  const navigate = useNavigate();


  const {register, handleSubmit, formState:{errors}} = useForm(
    {defaultValues: 
      {firstName: "",
        username: "",
        password: "",
      },
    resolver: zodResolver(userSchema)});

  const  myHandleSubmit = async (data: userType) =>{
    const response = await fetch(API_URL + '/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    console.log(response);

    if(response.status == 200){
      navigate('/log-in')
    }
    
  }
  
  console.log(errors);

  return (
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
              <p className="text-red-600">{errors?.firstName?.message}</p>
            </div>
            <div className="grid gap-2">
              <Label className={errors.username && "text-red-600"}htmlFor="username">Username</Label>
              <Input aria-invalid={errors.username && 'true'} className={errors.username && "border-red-600"}type="text" id="username" {...register("username")}/>
              <p className="text-red-600">{errors?.username?.message}</p>
            </div>
            <div className="grid gap-2">
              <Label className={errors.password && "text-red-600"}htmlFor="password">Password</Label>
              <Input aria-invalid={errors.password && 'true'} className={errors.password && "border-red-600"} type="password" id="password" {...register("password")}/>
              <p className="text-red-600">{errors?.password?.message}</p>
            </div>
             </form>
          </CardContent>
          
          <CardFooter className='flex-col gap-2'>
            <Button type='submit' form ="authForm" className='w-full'>Sign Up</Button>
            <Button variant={'outline'} className='w-full' onClick={() => location.href='/log-in'}>Log In Instead</Button>
          </CardFooter>
         
        
        </Card>
    </div>
  )
}

export default SignupPage
