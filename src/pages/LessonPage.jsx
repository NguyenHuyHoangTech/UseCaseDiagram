import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, Lock, HelpCircle } from 'lucide-react';
import { courseData } from '../courseData';
import Navbar from '../components/Navbar';

// Import widgets
import DragDropWidget from '../components/widgets/DragDropWidget';
import ReorderWidget from '../components/widgets/ReorderWidget';
import MultipleChoiceWidget from '../components/widgets/MultipleChoiceWidget';
import SpacedRepetitionCard from '../components/widgets/SpacedRepetitionCard';
import BrainGymDashboard from '../components/widgets/BrainGymDashboard';
import HighlighterWidget from '../components/widgets/HighlighterWidget';
import DecisionTreeWidget from '../components/widgets/DecisionTreeWidget';
import SpotErrorWidget from '../components/widgets/SpotErrorWidget';

// Import helper
import { injectSpacedRepetitionQuestion } from '../utils/spacedRepetition';

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
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)' }}>
        <h2 style={{ marginBottom: '16px' }}>Bài học không tồn tại!</h2>
        <button onClick={() => navigate('/')} style={{ padding: '12px 24px', background: 'var(--brand-color)', color: 'white', borderRadius: '100px', fontWeight: 600 }}>Quay lại Trang chủ</button>
      </div>
    );
  }

  // Get Spaced Repetition injected card if applicable
  const srData = useMemo(() => injectSpacedRepetitionQuestion(lesson.id), [lesson.id]);

  // Solved states
  const [mainSolved, setMainSolved] = useState(false);
  const [srSolved, setSrSolved] = useState(false);

  // Reset solved states when the lesson ID changes
  useEffect(() => {
    // If the lesson has an interactive type, it starts as unsolved.
    // If it's a standard static lesson, it starts as solved.
    setMainSolved(lesson.type ? false : true);
    
    // If there is a Spaced Repetition card injected, it starts as unsolved.
    // If not, it starts as solved.
    setSrSolved(srData ? false : true);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, lesson.id, srData]);

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
  const isFullySolved = mainSolved && srSolved;

  // Render the appropriate work area based on lesson type
  const renderWorkspace = () => {
    switch (lesson.type) {
      case 'highlighter':
        return <HighlighterWidget lesson={lesson} onSolved={setMainSolved} />;
      case 'decision-tree':
        return <DecisionTreeWidget lesson={lesson} onSolved={setMainSolved} />;
      case 'spot-the-error':
        return <SpotErrorWidget lesson={lesson} onSolved={setMainSolved} />;
      case 'drag-and-drop':
        return <DragDropWidget lesson={lesson} onSolved={setMainSolved} />;
      case 'reorder':
        return <ReorderWidget lesson={lesson} onSolved={setMainSolved} />;
      case 'multiple-choice':
        return <MultipleChoiceWidget lesson={lesson} onSolved={setMainSolved} />;
      case 'spaced-repetition-hub':
        return <BrainGymDashboard onSolved={setMainSolved} />;
      default:
        // Default text-only lesson fallback
        return (
          <div>
            <p style={{ fontSize: '1.1rem', color: '#495057', lineHeight: 1.8, marginBottom: '30px' }}>
              {lesson.content}
            </p>
            <div style={{
              marginTop: '40px',
              padding: '24px',
              background: '#f8f9fa',
              borderRadius: '16px',
              borderLeft: '4px solid var(--brand-color)'
            }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-hover)', marginBottom: '8px', fontWeight: 700 }}>
                <CheckCircle2 size={20} />
                Hướng dẫn lý thuyết
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Đọc kỹ lý thuyết trên để chuẩn bị cho các bài tập thực hành tương tác ở các bài tiếp theo trong chặng này. Hãy nhấn Tiếp tục để đi tiếp!
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
      <Navbar />
      
      {/* Progress Bar Header */}
      <div style={{ width: '100%', height: '4px', background: '#e9ecef', position: 'sticky', top: '72px', zIndex: 90 }}>
        <div style={{ 
          width: `${((currentIndex + 1) / allLessons.length) * 100}%`, 
          height: '100%', 
          background: 'linear-gradient(90deg, var(--brand-color) 0%, var(--brand-hover) 100%)',
          transition: 'width 0.5s ease-in-out'
        }} />
      </div>

      <main style={{ 
        flex: 1, 
        maxWidth: '850px', 
        width: '100%', 
        margin: '0 auto', 
        padding: '30px 20px 80px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Breadcrumb / Stage Info */}
        <div style={{ 
          color: 'var(--brand-color)', 
          fontWeight: 700, 
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '12px',
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
          fontSize: '2rem', 
          fontWeight: 800, 
          color: 'var(--text-main)',
          marginBottom: '24px',
          lineHeight: 1.25,
          letterSpacing: '-0.5px'
        }}>
          {lesson.title}
        </h1>

        {/* Lesson Content Area */}
        <div className="glass-panel" style={{
          padding: '36px',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
          background: 'white',
          border: '1px solid #e9ecef',
          flex: 1,
          marginBottom: '32px'
        }}>
          {/* Subtitle / Prompt for interactive lessons */}
          {lesson.type && lesson.type !== 'spaced-repetition-hub' && (
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px', borderBottom: '1px solid #f1f3f5', paddingBottom: '16px' }}>
              🎯 <strong>Thử thách thực hành:</strong> {lesson.content}
            </p>
          )}

          {renderWorkspace()}
        </div>

        {/* Spaced Repetition Bonus Card (Slides in when main lesson is solved) */}
        {srData && mainSolved && (
          <SpacedRepetitionCard data={srData} onSolved={setSrSolved} />
        )}

        {/* Bottom Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #e9ecef'
        }}>
          {/* Back Button */}
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{
              padding: '12px 24px',
              borderRadius: '100px',
              border: '2px solid #e9ecef',
              background: 'white',
              color: currentIndex === 0 ? '#ced4da' : '#495057',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: currentIndex === 0 ? 0.5 : 1
            }}
            onMouseOver={(e) => currentIndex > 0 && (e.currentTarget.style.borderColor = '#adb5bd')}
            onMouseOut={(e) => currentIndex > 0 && (e.currentTarget.style.borderColor = '#e9ecef')}
          >
            <ChevronLeft size={20} />
            Bài trước
          </button>

          {/* Continue / Lock Button */}
          <button 
            onClick={isLastLesson ? () => navigate('/') : handleNext}
            disabled={!isFullySolved}
            style={{
              padding: '14px 36px',
              borderRadius: '100px',
              background: isFullySolved ? 'var(--brand-color)' : '#e9ecef',
              color: isFullySolved ? 'white' : '#adb5bd',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: isFullySolved ? 'pointer' : 'not-allowed',
              boxShadow: isFullySolved ? '0 4px 14px rgba(18, 184, 134, 0.3)' : 'none',
              transition: 'all 0.2s ease',
              border: 'none'
            }}
            onMouseOver={(e) => {
              if (isFullySolved) {
                e.currentTarget.style.background = 'var(--brand-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              if (isFullySolved) {
                e.currentTarget.style.background = 'var(--brand-color)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {!isFullySolved && <Lock size={18} />}
            {isLastLesson ? 'Hoàn thành khóa học' : 'Tiếp tục'}
            {isFullySolved && !isLastLesson && <ChevronRight size={20} />}
          </button>
        </div>
      </main>
    </div>
  );
};

export default LessonPage;
