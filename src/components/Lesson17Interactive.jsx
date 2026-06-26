import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Step1Extract from './lesson17/Step1Extract';
import Step23Canvas from './lesson17/Step23Canvas';
import Step4MadLibs from './lesson17/Step4MadLibs';
import Step5Twist from './lesson17/Step5Twist';

const Lesson17Interactive = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep(prev => prev + 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Extract key="s1" onComplete={nextStep} />;
      case 2: return <Step23Canvas key="s2" onComplete={nextStep} />;
      case 3: return <Step4MadLibs key="s3" onComplete={nextStep} />;
      case 4: return <Step5Twist key="s4" onComplete={onFinish} />;
      default: return null;
    }
  };

  return (
    <div style={{ marginTop: '32px', background: '#f8f9fa', padding: '32px', borderRadius: '24px', border: '1px solid #dee2e6' }}>
      {/* Progress Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
        {[1, 2, 3, 4].map(step => (
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

export default Lesson17Interactive;
