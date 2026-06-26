import React from 'react';
import ReorderWidget from '../components/widgets/ReorderWidget';

const lessonData = {
  id: "lesson-14",
  title: "Bài 14: Luồng sự kiện chính (Happy Path)",
  type: "reorder",
  content: "Sắp xếp kịch bản kịch bản hội thoại chuẩn giữa Actor và Hệ thống cho Use Case: Rút tiền ATM.",
  steps: [
    "1. Actor đưa thẻ vào máy và nhập PIN.",
    "2. Hệ thống xác thực PIN thành công và hiển thị menu chức năng.",
    "3. Actor chọn chức năng Rút tiền và nhập số tiền.",
    "4. Hệ thống trừ tiền tài khoản, trả thẻ và nhả tiền."
  ]
};

const Lesson14 = ({ onSolved }) => {
  return <ReorderWidget lesson={lessonData} onSolved={onSolved} />;
};

export default Lesson14;
