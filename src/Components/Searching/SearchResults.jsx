import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";

function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const [users, setUsers] = useState([]);

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

  return (
    <div>
      <h1>Search Results for "{searchQuery}"</h1>
      <ul>
        {users.map((user) => (
          <div key={user.id}>
            <h4>{user.userName}</h4>
            <p>{user.email}</p>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;
