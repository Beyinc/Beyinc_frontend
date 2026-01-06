const MentorCardInfo = ({ profileData, profileRole }) => {
  return (
    <div className="space-y-3 text-gray-600 text-sm">
      {/* Role Level - Only for Mentor */}
      {/* {profileRole === "Mentor" && profileData.role_level && ( */}
      {/*   <div className="flex items-center gap-2"> */}
      {/*     <span className="text-lg">💼</span> */}
      {/*     <span className="font-medium text-gray-600">Level:</span> */}
      {/*     <span className="font-semibold text-gray-700"> */}
      {/*       {profileData.role_level} */}
      {/*     </span> */}
      {/*   </div> */}
      {/* )} */}

      {/* Skills */}
      {/* {profileData.skills && profileData.skills.length > 0 && ( */}
      {/*   <div className="flex items-start gap-2"> */}
      {/*     <span className="text-lg mt-0.5">⚡</span> */}
      {/*     <div className="flex-1"> */}
      {/*       <span className="font-medium text-gray-600 block mb-2"> */}
      {/*         Skills: */}
      {/*       </span> */}
      {/*       <div className="flex flex-wrap gap-2"> */}
      {/*         {profileData.skills.map((skill, index) => ( */}
      {/*           <span */}
      {/*             key={index} */}
      {/*             className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200" */}
      {/*           > */}
      {/*             {skill} */}
      {/*           </span> */}
      {/*         ))} */}
      {/*       </div> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* )} */}

      {/* Mentor Expertise */}
      {/* {profileData.mentorExpertise && */}
      {/*   profileData.mentorExpertise.length > 0 && ( */}
      {/*     <div className="flex items-start gap-2"> */}
      {/*       <span className="text-lg mt-0.5">🎓</span> */}
      {/*       <div className="flex-1"> */}
      {/*         <span className="font-medium text-gray-600 block mb-2"> */}
      {/*           Expertise: */}
      {/*         </span> */}
      {/*         <div className="space-y-3"> */}
      {/*           {profileData.mentorExpertise.map((expertise, index) => ( */}
      {/*             <div */}
      {/*               key={index} */}
      {/*               className="pl-2 border-l-2 border-purple-300" */}
      {/*             > */}
      {/*               <div className="font-semibold text-gray-700 mb-1.5"> */}
      {/*                 {expertise.industry} */}
      {/*               </div> */}
      {/*               <div className="flex flex-wrap gap-2"> */}
      {/*                 {expertise.skills.map((skill, skillIndex) => ( */}
      {/*                   <span */}
      {/*                     key={skillIndex} */}
      {/*                     className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200" */}
      {/*                   > */}
      {/*                     {skill} */}
      {/*                   </span> */}
      {/*                 ))} */}
      {/*               </div> */}
      {/*             </div> */}
      {/*           ))} */}
      {/*         </div> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*   )} */}
    </div>
  );
};

export default MentorCardInfo;
