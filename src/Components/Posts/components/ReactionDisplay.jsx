import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { reactionTypes } from "../../../constants/reactions";

// Reactions Modal Component
const ReactionsModal = ({ reactions, onClose }) => {
    console.log(reactions);
    const [activeTab, setActiveTab] = useState("all");

    const reactionCounts = reactions.reduce((acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
    }, {});

    const totalCount = reactions.length;
    const filteredReactions =
        activeTab === "all"
            ? reactions
            : reactions.filter((r) => r.type === activeTab);

    const getReactionConfig = (type) => {
        return reactionTypes.find((rt) => rt.type === type);
    };

    const formatTime = (date) => {
        const now = new Date();
        const diff = Math.floor((now - new Date(date)) / 1000);

        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
        return `${Math.floor(diff / 604800)}w`;
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Reactions</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors bg-transparent hover:bg-gray-100 p-1 rounded"
                    >
                        <Icon icon="mdi:close" className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex border-b overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`px-6 py-3 font-medium transition-colors whitespace-nowrap bg-white hover:bg-gray-50 ${
                            activeTab === "all"
                                ? "text-green-600 border-b-2 border-green-600"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        All {totalCount}
                    </button>
                    {reactionTypes.map((reaction) => {
                        const count = reactionCounts[reaction.type] || 0;
                        if (count === 0) return null;

                        return (
                            <button
                                key={reaction.type}
                                onClick={() => setActiveTab(reaction.type)}
                                className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 whitespace-nowrap bg-white hover:bg-gray-50 ${
                                    activeTab === reaction.type
                                        ? `${
                                              reaction.textColor
                                          } border-b-2 ${reaction.textColor.replace(
                                              "text-",
                                              "border-"
                                          )}`
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <span
                                    className={`w-6 h-6 ${reaction.color} rounded-full flex items-center justify-center`}
                                >
                                    <Icon
                                        icon={reaction.icon}
                                        className="w-4 h-4 text-white"
                                    />
                                </span>
                                {count}
                            </button>
                        );
                    })}
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredReactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <Icon
                                icon="mdi:emoticon-outline"
                                className="w-16 h-16 mb-2"
                            />
                            <p>No reactions yet</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredReactions.map((reaction) => {
                                const config = getReactionConfig(reaction.type);
                                return (
                                    <div
                                        key={reaction._id}
                                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={
                                                        reaction.user?.image
                                                            ?.url ||
                                                        "./profile.png"
                                                    }
                                                    alt={
                                                        reaction.user?.userName
                                                    }
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                                <div
                                                    className={`absolute -bottom-1 -right-1 w-5 h-5 ${config.color} rounded-full flex items-center justify-center border-2 border-white`}
                                                >
                                                    <Icon
                                                        icon={config.icon}
                                                        className="w-3 h-3 text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                                            {reaction.user
                                                                ?.userName ||
                                                                "Unknown User"}
                                                        </p>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {reaction.user
                                                                ?.role ||
                                                                "User"}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                                        {formatTime(
                                                            reaction.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main Reaction Display Component
export const ReactionDisplay = ({ reactions = [] }) => {
    const [showModal, setShowModal] = useState(false);

    if (!reactions || reactions.length === 0) {
        return null;
    }

    const totalCount = reactions.length;

    return (
        <>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                }}
                className="flex items-center gap-1.5 transition-all group bg-transparent hover:bg-gray-100 px-2 py-1 rounded"
            >
                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                    {totalCount} {totalCount === 1 ? "Reaction" : "Reactions"}
                </span>
            </button>

            {showModal && (
                <ReactionsModal
                    reactions={reactions}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};
