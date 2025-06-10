import React from 'react';
import { FileText, CheckCircle, Globe } from 'lucide-react';
import './HowItWorks.css';

export default function HowItWorks() {
  const steps = [
    {
      icon: <FileText />,
      title: 'Post the Ad',
      description: 'Fill out the listing form for your vehicle'
    },
    {
      icon: <CheckCircle />,
      title: 'Admin Approval',
      description: 'We verify that all cars published are real and accurate'
    },
    {
      icon: <Globe />,
      title: 'Ad Publishing',
      description: 'Advertisement is published and made visible to users on the website'
    }
  ];

  return (
    <div className="how-it-works-container">
      <div className="how-it-works-wrapper">
        <div className="how-it-works-header">
          <h2 className="how-it-works-title">How it works?</h2>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-icon">
                {step.icon}
              </div>
              <h3 className="step-title">
                {step.title}
              </h3>
              <p className="step-description">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}