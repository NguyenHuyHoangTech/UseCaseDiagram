import React from 'react';
import DragDropWidget from '../components/widgets/DragDropWidget';

const lessonData = {
  id: "lesson-13",
  title: "Bài 13: Cấu trúc Đặc tả Use Case (Pre/Post-conditions)",
  type: "drag-and-drop",
  content: "Phân biệt Tiền điều kiện và Hậu điều kiện của Use Case: Đăng nhập hệ thống.",
  items: [
    { text: "Người dùng truy cập trang login", category: "Pre-condition" },
    { text: "Hệ thống hiển thị trạng thái Online", category: "Post-condition" },
    { text: "Tài khoản người dùng đã được kích hoạt trước đó", category: "Pre-condition" },
    { text: "Session đăng nhập được tạo thành công", category: "Post-condition" }
  ]
};

const Lesson13 = ({ onSolved }) => {
  return <DragDropWidget lesson={lessonData} onSolved={onSolved} />;
};

export default Lesson13;
