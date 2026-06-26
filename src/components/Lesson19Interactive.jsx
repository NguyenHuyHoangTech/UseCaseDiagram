import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Step1Packages from './lesson19/Step1Packages';
import Step2Canvas from './lesson19/Step2Canvas';
import Step3Exceptions from './lesson19/Step3Exceptions';

const Lesson19Interactive = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep(prev => prev + 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Packages key="s1" onComplete={nextStep} />;
      case 2: return <Step2Canvas key="s2" onComplete={nextStep} />;
      case 3: return <Step3Exceptions key="s3" onComplete={onFinish} />;
      default: return null;
    }
  };

  return (
    <div style={{ marginTop: '32px', background: '#f8f9fa', padding: '32px', borderRadius: '24px', border: '1px solid #dee2e6' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
        {[1, 2, 3].map(step => (
          <div 
            key={step} 
            style={{ 
              width: '12px', height: '12px', borderRadius: '50%', 
              background: step === currentStep ? 'var(--brand-color)' : step < currentStep ? 'var(--brand-color)' : '#dee2e6',
              opacity: step > currentStep ? 0.5 : 1
            }} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
};

export default Lesson19Interactive;
