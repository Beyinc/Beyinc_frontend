// // import React, { useEffect, useState } from "react";
// // import BoxCategories from "./BoxCategories";
// // import {
// //   allskills,
// //   dataEntry,
// // } from "../../Utils";
// // import { useSelector } from "react-redux";
// // import { ApiServices } from "../../Services/ApiServices";

// // const EntryDetails = () => {
// //   const { email, user_id } = useSelector((store) => store.auth.loginDetails);

// //   // State for form inputs
// //   const [selectedCategory, setSelectedCategory] = useState("");
// //   const [username, setUsername] = useState("");
// //   const [headline, setHeadline] = useState("");
// //   const [skills, setSkills] = useState([]); // Array to store selected skills
// //   const [image, setImage] = useState(null);
// //   const [interests, setInterests] = useState([]);

// //   // Handler for BoxCategories to get the selected category (item.title)
// //   const onCategoryClick = (title) => {
// //     setSelectedCategory(title); // Set selected category on click
// //   };

// //   // Function to handle the username input
// //   const handleUsernameChange = (e) => {
// //     setUsername(e.target.value);
// //   };

// //   // Function to handle the headline input
// //   const handleHeadlineChange = (e) => {
// //     setHeadline(e.target.value);
// //   };

// //   // Function to handle image input
// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0]; // Get the first selected image
// //     if (file) {
// //       // Check if a file was selected
// //       if (file.size > 4 * 1024 * 1024) {
// //         alert(
// //           `File size should be less than ${
// //             (4 * 1024 * 1024) / (1024 * 1024)
// //           } MB.`
// //         );
// //         e.target.value = null; // Clear the selected file
// //         return;
// //       }
// //       setFileBase(file); // Convert to Base64
// //     }
// //   };

// //   // Function to convert the file to Base64
// //   const setFileBase = (file) => {
// //     const reader = new FileReader();
// //     reader.readAsDataURL(file);
// //     reader.onloadend = () => {
// //       setImage(reader.result); // Store the Base64 string in state
// //     };
// //   };

// //   // Function to handle interest selection
// //   const handleInterestChange = (e) => {
// //     const selectedInterest = e.target.value;
// //     if (interests.includes(selectedInterest)) {
// //       setInterests(
// //         interests.filter((interest) => interest !== selectedInterest)
// //       );
// //     } else {
// //       if (interests.length < 5) {
// //         setInterests([...interests, selectedInterest]);
// //       } else {
// //         alert("You can only select up to 5 interests.");
// //       }
// //     }
// //   };

// //   // Function to handle skill selection
// //   const handleSkillChange = (e) => {
// //     const selectedSkill = e.target.value;
// //     if (skills.includes(selectedSkill)) {
// //       // If the skill is already selected, remove it
// //       setSkills(skills.filter((skill) => skill !== selectedSkill));
// //     } else {
// //       // Otherwise, add the new skill to the array
// //       if (skills.length < 5) {
// //         setSkills([...skills, selectedSkill]);
// //       } else {
// //         alert("You can only select up to 5 skills.");
// //       }
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!selectedCategory || !username || !skills || skills.length === 0) {
// //       alert(
// //         "Please fill in the required fields: Category, Username, and Skills."
// //       );
// //       return;
// //     }

// //     console.log(selectedCategory, username, headline, skills, interests, image);
// //     try {
// //       await ApiServices.updateuserProfileImage({
// //         userId: user_id,
// //         image: image,
// //         email: email,
// //       });
// //     } catch (error) {
// //       console.log("error saving image");
// //       console.log(error);
// //     }

// //     try {
// //       await ApiServices.InputEntryData({
// //         username,
// //         headline,
// //         skills,
// //         interests,
// //         selectedCategory,
// //       });
// //       alert("Data saved successfully!");
// //       window.location.href = "/posts";
// //     } catch (error) {
// //       console.error("Error saving data:", error);
// //       alert("There was an error saving your data. Please try again.");
// //     }
// //   };

// //   useEffect(()=>{
// // // console.log(dataEntry);
// //   },[])
// //   return (
// //     // bg-customWhite
// //     <div className="bg-customWhite md:my-5 md:mx-20 shadow-[0_3px_12px_rgba(0,0,0,0.1)]">
// //       <div className="flex flex-col py-4 md:py-10 md:px-20">
// //         <h2 className="font-bold md:mb-5 pl-6">Tell us who you are?* </h2>
// //         <BoxCategories
// //           onCategoryClick={onCategoryClick}
// //           selectedCategory={selectedCategory}
// //         />
// //         <h2 className="font-bold md:mb-5 pl-6 mt-5 md:mt-11"  hidden={selectedCategory=="Mentor"}>Name*</h2>
// //         <input
// //           type="text"
// //           className="ml-6 w-9 md:w-[840px] h-[20px] p-2 border-2 border-gray-400 rounded-md focus:border-gray-600 outline-none"
// //           placeholder="Enter your user name"
// //           value={username}
// //           onChange={handleUsernameChange}
// //           hidden={selectedCategory=="Mentor"}
// //         />

// //         <div className="flex flex-col md:flex-row pl-6 mt-3 md:mt-11 md:mb-5"  hidden={selectedCategory=="Mentor"}>
// //           <h2 className="font-bold">Domain*</h2>
// //           <span className="md:ml-2">(Choose up to 5 )</span>
// //         </div>
// //         <div>
// //           <select
// //             name="skill"
// //             className="ml-6 w-[840px] h-[45px] p-2 border-2 border-gray-400 rounded-md focus:border-gray-600 focus:outline-none focus:ring-0"
// //             onChange={handleSkillChange}
// //              hidden={selectedCategory=="Mentor"}
// //           >
// //             <option className="w-[840px]" value="">
// //               Select
// //             </option>
// //             {allskills.map((skill) => (
// //               <option className="w-[840px]" key={skill} value={skill}>
// //                 {skill}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //         <div className="flex flex-row space-x-2 ml-10 mt-5">
// //           {skills?.map((t, i) => (
// //             <div
// //               className="p-[10px] rounded-[10px] font-roboto text-[14px] bg-lightPurple text-customPurple"
// //               key={i}
// //             >
// //               {t}
// //             </div>
// //           ))}
// //         </div>

// //         <h2 className="font-bold md:mb-5 pl-6 mt-3 md:mt-11"  hidden={selectedCategory=="Mentor"}>Headline</h2>
// //         <input
// //           type="text"
// //           className="ml-6 w-[840px] h-[20px] p-2 border-2 border-gray-400 rounded-md focus:border-gray-600 outline-none"
// //           placeholder="Enter your headline"
// //           value={headline}
// //           onChange={handleHeadlineChange}
// //            hidden={selectedCategory=="Mentor"}
// //         />

// //         <h2 className="font-bold md:mb-5 pl-6 mt-3 md:mt-11">Profile Image</h2>
// //         <input
// //           type="file"
// //           accept="image/*"
// //           className="ml-6 w-[840px] h-[20px] mb-4 p-2 border-2 border-gray-400 rounded-md focus:border-gray-600 outline-none"
// //           onChange={handleImageChange}
// //         />

// //         <div className="flex flex-col md:flex-row pl-6 mt-3 md:mt-11 md:mb-5"  hidden={selectedCategory=="Mentor"}>
// //           <h2 className="font-bold">Choose your interest</h2>
// //           <span className="md:ml-2">(Maximum 5 selections)</span>
// //         </div>
// //         <div className="flex flex-col md:flex-row flex-wrap mt-4 ml-6">
// //           {dataEntry.map((entry) => (
// //             <label
// //               key={entry.key}
// //               className="flex items-center mr-4 mb-2 text-xl font-normal"                  hidden={selectedCategory=="Mentor"}

// //             >
// //               <input
// //                 type="checkbox"
// //                 value={entry.key}
// //                 checked={interests.includes(entry.key)}
// //                 className="mr-2 accent-blue-600" // Change accent color as needed
// //                 onChange={handleInterestChange}
// //               />
// //               {entry.title}
// //             </label>
// //           ))}
// //         </div>
// //         <div className="mx-auto mt-5 md:mt-20 flex flex-row space-x-9">
// //           {/* <button
// //             type="button"
// //             className="flex items-center justify-center h-14 w-36 text-lg text-[#4f55c7] bg-[#4f55c7] px-1 rounded-full"
// //           >
// //             <div className=" py-3 flex items-center justify-center rounded-full bg-white h-full w-full">
// //               Save
// //             </div>
// //           </button> */}

// //           <button
// //             type="button"
// //             className="h-14 w-36 text-lg border-2 border-[#4f55c7] px-2 py-3 rounded-full"
// //             onClick={handleSubmit}
// //           >
// //             Submit
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EntryDetails;

// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import BoxCategories from "./BoxCategories";
// import { allskills, dataEntry } from "../../Utils";
// import { ApiServices } from "../../Services/ApiServices";

// const ROLE_LEVELS = [
//   "Entry Level",
//   "Intermediate",
//   "Senior / Lead",
//   "Manager",
//   "Director / Head",
//   "VP",
//   "CXO",
//   "Researcher",
//   "Senior Researcher / Research Lead",
//   "Principal Researcher",
// ];



// const EntryDetails = () => {

// // const [step, setStep] = useState(1);
//   const [completed, setCompleted] = useState(false);

//   // 🔹 Step 1 – Profile Type & Skills
//   const [selectedProfileType, setSelectedProfileType] = useState("");
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [skillSearch, setSkillSearch] = useState("");

//   // 🔹 Mentor Flow (Steps 2 & 3)
//   // const [roleLevel, setRoleLevel] = useState("");
//   const [companyStage, setCompanyStage] = useState("");

//   const [selectedIndustries, setSelectedIndustries] = useState([]);
//   const [selectedExpertise, setSelectedExpertise] = useState([]);

//   const [expandedIndustries, setExpandedIndustries] = useState({});
//   const [customExpertise, setCustomExpertise] = useState({});
//   const [showOtherInput, setShowOtherInput] = useState({});

//   // 🔹 Service Partner Flow
//   const [servicePartnerType, setServicePartnerType] = useState("individual");
//   const [teamSize, setTeamSize] = useState("");
//   const [foundedYear, setFoundedYear] = useState("");
//   const [minProjectPrice, setMinProjectPrice] = useState("");

//   // 🔹 Startup Flow
//   const [startupName, setStartupName] = useState("");
//   const [startupTagline, setStartupTagline] = useState("");
//   const [founderName, setFounderName] = useState("");
//   const [startupEmail, setStartupEmail] = useState("");

//   const [visibilityMode, setVisibilityMode] = useState("");
//   const [startupStage, setStartupStage] = useState("");
//   const [startupTeamSize, setStartupTeamSize] = useState("");

//   const [selectedStartupIndustries, setSelectedStartupIndustries] = useState([]);
//   const [targetMarket, setTargetMarket] = useState("");

//   const { email, user_id } = useSelector((store) => store.auth.loginDetails);

//   const [step, setStep] = useState(1);

//   // Common
//   const [selectedCategory, setSelectedCategory] = useState("");

//   // Mentor flow
//   const [roleLevel, setRoleLevel] = useState("");
//   const [skills, setSkills] = useState([]);

//   // Non-mentor flow
//   const [username, setUsername] = useState("");
//   const [headline, setHeadline] = useState("");
//   const [interests, setInterests] = useState([]);

//   // Image
//   const [image, setImage] = useState(null);
//   const toggleIndustry = (industry) => {
//   setExpandedIndustries((prev) => ({
//     ...prev,
//     [industry]: !prev[industry],
//   }));
// };

// const handleExpertiseToggle = (industry, expertise) => {
//   setSelectedExpertise((prev) => {
//     const current = prev[industry] || [];

//     if (current.includes(expertise)) {
//       return {
//         ...prev,
//         [industry]: current.filter((e) => e !== expertise),
//       };
//     }

//     return {
//       ...prev,
//       [industry]: [...current, expertise],
//     };
//   });
// };

// const handleAddCustomExpertise = (industry) => {
//   const value = customExpertise[industry]?.trim();
//   if (!value) return;

//   setSelectedExpertise((prev) => ({
//     ...prev,
//     [industry]: [...(prev[industry] || []), value],
//   }));

//   setCustomExpertise((prev) => ({
//     ...prev,
//     [industry]: "",
//   }));

//   setShowOtherInput((prev) => ({
//     ...prev,
//     [industry]: false,
//   }));
// };

//   /* ------------------ Handlers ------------------ */

//   const onCategoryClick = (title) => {
//     setSelectedCategory(title);
//     setStep(title === "Mentor" ? 2 : 1);
//   };

//   const handleSkillToggle = (skill) => {
//     if (skills.includes(skill)) {
//       setSkills(skills.filter((s) => s !== skill));
//     } else if (skills.length < 5) {
//       setSkills([...skills, skill]);
//     }
//   };

//   const handleInterestToggle = (value) => {
//     if (interests.includes(value)) {
//       setInterests(interests.filter((i) => i !== value));
//     } else if (interests.length < 5) {
//       setInterests([...interests, value]);
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (file.size > 4 * 1024 * 1024) {
//       alert("Image must be under 4MB");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => setImage(reader.result);
//     reader.readAsDataURL(file);
//   };

//   /* ------------------ Submit ------------------ */

//   const handleSubmit = async () => {
//     try {
//       if (image) {
//         await ApiServices.updateuserProfileImage({
//           userId: user_id,
//           image,
//           email,
//         });
//       }

//       await ApiServices.InputEntryData({
//         username,
//         headline,
//         skills,
//         interests,
//         selectedCategory,
//         roleLevel,
//       });

//       alert("Profile created successfully!");
//       window.location.href = "/posts";
//     } catch (err) {
//       alert("Something went wrong");
//       console.error(err);
//     }
//   };

//   /* ------------------ UI ------------------ */

//   return (
//     <div className="bg-customWhite md:m-10 p-6 shadow-lg">
//       <h2 className="font-bold text-xl mb-6">Tell us who you are *</h2>

//       {/* STEP 1 — CATEGORY */}
//       {step === 1 && (
//         <>
//           <BoxCategories
//             onCategoryClick={onCategoryClick}
//             selectedCategory={selectedCategory}
//           />

//           {selectedCategory && selectedCategory !== "Mentor" && (
//             <>
//               <input
//                 className="mt-6 w-full border p-2"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />

//               <input
//                 className="mt-4 w-full border p-2"
//                 placeholder="Headline"
//                 value={headline}
//                 onChange={(e) => setHeadline(e.target.value)}
//               />

//               <h3 className="mt-6 font-semibold">Skills (max 5)</h3>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {allskills.map((skill) => (
//                   <button
//                     key={skill}
//                     onClick={() => handleSkillToggle(skill)}
//                     className={`px-3 py-1 rounded ${
//                       skills.includes(skill)
//                         ? "bg-blue-600 text-white"
//                         : "bg-gray-200"
//                     }`}
//                   >
//                     {skill}
//                   </button>
//                 ))}
//               </div>

//               <h3 className="mt-6 font-semibold">Interests</h3>
//               {dataEntry.map((item) => (
//                 <label key={item.key} className="block">
//                   <input
//                     type="checkbox"
//                     checked={interests.includes(item.key)}
//                     onChange={() => handleInterestToggle(item.key)}
//                   />
//                   <span className="ml-2">{item.title}</span>
//                 </label>
//               ))}

//               <h3 className="mt-6 font-semibold">Profile Image</h3>
//               <input type="file" onChange={handleImageChange} />

//               <button
//                 className="mt-8 bg-blue-600 text-white px-6 py-2 rounded"
//                 onClick={handleSubmit}
//               >
//                 Submit
//               </button>
//             </>
//           )}
//         </>
//       )}

//       {/* STEP 2 — MENTOR ROLE */}
//       {step === 2 && selectedCategory === "Mentor" && (
//         <>
//           <h3 className="font-semibold mb-4">Select your role</h3>
//         <div className="grid grid-cols-3 gap-3 border-2 rounded-lg p-4"
//         >
//  {ROLE_LEVELS.map((role) => (
//   <div
//     key={role}
//     onClick={() => setRoleLevel(role)}
//     role="button"
//     tabIndex={0}
//     className={`cursor-pointer select-none text-center
//       p-3 rounded-lg border-2 transition-all duration-200
//       ${
//         roleLevel === role
//           ? "border-blue-600 bg-blue-500 text-white shadow-md"
//           : "border-gray-400 bg-white text-black hover:border-blue-400"
//       }
//     `}
//     style={{ border: "1px solid gray", padding: "20px" }}
//   >
//     {role}
//   </div>
// ))}

// </div>

//           <button
//             disabled={!roleLevel}
//             className="mt-6 bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
//             onClick={() => setStep(3)}
//           >
//             Next
//           </button>
//         </>
//       )}

//       {/* STEP 3 — MENTOR SKILLS */}
//       {/* {step === 3 && selectedCategory === "Mentor" && (
//         <>
//           <h3 className="font-semibold mb-4">Select Expertise (max 5)</h3>
//           <div className="flex flex-wrap gap-2">
//             {allskills.map((skill) => (
//               <button
//                 key={skill}
//                 onClick={() => handleSkillToggle(skill)}
//                 className={`px-3 py-1 rounded ${
//                   skills.includes(skill)
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200"
//                 }`}
//               >
//                 {skill}
//               </button>
//             ))}
//           </div>

//           <h3 className="mt-6 font-semibold">Profile Image</h3>
//           <input type="file" onChange={handleImageChange} />

//           <button
//             disabled={skills.length === 0}
//             className="mt-8 bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
//             onClick={handleSubmit}
//           >
//             Submit
//           </button>
//         </>
//       )} */}
//       {step === 3 && selectedProfileType === "mentor" && (
//   <div>
//     <h2 className="text-2xl font-bold text-slate-900 mb-2">
//       Select your industry and expertise
//     </h2>

//     <p className="text-slate-600 mb-8">
//       Click on an industry to expand and select expertise areas.
//       Industries will be automatically selected based on your choices.
//     </p>

//     <div className="space-y-3">
//       {Object.entries(INDUSTRY_EXPERTISE).map(([industry, skills]) => {
//         const isExpanded = expandedIndustries[industry];
//         const hasSelectedExpertise = skills.some((skill) =>
//           selectedExpertise.includes(skill)
//         );

//         return (
//           <div
//             key={industry}
//             className={`border-2 rounded-lg transition-all ${
//               isExpanded
//                 ? "border-blue-600 shadow-md bg-blue-50/30"
//                 : "border-slate-200 hover:border-slate-300 bg-white"
//             }`}
//           >
//             {/* INDUSTRY HEADER */}
//             <div
//               onClick={() => toggleIndustry(industry)}
//               className="w-full px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 rounded-lg transition-colors"
//             >
//               <div className="flex items-center gap-3">
//                 {/* CHECKBOX */}
//                 <div
//                   onClick={(e) => {
//                     e.stopPropagation();

//                     if (selectedIndustries.includes(industry)) {
//                       const industrySkills = INDUSTRY_EXPERTISE[industry] || [];
//                       setSelectedExpertise(
//                         selectedExpertise.filter(
//                           (exp) => !industrySkills.includes(exp)
//                         )
//                       );
//                       setSelectedIndustries(
//                         selectedIndustries.filter((i) => i !== industry)
//                       );
//                     } else {
//                       setSelectedIndustries([
//                         ...selectedIndustries,
//                         industry,
//                       ]);
//                     }
//                   }}
//                   className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
//                     selectedIndustries.includes(industry)
//                       ? "bg-blue-600 border-blue-600"
//                       : "border-slate-300"
//                   }`}
//                 >
//                   {selectedIndustries.includes(industry) && (
//                     <span className="text-white text-sm">✓</span>
//                   )}
//                 </div>

//                 <h3 className="font-semibold text-slate-900 text-lg">
//                   {industry}
//                 </h3>

//                 {hasSelectedExpertise && (
//                   <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
//                     {
//                       skills.filter((skill) =>
//                         selectedExpertise.includes(skill)
//                       ).length
//                     }{" "}
//                     selected
//                   </span>
//                 )}
//               </div>

//               <span className="text-slate-600 text-xl">
//                 {isExpanded ? "▲" : "▼"}
//               </span>
//             </div>

//             {/* EXPERTISE GRID */}
//             {isExpanded && (
//               <div className="px-5 pb-5 pt-2 border-t border-slate-200 mt-2">
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
//                   {skills.map((skill) => (
//                     <div
//                       key={skill}
//                       onClick={() => handleExpertiseToggle(skill, industry)}
//                       className={`cursor-pointer px-4 py-3 rounded-lg font-medium transition-all text-sm border-2 ${
//                         selectedExpertise.includes(skill)
//                           ? "bg-blue-600 text-white border-blue-600 shadow-md"
//                           : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span>{skill}</span>
//                         {selectedExpertise.includes(skill) && (
//                           <span className="text-white">✓</span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* ADD CUSTOM EXPERTISE */}
//                 <div className="flex items-center gap-3">
//                   <div
//                     onClick={() =>
//                       setShowOtherInput({
//                         ...showOtherInput,
//                         [industry]: true,
//                       })
//                     }
//                     className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-all text-sm border-2 border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
//                   >
//                     + Add Custom Expertise
//                   </div>

//                   {showOtherInput[industry] && (
//                     <div className="flex items-center gap-2 flex-1">
//                       <input
//                         type="text"
//                         value={customExpertise[industry] || ""}
//                         onChange={(e) =>
//                           setCustomExpertise({
//                             ...customExpertise,
//                             [industry]: e.target.value,
//                           })
//                         }
//                         placeholder="Enter custom expertise..."
//                         className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-blue-600"
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") {
//                             handleAddCustomExpertise(
//                               industry,
//                               customExpertise[industry] || ""
//                             );
//                           }
//                         }}
//                       />

//                       <div
//                         onClick={() =>
//                           handleAddCustomExpertise(
//                             industry,
//                             customExpertise[industry] || ""
//                           )
//                         }
//                         className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-all text-sm bg-blue-600 text-white hover:bg-blue-700"
//                       >
//                         Add
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>

//     {/* SUMMARY */}
//     <div className="mt-8 p-4 bg-blue-50 rounded-lg">
//       <p className="text-sm text-blue-700 font-semibold">
//         Selected: {selectedExpertise.length} expertise area
//         {selectedExpertise.length !== 1 ? "s" : ""} across{" "}
//         {selectedIndustries.length} industrie
//         {selectedIndustries.length !== 1 ? "s" : ""}
//       </p>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// export default EntryDetails;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import BoxCategories from "./BoxCategories";
import { allskills, dataEntry } from "../../Utils";
import { ApiServices } from "../../Services/ApiServices";
import { INDUSTRY_EXPERTISE } from "../../Utils";
import { ROLE_LEVELS } from "../../Utils";
import { COMPANY_STAGES } from "../../Utils";
import { CheckCircle2 } from "lucide-react";
import Startup from "../OnboardComponents/Startup";
/* ------------------ CONSTANTS ------------------ */

// export const INDUSTRY_EXPERTISE = {
//   "Technology / Software": [
//     "Backend Development",
//     "Frontend Development",
//     "Full Stack",
//     "AI/ML",
//     "DevOps",
//     "Cloud Architecture",
//     "Cybersecurity",
//     "Mobile Development",
//   ],
//   Engineering: [
//     "Mechanical Engineering",
//     "Electrical Engineering",
//     "Civil Engineering",
//     "Software Architecture",
//     "Systems Design",
//     "IoT",
//     "Embedded Systems",
//   ],
//   Product: [
//     "Product Strategy",
//     "Product Roadmap",
//     "User Research",
//     "Product Launch",
//     "Market Analysis",
//   ],
//   Marketing: [
//     "Digital Marketing",
//     "SEO",
//     "Content Strategy",
//     "Brand Building",
//     "Growth Hacking",
//   ],
// };

/* ------------------ COMPONENT ------------------ */

const EntryDetails = () => {
  // const loginDetails = useSelector((store) => store.auth.loginDetails);
  // const email = loginDetails?.email;
  // const user_id = loginDetails?.user_id;

  /* -------- COMMON -------- */
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  /* -------- NON-MENTOR -------- */
  const [username, setUsername] = useState("");
  const [headline, setHeadline] = useState("");
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);

  /* -------- IMAGE -------- */
  const [image, setImage] = useState(null);

  /* -------- MENTOR -------- */
  const [roleLevel, setRoleLevel] = useState("");
  const [expandedIndustries, setExpandedIndustries] = useState({});
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState({});
  const [customExpertise, setCustomExpertise] = useState({});
  const [showOtherInput, setShowOtherInput] = useState({});
  const [companyStage, setCompanyStage] = useState("");
  /* ------------------ HANDLERS ------------------ */

  const loginDetails = useSelector((store) => store.auth.loginDetails);

  const [email, setEmail] = useState(null);
  const [user_id, setUserId] = useState(null);

  useEffect(() => {
    if (loginDetails?.email && loginDetails?.user_id) {
      setEmail(loginDetails.email);
      setUserId(loginDetails.user_id);
    }
  }, [loginDetails]);

  const onCategoryClick = (title) => {
    setSelectedCategory(title);
  };

  const totalSteps =
    selectedCategory === "Mentor" || selectedCategory === "Startup" ? 3 : 1;
  const progressPercentage = (step / totalSteps) * 100;

  const handleSkillToggle = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else if (skills.length < 5) {
      setSkills([...skills, skill]);
    }
  };

  const handleInterestToggle = (value) => {
    if (interests.includes(value)) {
      setInterests(interests.filter((i) => i !== value));
    } else if (interests.length < 5) {
      setInterests([...interests, value]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 4 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* -------- MENTOR HELPERS -------- */

  const toggleIndustry = (industry) => {
    setExpandedIndustries((p) => ({ ...p, [industry]: !p[industry] }));
  };

  const handleExpertiseToggle = (industry, expertise) => {
    setSelectedExpertise((prev) => {
      const current = prev[industry] || [];
      return {
        ...prev,
        [industry]: current.includes(expertise)
          ? current.filter((e) => e !== expertise)
          : [...current, expertise],
      };
    });
  };

  const handleAddCustomExpertise = (industry) => {
    const value = customExpertise[industry]?.trim();
    if (!value) return;

    setSelectedExpertise((p) => ({
      ...p,
      [industry]: [...(p[industry] || []), value],
    }));

    setCustomExpertise((p) => ({ ...p, [industry]: "" }));
    setShowOtherInput((p) => ({ ...p, [industry]: false }));
  };

  /* ------------------ SUBMIT ------------------ */

  const handleSubmit = async () => {
    try {
      if (image) {
        console.log("user id from frontend:", user_id, "email:", email);
        await ApiServices.updateuserProfileImage({
          userId: user_id,
          image,
          email,
        });
      }

      // await ApiServices.InputEntryData({
      //   username,
      //   headline,
      //   skills,
      //   interests,
      //   selectedCategory,
      //   roleLevel,
      //   expertise: selectedExpertise,
      // });

      await ApiServices.InputEntryData({
        username,
        headline,
        skills,
        interests,
        selectedCategory,
        role_level: roleLevel,
        companyStage: companyStage,
        mentorExpertise: selectedExpertise,
      });

      // username, headline, skills, interests, selectedCategory ,role_level,mentor_expertise

      console.log(
        "role:",
        roleLevel,
        "expertise: ",
        selectedExpertise,
        "selected category:",
        selectedCategory,
      );

      alert("Profile created successfully!");
      window.location.href = "/posts";
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    }
  };

  /* ------------------ UI ------------------ */

  // console.log(selectedCategory);
  return (
    <div className="bg-white md:m-10 p-6 shadow-lg rounded-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-700">
            Step {step} of {totalSteps}
          </span>
          <span className="text-sm text-slate-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      <h2 className="font-bold text-xl mb-6">Tell us who you are *</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <BoxCategories
            onCategoryClick={onCategoryClick}
            selectedCategory={selectedCategory}
          />

          <div className="mt-4">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setStep(2);
                }}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 w-[100px]"
                disabled={!selectedCategory}
              >
                Next
              </button>
            </div>
          </div>

         
        </>
      )}

      {/* STEP 2 — ROLE */}
      {step === 2 && selectedCategory === "Mentor" && (
        <>
          {selectedCategory === "Mentor" && (
            <input
              className="mt-2 w-full border p-2 rounded"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            type="file"
            accept="image/*"
            className="ml-6 w-[840px] h-[20px] mb-4 p-2 border-2 border-gray-400 rounded-md focus:border-gray-600 outline-none"
            onChange={handleImageChange}
          />

          <h3 className="font-semibold mb-4">Select your role</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ROLE_LEVELS.map((role) => (
              <React.Fragment key={role}>
                <div
                  onClick={() => setRoleLevel(role)}
                  className={`relative cursor-pointer text-center p-3 rounded-lg border-2 transition-all
    ${
      roleLevel === role
        ? "border-blue-600 bg-blue-500 text-white"
        : "border-gray-400 bg-white"
    }`}
                >
                  {/* Check Icon */}

                  <span> {role}</span>
                  {roleLevel === role && (
                    <CheckCircle2 className="w-5 h-5 text-white ml-10 mt-2" />
                  )}
                </div>

                {role === "CXO" && roleLevel === "CXO" && (
                  <div className="col-span-2 md:col-span-3 mt-8 pt-8 border-t-2 border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      What stage is your company at?
                    </h3>
                    <p className="text-slate-600 mb-6">
                      This helps us understand your company context and match
                      you with relevant mentors
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {COMPANY_STAGES.map((stage) => (
                        <button
                          key={stage.id}
                          onClick={() => setCompanyStage(stage.label)}
                          className={`px-5 py-5 rounded-xl font-medium transition-all text-left border-2 ${
                            companyStage === stage.label
                              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg scale-105"
                              : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{stage.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-sm">
                                  {stage.label}
                                </span>
                              </div>
                              <p
                                className={`text-xs mt-1 ${
                                  companyStage === stage.label
                                    ? "text-blue-100"
                                    : "text-slate-500"
                                }`}
                              >
                                {stage.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 w-[100px]"
            onClick={() => {
              setStep(1);
              setRoleLevel("");
              setCompanyStage("");
              setSelectedCategory("");
              setUsername("");
            }}
          >
            Prev
          </button>

          <button
            disabled={
              !roleLevel ||
              (roleLevel === "CXO" && !companyStage) ||
              !image ||
              !username
            }
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded  ml-4 w-[100px] disabled:opacity-50"
            onClick={() => setStep(3)}
          >
            Next
          </button>
        </>
      )}



{/* STEP 2 — INDIVIDUAL / ENTREPRENEUR */}
{step === 2 && selectedCategory === "Individual/Entrepreneur" && (
  <>
    <h3 className="font-semibold mb-4">
      Tell us about yourself
    </h3>

    {/* Name */}
    <input
      className="mt-2 w-full border p-2 rounded"
      placeholder="Your Name"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />

    {/* Photo */}
    <input
      type="file"
      accept="image/*"
      className="mt-4 w-full mb-4 p-2 border-2 border-gray-400 rounded-md focus:border-gray-600 outline-none"
      onChange={handleImageChange}
    />

    {/* Tagline */}
    <input
      className="mt-2 w-full border p-2 rounded"
      placeholder="Your headline (e.g. Founder | SaaS Builder)"
      value={headline}
      onChange={(e) => setHeadline(e.target.value)}
    />

    {/* Buttons */}
    <button
      className="mt-6 bg-blue-600 text-white px-6 py-2 rounded w-[100px]"
      onClick={() => {
        setStep(1);
        setUsername("");
        setHeadline("");
      }}
    >
      Prev
    </button>

    <button
      disabled={!username || !image || !headline}
      className="mt-6 bg-blue-600 text-white px-6 py-2 rounded ml-4 w-[100px] disabled:opacity-50"
      onClick={() => setStep(3)}
    >
      Next
    </button>
  </>
)}

      {/* STEP 3 — MENTOR EXPERTISE  & individual expertise */}
{step === 3 &&
  (selectedCategory === "Mentor" ||
    selectedCategory === "Individual/Entrepreneur") && (
      {/* ROLE Startup for any steps*/}
      {selectedCategory === "Startup" && (
        <Startup
          step={step}
          setStep={setStep}
          selectedCategory={selectedCategory}
        />
      )}
      {/* STEP 3 — MENTOR EXPERTISE */}
      {step === 3 && selectedCategory === "Mentor" && (
        <>
          <h2 className="text-xl font-bold mb-4">
            Select your industry and expertise
          </h2>

          <div className="space-y-3">
            {Object.entries(INDUSTRY_EXPERTISE).map(([industry, skills]) => (
              <div key={industry} className="border-2 rounded-lg bg-white">
                <div
                  onClick={() => toggleIndustry(industry)}
                  className="flex justify-between p-4 cursor-pointer"
                  style={{
                    border: "1px solid gray",
                  }}
                >
                  <strong>{industry}</strong>
                  <span>{expandedIndustries[industry] ? "▲" : "▼"}</span>
                </div>

                {expandedIndustries[industry] && (
                  <div className="p-4 border-t grid grid-cols-3 gap-2">
                    {skills.map((skill) => (
                      <div
                        style={{
                          border: "1px solid gray",
                        }}
                        key={skill}
                        onClick={() => handleExpertiseToggle(industry, skill)}
                        className={`cursor-pointer p-2 rounded border
                          ${
                            selectedExpertise[industry]?.includes(skill)
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300"
                          }`}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded w-[100px] disabled:opacity-50"
            onClick={() => {
              setStep(2);
              setSelectedExpertise({});
              setCompanyStage("");
            }}
          >
            Prev
          </button>
          <button
            className="mt-8 bg-blue-600 text-white px-6 py-2 rounded w-[100px] ml-4 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={Object.keys(selectedExpertise).length === 0}
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default EntryDetails;
