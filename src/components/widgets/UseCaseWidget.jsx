import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

export default function UseCaseWidget({ lesson, onSolved }) {
  const [droppedItems, setDroppedItems] = useState({});
  const [errorZone, setErrorZone] = useState(null);
  const [showWhy, setShowWhy] = useState(false);
  const [whyText, setWhyText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    setDroppedItems({});
    setIsSuccess(false);
    setShowWhy(false);
    setErrorZone(null);
  }, [lesson.id]);

  const levelData = {
    'lesson-5': { flows: [{ id: 'f1', nodes: [{ type: 'Actor', text: 'Khách Hàng' }, { type: 'Use Case', text: 'Xem Menu' }], zones: { z1: { correct: 'association' } } }], defaultWhy: 'Quan hệ tương tác cơ bản giữa Actor và Use Case phải dùng Giao tiếp (Association) nét liền.', successText: 'Tuyệt vời! Bạn đã kết nối Actor với Use Case bằng đường Giao tiếp.' },
    'lesson-6': { flows: [{ id: 'f1', nodes: [{ type: 'Use Case', text: 'Rút Tiền' }, { type: 'Use Case', text: 'Kiểm Tra Mã PIN' }], zones: { z1: { correct: 'include' } } }], defaultWhy: 'Bắt buộc phải kiểm tra mã PIN để rút tiền. Hãy dùng mối quan hệ <<include>>.', successText: 'Chính xác! Rút tiền bao hàm (include) việc kiểm tra mã PIN.' },
    'lesson-7': { flows: [{ id: 'f1', nodes: [{ type: 'Use Case', text: 'Mua Hàng' }, { type: 'Use Case', text: 'Áp Mã Giảm Giá' }], zones: { z1: { correct: 'extend' } } }], defaultWhy: 'Áp mã giảm giá chỉ là một tính năng tùy chọn thêm, phải dùng <<extend>>.', successText: 'Xuất sắc! Mũi tên <<extend>> đâm ngược từ tính năng phụ về tính năng chính.' },
    'lesson-8': { flows: [ { id: 'f1', nodes: [{ type: 'Actor', text: 'Khách Hàng' }, { type: 'Use Case', text: 'Đặt Xe' }, { type: 'Use Case', text: 'Chọn Điểm Đến' }], zones: { z1: { correct: 'association' }, z2: { correct: 'include' } } }, { id: 'f2', nodes: [{ type: 'Actor', text: 'Khách Hàng' }, { type: 'Use Case', text: 'Đánh Giá' }, { type: 'Use Case', text: 'Gửi Tiền Tip' }], zones: { z3: { correct: 'association' }, z4: { correct: 'extend' } } } ], defaultWhy: 'Lệnh kéo vào chưa hợp lý! Hãy kiểm tra kỹ tính bắt buộc của Điểm đến và tính tùy chọn của Tiền Tip.', successText: 'Quá đỉnh! Bạn đã phân biệt được cả 3 mối quan hệ trong sơ đồ.' },
    'lesson-9': { flows: [{ id: 'f1', nodes: [{ type: 'Actor', text: 'Khách Hàng VIP' }, { type: 'Actor', text: 'Khách Hàng' }], zones: { z1: { correct: 'generalization' } } }], defaultWhy: 'Hai Actor có mối quan hệ cha-con phải dùng mũi tên Kế thừa (Generalization).', successText: 'Hoàn hảo! Khách hàng VIP kế thừa đặc tính của Khách hàng thường.' }
  };

  const current = levelData[lesson.id] || levelData['lesson-5'];

  const handleDragStart = (e, itemType) => { e.dataTransfer.setData("type", itemType); };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    const draggedType = e.dataTransfer.getData("type");
    let zoneConfig = null;
    current.flows.forEach(flow => { if (flow.zones[zoneId]) zoneConfig = flow.zones[zoneId]; });
    
    if (draggedType === zoneConfig.correct) {
      const newDrops = { ...droppedItems, [zoneId]: draggedType };
      setDroppedItems(newDrops); setErrorZone(null);
      let allZones = []; current.flows.forEach(flow => { allZones = [...allZones, ...Object.keys(flow.zones)]; });
      if (allZones.every(z => newDrops[z])) { 
        setIsSuccess(true); setShowWhy(false); onSolved(true); 
      }
    } else {
      setErrorZone(zoneId); setShowWhy(true); setIsSuccess(false); setWhyText(current.defaultWhy);
      setTimeout(() => setErrorZone(null), 500);
    }
  };

  return (
    <div style={{ color: '#495057', fontFamily: 'inherit', marginTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={() => { setDroppedItems({}); setIsSuccess(false); setShowWhy(false); onSolved(false); }} style={{ padding: '6px 12px', backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
          <RotateCcw size={14} /> Thử lại màn này
        </button>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '40px', overflowX: 'auto', marginBottom: '28px' }}>
        {current.flows.map((flow) => {
          const zoneIds = Object.keys(flow.zones);
          return (
            <div key={flow.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
              {flow.nodes.map((node, i) => (
                <React.Fragment key={i}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '110px' }}>
                    <div style={{ width: '100%', height: '50px', borderRadius: node.type === 'Actor' ? '100px' : '25px', border: node.type === 'Actor' ? '2px solid #748ffc' : '2px solid #12b886', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: node.type === 'Actor' ? '#edf2ff' : '#e6fcf5', padding: '0 8px' }}>
                      <span style={{ fontSize: '0.8rem', color: node.type === 'Actor' ? '#364fc7' : '#0c8599', fontWeight: 700, textAlign: 'center' }}>{node.text}</span>
                    </div>
                    <span style={{ fontSize: '10px', marginTop: '6px', color: '#adb5bd', fontWeight: 700 }}>{node.type}</span>
                  </div>

                  {i < flow.nodes.length - 1 && (
                    <div style={{ width: '130px', height: '40px', position: 'relative' }}>
                      {!droppedItems[zoneIds[i]] ? (
                        <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, zoneIds[i])} style={{ width: '100%', height: '100%', border: errorZone === zoneIds[i] ? '2px dashed #fa5252' : '2px dashed #adb5bd', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: errorZone === zoneIds[i] ? '#fa5252' : '#868e96', fontSize: '0.8rem', backgroundColor: errorZone === zoneIds[i] ? '#fff5f5' : '#f8f9fa' }}>
                          {errorZone === zoneIds[i] ? 'Sai quan hệ!' : 'Thả mối quan hệ'}
                        </div>
                      ) : (
                        <div style={{ width: '100%', height: '100%', borderBottom: flow.zones[zoneIds[i]].correct === 'association' ? '3px solid #12b886' : '2.5px dashed #12b886', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                          {flow.zones[zoneIds[i]].correct === 'include' && <svg width="24" height="24" fill="none" stroke="#12b886" strokeWidth="3" style={{ position: 'absolute', right: '-12px', top: '10px' }}><polyline points="9 18 15 12 9 6" /></svg>}
                          {flow.zones[zoneIds[i]].correct === 'extend' && <svg width="24" height="24" fill="none" stroke="#12b886" strokeWidth="3" style={{ position: 'absolute', left: '-12px', top: '10px' }}><polyline points="15 18 9 12 15 6" /></svg>}
                          {flow.zones[zoneIds[i]].correct === 'generalization' && <svg width="26" height="26" fill="#ffffff" stroke="#12b886" strokeWidth="2" style={{ position: 'absolute', right: '-13px', top: '9px' }}><polygon points="6 5 18 12 6 19" /></svg>}
                          {flow.zones[zoneIds[i]].correct !== 'association' && <span style={{ color: '#12b886', fontSize: '11px', fontWeight: 800, backgroundColor: '#ffffff', padding: '2px 6px', borderRadius: '4px', position: 'absolute', top: '-10px', border: '1px solid #e6fcf5' }}>{flow.zones[zoneIds[i]].correct === 'generalization' ? 'Kế thừa' : `<<${flow.zones[zoneIds[i]].correct}>>`}</span>}
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1.2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', minWidth: '250px' }}>
          <div draggable onDragStart={e => handleDragStart(e, "association")} style={{ padding: '12px', backgroundColor: 'white', border: '1px solid #dee2e6', borderRadius: '10px', cursor: 'grab', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#495057' }}><div style={{ width: '20px', height: '3px', backgroundColor: '#495057', marginRight: '8px' }}></div> Giao tiếp</div>
          <div draggable onDragStart={e => handleDragStart(e, "include")} style={{ padding: '12px', backgroundColor: 'white', border: '1px solid #dee2e6', borderRadius: '10px', cursor: 'grab', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#364fc7' }}>&lt;&lt; include &gt;&gt;</div>
          <div draggable onDragStart={e => handleDragStart(e, "extend")} style={{ padding: '12px', backgroundColor: 'white', border: '1px solid #dee2e6', borderRadius: '10px', cursor: 'grab', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#099268' }}>&lt;&lt; extend &gt;&gt;</div>
          <div draggable onDragStart={e => handleDragStart(e, "generalization")} style={{ padding: '12px', backgroundColor: 'white', border: '1px solid #dee2e6', borderRadius: '10px', cursor: 'grab', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#e67e22' }}>Kế thừa</div>
        </div>

        <div style={{ flex: 1.5, minWidth: '250px' }}>
          <AnimatePresence mode="wait">
            {showWhy && !isSuccess && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ padding: '14px', backgroundColor: '#fff5f5', border: '1px solid #ffe3e3', borderRadius: '12px', display: 'flex', gap: '10px', color: '#c92a2a', fontSize: '0.9rem' }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div><strong>Lỗi:</strong> {whyText}</div>
              </motion.div>
            )}
            {isSuccess && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ padding: '14px', backgroundColor: '#e6fcf5', border: '1px solid #c3fae8', borderRadius: '12px', display: 'flex', gap: '10px', color: '#0b7285', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div><strong>Hoàn thành:</strong> {current.successText}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}