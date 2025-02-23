import { useState, useEffect } from "react";
import { X, Check, Copy } from "lucide-react";
import PropTypes from "prop-types";
import AudioPlayer from "./AudioPlayer";

export function CallDetailsDrawer({ call, isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("transcription");
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        if (call) {
            console.log("Call Data:", call);
        }
    }, [call]);

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
        <div className="fixed inset-y-0 right-0 w-[600px] bg-white border-l border-gray-200 shadow-lg transition-transform duration-300 ease-in-out z-50 capitalize">
            {/* Header */}
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
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div>Agent: {call.agent || "Unknown"}</div>
                    <div className="flex items-center gap-2 group">
                        <span className="font-mono">Call ID: {call.call_id}</span>
                        <button
                            onClick={(e) => handleCopyClick(e, call.call_id)}
                            className="relative p-1 hover:bg-gray-100 rounded"
                        >
                            {copiedId === call.call_id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                        </button>
                        {copiedId === call.call_id && <span className="text-xs text-green-600">Copied!</span>}
                    </div>
                </div>
                <div className="text-sm text-gray-600">
                    <div>Phone Call: {call.from_number} → {call.to_number}</div>
                    <div>Duration: {formatDate(call.start_timestamp)} - {formatDate(call.end_timestamp)}</div>
                    <div>Cost: {call.combined_cost}</div>
                </div>
                <AudioPlayer audioUrl={call.recording_url} />
            </div>

            {/* Analysis Section */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold mb-3">Conversation Analysis</h3>
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                        <span>Call Successful</span>
                        <span className={call.call_successful ? "text-green-600" : "text-red-600"}>
                            {call.call_successful}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Call Status</span>
                        <span>{call.call_status || "Unknown"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>User Sentiment</span>
                        <span>{call.user_sentiment || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Disconnection Reason</span>
                        <span>{call.disconnection_reason || "Unknown"}</span>
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
                                    <button key={index} className="space-y- text-start capitalize cursor-pointer hover:bg-gray-100 p-4">
                                        <div className="text-sm font-medium text-gray-900">{transcript.role}</div>
                                        <div className="text-sm text-gray-600">{transcript.content}</div>
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
