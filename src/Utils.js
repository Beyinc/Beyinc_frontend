import moment from "moment"

// export const socket_io = "https://beyinc-socket.onrender.com"
export const socket_io = process.env.REACT_APP_SOCKET_IO

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


    Investor: 0,
    Incubation_Cell: 1,
    Accelerator: 2,
    Mentor: 3,
    Entrepreneur: 4,
    Technology_Partner: 5,

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



