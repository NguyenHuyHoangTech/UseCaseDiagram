import React from 'react';
import DecisionTreeWidget from '../components/widgets/DecisionTreeWidget';

const lessonData = {
  id: "lesson-12",
  title: "Bài 12: Biến Use Case thành Flowchart (Anti-patterns)",
  type: "decision-tree",
  content: "Tìm kiếm và chỉ ra lỗi thiết kế sơ đồ Use Case thường gặp (Anti-pattern) bằng cách so sánh và chọn sơ đồ thiết kế đúng chuẩn UML bên dưới.",
  scenario: "Bạn cần vẽ sơ đồ Use Case cho hai tính năng: 'Đăng nhập' và 'Xem số dư'. Nghiệp vụ yêu cầu người dùng bắt buộc phải đăng nhập thành công thì mới có thể xem được số dư tài khoản của mình.",
  question: "Sơ đồ nào dưới đây mô tả đúng mối quan hệ nghiệp vụ giữa hai Use Case này mà không phạm phải lỗi trình tự (Anti-pattern)?",
  options: [
    {
      text: "Thiết kế sơ đồ vẽ mũi tên chỉ hướng (mũi tên trình tự) nối trực tiếp từ Use Case 'Đăng nhập' sang 'Xem số dư'.",
      image: "/anti_pattern_flowchart.png",
      correct: false,
      feedback: "Sai rồi! Biểu đồ Use Case chỉ mô tả hệ thống có những chức năng gì (What), tuyệt đối không được dùng để vẽ luồng quy trình thực hiện tuần tự (Workflow/Flowchart) giữa các Use Case bằng cách nối mũi tên chỉ hướng. Đây là lỗi biến Use Case thành Flowchart kinh điển!"
    },
    {
      text: "Thiết kế sơ đồ vẽ hai Use Case độc lập trên sơ đồ (không nối mũi tên trình tự). Luồng tuần tự đăng nhập sẽ được đưa vào phần đặc tả 'Tiền điều kiện' (Pre-condition) của 'Xem số dư'.",
      image: "/correct_pattern_flowchart.png",
      correct: true,
      feedback: "Xuất sắc! Các Use Case trên sơ đồ phải hoàn toàn độc lập về mặt quy trình. Thứ tự thực hiện trước sau (phải đăng nhập trước) sẽ được mô tả cụ thể trong tài liệu Đặc tả kịch bản (mục Tiền điều kiện) hoặc sử dụng biểu đồ Activity Diagram!"
    }
  ]
};

const Lesson12 = ({ onSolved }) => {
  return <DecisionTreeWidget lesson={lessonData} onSolved={onSolved} />;
};

export default Lesson12;
