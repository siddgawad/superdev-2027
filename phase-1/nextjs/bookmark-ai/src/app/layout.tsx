import "./global.css";
import {Inter} from "next/font/google";
import {RecoilRoot} from "recoil";

const inter = Inter({subsets:["latin"]});


export const metdata = {
  title:"AI Bookmark",description:"Semantic bookmark manager"
};

export default function RootLayout({children}:{children:React.ReactNode}){
return(
<html lang="en">
  <body className = {inter.className}>
    <RecoilRoot>{children}</RecoilRoot>
  </body>
</html>
)
}