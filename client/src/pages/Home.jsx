import React, { useEffect, useState } from 'react';
import Spotlight from '../components/Spotlight';
import { Link } from 'react-router-dom';
import { API } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import ExperienceCard from '../components/ExperienceCard';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Home = () => {
  useScrollAnimation();
  const [spotlightItems, setSpotlightItems] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loadingDest, setLoadingDest] = useState(true);
  const [loadingExp, setLoadingExp] = useState(true);

  useEffect(() => {
    // Load Spotlight Items (Gallery)
    const loadGallery = async () => {
      try {
        const gallery = await API.getGallery();
        if (gallery && gallery.length > 0) {
           setSpotlightItems(gallery.map(item => ({
             name: item.title || 'Sri Lanka',
             img: item.imageUrl
           })));
        } else {
           // Fallback
           setSpotlightItems([
              { name: "Sigiriya", img: "/images/img_1.jpg" },
              { name: "Kandy", img: "/images/img_2.jpg" },
              { name: "Ella", img: "/images/img_3.jpg" },
              { name: "Galle", img: "/images/img_4.jpg" },
              { name: "Yala", img: "/images/img_5.jpg" },
              { name: "Mirissa", img: "/images/img_6.jpg" },
              { name: "Nuvara Eliya", img: "/images/img_7.jpg" },
              { name: "Polonnaruwa", img: "/images/img_8.jpg" },
              { name: "Anuradhapura", img: "/images/img_9.jpg" },
              { name: "Trincomalee", img: "/images/img_10.jpg" },
           ]);
        }
      } catch (e) {
        console.error("Failed to load gallery", e);
        // Fallback
        setSpotlightItems([
            { name: "Sigiriya", img: "/images/img_1.jpg" },
            { name: "Kandy", img: "/images/img_2.jpg" },
            { name: "Ella", img: "/images/img_3.jpg" },
            { name: "Galle", img: "/images/img_4.jpg" },
            { name: "Yala", img: "/images/img_5.jpg" },
            { name: "Mirissa", img: "/images/img_6.jpg" },
            { name: "Nuvara Eliya", img: "/images/img_7.jpg" },
            { name: "Polonnaruwa", img: "/images/img_8.jpg" },
            { name: "Anuradhapura", img: "/images/img_9.jpg" },
            { name: "Trincomalee", img: "/images/img_10.jpg" },
        ]);
      }
    };

    // Load Destinations
    const loadDestinations = async () => {
        try {
            const data = await API.getFeaturedDestinations();
            // Handle { data: [], meta: {} } format if applicable
            const list = Array.isArray(data) ? data : (data.data || []);
            setDestinations(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingDest(false);
        }
    };

    // Load Experiences
    const loadExperiences = async () => {
        try {
            const data = await API.getFeaturedExperiences();
            const list = Array.isArray(data) ? data : (data.data || []);
            setExperiences(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingExp(false);
        }
    };

    loadGallery();
    loadDestinations();
    loadExperiences();
  }, []);

  return (
    <div>
      <section className="intro intro-banner">
        <h1>Journey through the Wonder of Asia</h1>
      </section>

      <Spotlight items={spotlightItems} />

      <section className="ftco-section ftco-no-pb">
        <div className="container">
          <div className="row justify-content-center pb-4">
            <div className="col-md-12 heading-section text-center">
              <h2 className="mb-4">Explore Sri Lanka</h2>
              <p>Discover the beauty of the island.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <img src="/images/map_srilanka.png" className="img-fluid" alt="Map of Sri Lanka" style={{ maxHeight: '600px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="ftco-section">
        <div className="container">
            <div className="row justify-content-center pb-4">
                <div className="col-md-12 heading-section text-center">
                    <h2 className="mb-4">Popular Destinations</h2>
                </div>
            </div>
            <div className="row">
                {loadingDest ? (
                    <div className="col-md-12 text-center"><p>Loading destinations...</p></div>
                ) : destinations.length === 0 ? (
                    <div className="col-md-12 text-center"><p>No destinations found.</p></div>
                ) : (
                    destinations.map((item, idx) => <DestinationCard key={idx} item={item} />)
                )}
            </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="ftco-section">
        <div className="container">
            <div className="row justify-content-center pb-4">
                <div className="col-md-12 heading-section text-center">
                    <h2 className="mb-4">Unforgettable Experiences</h2>
                </div>
            </div>
             <div className="row">
                {loadingExp ? (
                    <div className="col-md-12 text-center"><p>Loading experiences...</p></div>
                ) : experiences.length === 0 ? (
                    <div className="col-md-12 text-center"><p>No experiences found.</p></div>
                ) : (
                    experiences.map((item, idx) => <ExperienceCard key={idx} item={item} />)
                )}
            </div>
        </div>
      </section>

       {/* Hotels Section (Static for now as per original) */}
    <section className="ftco-section">
        <div className="container">
            <div className="row justify-content-center pb-4">
                <div className="col-md-12 heading-section text-center">
                    <h2 className="mb-4">Premium Accommodation</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 col-lg-3">
                    <div className="project">
                        <div className="img">
                            <img src="/images/hotel-1.jpg" className="img-fluid" alt="Hotel 1" onError={(e) => e.target.src='/images/destination-1.jpg'} />
                            <div className="text">
                                <span>Hotel</span>
                                <h3><a href="#">Cinnamon Grand</a></h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                     <div className="project">
                        <div className="img">
                            <img src="/images/hotel-2.jpg" className="img-fluid" alt="Hotel 2" onError={(e) => e.target.src='/images/destination-2.jpg'} />
                            <div className="text">
                                <span>Resort</span>
                                <h3><a href="#">Shangri-La Hambantota</a></h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                     <div className="project">
                        <div className="img">
                            <img src="/images/hotel-3.jpg" className="img-fluid" alt="Hotel 3" onError={(e) => e.target.src='/images/destination-3.jpg'} />
                            <div className="text">
                                <span>Boutique</span>
                                <h3><a href="#">98 Acres Resort</a></h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                     <div className="project">
                        <div className="img">
                            <img src="/images/hotel-4.jpg" className="img-fluid" alt="Hotel 4" onError={(e) => e.target.src='/images/destination-4.jpg'} />
                            <div className="text">
                                <span>Villa</span>
                                <h3><a href="#">Cape Weligama</a></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

      <section className="outro outro-banner">
        <h1>Relic Lanka Tours - Your Gateway to Paradise</h1>
      </section>
    </div>
  );
};

export default Home;
