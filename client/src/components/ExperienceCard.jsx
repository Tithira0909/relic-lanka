import React from 'react';
import { Link } from 'react-router-dom';

const ExperienceCard = ({ item }) => {
  const imgUrl = (item.images && item.images.length > 0) ? item.images[0].imageUrl : '/images/image_2.jpg';
  const link = item.tour ? `/tours/${item.tour.slug}` : '#';

  return (
    <div className="col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated">
      <div className="project">
        <div className="img">
          <img src={imgUrl} className="img-fluid" alt={item.title} />
          <div className="text">
            <span>Experience</span>
            <h3><Link to={link}>{item.title}</Link></h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
