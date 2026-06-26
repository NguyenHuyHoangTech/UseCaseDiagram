import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import LessonPlayer from "../components/lesson/LessonPlayer";
import { interactiveLessons } from "../lessonEngine/lessonData";

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentIndex = useMemo(
    () => interactiveLessons.findIndex((lesson) => lesson.id === id),
    [id],
  );

  const lesson = interactiveLessons[currentIndex];

  if (!lesson) {
    return (
      <div>
        <Navbar />
        <main className="lesson-page-shell">
          <h1>Bài học không tồn tại</h1>
          <button className="run-button" onClick={() => navigate("/lesson/intro-machine")}>Mở lesson đầu tiên</button>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <LessonPlayer
        lesson={lesson}
        hasNextLesson={currentIndex < interactiveLessons.length - 1}
        onBack={() => navigate("/")}
        onNextLesson={() => {
          if (currentIndex < interactiveLessons.length - 1) {
            navigate(`/lesson/${interactiveLessons[currentIndex + 1].id}`);
          } else {
            navigate("/");
          }
        }}
      />
    </div>
  );
}

