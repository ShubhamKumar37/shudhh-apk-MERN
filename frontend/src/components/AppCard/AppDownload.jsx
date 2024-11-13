import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getApp } from '../../services/operations/appAPI';
import MediaSlider from './MediaSlider';

const AppDownload = () => {
  const { appId } = useParams();
  const app = useSelector((state) => state.app.singleAppData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getApp(appId));
  }, [dispatch, appId]);

  const details = app ? [
    { label: "Company", value: app.companyName },
    { label: "Category", value: app.category.name },
    { label: "Size", value: app.size },
    { label: "Downloads", value: app.download },
    { label: "Release Date", value: new Date(app.releaseDate).toLocaleDateString() },
    { label: "System Requirement", value: app.systemRequirement },
    { label: "In-App Purchase", value: app.inAppPurchase ? 'Yes' : 'No' },
    { label: "Languages", value: app.language.join(', ') },
    { label: "Tags", value: app.tag.join(', ') },
    { label: "Permissions", value: app.appPermission.join(', ') },
  ] : null;

  const handleDownload = () => {
    // Use Google Drive direct download link
    const directDownloadLink = `https://drive.google.com/uc?export=download&id=${app.appFile.googleDriveFileId}`;
    const a = document.createElement('a');
    a.href = directDownloadLink;
    a.download = app.appFile.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      {
        !app ? (<div className="text-center">Loading...</div>)
          : (
            <div className="flex flex-col gap-4 bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mt-10">
              <img
                src={app.appIcon?.url}
                className="w-20 h-20 rounded-lg object-cover mb-4"
                alt={app.appName}
              />
              <h1 className="text-3xl font-bold mb-2">{app.appName}</h1>
              <p className="text-gray-700 mb-4">{app.appDescription}</p>

              {/* Render details using .map() */}
              <div className="space-y-2 mb-4 flex flex-col gap-3">
                {details.map((detail, index) => (
                  <p key={index} className="flex items-center text-sm font-light">
                    <span className="text-gray-600 font-medium mr-2">{detail.label}:</span> {detail.value}
                  </p>
                ))}
              </div>

              {/* Media Section */}
              {app.media && <MediaSlider media={app.media} />}

              {/* Download Button */}
              {app.appFile && (
                <button
                  onClick={handleDownload}
                  className="w-full bg-blue-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Download App
                </button>
              )}
              <a
                href={app.appFile.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-200 text-black text-center py-2 rounded-lg font-semibold hover:bg-gray-300 transition mt-4"
              >
                View on Google Drive
              </a>
            </div>
          )
      }
    </div>
  );
};

export default AppDownload;

