
type User={
    id:number,
    firstName:string,
    email:string,
    phone:string
};

export default async function UsersServer(){
    await new Promise((resolve)=>setTimeout(resolve,2000));
    const res= await fetch("https://dummyjson.com/users");
    const data = await res.json();
    const users = data.users;

    return(
        <div>
             <ul className="space-y-4 p-4">
                {users.map((user:User)=>(
                    <li key={user.id} className="p-4 shadow-md rounded-lg text-white">{user.firstName} - ({user.email})</li>
                ))}
            </ul>
        </div>
    )

}