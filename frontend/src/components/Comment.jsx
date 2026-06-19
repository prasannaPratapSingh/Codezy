import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import toast from "react-hot-toast";

const Comment = ({ problemId }) => {
    const [comment, setComment] = useState([]);
    const [typeComment, setTypeComment] = useState("");

    const fetchComments = async () => {
        try {
            const response = await axiosClient.get(`/user/comment/${problemId}`);
            setComment(response.data.comments);
            console.log(response.data.comments);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setTypeComment("");
        try {

            const response = await axiosClient.post(`/user/comment/${problemId}`, {
                content: typeComment
            })

            fetchComments();

        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="space-y-4">
            {/* Heading */}
            <h2 className="text-lg font-semibold text-blue-300 border-b border-blue-900/40 pb-2">
                💬 Comments
            </h2>

            {/* Empty State */}
            {comment.length === 0 && (
                <div className="text-gray-400 text-sm italic">
                    No comments yet. Be the first to comment.
                </div>
            )}

            {/* Comment List */}
            <div className="space-y-3">
                {comment.map((cmt, idx) => (
                    <div
                        key={idx}
                        className="bg-[#0b1220] border border-blue-900/40 rounded-lg p-3"
                    >
                        {/* User */}
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-full bg-blue-800/40 flex items-center justify-center text-xs font-semibold text-blue-200">
                                {cmt?.userId?.firstName?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="flex justify-between w-full"  >
                                <span className="text-sm font-medium text-blue-200">
                                    {cmt?.userId?.firstName}
                                </span>
                                <p className="text-sm text-gray-200 leading-relaxed">
                                    {formatTime(cmt?.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <p className="text-gray-300 text-sm">
                            {cmt?.content}
                        </p>
                    </div>
                ))}

                <form className="mt-4 bottom-0 sticky flex" onSubmit={submitHandler} >
                    <input type="text" value={typeComment} className="border-b-2 border-blue-900/40 bg-black text-white w-full p-2 focus:outline-none focus:border-blue-500" placeholder="Add a comment..." onChange={(e) => setTypeComment(e.target.value)} />
                    <button className="bg-black hover:cursor-pointer border px-5 rounded-sm" type="submit">Enter</button>
                </form>
            </div>
        </div>
    );
};

export default Comment;
