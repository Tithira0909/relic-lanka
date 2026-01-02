import React, { useEffect, useState } from 'react';
import { API } from '../services/api';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Search = () => {
  useScrollAnimation();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({ tours: [], destinations: [], experiences: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (q) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await API.search(q);
      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
    performSearch(query);
  };

  return (
    <div>
      <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: 'url("/images/bg_1.jpg")' }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end justify-content-center">
            <div className="col-md-9 text-center mb-5">
              <h1 className="mb-0 bread">Search</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section">
        <div className="container">
            <div className="row justify-content-center mb-5">
                <div className="col-md-8">
                    <form onSubmit={handleSearchSubmit} className="search-form">
                        <div className="form-group d-flex">
                            <input type="text" className="form-control" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
                            <button type="submit" className="btn btn-primary ml-2 px-4">Search</button>
                        </div>
                    </form>
                </div>
            </div>

            {loading && <div className="text-center">Loading...</div>}

            {!loading && hasSearched && (
                <div>
                     {/* Tours */}
                     {results.tours.length > 0 && (
                         <div className="mb-5">
                             <h3>Tours</h3>
                             <ul className="list-group">
                                 {results.tours.map(t => (
                                     <li key={t.id} className="list-group-item">
                                         <Link to={`/tours/${t.slug}`}>{t.name}</Link>
                                     </li>
                                 ))}
                             </ul>
                         </div>
                     )}

                     {/* Destinations */}
                     {results.destinations.length > 0 && (
                         <div className="mb-5">
                             <h3>Destinations</h3>
                             <ul className="list-group">
                                 {results.destinations.map(d => (
                                     <li key={d.id} className="list-group-item">
                                         <Link to={`/tours/${d.tour.slug}`}>{d.name}</Link> (in tour)
                                     </li>
                                 ))}
                             </ul>
                         </div>
                     )}

                     {/* Experiences */}
                     {results.experiences.length > 0 && (
                         <div className="mb-5">
                             <h3>Experiences</h3>
                             <ul className="list-group">
                                 {results.experiences.map(e => (
                                     <li key={e.id} className="list-group-item">
                                         <Link to={`/tours/${e.tour.slug}`}>{e.title}</Link> (in tour)
                                     </li>
                                 ))}
                             </ul>
                         </div>
                     )}

                     {results.tours.length === 0 && results.destinations.length === 0 && results.experiences.length === 0 && (
                         <div className="text-center">No results found for "{initialQuery}".</div>
                     )}
                </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default Search;
