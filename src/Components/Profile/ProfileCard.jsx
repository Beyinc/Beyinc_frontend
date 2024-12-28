import { useDispatch, useSelector } from 'react-redux';
import { ApiServices } from '../../Services/ApiServices';
import { useEffect, useState } from 'react';
import ReviewStars from '../LivePitches/ReviewStars';
import AddReviewStars from '../LivePitches/AddReviewStars';
import ProfileImageUpdate from '../Navbar/ProfileImageUpdate';

const ProfileCard = () => {
  const [profileData, setProfileData] = useState({}); // Initialize as an empty object
  const [averageReview, setAverageReview] = useState(0); // State to hold the average review
  const [filledStars, setFilledStars] = useState(0); // State to store the filled stars for the review
  const [openEditPfp, setOpenEditPfp] = useState(false);
  // const []

  const {
    userName: loggedUserName,
    image: loggedImage,
  } = useSelector((store) => store.auth.loginDetails);

  const { email, role, userName, image, verification, user_id } = useSelector(
    (store) => store.auth.loginDetails
  );

  // Function to fetch profile data
  const getProfile = async () => {
    try {
      console.log("This is the user_id", user_id, role);
      const response = await ApiServices.getProfile({ id: user_id });
      console.log("This is the response: ", response.data);
      setProfileData(response.data);
      console.log("These are the followers:", response.data.followers.length);
      
      // Call calculateAvgReview to calculate the average review after fetching profile
      calculateAvgReview(response.data.reviews);

    } catch (error) {
      console.log("There was an error while fetching profile: ", error);
    }
  };

  // Function to calculate average review
  const calculateAvgReview = (reviews) => {
    if (reviews && reviews.length > 0) {
      let avgR = 0;
      reviews.forEach((rev) => {
        avgR += rev.review;
      });
      const avgReview = avgR / reviews.length;
      setAverageReview(avgReview); // Set the average review value in state
    } else {
      setAverageReview(0); // Set to 0 if no reviews
    }
  };

  // Function to send the review
  const sendReview = async () => {
    try {
      const response = await ApiServices.addReview({ userId: user_id, rating: filledStars });
      if (response.data.success) {
        // Optionally show a toast or feedback message
        console.log('Review added successfully');
      }
    } catch (error) {
      console.error('Error posting review', error);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    getProfile();
  }, [user_id]); // Adding user_id as dependency in case it changes

  return (
    <div className="h-auto pb-9 w-[500px] flex flex-col items-center rounded-lg shadow-lg">
      <div className="relative group mt-4">
        <img
          className="size-36 rounded-full"
          src={
            image !== undefined && image !== "" ? image : "/profile.png"
          }
        /><span>
        
      </span>
        <i 
        onClick={() => setOpenEditPfp(true)}
        className="fas fa-camera absolute top-0 bottom-[10px] left-[13px] p-[68px] opacity-0 group-hover:bg-black/60 group-hover:opacity-100 group-hover:text-white group-hover:rounded-full"></i>


      </div>
      <div className="font-bold text-xl ">
        {userName && userName[0]?.toUpperCase() + userName?.slice(1)}<i
          style={{ color: "var(--followBtn-bg)" }}
          // onClick={handleEditButtonClick}
          className="fas fa-pen"
        ></i>
      </div>
      <div className="font-bold text-xl text-gray-500">{role}</div>
      <div className="flex flex-col mt-4 font-bold w-full ">
        <div className="px-28 gap-4 flex flex-col">
          <div className="flex justify-between">
            <span>Followers</span> <span>{profileData.followers ? profileData.followers.length : 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Following</span> <span>{profileData.following ? profileData.following.length : 0}</span>
          </div>
        </div>
      </div>
      <ProfileImageUpdate open={openEditPfp} setOpen={setOpenEditPfp} />


      
      
    </div>
  );
};

export default ProfileCard;
