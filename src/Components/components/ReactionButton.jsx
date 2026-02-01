import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { reactionTypes } from "../../constants/reactions";

const LONG_PRESS_MS = 400;

export default function ReactionButton({
    postId,
    onReact,
    userReaction = null,
    post,
}) {
    // Check if user is authenticated
    const { _id: userId } = useSelector((state) => state.auth.userDetails || {});
    const isAuthenticated = Boolean(userId);
    const navigate = useNavigate();
    const [selected, setSelected] = useState(userReaction);
    const [showMenu, setShowMenu] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const timerRef = useRef(null);
    const debounceRef = useRef(null);
    const lastSentReactionRef = useRef(userReaction); 
    const pendingReactionRef = useRef(null);
    const longPressTimerRef = useRef(null);
    const longPressTriggeredRef = useRef(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isProcessing) {
            setSelected(userReaction);
            lastSentReactionRef.current = userReaction;
        }
    }, [userReaction, isProcessing]);

    const handleSelect = (reaction) => {
        // Redirect unauthenticated users to signup
        if (!isAuthenticated) {
            navigate("/signup");
            return;
        }

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

    // Long-press on touch devices to open reaction picker (mobile has no hover)
    const handleTouchStart = () => {
        longPressTriggeredRef.current = false;
        longPressTimerRef.current = setTimeout(() => {
            longPressTimerRef.current = null;
            longPressTriggeredRef.current = true;
            setShowMenu(true);
        }, LONG_PRESS_MS);
    };

    const handleTouchEnd = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    const handleTouchMove = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    const handleMainButtonClick = () => {
        if (!isAuthenticated) {
            navigate("/signup");
            return;
        }
        // If menu was just opened by long-press, don't toggle like (user wanted picker)
        if (longPressTriggeredRef.current) {
            longPressTriggeredRef.current = false;
            return;
        }
        handleSelect({ type: selected ? selected : "like" });
    };

    // Close menu when tapping outside (mobile: menu opened by long-press has no hover to close)
    useEffect(() => {
        if (!showMenu) return;
        const handlePointerDown = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [showMenu]);

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            if (timerRef.current) clearTimeout(timerRef.current);
            if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
        };
    }, []);

    const selectedReaction = reactionTypes.find((r) => r.type === selected);

    return (
        <div ref={containerRef} className="relative inline-block select-none">
            {/* Main reaction button - tap to like, long-press to open picker on mobile */}
            <button
                type="button"
                onClick={handleMainButtonClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onTouchCancel={handleTouchEnd}
                disabled={isProcessing}
                style={{ touchAction: "manipulation" }}
                className={`flex items-center gap-1 px-5 py-3 mr-1 rounded-md bg-white text-black border hover:bg-[#f5f5f5] text-base transition-all min-h-[44px] min-w-[44px] ${
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
                    className="absolute -top-40 sm:-top-16 bg-white shadow-lg px-3 py-2 rounded-2xl border z-50 w-[90vw] sm:w-auto"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="grid grid-cols-4 sm:flex gap-2">
                        {reactionTypes.map((reaction) => (
                            <button
                                key={reaction.type}
                                type="button"
                                onClick={() => handleSelect(reaction)}
                                style={{ touchAction: "manipulation" }}
                                className={`flex items-center justify-center min-w-[44px] min-h-[44px] sm:size-12 rounded-lg ${reaction.bg} ${reaction.hover} ${reaction.textColor} transition ring-1 ${reaction.ring}`}
                                title={reaction.label}
                            >
                                <Icon
                                    icon={reaction.icon}
                                    className="size-5 sm:size-4"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
