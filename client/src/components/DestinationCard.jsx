import React from 'react';
import { Link } from 'react-router-dom';

const DestinationCard = ({ item }) => {
  const imgUrl = (item.images && item.images.length > 0) ? item.images[0].imageUrl : '/images/destination-1.jpg';
  const safeImg = imgUrl || '/images/image_1.jpg';
  const link = item.tour ? `/tours/${item.tour.slug}` : '#';

  return (
    <div className="col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated">
      <div className="project">
        <div className="img">
          <img src={safeImg} className="img-fluid" alt={item.name} />
          <div className="text">
            <span>{item.name}</span>
            <h3><Link to={link}>{item.description ? item.description.substring(0, 50) + '...' : 'Explore'}</Link></h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
