import React, { useEffect, useState } from 'react';
import { API } from '../services/api';
import useScrollAnimation from '../hooks/useScrollAnimation';

const About = () => {
  useScrollAnimation();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await API.getPage('ABOUT');
        setPage(data);
      } catch (error) {
        console.error("Failed to fetch about page", error);
        // Fallback content if API fails or page not seeded
        setPage({
            title: "About Us",
            contentHtml: "<p>Welcome to Relic Lanka Tours. We are dedicated to providing you the best experience in Sri Lanka.</p>"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div>
      <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: 'url("/images/bg_1.jpg")' }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end justify-content-center">
            <div className="col-md-9 text-center mb-5">
              <h1 className="mb-0 bread">{page.title}</h1>
            </div>
          </div>
        </div>
      </section>
      <section className="ftco-section">
        <div className="container">
           <div className="row justify-content-center">
             <div className="col-md-12 ftco-animate fadeInUp ftco-animated">
                 <div dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default About;
