import { useRef, useState } from "react";
import { Play, Pause, Volume2, Download } from "lucide-react";
import PropTypes from "prop-types";

const AudioPlayer = ({ audioUrl }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    if (!audioUrl) return null;

    const togglePlay = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div className="flex items-center bg-[#f1f3f4] py-2 px-4 rounded-full  max-w-72">
            <button
                className=""
                onClick={togglePlay}
            >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <audio ref={audioRef} src={audioUrl} className="hidden"></audio>

            <div className="flex-1 mx-2 mb-2 text-black">
                <input
                    type="range"
                    className="w-full h-1 rounded-full cursor-pointer text-black"
                />
            </div>
            <Volume2 size={20} className="text-gray-600" />
            <a
                href={audioUrl}
                download
                className="ml-2"
            >
                <Download size={20} />
            </a>
        </div>
    );
};

AudioPlayer.propTypes = {
    audioUrl: PropTypes.string.isRequired,
};

export default AudioPlayer;