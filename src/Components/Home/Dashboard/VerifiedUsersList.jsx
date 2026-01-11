// VerifiedUsersList.jsx
import * as React from "react";
import { ApiServices } from "../../../Services/ApiServices";

export default function VerifiedUsersList() {
  const [verifiedUsers, setVerifiedUsers] = React.useState([]);
  const [unverifiedUsers, setUnverifiedUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const verifiedRes =
        await ApiServices.getUsersByVerifiedStatusByAdmin(true);
      const unverifiedRes =
        await ApiServices.getUsersByVerifiedStatusByAdmin(false);
      setVerifiedUsers(verifiedRes.data.users);
      setUnverifiedUsers(unverifiedRes.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerifyToggle = async (userId, currentStatus) => {
    try {
      await ApiServices.updateVerifiedStatusByAdmin(userId, !currentStatus);
      await fetchUsers();
    } catch (error) {
      console.error("Error updating verified status:", error);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const UserCard = ({ user, isVerified }) => (
    <div className="border border-gray-300 rounded-lg p-4 w-80 shadow-sm hover:shadow-md transition-shadow">
      {/* Profile Image */}
      <div className="flex justify-center mb-3">
        {user.image?.url || user.beyincProfile ? (
          <img
            src={user.image?.url || user.beyincProfile}
            alt={user.userName}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-200">
            <span className="text-2xl text-gray-600">
              {user.userName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* User Info */}
      <h4 className="text-lg font-medium mb-2 text-center">{user.userName}</h4>

      <p className="text-sm text-gray-600 mb-1">
        <strong>Email:</strong> {user.email}
      </p>

      <p className="text-sm text-gray-600 mb-1">
        <strong>Role:</strong> {user.role}
      </p>

      {user.experienceYears !== undefined && (
        <p className="text-sm text-gray-600 mb-1">
          <strong>Experience:</strong> {user.experienceYears} years
        </p>
      )}

      {user.role_level && (
        <p className="text-sm text-gray-600 mb-1">
          <strong>Level:</strong> {user.role_level}
        </p>
      )}

      {user.linkedinProfile && (
        <div className="text-sm text-gray-600 mb-1">
          <strong>LinkedIn:</strong>{" "}
          <a
            href={user.linkedinProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {user.linkedinProfile}
          </a>
        </div>
      )}

      <p className="text-sm text-gray-600 mb-3">
        <strong>Verified:</strong> {isVerified ? "✅" : "❌"}
      </p>

      <button
        onClick={() => handleVerifyToggle(user._id, user.verified)}
        className={`w-full ${
          isVerified
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white py-2 px-4 rounded transition-colors`}
      >
        {isVerified ? "Unverify" : "Verify"}
      </button>
    </div>
  );

  return (
    <div className="p-6">
      {/* Verified Users Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">
          Verified Users ({verifiedUsers.length})
        </h3>
        <div className="flex flex-wrap gap-4">
          {verifiedUsers.map((user) => (
            <UserCard key={user._id} user={user} isVerified={true} />
          ))}
        </div>
      </div>

      {/* Unverified Users Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Unverified Users ({unverifiedUsers.length})
        </h3>
        <div className="flex flex-wrap gap-4">
          {unverifiedUsers.map((user) => (
            <UserCard key={user._id} user={user} isVerified={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
