import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import SearchFilter from "./SearchFilter";

function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    interests: [],
  });

  useEffect(() => {
    console.log(searchQuery);

    const fetchUsers = async () => {
      if (searchQuery) {
        try {
          // Fetch users based on the search query
          const response = await ApiServices.searchProfiles(searchQuery); // Adjust this function based on your API service
          setUsers(response.data); // Assuming the response has a 'data' field containing user profiles
        } catch (err) {
          console.log(err.message); // Set error message if the fetch fails
        }
      }
    };

    fetchUsers(); // Call the fetch function
  }, [searchQuery]); // Dependency array includes searchQuery

  const FilteredSearchProfiles = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  // Function to fetch user data from backend based on filters
  const fetchSearchUsers = async () => {
    console.log("Current filters:", filters);
    try {
      const response = await ApiServices.FilterSearchProfiles({
        query: searchQuery, // Send query directly
        interests: filters.interests, // Send interests directly
      });
      setUsers(response.data);

      // Filter users to only include those with the desired fields
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchSearchUsers();
  }, [filters]);

  return (
    <div className="flex flex-row space-x-20">
      <SearchFilter FilteredSearchProfiles={FilteredSearchProfiles} />
      <div className="mt-4">
        <h1>Search Results for "{searchQuery}"</h1>
        <ul>
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white p-5 mt-8 py-5 w-[250px] shadow-md flex flex-col justify-center items-center space-y-3"
            >
              <img
                // src={user.image.url}
                src={user.image?.url ? user.image.url : "/profile.png"}
                style={{
                  objectFit: "cover", 
                  borderRadius: "50%",
                  height: "150px",
                  width: "150px",
                }}
                alt="profile pic"
              />
              <h2>{user.userName}</h2>
              <p>{user.description || "I am a full-stack dev"}</p>{" "}
              <button
                type="button"
                className="flex items-center justify-center h-14 w-36 text-lg text-[#4f55c7] bg-[#4f55c7] px-1 rounded-full"
              >
                <div className=" py-3 flex items-center justify-center rounded-full bg-white h-full w-full">
                  Connect
                </div>
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchResults;
