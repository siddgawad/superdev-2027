"use client"

import {useState,useEffect} from "react";

type User={
    id:number,
    firstName:string,
    email:string,
    phone:string
};

export default function UsersClient(){
    const [users,setUsers] = useState<User[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    useEffect(()=>{
        async function fetchUsers(){
            try{
                const response = await fetch(
                    "https://dummyjson.com/users"

                );
                if(!response.ok) throw new Error("Failed to fetch user data");
                const data = await response.json();
                setUsers(data.users);
            }catch(err){
                setError(`Failed to fetch users:${(err as Error).message}`)
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    },[]);

    if(loading) return <div>Loading...</div>
    if(error) return <div>{error}</div>

    return(
        <div>
            <ul className="space-y-4 p-4">
                {users.map((user)=>(
                    <li key={user.id} className="p-4 shadow-md rounded-lg text-white">{user.firstName} - ({user.email})</li>
                ))}
            </ul>
        </div>
    )
}