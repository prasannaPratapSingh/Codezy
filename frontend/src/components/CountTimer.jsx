import React, { useEffect, useState } from 'react'

const CountTimer = ({ time }) => {
    const [timeLeft, setTimeLeft] = useState(new Date(time).getTime() - new Date().getTime());

    // pad numbers to 2 digits
    const pad = (n) => String(n).padStart(2, "0");

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = new Date(time).getTime() - Date.now();

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
            } else {
                setTimeLeft(diff);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [time]);  // FIXED: should depend on time only

    if (timeLeft <= 0) {
        return (
            <div className="border-1 rounded-xl border-zinc-700 px-5 py-2 text-white min-w-20 text-center text-lg bg-gradient-to-r from-zinc-900 to-black">
                Time's Up!
            </div>
        );
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div className="border-1 rounded-xl border-zinc-700 bg-gradient-to-r from-zinc-900 to-black px-5 py-2 text-white min-w-20 text-center text-lg">
            Time Left: {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </div>
    );
}

export default CountTimer;
