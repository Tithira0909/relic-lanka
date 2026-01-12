import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../services/api';
import useScrollAnimation from '../hooks/useScrollAnimation';

const TourDetail = () => {
  useScrollAnimation();
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itinerary');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await API.getTourBySlug(slug);
        setTour(data);
      } catch (error) {
        console.error("Failed to fetch tour", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [slug]);

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (!tour) return <div className="text-center p-5">Tour not found.</div>;

  return (
    <div>
      <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: `url(${tour.heroImageUrl || '/images/bg_1.jpg'})` }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end justify-content-center">
            <div className="col-md-9 text-center mb-5">
              <h1 className="mb-0 bread">{tour.name}</h1>
              <p className="breadcrumbs"><span className="mr-2">{tour.days} Days / {tour.nights} Nights</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section ftco-no-pt ftco-no-pb">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 ftco-animate fadeInUp ftco-animated py-md-5 mt-md-5">
              <h2 className="mb-3">Overview</h2>
              <div dangerouslySetInnerHTML={{ __html: tour.description }} />

              <div className="mt-5">
                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'itinerary' ? 'active' : ''}`} onClick={() => setActiveTab('itinerary')}>Itinerary</button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'inclusions' ? 'active' : ''}`} onClick={() => setActiveTab('inclusions')}>Inclusions</button>
                  </li>
                  {tour.destinations && tour.destinations.length > 0 && (
                      <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'destinations' ? 'active' : ''}`} onClick={() => setActiveTab('destinations')}>Destinations</button>
                      </li>
                  )}
                  {tour.experiences && tour.experiences.length > 0 && (
                      <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'experiences' ? 'active' : ''}`} onClick={() => setActiveTab('experiences')}>Experiences</button>
                      </li>
                  )}
                </ul>
                <div className="tab-content" id="pills-tabContent">
                  {/* Itinerary */}
                  {activeTab === 'itinerary' && (
                      <div className="tab-pane fade show active">
                          {tour.itineraryDays && tour.itineraryDays.map((day) => (
                              <div key={day.id} className="day-wrap mb-4">
                                  <h3 className="mb-3">Day {day.dayNumber}: {day.title}</h3>
                                  <p><strong>Route:</strong> {day.routeText}</p>
                                  <div dangerouslySetInnerHTML={{ __html: day.details }} />
                              </div>
                          ))}
                      </div>
                  )}

                  {/* Inclusions */}
                  {activeTab === 'inclusions' && (
                      <div className="tab-pane fade show active">
                          <div className="row">
                              <div className="col-md-6">
                                  <h4>Included</h4>
                                  <ul>
                                      {tour.inclusion && tour.inclusion.map((inc, i) => <li key={i}>{inc}</li>)}
                                  </ul>
                              </div>
                              <div className="col-md-6">
                                  <h4>Activities</h4>
                                   <ul>
                                      {tour.includedActivities && tour.includedActivities.map((act, i) => <li key={i}>{act}</li>)}
                                  </ul>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* Destinations */}
                  {activeTab === 'destinations' && (
                      <div className="tab-pane fade show active">
                          <div className="row">
                              {tour.destinations.map(dest => (
                                  <div key={dest.id} className="col-md-6 mb-4">
                                      {dest.images && dest.images.length > 0 && (
                                          <img src={dest.images[0].imageUrl} alt={dest.name} className="img-fluid mb-3" />
                                      )}
                                      <h4>{dest.name}</h4>
                                      <p>{dest.description}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* Experiences */}
                  {activeTab === 'experiences' && (
                      <div className="tab-pane fade show active">
                           <div className="row">
                              {tour.experiences.map(exp => (
                                  <div key={exp.id} className="col-md-6 mb-4">
                                      {exp.images && exp.images.length > 0 && (
                                          <img src={exp.images[0].imageUrl} alt={exp.title} className="img-fluid mb-3" />
                                      )}
                                      <h4>{exp.title}</h4>
                                      <p>{exp.description}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourDetail;
