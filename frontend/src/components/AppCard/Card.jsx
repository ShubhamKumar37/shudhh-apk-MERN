import React from 'react'
import { useNavigate } from 'react-router-dom'

const Card = ({ app }) => {
    const navigate = useNavigate();
    console.log("This is app in card: ", app);
    return (
        <div 
            key={app._id} 
            className="cursor-pointer p-6 border-b border-gray-300 hover:bg-gray-50 transition duration-200 ease-in-out" 
            onClick={() => navigate(`/get-app/${app._id}`)}
        >
            <div className="flex items-start space-x-5">
                {/* App Icon */}
                <img 
                    src={app?.appIcon?.url} 
                    alt={app.appName} 
                    className="w-20 h-20 rounded-lg object-cover shadow-lg" 
                />

                {/* App Details */}
                <div className="flex-1">
                    {/* App Name */}
                    <h1 className="text-2xl font-semibold text-blue-800 mb-2">
                        {app.appName}
                    </h1>

                    {/* App Metadata */}
                    <div className="text-sm text-gray-700 mb-2 flex space-x-4">
                        <span>{app.size}</span>
                        <span>
                            Downloads: <span className="font-semibold text-blue-600">{app.download}</span>
                        </span>
                        <span>
                            In-App Purchases: <span className={app.inAppPurchase ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                            {app.inAppPurchase ? "Yes" : "No"}
                            </span>
                        </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-sm text-gray-600 mb-2">
                        {app.shortDesc}
                    </p>

                    {/* Category */}
                    <p className="text-sm text-gray-600 font-medium">
                        {app.category.name}
                    </p>

                    {/* Full Description (trimmed if necessary) */}
                    <p className="text-sm text-gray-600 mt-2">
                        {app.appDescription.length > 120 ? `${app.appDescription.slice(0, 120)}...` : app.appDescription}
                    </p>
                </div>
            </div>
        </div>


    )
}

export default Card