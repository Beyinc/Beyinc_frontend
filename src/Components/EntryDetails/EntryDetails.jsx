import React, { useState } from "react";
import BoxCategories from "./BoxCategories";
import { allskills, dataEntry } from "../../Utils";
import { useSelector } from "react-redux";
import { ApiServices } from "../../Services/ApiServices";

const EntryDetails = () => {
  const { email, user_id } = useSelector((store) => store.auth.loginDetails);

  // State for form inputs
  const [selectedCategory, setSelectedCategory] = useState("");
  const [username, setUsername] = useState("");
  const [headline, setHeadline] = useState("");
  const [skills, setSkills] = useState([]); // Array to store selected skills
  const [image, setImage] = useState(null);
  const [interests, setInterests] = useState([]);

  // Handler for BoxCategories to get the selected category (item.title)
  const onCategoryClick = (title) => {
    setSelectedCategory(title); // Set selected category on click
  };

  // Function to handle the username input
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Function to handle the headline input
  const handleHeadlineChange = (e) => {
    setHeadline(e.target.value);
  };

  // Function to handle image input
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first selected image
    if (file) {
      // Check if a file was selected
      if (file.size > 4 * 1024 * 1024) {
        alert(
          `File size should be less than ${
            (4 * 1024 * 1024) / (1024 * 1024)
          } MB.`
        );
        e.target.value = null; // Clear the selected file
        return;
      }
      setFileBase(file); // Convert to Base64
    }
  };

  // Function to convert the file to Base64
  const setFileBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result); // Store the Base64 string in state
    };
  };

  // Function to handle interest selection
  const handleInterestChange = (e) => {
    const selectedInterest = e.target.value;
    if (interests.includes(selectedInterest)) {
      setInterests(
        interests.filter((interest) => interest !== selectedInterest)
      );
    } else {
      if (interests.length < 5) {
        setInterests([...interests, selectedInterest]);
      } else {
        alert("You can only select up to 5 interests.");
      }
    }
  };

  // Function to handle skill selection
  const handleSkillChange = (e) => {
    const selectedSkill = e.target.value;
    if (skills.includes(selectedSkill)) {
      // If the skill is already selected, remove it
      setSkills(skills.filter((skill) => skill !== selectedSkill));
    } else {
      // Otherwise, add the new skill to the array
      if (skills.length < 5) {
        setSkills([...skills, selectedSkill]);
      } else {
        alert("You can only select up to 5 skills.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !username || !skills || skills.length === 0) {
      alert(
        "Please fill in the required fields: Category, Username, and Skills."
      );
      return;
    }

    console.log(selectedCategory, username, headline, skills, interests, image);
    try {
      await ApiServices.updateuserProfileImage({
        userId: user_id,
        image: image,
        email: email,
      });
    } catch (error) {
      console.log("error saving image");
      console.log(error);
    }

    try {
      await ApiServices.InputEntryData({
        username,
        headline,
        skills,
        interests,
        selectedCategory,
      });
      alert("Data saved successfully!");
      window.location.href = "/posts";
    } catch (error) {
      console.error("Error saving data:", error);
      alert("There was an error saving your data. Please try again.");
    }
  };
  return (
    // bg-customWhite
    <div className="bg-customWhite md:my-5 md:mx-20 shadow-[0_3px_12px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col py-4 md:py-10 md:px-20">
        <h2 className="font-bold md:mb-5 pl-6">Tell us who you are?* </h2>
        <BoxCategories
          onCategoryClick={onCategoryClick}
          selectedCategory={selectedCategory}
        />
        <h2 className="font-bold md:mb-5 pl-6 mt-5 md:mt-11">Name*</h2>
        <input
          type="text"
          className="ml-6 w-9 md:w-[840px] h-[20px] p-2 border-2 border-gray-400 rounded-md focus:border-gray-600 outline-none"
          placeholder="Enter your user name"
          value={username}
          onChange={handleUsernameChange}
        />

         <div className="flex flex-col md:flex-row pl-6 mt-3 md:mt-11 md:mb-5">
          <h2 className="font-bold">Domain*</h2>
          <span className="md:ml-2">(Choose up to 5 )</span>
        </div>
        <div>
          <select
            name="skill"
            className="ml-6 w-[840px] h-[45px] p-2 border-2 border-gray-400 rounded-md focus:border-gray-600 focus:outline-none focus:ring-0"
            onChange={handleSkillChange}
          >
            <option className="w-[840px]" value="">
              Select
            </option>
            {allskills.map((skill) => (
              <option className="w-[840px]" key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row space-x-2 ml-10 mt-5">
          {skills?.map((t, i) => (
            <div
              className="p-[10px] rounded-[10px] font-roboto text-[14px] bg-lightPurple text-customPurple"
              key={i}
            >
              {t}
            </div>
          ))}
        </div>



        <h2 className="font-bold md:mb-5 pl-6 mt-3 md:mt-11">Headline</h2>
        <input
          type="text"
          className="ml-6 w-[840px] h-[20px] p-2 border-2 border-gray-400 rounded-md focus:border-gray-600 outline-none"
          placeholder="Enter your headline"
          value={headline}
          onChange={handleHeadlineChange}
        />


        <h2 className="font-bold md:mb-5 pl-6 mt-3 md:mt-11">Profile Image</h2>
        <input
          type="file"
          accept="image/*"
          className="ml-6 w-[840px] h-[20px] mb-4 p-2 border-2 border-gray-400 rounded-md focus:border-gray-600 outline-none"
          onChange={handleImageChange}
        />
       


        <div className="flex flex-col md:flex-row pl-6 mt-3 md:mt-11 md:mb-5">
          <h2 className="font-bold">Choose your interest</h2>
          <span className="md:ml-2">(Maximum 5 selections)</span>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap mt-4 ml-6">
          {dataEntry.map((entry) => (
            <label
              key={entry}
              className="flex items-center mr-4 mb-2 text-xl font-normal"
            >
              <input
                type="checkbox"
                value={entry.title}
                checked={interests.includes(entry.title)}
                className="mr-2 accent-blue-600" // Change accent color as needed
                onChange={handleInterestChange}
              />
              {entry.title}
            </label>
          ))}
        </div>
        <div className="mx-auto mt-5 md:mt-20 flex flex-row space-x-9">
          {/* <button
            type="button"
            className="flex items-center justify-center h-14 w-36 text-lg text-[#4f55c7] bg-[#4f55c7] px-1 rounded-full"
          >
            <div className=" py-3 flex items-center justify-center rounded-full bg-white h-full w-full">
              Save
            </div>
          </button> */}

          <button
            type="button"
            className="h-14 w-36 text-lg border-2 border-[#4f55c7] px-2 py-3 rounded-full"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryDetails;
