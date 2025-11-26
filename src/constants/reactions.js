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
