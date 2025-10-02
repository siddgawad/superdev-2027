"use client"
import { useSession,signOut,signIn } from "next-auth/react";

export default function Page(){
  const session = useSession();

  return(
    <div>
      {session.status==="authenticated"? (<button onClick={()=>signOut()}>Logout</button>):(<button onClick={()=>signIn}>Sign In</button>)  }
      hi there
    </div>
  )
}