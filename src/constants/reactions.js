import { Icon } from "@iconify/react";

export const reactionTypes = [
    {
        type: "like",
        icon: <Icon icon="mdi:thumb-up" />,
        stateKey: "likes",
    },
    {
        type: "innovative",
        icon: <Icon icon="mdi:lightbulb-on-outline" />,
        stateKey: "innovative",
    },
    {
        type: "unique",
        icon: <Icon icon="mdi:sparkles" />,
        stateKey: "unique",
    },
];


// export const reactionTypes = [
//     {
//         type: "like",
//         icon: "mdi:thumb-up",
//         color: "bg-blue-500",
//         textColor: "text-blue-600",
//         hoverColor: "hover:bg-blue-50",
//         label: "Like",
//     },
//     {
//         type: "innovative",
//         icon: "mdi:lightbulb-on-outline",
//         color: "bg-green-500",
//         textColor: "text-green-600",
//         hoverColor: "hover:bg-green-50",
//         label: "Innovative",
//     },
//     {
//         type: "unique",
//         icon: "mdi:sparkles",
//         color: "bg-purple-500",
//         textColor: "text-purple-600",
//         hoverColor: "hover:bg-purple-50",
//         label: "Unique",
//     },
// ];
