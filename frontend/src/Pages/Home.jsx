import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllApp } from '../services/operations/appAPI';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components';

const Home = () => {
  const { appData } = useSelector((state) => state.app);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);
  console.log("This is app data = ", appData);

  useEffect(() => {
    console.log("Fetching app data...");
    dispatch(getAllApp())
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  return (
    <div className="p-6">
      {token && (
        <button
          onClick={() => navigate("/add-app")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md mt-6 w-full transition duration-200"
        >
          Add App
        </button>
      )}
      {isLoading ? (
        <p className="text-center text-lg text-gray-600">Loading data, please wait...</p>
      ) : (
        <div className='mt-5'>
          <p className='text-center text-2xl my-4 text-gray-800 font-bold'>Feel free to add your own app and make available for others</p>
          {(appData && appData.length > 0) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[5rem]">
              {appData.map((app) => (
                <Card key={app._id} app={app} />
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-gray-600">No data available.</p>
          )}
        </div>
      )}

    </div>

  );
}

export default Home;
