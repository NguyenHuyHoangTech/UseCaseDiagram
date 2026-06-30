import React from 'react';
import { useNavigate } from 'react-router-dom';
import { courseData } from '../courseData';
import { getCompletedLessons } from '../utils/progress';

const Hero = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    const completed = getCompletedLessons();
    
    // Flatten all lessons
    const allLessons = [];
    courseData.forEach(stage => {
      stage.lessons.forEach(lesson => {
        // Skip hidden lessons
        if (!['lesson-18', 'lesson-19', 'lesson-20'].includes(lesson.id)) {
          allLessons.push(lesson);
        }
      });
    });

    // Find first uncompleted
    const nextLesson = allLessons.find(l => !completed.includes(l.id));
    
    if (nextLesson) {
      navigate(`/lesson/${nextLesson.id}`);
    } else if (allLessons.length > 0) {
      // If all completed, just go to first lesson
      navigate(`/lesson/${allLessons[0].id}`);
    }
  };

  return (
    <header style={{
      textAlign: 'center',
      padding: '60px 20px 40px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '12px',
        fontWeight: 800,
        letterSpacing: '-1px'
      }}>Làm chủ Use Case Diagram</h1>
      <p style={{
        color: 'var(--text-muted)',
        fontSize: '1.1rem',
        marginBottom: '30px'
      }}>
        Học cách phân tích hệ thống như một kỹ sư thực thụ thông qua các thử thách tương tác trực quan.
      </p>
      <button 
        onClick={handleContinue}
        style={{
        backgroundColor: 'var(--brand-color)',
        color: 'white',
        border: 'none',
        padding: '16px 40px',
        borderRadius: '100px',
        fontSize: '1.1rem',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(18, 184, 134, 0.3)',
        transition: 'all 0.2s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--brand-hover)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(18, 184, 134, 0.4)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--brand-color)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(18, 184, 134, 0.3)';
      }}
      >
        Tiếp tục học
      </button>
    </header>
  );
};

export default Hero;
