import React from 'react';
import DecisionTreeWidget from '../components/widgets/DecisionTreeWidget';

const lessonData = {
  id: "lesson-11b",
  title: "Bài 11b: Chiều mũi tên Bắt buộc (<<include>>)",
  type: "decision-tree",
  content: "Phân biệt chiều mũi tên chính xác của quan hệ bắt buộc <<include>> trong thiết kế thực tế.",
  scenario: "Hệ thống yêu cầu mỗi khi khách hàng thực hiện chức năng [Rút tiền ATM], hệ thống bắt buộc phải tự động thực hiện tác vụ [Kiểm tra số dư tài khoản] để đảm bảo an toàn giao dịch.",
  question: "Thiết kế nào dưới đây thể hiện đúng chiều mũi tên của quan hệ <<include>> giữa hai Use Case này?",
  options: [
    {
      text: "Vẽ mũi tên <<include>> hướng từ Use Case 'Kiểm tra số dư' trỏ ngược về Use Case 'Rút tiền ATM'.",
      correct: false,
      feedback: "Sai rồi! Trong mối quan hệ <<include>>, mũi tên nét đứt luôn luôn bắt đầu từ Use Case cơ sở (Use Case chính - ở đây là 'Rút tiền ATM') và trỏ vào Use Case bắt buộc được bao gồm (Use Case phụ - ở đây là 'Kiểm tra số dư'). Trỏ ngược lại là sai hoàn toàn chuẩn UML!"
    },
    {
      text: "Vẽ mũi tên <<include>> hướng từ Use Case 'Rút tiền ATM' trỏ thẳng vào Use Case 'Kiểm tra số dư'.",
      correct: true,
      feedback: "Xuất sắc! Quan hệ <<include>> (bao gồm) thể hiện rằng Use Case chính bắt buộc cần tích hợp hành vi của Use Case phụ để hoàn thành nhiệm vụ. Vì vậy, mũi tên bắt buộc phải hướng từ chính sang phụ (Rút tiền ATM -> Kiểm tra số dư)!"
    }
  ]
};

const Lesson11b = ({ onSolved }) => {
  return <DecisionTreeWidget lesson={lessonData} onSolved={onSolved} />;
};

export default Lesson11b;
