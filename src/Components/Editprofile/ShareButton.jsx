import React, { useState } from "react";

const ShareButton = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const urlToShare = window.location.href;
  const textToShare = "Check out this amazing post!";
  const encodedUrlToShare = encodeURIComponent(urlToShare);
  const encodedTextToShare = encodeURIComponent(textToShare);

  const shareData = {
    title: textToShare,
    text: textToShare,
    url: urlToShare,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Link shared successfully");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      setPopupVisible(true);
    }
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrlToShare}`;
    window.open(facebookUrl, "_blank");
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrlToShare}&text=${encodedTextToShare}`;
    window.open(twitterUrl, "_blank");
  };

  const copyLink = () => {
    const clickableLink = `${urlToShare}`;
    navigator.clipboard
      .writeText(clickableLink)
      .then(() => {
        alert("Link copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div>
      <div className="actionText" onClick={handleShare}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
        >
          <path
            fill="black"
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.15c-.05.21-.08.43-.08.66c0 1.61 1.31 2.91 2.92 2.91s2.92-1.3 2.92-2.91s-1.31-2.92-2.92-2.92M18 4c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M6 13c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1m12 7c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1"
          />
        </svg>
      </div>
      {isPopupVisible && (
        <div className="popup">
          <button className="actionText" onClick={shareOnFacebook}>
            Share on Facebook
          </button>
          <button className="actionText" onClick={shareOnTwitter}>
            Share on Twitter
          </button>
          <button className="actionText" onClick={copyLink}>
            Copy Link
          </button>
          <button className="actionText" onClick={() => setPopupVisible(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
