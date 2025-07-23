export default function Product({params}:{params:{id:string}}){
    const {id} =  params; // we sue this id to fetch and display details in real world sceanrio
    return <h1>Product:{id}</h1>;
}