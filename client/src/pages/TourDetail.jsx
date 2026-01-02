import React from 'react';
import { useParams } from 'react-router-dom';

const TourDetail = () => {
  const { slug } = useParams();
  return (
    <div>
       <h1>Tour Detail: {slug}</h1>
    </div>
  );
};

export default TourDetail;
