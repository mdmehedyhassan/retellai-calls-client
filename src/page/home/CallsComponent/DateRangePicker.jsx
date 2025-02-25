import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarIcon } from "lucide-react";

export default function DateRangePicker({ range, setRange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  DateRangePicker.propTypes = {
    range: PropTypes.shape({
      from: PropTypes.instanceOf(Date),
      to: PropTypes.instanceOf(Date),
    }).isRequired,
    setRange: PropTypes.func.isRequired,
  };

  return (
    <div className="max-w-full" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center"
      >
        <CalendarIcon className="h-4 w-4 me-1" />
        {range.from && range.to ? (
          <span>
            {format(range.from, "MM/dd/yyyy")} -{" "}
            {format(range.to, "MM/dd/yyyy")}
          </span>
        ) : (
          "Date Range"
        )}
      </button>
      <div className="">
        {open && (
          <div className="w-fit absolute left-6 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg p-4">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={(selected) => {
                if (selected?.from && selected?.to) {
                  setRange({ from: selected.from, to: selected.to });
                } else {
                  setRange({ from: undefined, to: undefined });
                }
              }}
              numberOfMonths={2}
              modifiersClassNames={{
                selected: "!bg-black !text-white ", 
                range_middle: "!bg-gray-300 !text-black", 
                range_start: "!bg-black !text-white !rounded-none", 
                range_end: "!bg-black !text-white !rounded-none",
                today: "!text-blue-500", 
                month_toggle: "!bg-black !text-white",
              }}
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setRange({ from: undefined, to: undefined })}
                className="text-sm text-red-500 hover:underline"
              >
                Clear
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-black hover:underline"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}