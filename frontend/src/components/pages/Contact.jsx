import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-hero">
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-subtitle">
            Have questions, feedback, or need support? We'd love to hear from you!
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email Us</h3>
              <p>support@airesumetailor.com</p>
              <p>For general inquiries and support</p>
            </div>

            <div className="info-card">
              <div className="info-icon">💼</div>
              <h3>Business Inquiries</h3>
              <p>business@airesumetailor.com</p>
              <p>For partnerships and enterprise solutions</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🚀</div>
              <h3>Feature Requests</h3>
              <p>feedback@airesumetailor.com</p>
              <p>Share your ideas and suggestions</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🛠️</div>
              <h3>Technical Support</h3>
              <p>tech@airesumetailor.com</p>
              <p>For technical issues and bug reports</p>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            {isSubmitted ? (
              <div className="success-message">
                <div className="success-icon">✅</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="business">Business Partnership</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button type="submit" className="submit-button">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Is my resume data secure?</h4>
              <p>Yes, we take privacy seriously. Your resume data is processed securely and is not stored permanently on our servers.</p>
            </div>
            <div className="faq-item">
              <h4>What file formats do you support?</h4>
              <p>Currently, we support DOCX format for resume uploads. The tailored resume is provided as a DOC file for maximum compatibility.</p>
            </div>
            <div className="faq-item">
              <h4>How accurate is the AI tailoring?</h4>
              <p>Our AI uses advanced natural language processing to analyze job requirements and match them with your experience. Results are highly accurate and professional.</p>
            </div>
            <div className="faq-item">
              <h4>Can I use this for multiple job applications?</h4>
              <p>Absolutely! You can tailor your resume for as many different job positions as you like. Each tailoring is optimized for the specific job description you provide.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer refunds?</h4>
              <p>Our service is currently free to use. We're committed to providing value to job seekers without any cost barriers.</p>
            </div>
            <div className="faq-item">
              <h4>How long does the tailoring process take?</h4>
              <p>The AI tailoring process typically takes 30-60 seconds, depending on the length and complexity of your resume and job description.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
