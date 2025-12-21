import moment from "moment"
import { ApiServices } from "./Services/ApiServices"
import { setToast } from "./redux/AuthReducers/AuthReducer"
import { ToastColors } from "./Components/Toast/ToastColors"

// export const socket_io = "https://beyinc-socket.onrender.com"
export const socket_io = process.env.REACT_APP_SOCKET_IO

export const categories = ["Co-founder", "Mentor", "Investor"]
export const domain_subdomain = {
    "Agriculture": [
        "Agriculture",
        "AgroTech",
        "Fruit & Veg",
        "Horticulture",
        "Forestry",
        "Aquaculture"
    ],
    "Business Services": [
        "Law",
        "Accounting",
        "Security",
        "Insurance",
        "Recruitment",
        "Translation",
        "Consultancy"
    ],
    "Education & Training": [
        "Education",
        "Training",
        "EdTech",
        "School",
        "University"
    ],
    "Energy & Environmental": [
        "Energy",
        "Mining",
        "Renewables",
        "GreenTech",
        "Oil & Gas",
        "Environmental"
    ],
    "Entertainment & Leisure": [
        "Sport",
        "Concerts",
        "Tourism",
        "Events",
        "Entertainment",
        "Gambling",
        "Art"
    ],
    "Fashion & Beauty": [
        "Cosmetics",
        "Clothing",
        "Salon",
        "Jewellery",
        "Fashion",
        "Textiles",
        "Beauty"
    ],
    "Finance": [
        "Finance",
        "Investment",
        "Cryptocurrency",
        "Trading",
        "FinTech",
        "Banking"
    ],
    "Food & Beverage": [
        "Food",
        "Beverage",
        "Alcohol",
        "Nutrition",
        "Organic"
    ],
    "Hospitality, Restaurants & Bars": [
        "Bars",
        "Restaurants",
        "Fast Food",
        "Hotels",
        "Cafes"
    ],
    "Manufacturing & Engineering": [
        "Manufacturing",
        "Engineering",
        "Prototyping",
        "3D Printing",
        "Chemicals",
        "Materials",
        "Machinery"
    ],
    "Media": [
        "Publishing",
        "Radio",
        "Film",
        "TV",
        "Music"
    ],
    "Medical & Services": [
        "MedTech",
        "Healthcare",
        "Pharma",
        "Biotech",
        "Medical"
    ],
    "Personal Services": [
        "Massage",
        "Spa",
        "Cleaning",
        "Gardening",
        "Laundry",
        "Pets"
    ],
    "Products & Innovation": [
        "Products",
        "Inventions",
        "Gadgets",
        "Patent",
        "Design"
    ],
    "Property": [
        "Property",
        "Construction",
        "Land",
        "Commercial Property",
        "Residential Property",
        "Property Services",
        "Warehousing"
    ],
    "Retail": [
        "Retail",
        "FMCG",
        "Shop",
        "Consumer",
        "Wholesale"
    ],
    "Sales & Marketing": [
        "Marketing",
        "Sales",
        "PR",
        "Advertising",
        "Digital Marketing"
    ],
    "Software": [
        "Software",
        "Ecommerce",
        "Apps",
        "Data",
        "SaaS",
        "Gaming",
        "Web"
    ],
    "Technology": [
        "Technology",
        "Robotics",
        "IT Hardware",
        "Telecom",
        "Mobile",
        "Electronics",
        "Computers"
    ],
    "Transportation": [
        "Transport",
        "Aerospace",
        "Logistics",
        "Automotive",
        "Marine",
        "Aviation"
    ]
}

export const stages = ['Pre-Startup/R&D', 'MVP/Finished Product', 'Achieving Sales', 'Breaking Even', 'Profitable', 'Other']
export const idealUserRole = ['User Role', 'Silent', 'Daily Involvement', 'Weekly Involvement', 'Monthly Involvement', 'Any']
export const allskills = [
    "Accounting",
    "Aerospace Engineering",
    "AgroTech",
    "AI Development",
    "Android Development",
    "Art",
    "Biotechnology",
    "Blockchain",
    "Chemistry",
    "Clean Energy",
    "Clothing Design",
    "Commercial Property Management",
    "Communication",
    "Computer Programming",
    "Consultancy",
    "Construction Management",
    "Consumer Goods",
    "Content Marketing",
    "Cryptocurrency",
    "Data Analysis",
    "Design Thinking",
    "Digital Marketing",
    "Ecommerce",
    "EdTech",
    "Electronics",
    "Energy",
    "Environmental Science",
    "Events Management",
    "Fashion Design",
    "Finance",
    "Financial Analysis",
    "Fintech",
    "Food and Beverage",
    "Frontend Development",
    "Full Stack Development",
    "Gaming",
    "GreenTech",
    "Healthcare",
    "Hospitality",
    "Information Technology",
    "Insurance",
    "Interior Design",
    "Investment",
    "iOS Development",
    "Java Programming",
    "JavaScript",
    "Jewelry Design",
    "Logistics",
    "Machine Learning",
    "Management Consulting",
    "Manufacturing",
    "Marine Engineering",
    "Marketing Strategy",
    "Material Science",
    "Mathematics",
    "Mechanical Engineering",
    "Medical Technology",
    "Mining",
    "Mobile App Development",
    "Music Composition",
    "Natural Language Processing",
    "Neural Networks",
    "Nutrition",
    "Oil & Gas",
    "Organic Farming",
    "Patent Law",
    "Pharmaceuticals",
    "Physics",
    "Product Design",
    "Project Management",
    "Prototyping",
    "Publishing",
    "Python Programming",
    "Real Estate",
    "Recruitment",
    "Renewable Energy",
    "Restaurants",
    "Robotics",
    "Ruby Programming",
    "Sales",
    "Security",
    "SEO",
    "Social Media Management",
    "Software Development",
    "Spa Services",
    "Sports Management",
    "Supply Chain Management",
    "Telecommunications",
    "Tourism",
    "Translation",
    "UI/UX Design",
    "Virtual Reality",
    "Web Development",
    "Wholesale",
    "3D Printing"
]

export const allsalutations = [
    "Dr", "Mr",
    "Mrs", "Miss"]

export const mentorcategories = [
    "Academia Mentor", "Industry Expert Mentor "]

export const allLanguages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Mandarin Chinese",
    "Hindi",
    "Arabic",
    "Russian",
    "Portuguese",
    "Bengali",
    "Urdu",
    "Indonesian",
    "Japanese",
    "Swahili",
    "Korean",
    "Italian",
    "Turkish",
    "Vietnamese",
    "Tamil",
    "Telugu",
    "Marathi",
    "Thai",
    "Dutch",
    "Greek",
    "Hebrew",
    "Czech",
    "Polish",
    "Swedish",
    "Finnish",
    "Norwegian",
    "Danish",
    "Hungarian",
    "Romanian",
    "Slovak",
    "Bulgarian",
    "Serbian",
    "Croatian",
    "Bosnian",
    "Slovenian",
    "Albanian",
    "Mongolian",
    "Mongolian",
    "Kazakh",
    "Uzbek",
    "Kyrgyz",
    "Turkmen",
    "Georgian",
    "Armenian",
    "Azerbaijani",
    "Persian",
    "Pashto",
    "Dari",
    "Kurdish",
    "Tajik",
    "Uighur",
    "Kazakh",
    "Kyrgyz",
    "Turkmen",
    "Mongolian",
    "Tibetan",
    "Burmese",
    "Karen",
    "Lao",
    "Khmer",
    "Hmong",
    "Malay",
    "Tagalog",
    "Bisaya",
    "Ilocano",
    "Waray",
    "Chamorro",
    "Palauan",
    "Marshallese",
    "Kiriwinan",
    "Nauruan",
    "Tok Pisin",
    "Hiri Motu",
    "Solomon Islands Pijin",
    "Bislama",
    "Fijian",
    "Samoan",
    "Tongan",
    "Maori",
    "Hawaiian",
    "Chamorro",
    "Chuukese",
    "Pohnpeian",
    "Yapese",
    "Marshallese"
]

export const itPositions = [
    'Lead', 'Freelancer',
    'CEO',
    'Co Founder',
    'Software Developer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile App Developer',
    'Web Developer',
    'DevOps Engineer',
    'System Administrator',
    'Network Administrator',
    'Database Administrator',
    'Quality Assurance (QA) Engineer',
    'Software Tester',
    'Business Analyst',
    'Product Manager',
    'Project Manager',
    'UI/UX Designer',
    'Data Scientist',
    'Data Analyst',
    'Machine Learning Engineer',
    'Artificial Intelligence (AI) Engineer',
    'Cloud Engineer',
    'Cloud Architect',
    'Cybersecurity Analyst',
    'Information Security Specialist',
    'IT Support Specialist',
    'IT Consultant',
    'Network Engineer',
    'Technical Writer',
    'Systems Analyst',
    'Technical Support Engineer',
    'Solution Architect',
    'IT Manager',
    'Chief Technology Officer (CTO)',
    'Chief Information Officer (CIO)',
    'Blockchain Developer',
    'Quantum Computing Engineer',
    'Game Developer',
    'Embedded Systems Engineer',
    'IT Trainer',
    'Robotics Engineer',
    'Virtual Reality (VR) Developer',
    'Augmented Reality (AR) Developer',
    'Data Engineer',
    'UI/UX Researcher',
    'IT Auditor',
    'IT Compliance Analyst',
    'ERP Consultant',
    'IT Recruiter',
    'Business Intelligence (BI) Developer',
    'Mobile Game Developer',
    'Frontend Architect',
    'Backend Architect',
    'Microservices Architect',
    'IT Procurement Specialist',
    'Health IT Specialist',
    'Geospatial Data Scientist',
    'Web Security Analyst',
    'Ethical Hacker',
    'Data Warehouse Architect',
    'Disaster Recovery Specialist',
    'Digital Marketing Technologist',
    'Financial Systems Analyst',
    'AR/VR Interaction Designer',
    'Geographic Information Systems (GIS) Analyst',
    'Wireless Communication Engineer',
    'System Integration Engineer',
    'IT Operations Manager',
    'Automation Engineer',
    'Chatbot Developer',
    'IT Compliance Manager',
    'Network Security Engineer',
    'Quantitative Analyst',
    'Digital Forensics Analyst',
    'Middleware Developer',
    'Business Process Analyst',
    'E-commerce Developer',
    'Linux System Administrator',
    'Information Systems Manager',
    'IT Project Coordinator',
    'Systems Engineer',
    'IT Security Consultant',
    'Mobile Solutions Architect',
    'Cloud Security Engineer',
    'IT Risk Analyst',
    'Technical Recruiter',
    'Software Configuration Manager',
    'Content Management System (CMS) Developer',
    'API Developer',
    'IT Business Continuity Planner',
    'Wireless Network Engineer',
    'Geotechnical Software Engineer',
    'Agile Coach',
    'Systems Integration Specialist',
    'Digital Transformation Consultant',
    'Big Data Engineer',
    'Customer Support Engineer',
];


export const convertToDate = (inputDate) => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const date = inputDate?.split('-')[1][0] == '0' ? inputDate?.split('-')[1][1] - 1 : inputDate?.split('-')[1] - 1
    return `${months[date]} ${inputDate?.split('-')[0]}`

}



export const postTypes = [
    { 'value': 'Idea Discussion', 'color': '#0d2c52' },
    { 'value': 'Co-founder Needed', 'color': '#af1dd8' },
    { 'value': 'Tech Partner Needed', 'color': '#60d441' },
    { 'value': 'Mentor Needed', 'color': '#9f1f04' },
    { 'value': 'General Post', 'color': '#05eb1b' },
    { 'value': 'Question and Answer', 'color': '#6920a9' },
    { 'value': 'Announcement', 'color': '#70b9d5' },
    { 'value': 'News', 'color': '#f14edf' },
    { 'value': 'Hiring', 'color': '#e1265d' },
    { 'value': 'Opportunities', 'color': '#5e8d7c' },
    { 'value': 'Investment', 'color': '#207b6a' }
]

export const INDUSTRY_EXPERTISE = {
  "Technology / Software": [
    "Backend Development",
    "Frontend Development",
    "Full Stack",
    "AI/ML",
    "DevOps",
    "Cloud Architecture",
    "Cybersecurity",
    "Mobile Development",
  ],
  Engineering: [
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Software Architecture",
    "Systems Design",
    "IoT",
    "Embedded Systems",
    "Automotive Engineering",
    "Electronics Engineering",
    "Robotics Engineering",
    "EV (Electric Vehicle) Technology",
    "Aerospace Engineering",
    "Chemical Engineering",
    "Biomedical Engineering",
    "Petroleum Engineering",
    "Environmental Engineering",
  ],
  Product: [
    "Product Strategy",
    "Product Roadmap",
    "User Research",
    "Product Launch",
    "Market Analysis",
    "Feature Prioritization",
    "Analytics",
    "Product Management",
  ],
  Finance: [
    "Financial Planning",
    "Investment Strategy",
    "Risk Management",
    "Portfolio Management",
    "Corporate Finance",
    "FP&A",
    "Treasury Management",
    "Mergers & Acquisitions",
  ],
  Marketing: [
    "Digital Marketing",
    "Content Strategy",
    "Brand Building",
    "Growth Hacking",
    "SEO/SEM",
    "Social Media Strategy",
    "Marketing Analytics",
    "Campaign Management",
  ],
  Legal: [
    "Contract Law",
    "Intellectual Property",
    "Corporate Law",
    "Compliance",
    "Litigation",
    "Regulatory Affairs",
    "Employment Law",
    "Privacy Law",
  ],
  "HR / Talent": [
    "Talent Acquisition",
    "Employee Development",
    "Compensation & Benefits",
    "Organizational Design",
    "Culture & Engagement",
    "Performance Management",
    "Learning & Development",
    "Labor Relations",
  ],
  Healthcare: [
    "Clinical Practice",
    "Healthcare Management",
    "Medical Research",
    "Health Policy",
    "Pharmaceuticals",
    "Medical Device",
    "Healthcare Technology",
    "Public Health",
  ],
  Manufacturing: [
    "Supply Chain",
    "Operations Management",
    "Quality Control",
    "Lean Manufacturing",
    "Automation",
    "Production Planning",
    "Maintenance Management",
    "Industrial Engineering",
  ],
  EdTech: [
    "Curriculum Design",
    "Learning Analytics",
    "Instructional Design",
    "EdTech Strategy",
    "Digital Learning",
    "Assessment Design",
    "Student Engagement",
    "EdTech Product",
  ],
  Consulting: [
    "Strategy Consulting",
    "Operations Consulting",
    "Digital Transformation",
    "Change Management",
    "Business Analysis",
    "Process Improvement",
    "Client Relations",
    "Project Management",
  ],
  SaaS: [
    "SaaS Product Strategy",
    "Customer Success",
    "Sales & Revenue",
    "SaaS Marketing",
    "Subscription Model",
    "Churn Reduction",
    "Pricing Strategy",
    "SaaS Operations",
  ],
  "E-commerce": [
    "E-commerce Strategy",
    "Conversion Optimization",
    "User Experience",
    "Inventory Management",
    "Logistics & Fulfillment",
    "Payment Processing",
    "Customer Retention",
    "Marketplace Management",
  ],
  "Mobility / Logistics": [
    "Supply Chain Optimization",
    "Fleet Management",
    "Route Optimization",
    "Warehouse Management",
    "Last-Mile Delivery",
    "Mobility Solutions",
    "Transportation",
    "Logistics Technology",
  ],
  "Real Estate": [
    "Real Estate Development",
    "Property Management",
    "Commercial Real Estate",
    "Residential Real Estate",
    "Real Estate Investment",
    "Valuation",
    "Real Estate Finance",
    "Urban Planning",
  ],
  "Web3 / AI": [
    "Blockchain Development",
    "Smart Contracts",
    "DeFi Strategy",
    "NFT Strategy",
    "AI Strategy",
    "Machine Learning",
    "Web3 Product",
    "Cryptocurrency",
  ],
}

export const ROLE_LEVELS = [
  "Entry Level",
  "Intermediate",
  "Senior / Lead",
  "Manager",
  "Director / Head",
  "VP",
  "CXO",
  "Researcher",
  "Senior Researcher / Research Lead",
  "Principal Researcher",
];

// January 15, 2024
export const MMDDYYFormat = (date) => {
    const formattedDate = moment(date).format('MMMM D, YYYY'); // "January 15, 2024"

    return formattedDate;
}


// gives in format 2024-jan-08
export const formatedDate = (inputDate) => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const date = inputDate?.split('-')[1][0] == '0' ? inputDate?.split('-')[1][1] - 1 : inputDate?.split('-')[1] - 1
    return `${inputDate?.split('-')[2].slice(0, 2)} ${months[date]} ${inputDate?.split('-')[0]}`

}

// fetch avg rating of user or pitch
export const fetchRating = (db) => {
    let avg = 0
    db.review?.length > 0 && db.review.map(fc => {
        avg += +fc.review
    })
    if (db.review?.length > 0) {
        avg = avg / db.review?.length;
    }
    return avg
}



export const userColor = {
    Admin: '0',
    Investor: 1,
    Mentor: 2,
    Entrepreneur: 3,
}



const heirarchy = {


    'Investor': 0,
    'Incubation_Cell': 1,
    'Individual/Entrepreneur': 1,
    'Accelerator': 2,
    'Mentor': 3,
    'Entrepreneur': 4,
    'Technology_Partner': 5,

};

// Function to check if a given role is the parent of another role
export function isParent(givenRole, childRole) {
    // console.log(givenRole, childRole);
    // console.log(heirarchy[givenRole] <= heirarchy[childRole]);
    if (heirarchy[givenRole] <= heirarchy[childRole]) {
        return true
    }

    return false
}


export function updateLastSeen() {
    // Get the current time using Moment.js
    var currentTime = moment();

    // Get the last seen time (replace this with your actual last seen time logic)
    var lastSeenTime = moment().subtract(2, 'minutes'); // Example: 2 minutes ago

    // Calculate the difference between current time and last seen time
    var timeDifference = currentTime.diff(lastSeenTime, 'minutes');

    // Display the last seen time in a user-friendly format
    var displayText = '';

    if (timeDifference < 1) {
        displayText = 'Online';
    } else if (timeDifference < 60) {
        displayText = timeDifference + ' minutes ago';
    } else if (timeDifference < 1440) {
        displayText = moment.duration(timeDifference, 'minutes').humanize();
    } else {
        displayText = lastSeenTime.format('MMM D, YYYY [at] h:mm A');
    }
    return displayText
}



export const dataEntry = [
    {
        id: 1,
        title: 'Individual/Entrepreneur',
        key: 'Individual/Entrepreneur',
        icon: 'mage:light-bulb',
        paragraph: 'Already started your entrepreneurial journey, either with an idea or a newly established business.',
    },
    {
        id: 2,
        title: 'Mentor',
        key: 'Mentor',
        icon: 'nimbus:university',
        paragraph: 'A person who shares their knowledge and experience to guide and support others.',
    },

    {
        id: 3,
        title: 'Startup',
        key: 'Startup',
        icon: 'material-symbols:rocket-launch-outline',
        paragraph: 'A company in early stages of development and looking to scale.',
    },
    {
        id: 4,
        title: 'Incubator',
        key: 'Incubator',
        icon: 'clarity:organization-line',
        paragraph: 'An organization that provides startups with workspace, mentorship, and resources.',
    },
    {
        id: 5,
        title: 'Accelerator',
        key: 'Accelerator',
        icon: 'material-symbols:speed-outline-rounded',
        paragraph: 'A program that helps startups grow rapidly through mentorship, funding and connections',
    },
    {
        id: 6,
        title: 'Individual Investor',
        key: 'IndividualInvestor',
        icon: 'fluent:building-bank-16-filled',
        paragraph: 'An individual who invest their own money in companies',
    },
    {
        id: 7,
        title: 'Institutional Investor',
        key: 'InstituteInvestor',
        icon: 'ph:building-apartment',
        paragraph: 'An organization that invest money on behalf of others, such as pension funds or insurance companies.',
    },
    {
        id: 8,
        title: 'Trade Bodies',
        key: 'TradeBody',
        icon: 'material-symbols:handshake-outline',
        paragraph: 'Organizations that represent the interests of businesses in a particular sector.',
    },
    {
        id: 9,
        title: 'Government body',
        key: 'GovernmentBody',
        icon: 'streamline:justice-hammer',
        paragraph: 'A department or agency of the government that supports startups.',
    },
    {
        id: 10,
        title: 'Corporate',
        key: 'Corporate',
        icon: 'material-symbols:corporate-fare-rounded',
        paragraph: 'A large company that invests in or partners with startups.',
    },
    {
        id: 11,
        title: 'Technology partner',
        key: 'TechPartner',
        icon: 'material-symbols:laptop-mac-outline',
        paragraph: 'A company that provides technology or services to startups.',
    },
]

export const followerController = async ({ e, user, socket, recommendedUserTrigger, setRecommendedUserTrigger, dispatch, followingToId, setRecommendedUsers }) => {
    if (!user.id) {
        console.log('user :', user);
        throw new Error("Invalid user ");
    }
    if (setRecommendedUsers) {
        setRecommendedUsers(prev => Array.isArray(prev) ? prev.filter(u => u._id !== followingToId) : prev)
    }
    
    await ApiServices.saveFollowers({
        followerReqBy: user.id,
        followerReqTo: followingToId,
    })
        .then((res) => {
            if (res.data.followers.map((f) => f._id).includes(user.id)) {
                socket.current.emit("sendNotification", {
                    senderId: user.id,
                    receiverId: followingToId,
                });
                socket.current.emit("sendFollowerNotification", {
                    senderId: user.id,
                    receiverId: followingToId,
                    type: "adding",
                    image: user.image,
                    role: user.role,
                    _id: followingToId,
                    userName: user.userName,
                });
            } else {
                socket.current.emit("sendFollowerNotification", {
                    senderId: user.id,
                    receiverId: followingToId,
                    type: "removing",
                    _id: followingToId,
                });
            }
            setRecommendedUserTrigger(!recommendedUserTrigger);
        })
        .catch((err) => {
            dispatch(
                setToast({
                    message: "Error in update status",
                    bgColor: ToastColors.failure,
                    visible: "yes",
                })
            );
        });
    e.target.disabled = false;
};



export function convertCamelToNormalCapitalized(
    camelCaseString
) {
    // Split the camelCase string into words
    const words = camelCaseString
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(/[\s_]+/);

    // Capitalize each word
    const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );

    // Join the capitalized words to form the normal capitalized string
    const normalCapitalizedString = capitalizedWords.join(" ");

    return normalCapitalizedString;
}

