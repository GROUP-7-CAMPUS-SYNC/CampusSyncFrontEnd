import { useEffect, useState } from "react"
import api from "../../api/api"


interface ReportItem {
    _id: string;
    reportType: "Lost" | "Found";
    itemName: string;
    description: string;
    turnOver: string;          
    locationDetails: string;
    contactDetails: string;
    dateLostOrFound: string;
    image: string;
    postedBy: string;          
    status: string;            
    witnesses: any[];          
    comments: any[];           
}


export default function LostAndFoundContent() {
    const [reportItems, setReportItems] = useState<ReportItem[]>([]);


    const fetchLostAndFoundContent = async () => {
        try {
            const response = await api.get("/report_types/getPosts/reportItems")
            setReportItems(response.data)
        } catch(error) {
            console.log(error)
        }
    }


    useEffect(() => {
        fetchLostAndFoundContent()


        const interval = setInterval(() => {
            fetchLostAndFoundContent()
       
        }, 2000)


        return () => {
            clearInterval(interval)
        }
    }, [])


    return (
        <div style={{ padding: "20px", fontFamily: "monospace" }}>
            <h2>Debug: All Data Display</h2>
            {reportItems.map((item) => (
                <div key={item._id} style={{ marginBottom: "30px", borderBottom: "4px solid #333", paddingBottom: "10px", backgroundColor: "#f4f4f4", padding: "10px" }}>
                   
                    <p><strong>_id:</strong> {item._id}</p>
                    <p><strong>reportType:</strong> {item.reportType}</p>
                    <p><strong>itemName:</strong> {item.itemName}</p>
                    <p><strong>description:</strong> {item.description}</p>
                   
                    {/* New Fields Added Below */}
                    <p><strong>turnOver:</strong> {item.turnOver}</p>
                    <p><strong>locationDetails:</strong> {item.locationDetails}</p>
                    <p><strong>contactDetails:</strong> {item.contactDetails}</p>
                   
                    <p><strong>dateLostOrFound:</strong> {item.dateLostOrFound}</p>
                    <p><strong>date (Formatted):</strong> {new Date(item.dateLostOrFound).toString()}</p>
                   
                    <p><strong>image:</strong> {item.image}</p>
                    <p><strong>postedBy:</strong> {item.postedBy}</p>
                    <p><strong>status:</strong> {item.status}</p>
                   
                    {/* JSON.stringify used to display arrays safely */}
                    <p><strong>witnesses:</strong> {JSON.stringify(item.witnesses)}</p>
                    <p><strong>comments:</strong> {JSON.stringify(item.comments)}</p>


                </div>
            ))}
        </div>
    )
}

