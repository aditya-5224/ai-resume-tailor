import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-hero">
          <h1 className="about-title">About AI Resume Tailor</h1>
          <p className="about-subtitle">
            Transform your resume with the power of artificial intelligence
          </p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>What We Do</h2>
            <p>
              AI Resume Tailor is a cutting-edge web application that leverages advanced artificial intelligence 
              to help job seekers create perfectly tailored resumes for specific job opportunities. Our platform 
              analyzes job descriptions and optimizes your resume content to match employer requirements, 
              significantly increasing your chances of landing interviews.
            </p>
          </section>

          <section className="about-section">
            <h2>How It Works</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📄</div>
                <h3>Upload Your Resume</h3>
                <p>Simply upload your existing resume in DOCX format, and our system will extract and analyze your content.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Add Job Description</h3>
                <p>Paste the job description for your target position, and our AI will identify key requirements and skills.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h3>AI Optimization</h3>
                <p>Our advanced AI analyzes both documents and tailors your resume to highlight relevant experience and skills.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⬇️</div>
                <h3>Download Results</h3>
                <p>Get your perfectly tailored resume in professional DOC format, ready to submit to employers.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Why Choose AI Resume Tailor?</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">✨</span>
                <div>
                  <h4>Precision Matching</h4>
                  <p>Our AI understands job requirements and highlights your most relevant qualifications.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">⚡</span>
                <div>
                  <h4>Fast & Efficient</h4>
                  <p>Get a tailored resume in minutes, not hours of manual editing.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🎨</span>
                <div>
                  <h4>Professional Formatting</h4>
                  <p>Maintains your original formatting while optimizing content for maximum impact.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🔒</span>
                <div>
                  <h4>Secure & Private</h4>
                  <p>Your resume data is processed securely and never stored permanently.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Our Technology</h2>
            <p>
              Built with modern web technologies and powered by Google's Gemini AI, our platform combines 
              the latest in natural language processing with intuitive user experience design. We use 
              React for the frontend, Node.js for the backend, and state-of-the-art AI models to deliver 
              accurate, professional results every time.
            </p>
          </section>

          <section className="about-section">
            <h2>Get Started Today</h2>
            <p>
              Ready to transform your job search? Upload your resume and start creating tailored applications 
              that stand out from the competition. Join thousands of job seekers who have already discovered 
              the power of AI-driven resume optimization.
            </p>
            <div className="cta-container">
              <a href="/" className="cta-button">Start Tailoring Your Resume</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
