import { useState, useEffect, useRef } from "react";
import { Download, X, Check, Copy, Award, Phone, Gauge, SquareCheck, Headset } from "lucide-react";
import PropTypes from "prop-types";

export function CallDetailsDrawer({ call, isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("transcription");
    const [copiedId, setCopiedId] = useState(null);
    const audioRef = useRef(null);

    const audioPlayFrom = (getNum) => {
        if (audioRef.current) {
            audioRef.current.currentTime = parseInt(getNum);
            audioRef.current.play();
        }
    };


    if (!isOpen) return null;
    if (!call) return <div className="fixed inset-y-0 right-0 w-[600px] bg-white p-6">Loading call details...</div>;

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const handleCopyClick = async (e, callId) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(callId);
            setCopiedId(callId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div style={{ overflowY: 'auto', paddingBottom: 100 }} className="fixed  inset-y-0 right-0 w-[600px] bg-white border-l border-gray-200 shadow-lg transition-transform duration-300 ease-in-out z-50 capitalize">
            {/* Header */}
            <div style={{ position: "sticky", top: 0, background: "#fff" }}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Call Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Call Details */}
                <div className="p-4 border-b space-y-4 border-gray-200">
                    <div className="text-lg font-bold text-gray-900">
                        {formatDate(call.start_timestamp)} - {call.call_type}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div style={{fontSize: 13}} className="flex items-center group">
                            <span className="font-mono">Agent: {call.agent_name || "Unknown"} <span className="text-gray-400">({call?.agent_id?.slice(0, 3) + '...' + call?.agent_id?.slice(-3)})</span></span>
                            <button
                                onClick={(e) => handleCopyClick(e, call.agent_id)}
                                className="relative p-1 hover:bg-gray-100 rounded"
                            >
                                {copiedId === call.agent_id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-500" />}
                            </button>
                            {copiedId === call.agent_id && <span className="text-xs text-green-600">Copied!</span>}
                        </div>
                        <div style={{fontSize: 13}} className="flex items-center group">
                            <span className="font-mono">Call ID: <span className="text-gray-400">{call?.call_id?.slice(0, 3) + '...' + call?.call_id?.slice(-3)}</span></span>
                            <button
                                onClick={(e) => handleCopyClick(e, call.call_id)}
                                className="relative p-1 hover:bg-gray-100 rounded"
                            >
                                {copiedId === call.call_id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-500" />}
                            </button>
                            {copiedId === call.call_id && <span className="text-xs text-green-600">Copied!</span>}
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        <div>Phone Call: {call.from_number} → {call.to_number}</div>
                        <div>Duration: {formatDate(call.start_timestamp)} - {formatDate(call.end_timestamp)}</div>
                        <div>Cost: ${(call.combined_cost / 100).toFixed(3)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <audio ref={audioRef} controls style={{ height: 44 }}>
                            <source src={call.recording_url}
                                type="audio/wav" />
                        </audio>
                        <button style={{ height: 42, width: 42, padding: 10 }} className="custom-button-1">
                            <a href={call.recording_url}>
                                <Download className="w-5 h-5" />
                            </a>
                        </button>
                    </div>
                </div>
            </div>

            {/* Analysis Section */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold mb-3">Conversation Analysis</h3>
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                        <span className="flex gap-2 items-center"><SquareCheck className="w-4 h-4" /> Call Successful</span>
                        <span className={call.call_successful == "Unsuccessful" ? "text-red-600" : "text-green-600"}>
                            <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${call.call_successful == "Unsuccessful" ?  "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                            >
                                {call.call_successful}
                            </span>
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex gap-2 items-center"><Headset className="w-4 h-4" /> Call Status</span>
                        <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${call.call_status === "ended" ? "bg-gray-100" : "bg-red-100 text-red-700"
                                }`}
                        >
                            {call.call_status || "Unknown"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex gap-2 items-center"><Award className="w-4 h-4" /> User Sentiment</span>
                        <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${call.user_sentiment === "Positive"
                                ? "bg-green-100 text-green-700"
                                : call.user_sentiment === "Negative"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100"
                                }`}
                        >
                            {call.user_sentiment || "N/A"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex gap-2 items-center"><Phone className="w-4 h-4" /> Disconnection Reason</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
                            {call.disconnection_reason || "Unknown"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex gap-2 items-center"><Gauge className="w-4 h-4" /> End to End Latency</span>
                        <span>{parseInt(call.latency) == 0 ? "" : parseInt(call.latency) + 'ms'}</span>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-sm mb-2">Summary</h3>
                <p className="text-sm text-gray-600">{call.call_summary || "No summary available."}</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex border-b">
                    {["transcription", "data", "logs"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="p-4">
                    {activeTab === "transcription" && (
                        <div className="">
                            {call.transcript_object && call.transcript_object.length > 0 ? (
                                call.transcript_object.map((transcript, index) => (
                                    <button
                                        onClick={() => audioPlayFrom(transcript.start)}
                                        key={index} style={{ width: '100%', }} className="space-y- text-start capitalize cursor-pointer hover:bg-gray-100 p-4">
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'auto 50px',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'

                                        }}>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{transcript.role}</div>
                                                <div className="text-sm text-gray-600">{transcript.content}</div>
                                            </div>
                                            <div className="text-sm text-end text-gray-600">{parseInt(transcript.start / 60) + ":"}{parseInt(transcript.start % 60) < 10 ? "0" + parseInt(transcript.start % 60) : parseInt(transcript.start % 60)}</div>
                                        </div>

                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No transcription available.</p>
                            )}
                        </div>
                    )}
                    {activeTab === "data" && <p className="text-sm text-gray-500">Data tab content goes here.</p>}
                    {activeTab === "logs" && <p className="text-sm text-gray-500">Detail logs content goes here.</p>}
                </div>
            </div>
        </div>
    );
}

CallDetailsDrawer.propTypes = {
    call: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
