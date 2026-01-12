import { useState } from "react";

const TopFilterBar = () => {
  // JS version: no generics, no union types
  const [selectedProfileType, setSelectedProfileType] = useState("All");

  return (
    <>
      <div className="border-b border-border  sticky top-20 z-10 ">
        <div className="max-w-full px-6 py-4 ">
          <div className="flex items-center justify-center flex-wrap gap-4  ">
            {/* Profile Type Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg space-x-4">
              {["All", "Mentor", "Service Partner", "Startup"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedProfileType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Quick Categories (Only show for Mentors or All) */}
            {selectedProfileType !== "Service Partner" &&
              selectedProfileType !== "Startup" && (
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {/* future category buttons */}
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopFilterBar;
