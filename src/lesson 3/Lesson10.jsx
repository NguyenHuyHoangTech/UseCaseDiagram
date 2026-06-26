import React from 'react';
import HighlighterWidget from '../components/widgets/HighlighterWidget';

const lessonData = {
  id: "lesson-10",
  title: 'Bài 10: Thử thách "Gạn Đục Khơi Trong" – Actor, Use Case, Lọc Nhiễu',
  type: "highlighter",
  content: "Tô màu các cụm từ trong đoạn văn dưới đây: 🔵 Actor | 🟢 Use Case | 🟠 Lọc Nhiễu",
  raw_text: "Kế toán trưởng muốn đăng nhập vào hệ thống bằng tài khoản công ty để xuất báo cáo tài chính cuối tháng dưới dạng file PDF. Giao diện xuất báo cáo phải sử dụng font chữ Arial và dữ liệu được lấy từ database Oracle.",
  segments: [
    { text: "Kế toán trưởng", type: "actor" },
    { text: " muốn đăng nhập vào hệ thống ", type: "usecase" },
    { text: "bằng tài khoản công ty", type: "noise" },
    { text: " để " },
    { text: "xuất báo cáo tài chính", type: "usecase" },
    { text: " cuối tháng " },
    { text: "dưới dạng file PDF", type: "noise" },
    { text: ". " },
    { text: "Giao diện xuất báo cáo phải sử dụng font chữ Arial", type: "noise" },
    { text: " và " },
    { text: "dữ liệu được lấy từ database Oracle", type: "noise" },
    { text: "." }
  ]
};

const Lesson10 = ({ onSolved }) => {
  return <HighlighterWidget lesson={lessonData} onSolved={onSolved} />;
};

export default Lesson10;
