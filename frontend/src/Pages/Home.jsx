import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllApp } from '../services/operations/appAPI';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components';

const Home = () => {
  const { appData } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);

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
        appData && appData.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2  gap-4'>
            {appData.map((app) => (
              <Card key={app._id} app={app} />
            ))}
          </div>
        ) : (
          <p>No data available.</p>
        )
      )}
    </div>
  );
}

export default Home;
