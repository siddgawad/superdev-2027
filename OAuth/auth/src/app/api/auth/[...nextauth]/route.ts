import NextAuth from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import AppleProvider from "next-auth/providers/apple";
import FacebookProvider from "next-auth/providers/facebook";





const handler = NextAuth({
    providers:[
        CredentialsProvider({
            name:"Email",
            credentials:{
                username: {label:"Username",type:"text",placeholder:"s@example.com"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials,req){
               const username = credentials?.username;
               const password = credentials?.password;

               //check if user exists in db 
               const userExists = {

               }

               if(userExists){
                return userExists;
               }else{
                return null;
               }
            }
            }),

            GoogleProvider({
                clientId:"asd",
                clientSecret:"Asd"
            }),

            GithubProvider({
                clientId:"asd",
                clientSecret:"Asd"
            }),

            AppleProvider({
                clientId:"dsjd3",
                clientSecret:"Asd"
            }),
            FacebookProvider({
                clientId:"jubnr",
                clientSecret:"ADN"
            })


    ]
}

);

export {handler as GET, handler as POST};