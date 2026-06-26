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
        title: "Bài 10: Kỹ thuật trích xuất từ khóa & Lọc nhiễu",
        type: "highlighter",
        content: "Hãy phân tích yêu cầu dưới đây. Trích xuất Actor (👤), Use Case (⚙️) và Lọc nhiễu chi tiết kỹ thuật (🚫) bằng cách tô màu thích hợp.",
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
      },
      {
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
      },
      {
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
        title: "Bài 13: Cấu trúc Đặc tả Use Case (Pre/Post-conditions)",
        type: "drag-and-drop",
        content: "Phân biệt Tiền điều kiện và Hậu điều kiện của Use Case: Đăng nhập hệ thống.",
        items: [
          { text: "Người dùng truy cập trang login", category: "Pre-condition" },
          { text: "Hệ thống hiển thị trạng thái Online", category: "Post-condition" },
          { text: "Tài khoản người dùng đã được kích hoạt trước đó", category: "Pre-condition" },
          { text: "Session đăng nhập được tạo thành công", category: "Post-condition" }
        ]
      },
      {
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
      },
      {
        id: "lesson-15",
        title: "Bài 15: Luồng ngoại lệ & Luồng thay thế",
        type: "multiple-choice",
        question: "Trong Use Case 'Thanh toán hóa đơn', nếu khách hàng nhập sai mã OTP quá 3 lần, kịch bản này nên xử lý theo luồng nào?",
        content: "Trong Use Case 'Thanh toán hóa đơn', nếu khách hàng nhập sai mã OTP quá 3 lần, kịch bản này nên xử lý theo luồng nào?",
        options: [
          { text: "Luồng chính (Happy Path)", correct: false },
          { text: "Luồng thay thế (Alternative Flow) - Cho nhập lại OTP khác", correct: false },
          { text: "Luồng ngoại lệ (Exception Flow) - Hủy giao dịch, khóa tạm thời tính năng nhận OTP và thông báo lỗi", correct: true }
        ]
      },
      {
        id: "lesson-16",
        title: "Bài 16: Chuỗi bài tập Lặp lại ngắt quãng",
        type: "spaced-repetition-hub",
        content: "Hệ thống ôn tập thông minh (Brain Injector) giúp bạn củng cố sâu sắc các mối quan hệ <<include>> và <<extend>> thông qua các bài tập lặp lại ngắt quãng."
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
