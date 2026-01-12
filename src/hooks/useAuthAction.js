import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useAuthAction = () => {
    const { _id: user_id } = useSelector((state) => state.auth.userDetails || {});
    const navigate = useNavigate();

    return (action) => {
        return (...args) => {
            if (!user_id) {
                navigate("/signup");
                return;
            }
            return action(...args);
        };
    };
};
