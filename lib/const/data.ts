import { Calendar, Clock, LinkIcon, Settings, Share2, Zap } from "lucide-react";

export const features = [
    {
        icon: Calendar,
        title: "Create Events",
        description: "Easily set up and customize your event types",
    },
    {
        icon: Clock,
        title: "Manage Availability",
        description: "Define your availability to streamline scheduling",
    },
    {
        icon: LinkIcon,
        title: "Custom Links",
        description: "Share your personalized scheduling link",
    },
];

// export const howItWorks = [
//     { step: "Sign Up", description: "Create your free TimelyMeet account" },
//     {
//         step: "Set Availability",
//         description: "Define when you're available for meetings",
//     },
//     {
//         step: "Share Your Link",
//         description: "Send your scheduling link to clients or colleagues",
//     },
//     {
//         step: "Get Booked",
//         description: "Receive confirmations for new appointments automatically",
//     },
// ];

export const workflowSteps = [
    {
        id: 1,
        title: "Set Your Availability",
        description: "Define when you're free with flexible time blocks and preferences",
        icon: Settings,
        color: "from-blue-500 to-cyan-500",
        details: "Smart calendar integration syncs your existing schedule automatically",
    },
    {
        id: 2,
        title: "Create Event Types",
        description: "Design different meeting types with custom durations and settings",
        icon: Calendar,
        color: "from-purple-500 to-pink-500",
        details: "15-min coffee chats to 2-hour strategy sessions - you control it all",
    },
    {
        id: 3,
        title: "Share Your Link",
        description: "Send your personalized booking link via email, social, or embed it",
        icon: Share2,
        color: "from-green-500 to-emerald-500",
        details: "Beautiful branded booking pages that reflect your professional image",
    },
    {
        id: 4,
        title: "Get Booked Seamlessly",
        description: "Automatic confirmations, reminders, and calendar invites handle the rest",
        icon: Zap,
        color: "from-orange-500 to-red-500",
        details: "Zero back-and-forth emails. Just smooth, professional scheduling",
    },
]

export const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Marketing Manager",
        content:
            "TimelyMeet has transformed how I manage my team's meetings. It's intuitive and saves us hours every week!",
        image: "/images/testi_4.png",
    },
    {
        name: "David Lee",
        role: "Freelance Designer",
        content:
            "As a freelancer, TimelyMeet helps me stay organized and professional. My clients love how easy it is to book time with me.",
        image: "/images/testi_4.png",
    },
    {
        name: "Emily Chen",
        role: "Startup Founder",
        content:
            "TimelyMeet streamlined our hiring process. Setting up interviews has never been easier!",
        image: "/images/testi_4.png",
    },
    {
        name: "Michael Brown",
        role: "Sales Executive",
        content:
            "I've seen a 30% increase in my meeting bookings since using TimelyMeet. It's a game-changer for sales professionals.",
        image: "/images/testi_4.png",
    },
];