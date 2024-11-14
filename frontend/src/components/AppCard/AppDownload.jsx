import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getApp } from '../../services/operations/appAPI';
import MediaSlider from './MediaSlider';
import { apiConnector } from '../../services/apiConnector';
import { appApi } from '../../services/apis';
import toast from 'react-hot-toast';

const AppDownload = () => {
  const { appId } = useParams();
  const app = useSelector((state) => state.app.singleAppData);
  const user = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(app);


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

  async function deleteApp(appId) {
    try {
      toast.loading("Deleting App...");
      const response = await apiConnector("DELETE", appApi.DELETE_APP, { appId: appId });
      toast.dismiss();
      toast.success("App deleted successfully");

      console.log("This is response: ", response);
      console.log("Hua toh hn");
      navigate("/");
    }
    catch (Error) {
      toast.error("App is not deleted properly");
      console.log("Error in deleting App: ", Error);
      return Error;
    }
  }

  useEffect(() => {
    dispatch(getApp(appId));
  }, [dispatch, appId]);
  return (
    <div>
      {
        !app ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="flex flex-col gap-4 bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mt-10">
            <img
              src={app.appIcon?.url}
              className="w-20 h-20 rounded-lg object-cover mb-4"
              alt={app.appName}
            />
            <h1 className="text-3xl font-bold text-blue-800 mb-2">{app.appName}</h1>
            <p className="text-gray-700 mb-4">{app.appDescription}</p>

            {/* App Details Section */}
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

            {/* Delete App Button for Owner */}
            {app.providedBy === user._id && (
              <button
                onClick={() => deleteApp(app._id)}
                className="w-full bg-red-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-red-700 transition mt-4"
              >
                Delete App
              </button>
            )}
          </div>
        )
      }
    </div>

  );
};

export default AppDownload;

