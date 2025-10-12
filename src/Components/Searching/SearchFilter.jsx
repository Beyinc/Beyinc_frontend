import React, { useEffect, useState } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import { dataEntry } from '../../Utils';

const SearchFilter = ({ FilteredSearchProfiles}) => {
  const [entityTitles, setEntityTitles] = useState(''); // Change from [] to ''
  const [isEntityOpen, setIsEntityOpen] = useState(true);
  const [selectedEntities, setSelectedEntities] = useState([]);

  const handleEntityTitlesChange = (event) => {
    const { value, checked } = event.target;
    setSelectedEntities((prev) =>
      checked ? [...prev, value] : prev.filter((option) => option !== value)
    );
  };

  // Filter options based on the input value
  const filteredEntityTitlesOptions = dataEntry.filter((option) =>
    option.title.toLowerCase().includes(entityTitles.toLowerCase())
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      const filters = { interests: selectedEntities };
      FilteredSearchProfiles(filters);
    }, 300); // 300ms debounce time
  
    return () => clearTimeout(debounce);
  }, [selectedEntities]);
  
  

  return (
    <div>
      <div className="bg-white ml-10 p-5 mt-0 rounded-lg w-[300px]  shadow-md">
        <h2>Filter</h2>
        
        <h3 className="mt-6 mb-2">Role Type</h3>
        <div className="relative">
          <button
            className={`absolute right-1 top-[-45px] text-xl transform transition-transform duration-300 focus:outline-none focus:ring-0 border-none bg-transparent hover:bg-transparent text-gray-500 ${
              isEntityOpen ? 'rotate-180' : 'rotate-0'
            }`}
            onClick={() => setIsEntityOpen(!isEntityOpen)}
          >
            <RxCaretDown />
          </button>
        </div>

        {/* Checkboxes shown only if isEntityOpen is true */}
        {isEntityOpen && (
          <div className="max-h-48 overflow-y-scroll overflow-x-hidden mt-2 border border-gray-300 rounded-md">
            <input
              type="text"
              className="w-60 mt-3"
              placeholder="Search Role"
              value={entityTitles}
              onChange={(e) => setEntityTitles(e.target.value)} // Update state with string input
            />

            {filteredEntityTitlesOptions.map((option) => (
              <div key={option.id} className="p-0"> {/* Use option.id for the key */}
                <label>
                  <input
                    type="checkbox"
                    value={option.title} // Use option.title for checkbox value
                    checked={selectedEntities.includes(option.title)} // Check based on title
                    onChange={handleEntityTitlesChange}
                    className='mr-2'
                  />
                  {option.title} {/* Display the title */}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
