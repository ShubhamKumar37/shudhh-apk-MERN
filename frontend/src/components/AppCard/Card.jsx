import React from 'react'
import { useNavigate } from 'react-router-dom'

const Card = ({app}) => {
    const navigate = useNavigate();
    return (
        
        <div key={app._id} className="cursor-pointer p-4 border-b border-gray-300 hover:bg-gray-100" onClick={() => navigate(`/get-app/${app._id}`)}>
            <div className="flex items-start space-x-4">
                <img src={app.appIcon.url} alt={app.appName} className="w-16 h-16 rounded-lg object-cover shadow-md" />
                <div className="flex-1">
                    <h1 className="text-xl font-bold">{app.appName}</h1>
                    <p className="text-sm text-gray-900 flex items-center">
                        {app.size} | Downloads: {app.download} | In-App Purchases: {app.inAppPurchase ? "Yes" : "No"}
                    </p>
                    <p className="text-sm text-gray-600">{app.shortDesc}</p>
                    <p className="text-sm text-gray-600">{app.category.name}</p>
                    <p className="text-sm text-gray-600">{app.appDescription.length > 120 ? `${app.appDescription.slice(0, 120)}...` : app.appDescription}</p>
                </div>
            </div>
        </div>
    )
}

export default Card