import { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';



const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {


    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Update current time during playback
    useEffect(() => {
        const video = videoRef.current;

        const handleTimeUpdate = () => {
            if (video) setCurrentTime(video.currentTime);
        };

        if (video) {
            video.addEventListener('timeupdate', handleTimeUpdate);
            return () => video.removeEventListener('timeupdate', handleTimeUpdate);
        }
    }, []);

    const secure = secureUrl;
    const thumb = thumbnailUrl;

    if (!secure && !thumb) {
        return (
            <>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-base-200 rounded-full p-6 mb-4">
                        <svg className="w-12 h-12 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-base-content/70 mb-2">No Editorial Video Available</h3>
                    <p className="text-base-content/50 max-w-md">
                        The editorial video for this problem hasn't been uploaded yet. Please check back later or try solving the problem on your own first!
                    </p>
                </div>
            </>
        )
    }


    return (

        <div
            className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={secureUrl}
                poster={thumbnailUrl}
                onClick={togglePlayPause}
                className="w-full aspect-video bg-black cursor-pointer"
            />

            {/* Video Controls Overlay */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity ${isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlayPause}
                    className="btn btn-circle btn-primary mr-3"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <Pause />
                    ) : (
                        <Play />
                    )}
                </button>

                {/* Progress Bar */}
                <div className="flex items-center w-full mt-2">
                    <span className="text-white text-sm mr-2">
                        {formatTime(currentTime)}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={(e) => {
                            if (videoRef.current) {
                                videoRef.current.currentTime = Number(e.target.value);
                            }
                        }}
                        className="range range-primary range-xs flex-1"
                    />
                    <span className="text-white text-sm ml-2">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>
        </div>
    );
};


export default Editorial;