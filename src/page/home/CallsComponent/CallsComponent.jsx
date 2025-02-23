import { useState } from "react"
import { dataArray } from "../../../data/dataArray"
import { Calendar, Filter, Settings, Download, Clock, ArrowLeft, ArrowRight, Copy, Check } from "lucide-react"
import { CallDetailsDrawer } from "./call-details-drawer"


export default function CallsComponent() {

  const [copiedId, setCopiedId] = useState(null)
  const [selectedCall, setSelectedCall] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)


  const handleCopyClick = async (e, callId) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(callId)
      setCopiedId(callId)
      setTimeout(() => {
        setCopiedId(null)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  const handleRowClick = (call) => {
    console.log(call)
    setSelectedCall(call)
    setIsDrawerOpen(true)
  }

  return (
    <div className="p-6 max-w-[1920px] mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <h1 className="text-xl font-semibold">Call History</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-gray-50">
            <Settings className="w-4 h-4" />
            Customize Field
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-[#e5e5e5] rounded-lg custom-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[#e5e5e5]">
              <th className="px-4 py-3 text-left font-medium text-gray-500">Time</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Call Duration</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Cost</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Call ID</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Disconnection Reason</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Call Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">User Sentiment</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">From</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">To</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Call Successful</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Latency</th>
            </tr>
          </thead>
          <tbody>
            {dataArray.map((call, index) => (
              <tr
                key={call._id}
                className={`border-b border-[#e5e5e5] last:border-b-0 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } cursor-pointer hover:bg-gray-50`}
                onClick={() => handleRowClick(call)}
              >
                <td className="px-4 py-3">{formatDate(call.start_timestamp)}</td>
                <td className="px-4 py-3">{formatDuration(call.duration_ms)}</td>
                <td className="px-4 py-3">{call.call_type}</td>
                <td className="px-4 py-3">${call.combined_cost.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 group">
                    <span className="font-mono text-xs">{call.call_id}</span>
                    <button
                      onClick={(e) => handleCopyClick(e, call.call_id)}
                      className="relative p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-opacity"
                    >
                      {copiedId === call.call_id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                      {copiedId === call.call_id && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded">
                          Copied!
                        </div>
                      )}
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
                    {call.disconnection_reason}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${call.call_status === "ended" ? "bg-gray-100" : "bg-red-100 text-red-700"
                      }`}
                  >
                    {call.call_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${call.user_sentiment === "Positive"
                      ? "bg-green-100 text-green-700"
                      : call.user_sentiment === "Negative"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100"
                      }`}
                  >
                    {call.user_sentiment}
                  </span>
                </td>
                <td className="px-4 py-3">{call.from_number}</td>
                <td className="px-4 py-3">{call.to_number}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${call.call_successful ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                  >
                    {call.call_successful ? "Successful" : "Unsuccessful"}
                  </span>
                </td>
                <td className="px-4 py-3">{call.latency}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="text-gray-500">Page 1 of 1</div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100 bg-gray-200">1</button>
          <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <CallDetailsDrawer call={selectedCall} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  )
}
