import React from 'react';
import DecisionTreeWidget from '../components/widgets/DecisionTreeWidget';

const lessonData = {
  id: "lesson-11",
  title: "Bài 11: Mức độ chi tiết (Granularity - CRUD)",
  type: "decision-tree",
  content: "Quyết định mức độ chi tiết (Granularity) khi gom nhóm hoặc tách biệt các tác vụ CRUD để đảm bảo bảo mật.",
  scenario: "Hệ thống có 2 Actor: 'Khách hàng' và 'Admin'. Khách hàng được quyền [Xem thông tin cá nhân] của mình. Admin được quyền [Xem, Sửa, Xóa thông tin cá nhân của khách hàng].",
  question: "Bạn nên thiết kế các Use Case này như thế nào trong sơ đồ?",
  options: [
    {
      text: "Vẽ 1 Use Case 'Quản lý thông tin cá nhân' và nối cả Khách hàng lẫn Admin vào.",
      correct: false,
      feedback: "Sai rồi! Nếu vẽ như vậy, Khách hàng sẽ vô tình được cấp quyền Sửa/Xóa thông tin cá nhân giống như Admin (vì cả hai đều trỏ vào chung 1 Use Case lớn chứa tất cả hành động). Đây là lỗ hổng bảo mật CRUD cực kỳ nghiêm trọng!"
    },
    {
      text: "Tách thành các Use Case riêng biệt: 'Xem thông tin' (cho cả hai), 'Sửa/Xóa thông tin' (chỉ nối với Admin).",
      correct: true,
      feedback: "Chính xác! Khi các Actor có quyền hạn khác nhau trên cùng một đối tượng dữ liệu, ta bắt buộc phải phân rã (tách biệt) các Use Case để đảm bảo tính an toàn thông tin và phân quyền chính xác."
    }
  ]
};

const Lesson11 = ({ onSolved }) => {
  return <DecisionTreeWidget lesson={lessonData} onSolved={onSolved} />;
};

export default Lesson11;
