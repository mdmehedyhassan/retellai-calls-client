import { useState, useEffect, useRef } from "react"
import { dataArray } from "../../../data/dataArray";
import {
  Calendar, Filter, Settings, Download, Clock,
  ArrowLeft, ArrowRight, Copy, Check,
  History, CirclePlus, ChevronDown
} from "lucide-react";
import { CallDetailsDrawer } from "./call-details-drawer"
import { agentData } from "../../../data/agentData";


const fields = [
  {
    name: "Agent",
    id: "",
    options: agentData.map(agent => agent.agent_name)
  },
  { name: "Call ID", id: "call_id", options: [] },
  { name: "Batch Call ID", id: "", options: [] },
  { name: "Type", id: "call_type", options: ["Inbound", "Outbound", "Automated", "Manual"] },
  { name: "Call Duration", id: "", options: [] },
  { name: "From", id: "", options: [] },
  { name: "To", id: "", options: [] },
  { name: "User Sentiment", id: "user_sentiment", options: ["Positive", "Neutral", "Negative", "Unknown"] },
  {
    name: "Disconnection Reason", id: "disconnection_reason", options: [
      "User Hangup",
      "Agent Hangup",
      "Call Transfer",
      "Voicemail Reached",
      "Inactivity",
      "Machine Detected",
      "Max Duration Reached",
      "Concurrency Limit Reached",
      "No Valid Payment",
      "Scam Detected",
      "Error Inbound Webhook",
      "Dial Busy",
      "Dial Failed",
      "Dial No Answer",
      "Error Llm Websocket Open",
      "Error Llm Websocket Lost Connection",
      "Error Llm Websocket Runtime",
      "Error Llm Websocket Corrupt Payload",
      "Error Frontend Corrupted Payload",
      "Error Twilio",
      "Error No Audio Received",
      "Error Asr",
      "Error Retell",
      "Error Unknown",
      "Error User Not Joined",
      "Registered Call Timeout",
    ]
  },
  {
    name: "Call Successful", id: "call_successful", options: ["Success", "Unsuccess"]
  },
  {
    name: "Call Status", id: "call_status", options: [
      "ended",
      "ongoing",
      "error"]
  },
  { name: "End to End Latency", id: "", options: [] } // Added End to End Latency field
];


export default function CallsComponent() {
  const dataArrayPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null)
  const [selectedCall, setSelectedCall] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCustomizeFieldShow, set_isCustomizeFieldShow] = useState(false)
  const [isOpenFilter, set_isOpenFilter] = useState(false);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [callIdFilter, setCallIdFilter] = useState("");
  const [batchCallIdFilter, setBatchCallIdFilter] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [callDurationCondition, setCallDurationCondition] = useState("greater");
  const [callDurationValue, setCallDurationValue] = useState("");
  const [callDurationRange, setCallDurationRange] = useState([null, null]);
  const [latencyCondition, setLatencyCondition] = useState("greater"); // Default to 'greater'
  const [latencyValue, setLatencyValue] = useState("");
  const [latencyRange, setLatencyRange] = useState([null, null]); // For 'Is Between' condition
  const dropdownFilterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownFilterRef.current && !dropdownFilterRef.current.contains(event.target)) {
        set_isOpenFilter(false);
        setOpenSubDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOptionSelection = (fieldName, option) => {
    setSelectedOptions((prev) => {
      const prevSelected = prev[fieldName] || [];
      const newSelected = prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option) // Deselect
        : [...prevSelected, option]; // Select

      return { ...prev, [fieldName]: newSelected };
    });
  };

  const applyFilters = () => {
    console.log("Selected Filters:", selectedOptions);
    
    
    for (let index = 0; index < fields.length; index++) {
      const element = fields[index];
      // console.log([element.id])
      if(selectedOptions[element.name]){
        // console.log([selectedOptions[element.name]])
        const newDD = dataArray.filter(dt => selectedOptions[element.name].includes(dt[element.id]))
        console.log(newDD)
      }
      // console.log(element.name, selectedOptions[element.name]);

    }
   
    // console.log("Call ID Filter:", callIdFilter);
    // console.log("Batch Call ID Filter:", batchCallIdFilter);
    // console.log("From Filter:", fromFilter);
    // console.log("To Filter:", toFilter);
    // console.log("Call Duration Condition:", callDurationCondition);
    // console.log("Call Duration Value:", callDurationValue);
    // console.log("Call Duration Range:", callDurationRange);
    // console.log("Latency Condition:", latencyCondition);
    // console.log("Latency Value:", latencyValue);
    // console.log("Latency Range:", latencyRange);
    // setOpenSubDropdown(null);
    // set_isOpenFilter(false);
  };


  const customizeFieldShowRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (customizeFieldShowRef.current && !customizeFieldShowRef.current.contains(event.target)) {
        set_isCustomizeFieldShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const allFields = [
    "Time", "Call Duration", "Type", "Cost", "Call ID",
    "Disconnection Reason", "Call Status", "User Sentiment",
    "From", "To", "Call Successful", "End to End Latency"
  ];
  const [selectedFields, setSelectedFields] = useState([...allFields]);
  const [savedFields, setSavedFields] = useState([...allFields]);
  const handleCheckboxChange = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.filter((item) => item !== field)
        : [...prev, field]
    );
  };
  const handleSave_customizeField = () => {
    setSavedFields([...selectedFields]);
    set_isCustomizeFieldShow(false)
  };
  const handleCancel_customizeField = () => {
    setSelectedFields([...savedFields]);
    set_isCustomizeFieldShow(false)
  };
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

  const totalPages = Math.ceil(dataArray.length / dataArrayPerPage);
  const startIndex = (currentPage - 1) * dataArrayPerPage;
  const endIndex = startIndex + dataArrayPerPage;
  const currentdataArray = dataArray.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };



  return (
    <div className="p-6 max-w-[1920px] mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" />
            <h1 className="text-xl font-semibold">Call History</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="custom-button-1">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="custom-button-1">
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
          <div className="relative" ref={dropdownFilterRef}>
            <button
              onClick={() => set_isOpenFilter(!isOpenFilter)}
              className="custom-button-1"
            >
              <Filter className="w-4 h-4" /> Filter
            </button>

            {isOpenFilter && (
              <div style={{ color: '#0e121b' }} className="absolute bg-white shadow-lg p-2 rounded-lg w-64 mt-2 border border-gray-300 z-10">
                {fields.map((field) => (
                  <div key={field.name} className="relative">
                    <div
                      className="flex justify-between items-center rounded-md p-1 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setOpenSubDropdown(openSubDropdown === field.name ? null : field.name)}
                    >
                      <div className="flex items-center">
                        <CirclePlus size={14} className="mr-2" />
                        <span style={{ fontSize: 14 }}>{field.name}</span>
                      </div>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${openSubDropdown === field.name ? "rotate-180" : ""}`}
                      />
                    </div>

                    {openSubDropdown === field.name && (
                      <div className="absolute left-full top-0 ml-2 w-80 bg-white border border-gray-300 shadow-lg rounded-md p-3">
                        <p style={{ fontSize: 14 }} className="text-gray-600 font-semibold mb-2">Filter by {field.name}</p>

                        {field.name === "Call ID" || field.name === "Batch Call ID" || field.name === "From" || field.name === "To" ? (
                          <div className="mb-4">
                            <input
                              type="text"
                              value={field.name === "Call ID" ? callIdFilter :
                                field.name === "Batch Call ID" ? batchCallIdFilter :
                                  field.name === "From" ? fromFilter : toFilter}
                              onChange={(e) =>
                                field.name === "Call ID"
                                  ? setCallIdFilter(e.target.value)
                                  : field.name === "Batch Call ID"
                                    ? setBatchCallIdFilter(e.target.value)
                                    : field.name === "From"
                                      ? setFromFilter(e.target.value)
                                      : setToFilter(e.target.value)
                              }
                              style={{ fontSize: 14 }}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                              placeholder={`Enter ${field.name}`}
                            />
                          </div>
                        ) : field.name === "Call Duration" || field.name === "End to End Latency" ? (
                          <div className="mb-4">
                            <select
                              value={field.name === "Call Duration" ? callDurationCondition : latencyCondition}
                              onChange={(e) => {
                                if (field.name === "Call Duration") setCallDurationCondition(e.target.value);
                                else setLatencyCondition(e.target.value);
                              }}
                              style={{ fontSize: 14 }}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                              <option value="greater">Is Greater Than</option>
                              <option value="less">Is Less Than</option>
                              <option value="between">Is Between</option>
                            </select>
                            {((field.name === "Call Duration" && callDurationCondition === "between") ||
                              (field.name === "End to End Latency" && latencyCondition === "between")) ? (
                              <div className="mt-2 flex space-x-2">
                                <input
                                  type="number"
                                  value={(field.name === "Call Duration" ? callDurationRange[0] : latencyRange[0]) || ""}
                                  onChange={(e) =>
                                    field.name === "Call Duration"
                                      ? setCallDurationRange([e.target.value, callDurationRange[1]])
                                      : setLatencyRange([e.target.value, latencyRange[1]])
                                  }
                                  style={{ fontSize: 14 }}
                                  className="w-1/2 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                  placeholder="From"
                                />
                                <input
                                  type="number"
                                  value={(field.name === "Call Duration" ? callDurationRange[1] : latencyRange[1]) || ""}
                                  onChange={(e) =>
                                    field.name === "Call Duration"
                                      ? setCallDurationRange([callDurationRange[0], e.target.value])
                                      : setLatencyRange([latencyRange[0], e.target.value])
                                  }
                                  style={{ fontSize: 14 }}
                                  className="w-1/2 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                  placeholder="To"
                                />
                              </div>
                            ) : (
                              <input
                                type="number"
                                value={field.name === "Call Duration" ? callDurationValue : latencyValue || ""}
                                onChange={(e) =>
                                  field.name === "Call Duration"
                                    ? setCallDurationValue(e.target.value)
                                    : setLatencyValue(e.target.value)
                                }
                                style={{ fontSize: 14 }}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Enter Duration"
                              />
                            )}
                          </div>
                        ) : field.options.length > 0 ? (
                          field.options.map((option) => (
                            <label key={option} className="flex ps-2 p-1 items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-md">
                              <input
                                type="checkbox"
                                checked={selectedOptions[field.name]?.includes(option) || false}
                                onChange={() => toggleOptionSelection(field.name, option)}
                              />
                              <span style={{ fontSize: 14 }}>{option}</span>
                            </label>
                          ))
                        ) : null}
                        <div style={{
                          marginTop: 10,
                          borderTop: '1px solid #e1e4ea',
                          paddingTop: 10,
                          textAlign: 'end'
                        }}>
                          <button
                            onClick={() => setOpenSubDropdown(null)}
                            className="custom-button-cancel"
                          >
                            Cancel
                          </button>
                          <button
                            className="custom-button-save"
                            onClick={applyFilters}
                          >
                            save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => set_isCustomizeFieldShow(!isCustomizeFieldShow)}
            className="custom-button-1">
            <Settings className="w-4 h-4" />
            Customize Field
          </button>
          {

            isCustomizeFieldShow &&
            <div ref={customizeFieldShowRef} className="w-fit absolute left-66 top-34 z-10 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg p-2">
              {
                allFields.map((field) => (
                  <div className="rounded-md hover:bg-gray-100" key={field}>
                    <label className="flex ps-2 p-1 items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-md">
                      <input
                        type="checkbox"
                        id={field}
                        className="cursor-pointer"
                        checked={selectedFields.includes(field)}
                        onChange={() => handleCheckboxChange(field)}
                      />
                      <span style={{ fontSize: 14 }}>{field}</span>
                    </label>
                  </div>
                ))
              }
              <div style={{
                marginTop: 10,
                borderTop: '1px solid #e1e4ea',
                paddingTop: 10,
                textAlign: 'end'
              }}>
                <button className='custom-button-cancel' onClick={handleCancel_customizeField}>Cancel</button>
                <button className='custom-button-save' onClick={handleSave_customizeField}>Save</button>
              </div>
            </div>
          }
        </div>
      </div>

      <div style={{ maxHeight: '70vh' }} className="overflow-x-auto border border-[#e5e5e5] rounded-lg custom-scrollbar">
        <table style={{ fontSize: 14 }} className="w-full">
          <thead>
            <tr className="calls-table-th-parent bg-gray-50 border-b border-[#e5e5e5]">
              {
                allFields.map((el, i) =>
                  savedFields.includes(el) ? <th key={i}>{el}</th> : null
                )
              }

            </tr>
          </thead>
          <tbody>
            {currentdataArray.map((call, index) => (
              <tr
                key={index}
                className={`border-b border-[#e5e5e5] last:border-b-0 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } cursor-pointer hover:bg-gray-50 calls-table-td-parent`}
                onClick={() => handleRowClick(call)}
              >
                {savedFields.includes("Time") ? <td className="px-4 py-3">{formatDate(call.start_timestamp)}</td> : null}
                {savedFields.includes("Call Duration") ? <td className="px-4 py-3">{formatDuration(call.duration_ms)}</td> : null}
                {savedFields.includes("Type") ? <td className="px-4 py-3">{call.call_type}</td> : null}
                {savedFields.includes("Cost") ? <td className="px-4 py-3">${(call.combined_cost / 100).toFixed(3)}</td> : null}
                {
                  savedFields.includes("Call ID") ?
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
                    : null
                }
                {savedFields.includes("Disconnection Reason") ? <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
                    {call.disconnection_reason}
                  </span>
                </td> : null}
                {savedFields.includes("Call Status") ? <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${call.call_status === "ended" ? "bg-gray-100" : "bg-red-100 text-red-700"
                      }`}
                  >
                    {call.call_status}
                  </span>
                </td> : null}
                {savedFields.includes("User Sentiment") ? <td className="px-4 py-3">
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
                </td> : null}
                {savedFields.includes("From") ? <td className="px-4 py-3">{call.from_number}</td> : null}
                {savedFields.includes("To") ? <td className="px-4 py-3">{call.to_number}</td> : null}
                {savedFields.includes("Call Successful") ? <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${call.call_successful ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                  >
                    {call.call_successful ? "Successful" : "Unsuccessful"}
                  </span>
                </td> : null}
                {savedFields.includes("End to End Latency") ? <td className="px-4 py-3">{parseInt(call.latency) == 0 ? "" : parseInt(call.latency) + 'ms'}</td> : null}

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: 14 }} className="flex items-center justify-between mt-4">
        <div className="text-gray-500">Page {currentPage} of {totalPages}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage} disabled={currentPage === 1}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100 bg-gray-200">{currentPage}</button>
          <button
            onClick={goToNextPage} disabled={currentPage === totalPages}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <CallDetailsDrawer call={selectedCall} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  )
}
