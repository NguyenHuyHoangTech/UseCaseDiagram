import React from 'react';
import DecisionTreeWidget from '../components/widgets/DecisionTreeWidget';

const lessonData = {
  id: "lesson-12b",
  title: "Bài 12b: Chiều mũi tên Tùy chọn (<<extend>>)",
  type: "decision-tree",
  content: "Phân biệt chiều mũi tên chính xác của quan hệ tùy chọn <<extend>> để tránh nhầm lẫn với <<include>>.",
  scenario: "Khi khách hàng thực hiện chức năng [Thanh toán hóa đơn], họ có tùy chọn [Áp mã giảm giá] để được giảm trừ tiền. Hành động này là không bắt buộc và chỉ xảy ra khi khách hàng có mã.",
  question: "Thiết kế nào dưới đây thể hiện đúng chiều mũi tên của quan hệ <<extend>> giữa hai Use Case này?",
  options: [
    {
      text: "Vẽ mũi tên <<extend>> hướng từ Use Case 'Thanh toán hóa đơn' trỏ sang Use Case 'Áp mã giảm giá'.",
      correct: false,
      feedback: "Sai rồi! Trái ngược hoàn toàn với <<include>>, quan hệ <<extend>> (mở rộng) có chiều mũi tên đi ngược lại: hướng từ Use Case mở rộng (tùy chọn - ở đây là 'Áp mã giảm giá') trỏ ngược về Use Case cơ sở (chính - ở đây là 'Thanh toán hóa đơn'). Trỏ từ chính sang phụ là sai nguyên tắc!"
    },
    {
      text: "Vẽ mũi tên <<extend>> hướng từ Use Case 'Áp mã giảm giá' trỏ ngược về Use Case 'Thanh toán hóa đơn'.",
      correct: true,
      feedback: "Tuyệt vời! Trong quan hệ <<extend>>, mũi tên nét đứt luôn hướng từ Use Case mở rộng (Áp mã giảm giá) trỏ ngược về Use Case cơ sở (Thanh toán hóa đơn). Điều này thể hiện tính năng phụ đang 'mở rộng' và chèn thêm hành vi vào tính năng chính!"
    }
  ]
};

const Lesson12b = ({ onSolved }) => {
  return <DecisionTreeWidget lesson={lessonData} onSolved={onSolved} />;
};

export default Lesson12b;
