import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { reactionTypes } from "../../constants/reactions";

export default function ReactionButton({
    postId,
    onReact,
    userReaction = null,
    post,
}) {
    const [selected, setSelected] = useState(userReaction);
    const [showMenu, setShowMenu] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const timerRef = useRef(null);
    const debounceRef = useRef(null);
    const lastSentReactionRef = useRef(userReaction); 
    const pendingReactionRef = useRef(null); 

    useEffect(() => {
        if (!isProcessing) {
            setSelected(userReaction);
            lastSentReactionRef.current = userReaction;
        }
    }, [userReaction, isProcessing]);

    const handleSelect = (reaction) => {
        const newReaction = reaction.type;

        setSelected((prev) => (prev === newReaction ? null : newReaction));
        setShowMenu(false);

        pendingReactionRef.current = newReaction;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            setIsProcessing(true);

            try {
                const reactionToSend = pendingReactionRef.current;

                await onReact(reactionToSend, postId);

                lastSentReactionRef.current =
                    lastSentReactionRef.current === reactionToSend
                        ? null
                        : reactionToSend;
            } catch (error) {
                console.error("Failed to update reaction:", error);
                setSelected(lastSentReactionRef.current);
            } finally {
                setIsProcessing(false);
                pendingReactionRef.current = null;
            }
        }, 300);
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

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const selectedReaction = reactionTypes.find((r) => r.type === selected);

    return (
        <div className="relative inline-block select-none">
            {/* Main reaction button */}
            <button
                onClick={() =>
                    handleSelect({ type: selected ? selected : "like" })
                }
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={isProcessing}
                className={`flex items-center gap-1 px-5 py-3 mr-1 rounded-md bg-white text-black border hover:bg-[#f5f5f5] text-base transition-all ${
                    isProcessing ? "opacity-60 cursor-wait" : ""
                }`}
            >
                {selectedReaction ? (
                    <div
                        className={`${selectedReaction.textColor} flex items-center justify-center gap-1`}
                    >
                        <Icon
                            icon={selectedReaction.icon}
                            className="w-5 h-5"
                        />
                        <span className="capitalize">
                            {selectedReaction.label}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1">
                        <Icon icon="mdi:thumb-up" />
                        <span>Like</span>
                    </div>
                )}
            </button>

            {/* Hover reaction menu */}
            {showMenu && (
                <div
                    className="absolute left-0 -top-24 sm:-top-16 bg-white shadow-lg px-3 py-2 rounded-2xl border z-50 w-[90vw] sm:w-auto"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="grid grid-cols-5 sm:flex gap-2">
                        {reactionTypes.map((reaction) => (
                            <button
                                key={reaction.type}
                                onClick={() => handleSelect(reaction)}
                                className={`flex items-center justify-center size-8 sm:size-12 rounded-lg ${reaction.bg} ${reaction.hover} ${reaction.textColor} transition ring-1 ${reaction.ring}`}
                                title={reaction.label}
                            >
                                <Icon
                                    icon={reaction.icon}
                                    className="w-5 h-5 sm:size-4"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
