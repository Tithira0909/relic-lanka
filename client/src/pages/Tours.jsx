import React, { useEffect, useState } from 'react';
import { API } from '../services/api';
import { Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Tours = () => {
  useScrollAnimation();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await API.getTours();
        // Handle { data: [], meta: {} } response structure
        const list = Array.isArray(data) ? data : (data.data || []);
        setTours(list);
      } catch (error) {
        console.error("Failed to fetch tours", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <div>
      <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: 'url("/images/bg_1.jpg")' }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end justify-content-center">
            <div className="col-md-9 text-center mb-5">
              <h1 className="mb-0 bread">Tours</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section">
        <div className="container">
            <div className="row">
                {loading ? (
                    <div className="col-md-12 text-center"><p>Loading tours...</p></div>
                ) : tours.length === 0 ? (
                    <div className="col-md-12 text-center"><p>No tours found.</p></div>
                ) : (
                    tours.map((tour) => {
                         const imgUrl = (tour.images && tour.images.length > 0) ? tour.images[0].imageUrl : '/images/destination-1.jpg';
                         return (
                            <div key={tour.id} className="col-md-4 ftco-animate fadeInUp ftco-animated">
                                <div className="project-wrap">
                                    <Link to={`/tours/${tour.slug}`} className="img" style={{ backgroundImage: `url(${imgUrl})` }}>
                                        <span className="price">${tour.price || 'N/A'}/person</span>
                                    </Link>
                                    <div className="text p-4">
                                        <span className="days">{tour.duration} Days Tour</span>
                                        <h3><Link to={`/tours/${tour.slug}`}>{tour.title}</Link></h3>
                                        <p className="location"><span className="fa fa-map-marker"></span> {tour.location || 'Sri Lanka'}</p>
                                        <ul>
                                            <li><span className="flaticon-shower"></span> 2</li>
                                            <li><span className="flaticon-king-size"></span> 3</li>
                                            <li><span className="flaticon-mountains"></span> Near Mountain</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                         );
                    })
                )}
            </div>
        </div>
      </section>
    </div>
  );
};

export default Tours;
