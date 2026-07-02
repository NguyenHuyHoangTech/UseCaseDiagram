export const getCompletedLessons = () => {
  try {
    const data = localStorage.getItem('user-completed-lessons');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const isLessonCompleted = (lessonId) => {
  const completed = getCompletedLessons();
  return completed.includes(lessonId);
};

export const markLessonCompleted = (lessonId, starsToAward = 10, zapsToAward = 1) => {
  const completed = getCompletedLessons();
  if (completed.includes(lessonId)) {
    return false; // Already completed, no double rewards
  }
  
  completed.push(lessonId);
  localStorage.setItem('user-completed-lessons', JSON.stringify(completed));
  
  // Award XP
  const currentStars = parseInt(localStorage.getItem('user-stars') || '850', 10);
  const currentZaps = parseInt(localStorage.getItem('user-zaps') || '12', 10);
  
  localStorage.setItem('user-stars', (currentStars + starsToAward).toString());
  localStorage.setItem('user-zaps', (currentZaps + zapsToAward).toString());
  
  // Dispatch event for UI to update (Navbar, JourneyMap)
  window.dispatchEvent(new Event('progress-updated'));
  window.dispatchEvent(new Event('stats-updated'));
  
  return true;
};
