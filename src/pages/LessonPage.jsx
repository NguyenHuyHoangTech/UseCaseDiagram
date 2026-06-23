import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { courseData } from '../courseData';
import Navbar from '../components/Navbar';

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the current lesson and its stage
  const { lesson, stage, allLessons, currentIndex } = useMemo(() => {
    let all = [];
    for (const st of courseData) {
      for (const l of st.lessons) {
        all.push({ ...l, stageTitle: st.title });
      }
    }
    const index = all.findIndex(l => l.id === id);
    return {
      lesson: all[index],
      stage: courseData.find(st => st.title === all[index]?.stageTitle),
      allLessons: all,
      currentIndex: index
    };
  }, [id]);

  if (!lesson) {
    return <div>Bài học không tồn tại!</div>;
  }

  const handleNext = () => {
    if (currentIndex < allLessons.length - 1) {
      navigate(`/lesson/${allLessons[currentIndex + 1].id}`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigate(`/lesson/${allLessons[currentIndex - 1].id}`);
    }
  };

  const isLastLesson = currentIndex === allLessons.length - 1;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ 
        flex: 1, 
        maxWidth: '800px', 
        width: '100%', 
        margin: '0 auto', 
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Breadcrumb / Stage Info */}
        <div style={{ 
          color: 'var(--brand-color)', 
          fontWeight: 600, 
          fontSize: '0.9rem',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Hành trình</span>
          <span>/</span>
          <span>{lesson.stageTitle}</span>
        </div>

        {/* Lesson Title */}
        <h1 style={{ 
          fontSize: '2.2rem', 
          fontWeight: 800, 
          color: 'var(--text-main)',
          marginBottom: '32px',
          lineHeight: 1.3
        }}>
          {lesson.title}
        </h1>

        {/* Lesson Content Area */}
        <div className="glass-panel" style={{
          padding: '40px',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          background: 'white',
          flex: 1,
          marginBottom: '40px'
        }}>
          <p style={{ fontSize: '1.1rem', color: '#495057', lineHeight: 1.8 }}>
            {lesson.content}
          </p>
          
          <div style={{ 
            marginTop: '40px', 
            padding: '24px', 
            background: '#f8f9fa', 
            borderRadius: '16px',
            borderLeft: '4px solid var(--brand-color)'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-hover)', marginBottom: '8px' }}>
              <CheckCircle2 size={20} />
              Mục tiêu bài học
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Sau bài học này, bạn sẽ nắm vững các khái niệm cốt lõi và sẵn sàng cho bài tập thực hành.
            </p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{
              padding: '12px 24px',
              borderRadius: '100px',
              border: '2px solid #e9ecef',
              color: currentIndex === 0 ? '#ced4da' : '#495057',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronLeft size={20} />
            Bài trước
          </button>

          <button 
            onClick={isLastLesson ? () => navigate('/') : handleNext}
            style={{
              padding: '12px 32px',
              borderRadius: '100px',
              background: 'var(--brand-color)',
              color: 'white',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(18, 184, 134, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {isLastLesson ? 'Hoàn thành khóa học' : 'Tiếp tục'}
            {!isLastLesson && <ChevronRight size={20} />}
          </button>
        </div>
      </main>
    </div>
  );
};

export default LessonPage;
