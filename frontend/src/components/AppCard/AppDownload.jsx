import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'
import { getApp } from '../../services/operations/appAPI';

const AppDownload = () => {

    const {id} = useParams();
    const [app, setApp] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        const data = dispatch(getApp(id));
        setApp(data);
    }, [])

  return (
    <div></div>
  )
}

export default AppDownload