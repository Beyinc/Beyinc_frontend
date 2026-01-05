import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * A custom hook to guard actions that require authentication.
 * If the user is logged in, it executes the provided callback.
 * If the user is anonymous, it redirects to the login page.
 */
export const useAuthAction = () => {
    const navigate = useNavigate();
    // Retrieve user_id from the Redux store to check login status
    const loginDetails = useSelector((store) => store.auth.loginDetails || {});
    const { user_id } = loginDetails;

    /**
     * @param {Function} callback - The action to perform if authenticated
     * @returns {Function} - A wrapped function for use in event handlers
     */
    return (callback) => {
        return (...args) => {
            if (!user_id) {
                // If no user_id, redirect to signup/login
                navigate("/signup");
                return;
            }
            // If authenticated, execute the original action with args
            return callback(...args);
        };
    };
};
