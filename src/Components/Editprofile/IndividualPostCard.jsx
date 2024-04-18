

const IndividualPostCard = ({ post }) => {
    return (
        <div className="postImageContainer" onMouseOver={() => {
            document.getElementById(`${post._id}`).style.display = 'flex'
        }} onMouseLeave={() => {
            document.getElementById(`${post._id}`).style.display = 'none'
        }}>
            <img src={post?.image?.url} alt="" srcset=""/>
            <div className='postImageContainerLayer' style={{display: 'none'}} id={`${post._id}`}>
                <i className="fas fa-heart" style={{ color: 'white', fontSize: '18px' }}></i> {post?.likes?.length}
            </div>
        </div>
    );
};

export default IndividualPostCard;
