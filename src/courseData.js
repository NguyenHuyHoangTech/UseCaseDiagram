// src/courseData.js
export const courseData = [
  {
    id: 1,
    title: "Chặng 1: Nền tảng & Các thành phần cốt lõi",
    description: "Giúp người học biết ngay Use Case dùng để làm gì và gọi tên đúng các thành phần.",
    lessons: [
      {
        id: "lesson-0",
        title: "Bài 0: Hệ thống tạo ra giá trị cho ai?",
        content: "Trước khi học Use Case, hãy nhìn hệ thống từ bên ngoài: một người hoặc tác nhân tương tác với hệ thống để đạt được một kết quả có ích.",
        type: "interactive-engine",
        engineId: "intro-machine"
      },
      {
        id: "lesson-1",
        title: "Bài 1: Use Case là gì?",
        content: "Cinema Booking System: nhìn Use Case như mục tiêu và giá trị mà Actor muốn đạt được, không phải UI, database, API hay xử lý kỹ thuật.",
        type: "interactive-engine",
        engineId: "what-not-how"
      },
      {
        id: "lesson-2",
        title: "Bài 2: Ranh giới hệ thống (System Boundary)",
        content: "Use Case nằm trong boundary; Actor và external system đứng ngoài.",
        type: "interactive-engine",
        engineId: "system-boundary"
      },
      {
        id: "lesson-3",
        title: "Bài 3: Tác nhân (Actor không chỉ là con người)",
        content: "Actor là vai trò, external system hoặc thời gian kích hoạt hệ thống.",
        type: "interactive-engine",
        engineId: "actor"
      },
      {
        id: "lesson-4",
        title: "Bài 4: Quy tắc đặt tên Use Case",
        content: "Tên tốt thường là động từ nghiệp vụ + đối tượng nghiệp vụ.",
        type: "interactive-engine",
        engineId: "naming"
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
        type: "level1-association",
        levelIndex: 1,
        content: "Hệ thống cần người kích hoạt. Hãy chọn đường nối đúng."
      },
      {
        id: "lesson-6",
        title: "Bài 6: Quan hệ bắt buộc (<<include>>)",
        type: "level1-association",
        levelIndex: 2,
        content: "Để rút được tiền, hệ thống BẮT BUỘC phải kiểm tra mã PIN."
      },
      {
        id: "lesson-7",
        title: "Bài 7: Quan hệ tùy chọn (<<extend>> & Extension Point)",
        type: "level1-association",
        levelIndex: 3,
        content: "Hệ thống có tính năng \"Áp mã giảm giá\" nhưng đây là tùy chọn."
      },
      {
        id: "lesson-8",
        title: "Bài 8: Phân biệt <<include>> và <<extend>>",
        type: "level1-association",
        levelIndex: 4,
        content: "Phân biệt rõ cái nào bắt buộc, cái nào tùy chọn bằng cách lấp đầy 4 khoảng trống."
      },
      {
        id: "lesson-9",
        title: "Bài 9: Quan hệ kế thừa (Generalization)",
        type: "level1-association",
        levelIndex: 5,
        content: "Khách hàng VIP bản chất vẫn là một Khách hàng. Hãy dùng lệnh Kế thừa để gom nhóm chúng lại."
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
      },
      {
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
        scenarioTitle: "Tình huống: Đăng nhập hệ thống",
        scenario: "Một thành viên đã đăng ký tài khoản thành công trên hệ thống. Bây giờ, họ truy cập vào trang đăng nhập và điền thông tin để bắt đầu sử dụng các tính năng bảo mật.",
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
        scenarioTitle: "Tình huống: Rút tiền ATM thành công",
        scenario: "Khách hàng muốn rút một khoản tiền mặt tại cây ATM. Mọi việc diễn ra thuận lợi: thẻ hợp lệ, nhập đúng mã PIN, số dư tài khoản đủ và máy ATM còn đủ tiền để giao dịch thành công.",
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
        scenarioTitle: "Tình huống: Nhập sai mã OTP quá giới hạn",
        scenario: "Khi thực hiện thanh toán hóa đơn mua sắm trực tuyến, hệ thống gửi một mã OTP về điện thoại khách hàng. Vì nhập nhầm, khách hàng đã điền sai mã này liên tiếp 3 lần.",
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
