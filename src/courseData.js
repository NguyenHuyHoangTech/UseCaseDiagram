import { interactiveLessons } from "./lessonEngine/lessonData";

export const courseData = [
  {
    id: 1,
    title: "Use Case Diagram: Brilliant-style Interactive Course",
    description: "Học bằng thao tác trực tiếp: chọn block, phân loại, đặt boundary, nối actor, bấm Run và xem hậu quả.",
    lessons: interactiveLessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      content: lesson.description,
    })),
  },
];

