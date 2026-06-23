// src/courseData.js
export const courseData = [
  {
    id: 1,
    title: "Chặng 1: Nền tảng & Các thành phần cốt lõi",
    description: "Giúp người học biết ngay Use Case dùng để làm gì và gọi tên đúng các thành phần.",
    lessons: [
      {
        id: "lesson-1",
        title: "Bài 1: Use Case là gì và Lăng kính hệ thống",
        content: "Soạn nội dung giải thích khái niệm Use Case. Nhấn mạnh nguyên tắc: Use Case mô tả 'Hệ thống làm được gì?' (What) chứ không phải 'Hệ thống làm điều đó như thế nào?' (How)."
      },
      {
        id: "lesson-2",
        title: "Bài 2: Ranh giới hệ thống (System Boundary)",
        content: "Dạy cách vẽ và xác định vạch ranh giới. Định nghĩa rõ cái gì nằm trong (phần mềm cần code) và cái gì nằm ngoài (môi trường)."
      },
      {
        id: "lesson-3",
        title: "Bài 3: Tác nhân (Actor)",
        content: "Phân loại và lấy ví dụ chi tiết về 3 loại Actor: Con người (Khách hàng, Admin), Hệ thống bên ngoài (Cổng thanh toán, API), và Thời gian (Hệ thống tự động chạy lúc 00:00)."
      },
      {
        id: "lesson-4",
        title: "Bài 4: Ca sử dụng (Use Case) Quy tắc đặt tên",
        content: "Hướng dẫn công thức đặt tên chuẩn bằng 'Động từ + Danh từ' (VD: Đăng nhập, Thêm vào giỏ hàng) và liệt kê các tên gọi sai phổ biến cần tránh."
      }
    ]
  },
  {
    id: 2,
    title: "Chặng 2: Ngữ pháp sơ đồ & Các mối quan hệ",
    description: "Dạy cách nối các mũi tên. Đây là phần khó nhất, thật dễ hiểu và có nhiều ví dụ so sánh.",
    lessons: [
      {
        id: "lesson-5",
        title: "Bài 5: Quan hệ giao tiếp (Association)",
        content: "Quy tắc nối đường thẳng cơ bản giữa Actor và Use Case. Nguyên tắc: Hai Actor không giao tiếp với nhau trong biểu đồ này."
      },
      {
        id: "lesson-6",
        title: "Bài 6: Quan hệ bắt buộc (<<include>>)",
        content: "Định nghĩa, cách vẽ mũi tên (chĩa vào Use Case được gọi). Lấy ví dụ minh họa (VD: 'Rút tiền' bắt buộc phải có 'Kiểm tra mã PIN')."
      },
      {
        id: "lesson-7",
        title: "Bài 7: Quan hệ tùy chọn (<<extend>> & Extension Point)",
        content: "Định nghĩa điều kiện rẽ nhánh, cách vẽ mũi tên (chĩa ngược lại Use Case gốc). Lấy ví dụ minh họa (VD: 'Mua hàng' có tùy chọn 'Áp mã giảm giá')."
      },
      {
        id: "lesson-8",
        title: "Bài 8: Phân biệt <<include>> và <<extend>>",
        content: "Tổng hợp bảng so sánh điểm khác biệt và soạn 10 tình huống trắc nghiệm để người học tự phân biệt."
      },
      {
        id: "lesson-9",
        title: "Bài 9: Quan hệ kế thừa (Generalization)",
        content: "Hướng dẫn cách gom nhóm các Actor có chung quyền hạn hoặc các Use Case có chung bản chất."
      }
    ]
  },
  {
    id: 3,
    title: "Chặng 3: Kỹ năng phân tích Requirement",
    description: "Dạy người học cách đọc một đoạn văn bản yêu cầu và nhặt ra đúng các thành phần.",
    lessons: [
      {
        id: "lesson-10",
        title: "Bài 10: Kỹ thuật trích xuất từ khóa",
        content: "Dạy phương pháp gạch chân: Danh từ -> Actor, Cụm động từ -> Use Case. Cách loại bỏ các thông tin gây nhiễu."
      },
      {
        id: "lesson-11",
        title: "Bài 11: Mức độ chi tiết (Granularity)",
        content: "Giải thích quy tắc CRUD. Hướng dẫn khi nào nên gom thành 1 Use Case 'Quản lý', khi nào phải tách rời."
      },
      {
        id: "lesson-12",
        title: "Bài 12: Các lỗi 'chết người' thường gặp (Anti-patterns)",
        content: "Soạn một danh sách các biểu đồ vẽ sai bét và hướng dẫn cách sửa."
      }
    ]
  },
  {
    id: 4,
    title: "Chặng 4: Đặc tả kịch bản (Specification)",
    description: "Hướng dẫn viết kịch bản chi tiết cho Use Case và hệ thống bài tập củng cố kiến thức.",
    lessons: [
      {
        id: "lesson-13",
        title: "Bài 13: Cấu trúc một tài liệu Đặc tả Use Case",
        content: "Cung cấp Template chuẩn. Soạn nội dung giải thích Tiền điều kiện và Hậu điều kiện."
      },
      {
        id: "lesson-14",
        title: "Bài 14: Luồng sự kiện chính (Happy Path)",
        content: "Hướng dẫn cách viết kịch bản hội thoại chuẩn mực giữa Actor và Hệ thống khi mọi thứ diễn ra suôn sẻ."
      },
      {
        id: "lesson-15",
        title: "Bài 15: Luồng ngoại lệ & Luồng thay thế",
        content: "Hướng dẫn cách xử lý sự cố trong kịch bản (VD: Nhập sai mật khẩu 3 lần, rớt mạng)."
      },
      {
        id: "lesson-16",
        title: "Bài 16: Chuỗi bài tập Lặp lại ngắt quãng",
        content: "Rải các bài tập ôn tập về <<include>> và <<extend>> vào cuối bài học để ép nhớ kiến thức."
      }
    ]
  },
  {
    id: 5,
    title: "Chặng 5: Case Study Thực chiến & Ngân hàng đề",
    description: "Tập trung soạn thảo các dự án mẫu từ đoạn văn mô tả hệ thống cho đến sơ đồ đáp án.",
    lessons: [
      {
        id: "lesson-17",
        title: "Bài 17: Case Study Level 1 (Hệ thống nhỏ)",
        content: "Cung cấp đề bài và đáp án chi tiết: Máy rút tiền ATM, Ứng dụng đặt đồ ăn nhanh."
      },
      {
        id: "lesson-18",
        title: "Bài 18: Case Study Level 2 (Hệ thống nhiều phân quyền)",
        content: "Cung cấp đề bài và đáp án: Quản lý thư viện trường học, Đăng ký tín chỉ đại học."
      },
      {
        id: "lesson-19",
        title: "Bài 19: Case Study Level 3 (Dự án lớn)",
        content: "Soạn một đề án cực khó (Sàn TMĐT hoặc Đặt vé máy bay). Hướng dẫn phân rã hệ thống."
      },
      {
        id: "lesson-20",
        title: "Bài 20: Ngân hàng Requirement mở rộng",
        content: "Tự động sinh ra thêm khoảng 20-30 đề bài Requirement ở nhiều lĩnh vực khác nhau để thực hành."
      }
    ]
  }
];
