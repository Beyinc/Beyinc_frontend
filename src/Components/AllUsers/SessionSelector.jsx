import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const SessionSelector = ({ session, selectedSessionId, setSelectedSessionId, setSelectedSession, setSessionTitle }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (s) => {
    setSelectedSessionId(s._id);
    setSelectedSession(s);
    setSessionTitle(s.title);
    setOpen(false);
  };

  const selected = session.find((s) => s._id === selectedSessionId);

  return (
    <div className="relative">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
        Select Session Duration
      </label>

      {/* Selected Box */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-4 cursor-pointer 
                  flex justify-between items-center font-medium hover:border-gray-300 transition-all"
      >
        <div>
          {selected ? (
            <>
              <div className="font-semibold">{selected.title}</div>
              <div className="text-sm text-gray-500">
                {selected.duration} minutes • ₹{selected.amount}
              </div>
            </>
          ) : (
            <span className="text-gray-400">Choose a duration...</span>
          )}
        </div>
        <FaChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown List */}
      {open && (
        <div className="absolute left-0 right-0 bg-white mt-2 border border-gray-200 rounded-xl shadow-lg py-2 z-50 max-h-60 overflow-y-auto">
          {session.map((s) => (
            <div
              key={s._id}
              onClick={() => handleSelect(s)}
              className="p-4 hover:bg-gray-100 cursor-pointer transition-all"
            >
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-gray-500">
                {s.duration} minutes • <span className={`${s.amount == 0 ? "text-gray-500" : "text-green-500"}`}>{s.amount == 0 ? "Free" : `₹${s.amount}`}</span> 
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionSelector;
