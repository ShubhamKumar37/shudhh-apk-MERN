// MediaSlider.js
import React, { useState } from 'react';

const MediaSlider = ({ media }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleOpenMedia = (mediaItem) => {
    setIsOpen(true);
    setSelectedMedia(mediaItem);
  };

  const handleCloseMedia = () => {
    setIsOpen(false);
    setSelectedMedia(null);
  };

  return (  
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">App screenshot and video</h2>
      <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
        {media.map((mediaItem, index) => (
          <div key={index} className="flex-shrink-0 w-56 sm:w-64 md:w-80 lg:w-96 h-48 rounded-lg overflow-hidden">
            {mediaItem.type === 'video' ? (
              <video controls className="w-full h-full object-cover" onClick={() => handleOpenMedia(mediaItem)}>
                <source src={mediaItem.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={mediaItem.url} alt="Media content" className="w-full h-full object-cover" onClick={() => handleOpenMedia(mediaItem)} />
            )}
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg max-w-md max-h-screen overflow-y-auto">
            {selectedMedia.type === 'video' ? (
              <video controls className="w-full h-full object-cover" autoPlay>
                <source src={selectedMedia.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={selectedMedia.url} alt="Media content" className="w-full h-full object-cover" />
            )}
            <button className="absolute top-0 right-0 p-2 text-white" onClick={handleCloseMedia}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaSlider;

