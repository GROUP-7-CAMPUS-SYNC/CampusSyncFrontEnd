import { useEffect, useState } from "react"
import api from "../../api/api"


// Interface matching your Academic Model and Controller populate logic
interface AcademicPost {
    _id: string;
    type: string;
    title: string;
    content: string;
    image: string;
    // Fields populated by the controller
    postedBy: {
        _id: string;
        firstname: string;
        lastname: string;
    } | null;
    organization: {
        _id: string;
        organizationName: string;
        profileLink: string;
    } | null;
    taggedUsers: any[];
    comments: any[];
    createdAt: string;
    updatedAt: string;
}


export default function AcademicContent() {
    const [posts, setPosts] = useState<AcademicPost[]>([]);


    const fetchAcademicPosts = async () => {
        try {
            const response = await api.get("/academic/getPosts/academic")
            setPosts(response.data)
        } catch(error) {
            console.log("Error fetching academic posts:", error)
        }
    }


    useEffect(() => {
        fetchAcademicPosts()


        const interval = setInterval(() => {
            fetchAcademicPosts()
        }, 2000)


        return () => {
            clearInterval(interval)
        }
    }, [])


    return (
        <div style={{ padding: "20px", fontFamily: "monospace" }}>
            <h2>Debug: All Academic Data Display</h2>
            <p style={{marginBottom: "20px", color: "gray"}}>Raw data dump for UI team integration</p>
           
            {posts.map((post) => (
                <div key={post._id} style={{ marginBottom: "30px", borderBottom: "4px solid #333", paddingBottom: "10px", backgroundColor: "#f4f4f4", padding: "15px" }}>
                   
                    <p><strong>_id:</strong> {post._id}</p>
                    <p><strong>type:</strong> {post.type}</p>
                    <p><strong>title:</strong> {post.title}</p>
                    <p><strong>content:</strong> {post.content}</p>
                   
                    <div style={{margin: "10px 0"}}>
                        <strong>image:</strong> <br/>
                        <span style={{wordBreak: "break-all", fontSize: "0.8em"}}>{post.image}</span>
                        <br/>
                        {/* Preview for validation */}
                        <img src={post.image} alt="preview" style={{height: "50px", marginTop: "5px"}} />
                    </div>
                   
                    {/* Handling populated objects safely */}
                    <p><strong>postedBy:</strong> {post.postedBy ? `${post.postedBy.firstname} ${post.postedBy.lastname} (ID: ${post.postedBy._id})` : "null"}</p>
                   
                    <p><strong>organization:</strong> {post.organization ? `${post.organization.organizationName} (ID: ${post.organization._id})` : "null"}</p>
                   
                    {/* Arrays dump */}
                    <p><strong>taggedUsers:</strong> {JSON.stringify(post.taggedUsers)}</p>
                    <p><strong>comments:</strong> {JSON.stringify(post.comments)}</p>
                   
                    <p><strong>createdAt:</strong> {post.createdAt}</p>
                    <p><strong>updatedAt:</strong> {post.updatedAt}</p>


                </div>
            ))}
        </div>
    )
}

