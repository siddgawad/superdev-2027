export default async function Product({params}:{params:{id:string}}){
    const {id} = await params; // we sue this id to fetch and display details in real world sceanrio
    return <h1>Product:{id}</h1>;
}