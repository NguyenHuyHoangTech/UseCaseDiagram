// src/utils/spacedRepetition.js

/**
 * Brain Injector Middleware:
 * Injects a spaced repetition review question at the end of specific lessons
 * to reinforce <<include>> and <<extend>> concepts.
 */
export const injectSpacedRepetitionQuestion = (currentLessonId) => {
  const spacedRepetitionData = {
    'lesson-13': {
      id: 'sr-13',
      title: '⚡ THỬ THÁCH LẶP LẠI NGẮT QUÃNG (SPACED REPETITION)',
      question: 'Use Case [Xác thực vân tay] quan hệ thế nào với Use Case [Mở khóa điện thoại]?',
      options: [
        { text: '<<include>>', correct: true },
        { text: '<<extend>>', correct: false }
      ],
      explanation: 'Trong kịch bản này, Use Case [Mở khóa điện thoại] đòi hỏi hành động [Xác thực vân tay] như một phần bắt buộc (hoặc một tiến trình con cần thực hiện) để hoàn tất. Do đó, đây là mối quan hệ <<include>> (bắt buộc phải có).'
    },
    'lesson-15': {
      id: 'sr-15',
      title: '⚡ THỬ THÁCH LẶP LẠI NGẮT QUÃNG (SPACED REPETITION)',
      question: 'Use Case [Áp dụng mã giảm giá] quan hệ thế nào với Use Case [Thanh toán]?',
      options: [
        { text: '<<include>>', correct: false },
        { text: '<<extend>>', correct: true }
      ],
      explanation: 'Hành động [Áp dụng mã giảm giá] là tùy chọn (optional) và chỉ diễn ra tại một thời điểm nhất định (Extension Point) khi thực hiện [Thanh toán]. Giao dịch thanh toán vẫn hoàn tất thành công ngay cả khi không có mã giảm giá. Do đó, đây là mối quan hệ <<extend>>.'
    },
    'lesson-17': {
      id: 'sr-17',
      title: '⚡ THỬ THÁCH LẶP LẠI NGẮT QUÃNG (SPACED REPETITION)',
      question: 'Use Case [Thêm vào danh sách yêu thích] quan hệ thế nào với Use Case [Xem chi tiết sản phẩm]?',
      options: [
        { text: '<<include>>', correct: false },
        { text: '<<extend>>', correct: true }
      ],
      explanation: 'Khi xem chi tiết sản phẩm, người dùng có thể tùy chọn thêm sản phẩm đó vào danh sách yêu thích. Đây là hành động không bắt buộc để hoàn tất việc xem chi tiết, đại diện cho mối quan hệ <<extend>>.'
    }
  };

  return spacedRepetitionData[currentLessonId] || null;
};
