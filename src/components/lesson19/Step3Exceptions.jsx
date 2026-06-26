import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const Step3Exceptions = ({ onComplete }) => {
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCheck = () => {
    if (!q1 || !q2) {
      showFeedback('error', 'Vui lòng chọn hướng xử lý cho tất cả các tình huống rẽ nhánh.');
      return;
    }
    
    if (q1 === 'A') {
      showFeedback('error', 'Tình huống 1: Nếu bạn đuổi khách về chỉ vì thẻ gãy, khách sẽ rất phẫn nộ và gây ùn tắc giao thông. Hãy chuyển sang quy trình xử lý ngoại lệ thủ công!');
      return;
    }
    
    if (q2 === 'A') {
      showFeedback('error', 'Tình huống 2: Nếu bạn mở Barrier khi biển số không khớp, tức là bạn vừa tiếp tay cho kẻ trộm xe chạy thoát! Phải khóa chặt Barrier và gọi bảo vệ.');
      return;
    }

    showFeedback('success', 'Tuyệt vời! "Làm BA không phải là thiết kế ra một hệ thống màu hồng, mà là vẽ ra mọi đường lùi cho hệ thống khi có sự cố." Bạn đã nắm vững tinh thần này!');
    setSuccess(true);
    
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      confetti({ particleCount: 50, spread: 360, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);
  };

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--brand-color)' }}>
        19.3 Cơn Ác Mộng Rẽ Nhánh (Viết Đặc tả Use Case)
      </h3>
      <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
        Mọi thứ có thể sai lệch ở trạm gửi xe. Hãy đối mặt với các sự cố và chọn hướng xử lý (Exception Flow) cho Đặc tả [Quẹt thẻ ra cổng].
      </p>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: feedback.type === 'error' ? '#ffe3e3' : '#d3f9d8', color: feedback.type === 'error' ? '#e03131' : '#2b8a3e', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, lineHeight: 1.5 }}>
            {feedback.type === 'error' ? <AlertTriangle size={24} style={{ flexShrink: 0 }} /> : <CheckCircle size={24} style={{ flexShrink: 0 }} />} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #dee2e6', marginBottom: '24px' }}>
        <h4 style={{ borderBottom: '2px solid #f1f3f5', paddingBottom: '12px', marginBottom: '20px' }}>Đặc tả Use Case: Quẹt thẻ ra cổng</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem' }}>
          <div>
            <strong>Luồng cơ bản (Happy Path):</strong>
            <ol style={{ paddingLeft: '20px', marginTop: '8px', color: '#495057' }}>
              <li>(1) Khách quẹt thẻ.</li>
              <li>(2) Hệ thống đọc mã thẻ từ chip RFID.</li>
              <li>(3) Camera AI quét biển số xe thực tế.</li>
              <li>(4) Hệ thống đối chiếu mã thẻ với biển số xe lúc vào.</li>
              <li>(5) <em>&lt;&lt;extend&gt;&gt;</em> Tính tiền & Thanh toán (nếu là khách lượt).</li>
              <li>(6) Mở Barrier cho xe ra.</li>
            </ol>
          </div>

          <div style={{ marginTop: '16px', padding: '16px', background: '#fff5f5', border: '1px solid #ffc9c9', borderRadius: '8px' }}>
            <strong style={{ color: '#e03131' }}>Luồng Ngoại Lệ (Exception Flows):</strong>
            
            {/* Tình huống 1 */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Tình huống 1: Tại Bước 2, thẻ bị gãy, máy không đọc được chip RFID. Hệ thống sẽ:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', border: q1 === 'A' ? '2px solid #fa5252' : '1px solid #ced4da', background: q1 === 'A' ? '#ffe3e3' : 'white' }}>
                  <input type="radio" name="q1" value="A" checked={q1 === 'A'} onChange={() => setQ1('A')} style={{ display: 'none' }} />
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #adb5bd', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    {q1 === 'A' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fa5252' }} />}
                  </span>
                  [A] Hủy giao dịch, báo còi đuổi khách quay lại tìm thẻ khác.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', border: q1 === 'B' ? '2px solid #339af0' : '1px solid #ced4da', background: q1 === 'B' ? '#e7f5ff' : 'white' }}>
                  <input type="radio" name="q1" value="B" checked={q1 === 'B'} onChange={() => setQ1('B')} style={{ display: 'none' }} />
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #adb5bd', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    {q1 === 'B' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#339af0' }} />}
                  </span>
                  [B] Chuyển qua luồng Use Case [Xử lý mất/hỏng thẻ] do Bảo vệ thực hiện thủ công.
                </label>
              </div>
            </div>

            {/* Tình huống 2 */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Tình huống 2: Tại Bước 4, biển số xe lúc ra KHÔNG KHỚP với biển số xe lưu trong thẻ lúc vào. Hệ thống sẽ:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', border: q2 === 'A' ? '2px solid #fa5252' : '1px solid #ced4da', background: q2 === 'A' ? '#ffe3e3' : 'white' }}>
                  <input type="radio" name="q2" value="A" checked={q2 === 'A'} onChange={() => setQ2('A')} style={{ display: 'none' }} />
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #adb5bd', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    {q2 === 'A' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fa5252' }} />}
                  </span>
                  [A] Vẫn mở Barrier cho xe qua, đồng thời bật còi báo động để cảnh báo an ninh.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', border: q2 === 'B' ? '2px solid #339af0' : '1px solid #ced4da', background: q2 === 'B' ? '#e7f5ff' : 'white' }}>
                  <input type="radio" name="q2" value="B" checked={q2 === 'B'} onChange={() => setQ2('B')} style={{ display: 'none' }} />
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #adb5bd', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    {q2 === 'B' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#339af0' }} />}
                  </span>
                  [B] Khóa chặt Barrier, phát cảnh báo lên màn hình của Bảo vệ để đối chiếu giấy tờ xe thủ công.
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        {!success ? (
          <button onClick={handleCheck} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--text-main)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Nộp Đặc tả
          </button>
        ) : (
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: '#12b886', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Chính thức phá đảo Boss cuối! <ArrowRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Step3Exceptions;
