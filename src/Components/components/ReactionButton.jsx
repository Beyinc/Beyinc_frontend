import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { reactionTypes } from "../../constants/reactions";

export default function ReactionButton({ postId, onReact }) {
    const [showMenu, setShowMenu] = useState(false);
    const [selected, setSelected] = useState(null);
    const timerRef = useRef(null);

    const handleSelect = (reaction) => {
        setSelected(reaction.type);
        setShowMenu(false);

        console.log(reaction)

        // Send to parent (API call)
        onReact(reaction.type, postId);
    };

    const handleMouseEnter = () => {
        clearTimeout(timerRef.current);
        setShowMenu(true);
    };

    const handleMouseLeave = () => {
        timerRef.current = setTimeout(() => {
            setShowMenu(false);
        }, 200);
    };

    return (
        <div className="relative inline-block select-none">
            {/* Main reaction button */}
            <button
                onClick={() => handleSelect({ type: "like" })}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="flex items-center gap-1 px-5 py-3 mr-1 rounded-md bg-white text-black border hover:bg-[#f5f5f5] text-base"
            >
                {selected ? (
                    reactionTypes
                        .filter((r) => r.type == selected)
                        .map((r) => (
                            <div
                                key={r.type}
                                onClick={() => handleSelect(r)}
                                className="text-blue-500 flex items-center justify-center gap-1"
                            >
                                {r.icon}
                                <span>{r.type}</span>
                            </div>
                        ))
                ) : (
                    <div>
                        <Icon icon="mdi:thumb-up" />
                        <span>Like</span>
                    </div>
                )}
            </button>

            {/* Hover reaction menu */}
            {showMenu && (
                <div
                    className="absolute left-0 -top-12 flex gap-3 bg-white shadow-lg px-3 py-2 rounded-full border z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {reactionTypes.map((r) => (
                        <div
                            key={r.type}
                            onClick={() => handleSelect(r)}
                            className="cursor-pointer hover:scale-125 transition-transform"
                        >
                            {r.icon}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
