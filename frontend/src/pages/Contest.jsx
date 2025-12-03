import { useEffect, useState } from "react"
import axiosClient from "../utils/axiosClient";
import ContestCard from "../components/ContestCard";

const Contest = () => {
    const [allContest, setAllContest] = useState([]);
    const [loading, setLoading] = useState(true);

    //fetching the contest details
    useEffect(() => {
        const fetchContest = async () => {
            try {
                const response = await axiosClient.get('/contest/all');
                console.log(response.data.contestDetails);
                setAllContest(response.data.contestDetails);
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchContest();
    }, []);

    return (
        <div
            className="h-screen overflow-auto pt-20 pb-20"
            style={{
                background:
                    "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)",
            }}
        >
            {loading ? (
                <div className="min-h-screen flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <>
                    <div className="mx-auto max-w-6xl flex flex-col items-center mb-20">
                        <p className="text-8xl mb-2 font-medium">Welcome to the</p>
                        <span className="text-6xl">Codezy Contest</span>
                        <p className="text-xl italic mt-1 text-neutral-400">
                            Think in Bits. Compete in Brains.
                        </p>
                    </div>

                    <div>
                        {allContest.map((data) => (
                            <ContestCard key={data._id} challenge={data} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );

}

export default Contest
