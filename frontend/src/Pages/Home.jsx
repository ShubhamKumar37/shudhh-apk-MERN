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
    <div className='p-4'>
      {isLoading ? (
        <p>Loading data, please wait...</p>
      ) : (
        (appData && appData.length > 0) ? (
          <div className='grid grid-cols-1 sm:grid-cols-2  gap-4'>
            {appData.map((app) => (
              <Card key={app._id} app={app} />
            ))}
          </div>
        ) : (
          <p>No data available.</p>
        )
      )}

      {
        token && (
          <button
            onClick={() => navigate("/add-app")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add App
          </button>
        )
      }
    </div>
  );
}

export default Home;
