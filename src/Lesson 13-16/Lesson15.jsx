import React from 'react';
import MultipleChoiceWidget from '../components/widgets/MultipleChoiceWidget';

const lessonData = {
  id: "lesson-15",
  title: "Bài 15: Luồng ngoại lệ & Luồng thay thế",
  type: "multiple-choice",
  scenarioTitle: "Tình huống: Nhập sai mã OTP quá giới hạn",
  scenario: "Khi thực hiện thanh toán hóa đơn mua sắm trực tuyến, hệ thống gửi một mã OTP về điện thoại khách hàng. Vì nhập nhầm, khách hàng đã điền sai mã này liên tiếp 3 lần.",
  question: "Trong Use Case 'Thanh toán hóa đơn', nếu khách hàng nhập sai mã OTP quá 3 lần, kịch bản này nên xử lý theo luồng nào?",
  content: "Trong Use Case 'Thanh toán hóa đơn', nếu khách hàng nhập sai mã OTP quá 3 lần, kịch bản này nên xử lý theo luồng nào?",
  options: [
    { text: "Luồng chính (Happy Path)", correct: false },
    { text: "Luồng thay thế (Alternative Flow) - Cho nhập lại OTP khác", correct: false },
    { text: "Luồng ngoại lệ (Exception Flow) - Hủy giao dịch, khóa tạm thời tính năng nhận OTP và thông báo lỗi", correct: true }
  ]
};

const Lesson15 = ({ onSolved }) => {
  return <MultipleChoiceWidget lesson={lessonData} onSolved={onSolved} />;
};

export default Lesson15;
