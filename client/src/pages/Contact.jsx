import React, { useState } from 'react';
import { API } from '../services/api';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Contact = () => {
  useScrollAnimation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState(''); // 'submitting', 'success', 'error'

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      await API.sendInquiry({
        type: 'GENERAL',
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      setStatus('success');
      setFormData({ fullName: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error("Failed to send inquiry", error);
      setStatus('error');
    }
  };

  return (
    <div>
      <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: 'url("/images/bg_1.jpg")' }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end justify-content-center">
            <div className="col-md-9 text-center mb-5">
              <h1 className="mb-0 bread">Contact Us</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section contact-section ftco-no-pt ftco-no-pb">
        <div className="container">
          <div className="row d-flex justify-content-center py-5">
            <div className="col-md-8">
                {status === 'success' && (
                    <div className="alert alert-success">Your message has been sent. Thank you!</div>
                )}
                {status === 'error' && (
                    <div className="alert alert-danger">There was an error sending your message. Please try again.</div>
                )}

                <form onSubmit={handleSubmit} className="bg-light p-5 contact-form">
                    <div className="form-group">
                        <input type="text" name="fullName" className="form-control" placeholder="Your Name" value={formData.fullName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <input type="email" name="email" className="form-control" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <input type="text" name="phone" className="form-control" placeholder="Phone Number (Optional)" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <textarea name="message" id="" cols="30" rows="7" className="form-control" placeholder="Message" value={formData.message} onChange={handleChange} required></textarea>
                    </div>
                    <div className="form-group">
                        <input type="submit" value={status === 'submitting' ? 'Sending...' : 'Send Message'} className="btn btn-primary py-3 px-5" disabled={status === 'submitting'} />
                    </div>
                </form>
            </div>
          </div>
          <div className="row d-flex mb-5 contact-info">
		<div className="col-md-12 mb-4">
	            <h2 className="h3">Contact Information</h2>
	          </div>
		<div className="w-100"></div>
		<div className="col-md-3">
	            <p><span>Address:</span> 198 West 21th Street, Suite 721 New York NY 10016</p>
	          </div>
	          <div className="col-md-3">
	            <p><span>Phone:</span> <a href="tel://1234567920">+ 1235 2355 98</a></p>
	          </div>
	          <div className="col-md-3">
	            <p><span>Email:</span> <a href="mailto:info@yoursite.com">info@yoursite.com</a></p>
	          </div>
	          <div className="col-md-3">
	            <p><span>Website:</span> <a href="#">yoursite.com</a></p>
	          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
