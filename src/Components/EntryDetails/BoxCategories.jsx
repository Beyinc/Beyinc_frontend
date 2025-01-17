import React from "react";
import { Icon } from "@iconify/react";
import { dataEntry } from "../../Utils";

const BoxCategories = ({ onCategoryClick,selectedCategory }) => {

  
  return (
    <div className="flex flex-wrap">
      {dataEntry.map((item, i) => (
        <div
        key={item.id} 
        className={`mx-5 my-2 cursor-pointer shadow-[0_3px_12px_rgba(0,0,0,0.1)] mt-6 w-[259px] h-[223px] rounded-md py-4 px-5
          ${selectedCategory === item.title ? 'bg-customPurple' : 'bg-customWhite'}`}  
          onClick={() => onCategoryClick(item.title)}
        >
          <div className="relative flex mt-5">
            <div className="bg-lightPurple w-[50px] h-[50px] rounded-full" />
            <Icon
              icon={item.icon}
              className="absolute top-3 left-3 transform -translate-x-1/2 -translate-y-1/2 text-customPurple h-[28px] w-[28px]"
            />
          </div>
          <div className={`pt-7 pb-4 font-bold text-lg ${selectedCategory === item.title ? 'text-white' : 'text-customPurple'}`}>
            {item.title}
          </div>
          <div className="mt-4 text-sm font-medium">{item.paragraph}</div>
        </div>
      ))}
    </div>
  );
};

export default BoxCategories;
