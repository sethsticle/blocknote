import { Button } from "@/components/ui/button";
import {RegisterLink, LoginLink, LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";

export default async function Home() {
  
  const { getUser } = getKindeServerSession()
  const session = await getUser() //safe due to server side rendering -> returns whether logged in user or not


  return (
    <div>
    <h1>home</h1>
    
    {session ? //here we are conditionally rendering a login or logout button depending on the users logged in status
    (
      <div>
        <LogoutLink><Button>Logout</Button></LogoutLink>
      </div>
    ) : 
    (
      <div>
      <RegisterLink><Button>Register</Button></RegisterLink>
      <LoginLink><Button>Login</Button></LoginLink>
      
    </div>
    )}
    </div>
  );
}
