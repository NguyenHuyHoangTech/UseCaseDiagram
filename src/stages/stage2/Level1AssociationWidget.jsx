import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Search, CreditCard, Key, ShoppingCart, Ticket, HelpCircle, RotateCcw, CheckCircle, Car, MapPin, Star, Heart, Crown } from 'lucide-react';

export default function Level1AssociationWidget({ lesson, onSolved }) {
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
    onSolved(false);
  }, [lesson, onSolved]);

  const levelData = {
    1: {
      heading: 'Khách hàng tương tác',
      desc: 'Hệ thống cần người kích hoạt. Hãy chọn đường nối đúng.',
      flows: [
        {
          id: 'f1',
          nodes: [
            { id: 'n1', type: 'Actor', text: 'Khách Hàng', icon: <User size={40} color="#a78bfa" /> },
            { id: 'n2', type: 'Use Case', text: 'Xem Menu', icon: <Search size={24} color="#93c5fd" /> }
          ],
          zones: { z1: { correct: 'association', lineStyle: 'solid', arrowDir: 'none' } }
        }
      ],
      defaultWhy: 'Chưa đúng! Tương tác cơ bản giữa Người (Actor) và Chức năng (Use Case) phải dùng Giao tiếp (Association)!',
      successText: 'Chính xác! Actor và Use Case tương tác trực tiếp luôn được nối bằng đường nét liền.'
    },
    2: {
      heading: 'Rút tiền ở cây ATM',
      desc: 'Để rút được tiền, hệ thống BẮT BUỘC phải kiểm tra mã PIN.',
      flows: [
        {
          id: 'f1',
          nodes: [
            { id: 'n1', type: 'Use Case', text: 'Rút Tiền', icon: <CreditCard size={24} color="#93c5fd" /> },
            { id: 'n2', type: 'Use Case', text: 'Kiểm Tra Mã PIN', icon: <Key size={24} color="#f87171" /> }
          ],
          zones: { z1: { correct: 'include', lineStyle: 'dashed', arrowDir: 'right' } }
        }
      ],
      defaultWhy: 'Khoan đã! Nếu không nhập đúng PIN thì sao máy nhả tiền được? Phải dùng <<include>> (Bắt buộc).',
      successText: 'Tuyệt vời! Lệnh <<include>> chĩa vào "Kiểm tra mã PIN" báo hiệu hành động này là bắt buộc!'
    },
    3: {
      heading: 'Mua hàng & Áp mã giảm giá',
      desc: 'Hệ thống có tính năng "Áp mã giảm giá" nhưng đây là tùy chọn.',
      flows: [
        {
          id: 'f1',
          nodes: [
            { id: 'n1', type: 'Use Case', text: 'Mua Hàng', icon: <ShoppingCart size={24} color="#93c5fd" /> },
            { id: 'n2', type: 'Use Case', text: 'Áp Mã Giảm Giá', icon: <Ticket size={24} color="#fcd34d" /> }
          ],
          zones: { z1: { correct: 'extend', lineStyle: 'dashed', arrowDir: 'left' } }
        }
      ],
      defaultWhy: 'Không chính xác! "Áp mã" chỉ là phần mở rộng. Phải dùng <<extend>> (Tùy chọn) đâm ngược về chức năng gốc!',
      successText: 'Chuẩn không cần chỉnh! Lệnh <<extend>> chĩa mũi tên NGƯỢC về chức năng gốc chính là quy tắc ăn điểm!'
    },
    4: {
      heading: 'So sánh luồng Đặt xe Grab',
      desc: 'Phân biệt rõ cái nào bắt buộc, cái nào tùy chọn bằng cách lấp đầy 4 khoảng trống.',
      flows: [
        {
          id: 'flow1',
          nodes: [
            { id: 'n1', type: 'Actor', text: 'Khách Hàng', icon: <User size={40} color="#a78bfa" /> },
            { id: 'n2', type: 'Use Case', text: 'Đặt Xe', icon: <Car size={24} color="#93c5fd" /> },
            { id: 'n3', type: 'Use Case', text: 'Chọn Điểm Đến', icon: <MapPin size={24} color="#f87171" /> }
          ],
          zones: {
            z1: { correct: 'association', lineStyle: 'solid', arrowDir: 'none' },
            z2: { correct: 'include', lineStyle: 'dashed', arrowDir: 'right' }
          }
        },
        {
          id: 'flow2',
          nodes: [
            { id: 'n4', type: 'Actor', text: 'Khách Hàng', icon: <User size={40} color="#a78bfa" /> },
            { id: 'n5', type: 'Use Case', text: 'Đánh Giá', icon: <Star size={24} color="#93c5fd" /> },
            { id: 'n6', type: 'Use Case', text: 'Gửi Tiền Tip', icon: <Heart size={24} color="#fcd34d" /> }
          ],
          zones: {
            z3: { correct: 'association', lineStyle: 'solid', arrowDir: 'none' },
            z4: { correct: 'extend', lineStyle: 'dashed', arrowDir: 'left' }
          }
        }
      ],
      defaultWhy: 'Lệnh kéo vào chưa hợp lý! Hãy so sánh kỹ tính bắt buộc/tùy chọn nhé.',
      customErrors: {
        z1: { 'include': 'Actor không thể dùng include!', 'extend': 'Actor không dùng extend!', 'generalization': 'Sai rồi! Khách hàng và Đặt xe không cùng loại.' },
        z2: { 'association': 'Hai Use Case gọi nhau phải dùng nét đứt!', 'extend': 'Đặt xe mà không có điểm đến thì xe chạy đi đâu? Đây là bắt buộc!', 'generalization': 'Sai rồi! Đặt xe không phải là Kế thừa của Chọn điểm đến.' },
        z3: { 'include': 'Actor không thể dùng include!', 'extend': 'Actor không dùng extend!', 'generalization': 'Sai rồi! Khách hàng và Đánh giá không cùng loại.' },
        z4: { 'association': 'Hai Use Case gọi nhau phải dùng nét đứt!', 'include': 'Tip tiền là tùy tâm, không bắt buộc! Phải dùng <<extend>>.', 'generalization': 'Sai rồi! Gửi tiền tip không kế thừa Đánh giá.' }
      },
      successText: 'Quá đỉnh! Nhìn vào sơ đồ, bạn đã tự phân biệt được ngay sự khác nhau cốt lõi giữa Include và Extend rồi đấy!'
    },
    5: {
      heading: 'Gom nhóm đối tượng',
      desc: 'Khách hàng VIP bản chất vẫn là một Khách hàng. Hãy dùng lệnh Kế thừa để gom nhóm chúng lại.',
      flows: [
        {
          id: 'f1',
          nodes: [
            { id: 'n1', type: 'Actor', text: 'Khách Hàng VIP', icon: <Crown size={40} color="#fcd34d" /> },
            { id: 'n2', type: 'Actor', text: 'Khách Hàng', icon: <User size={40} color="#a78bfa" /> }
          ],
          zones: { z1: { correct: 'generalization', lineStyle: 'solid', arrowDir: 'right' } }
        }
      ],
      defaultWhy: 'Sai rồi! Hai Actor (người dùng) có chung tính chất thì phải dùng quan hệ Kế thừa (Generalization) đâm mũi tên về đối tượng gốc nhé!',
      customErrors: {
        z1: { 'association': 'Đường thẳng chỉ dùng nối Người với Chức năng. Đây là 2 người mà!', 'include': 'Include không dùng cho Actor!', 'extend': 'Extend không dùng cho Actor!' }
      },
      successText: 'Hoàn hảo! Mũi tên Kế thừa (Hollow Triangle) đâm vào "Khách Hàng" có nghĩa là: VIP được hưởng toàn bộ quyền lợi của Khách hàng thường!'
    }
  };

  const current = levelData[lesson.levelIndex || 1];

  const handleDragStart = (e, itemType) => {
    e.dataTransfer.setData("type", itemType);
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    const draggedType = e.dataTransfer.getData("type");
    
    let zoneConfig = null;
    current.flows.forEach(flow => { if (flow.zones[zoneId]) zoneConfig = flow.zones[zoneId]; });

    if (draggedType === zoneConfig.correct) {
      const newDrops = { ...droppedItems, [zoneId]: draggedType };
      setDroppedItems(newDrops);
      setErrorZone(null);

      let allZones = [];
      current.flows.forEach(flow => { allZones = [...allZones, ...Object.keys(flow.zones)]; });
      const isAllSolved = allZones.every(z => newDrops[z]);
      
      if (isAllSolved) {
        setIsSuccess(true);
        setShowWhy(false);
        onSolved(true);
      } else {
        setShowWhy(false);
      }
    } else {
      setErrorZone(zoneId);
      setShowWhy(true);
      setIsSuccess(false);

      if (current.customErrors && current.customErrors[zoneId] && current.customErrors[zoneId][draggedType]) {
        setWhyText(current.customErrors[zoneId][draggedType]);
      } else {
        setWhyText(current.defaultWhy);
      }
      setTimeout(() => setErrorZone(null), 500);
    }
  };

  const resetLevel = () => {
    setDroppedItems({});
    setIsSuccess(false);
    setShowWhy(false);
    setErrorZone(null);
    onSolved(false);
  };

  return (
    <div style={{ backgroundColor: '#0b0f19', color: 'white', padding: '40px', borderRadius: '16px', fontFamily: 'sans-serif' }}>
      
      <div style={{ maxWidth: '900px', margin: '0 auto 40px auto', position: 'relative' }}>
        <h1 style={{ fontSize: '28px', marginTop: '10px' }}>{current.heading}</h1>
        <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '16px', maxWidth: '600px' }}>{current.desc}</p>
        
        <div style={{ position: 'absolute', top: '10px', right: '0', display: 'flex', gap: '10px' }}>
          <button onClick={resetLevel} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', backgroundColor: '#1f293d', color: '#9ca3af', border: '1px solid #374151', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <RotateCcw size={16} /> Làm lại
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#111827', borderRadius: '16px', padding: '60px 30px', border: '1px solid #1f293d', position: 'relative', overflowX: 'auto' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', width: '100%', minWidth: '700px' }}>
          {current.flows.map((flow) => {
            const zoneIds = Object.keys(flow.zones);

            return (
              <div key={flow.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                {flow.nodes.map((node, index) => {
                  const zoneId = zoneIds[index]; 
                  const zoneConfig = flow.zones[zoneId];
                  const isLastNode = index === flow.nodes.length - 1;

                  return (
                    <React.Fragment key={node.id}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: node.type === 'Actor' ? '120px' : '160px' }}>
                        {node.type === 'Actor' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {node.icon}
                            <span style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'center', color: node.id === 'n1' && lesson.levelIndex === 5 ? '#fcd34d' : 'white' }}>{node.text}</span>
                          </div>
                        ) : (
                          <div style={{ width: '100%', height: '60px', border: '2px solid #3b82f6', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e3a8a', gap: '8px', padding: '0 10px' }}>
                            {node.icon}
                            <span style={{ color: '#bfdbfe', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' }}>{node.text}</span>
                          </div>
                        )}
                        <span style={{ marginTop: '10px', fontSize: '10px', backgroundColor: '#374151', color: '#d1d5db', padding: '3px 8px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                          {node.type}
                        </span>
                      </div>

                      {!isLastNode && (
                        <div style={{ position: 'relative', width: '150px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-30px' }}>
                          {!droppedItems[zoneId] ? (
                            <div 
                              onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, zoneId)}
                              style={{ width: '100%', height: '100%', border: errorZone === zoneId ? '2px dashed #ef4444' : '2px dashed #374151', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: errorZone === zoneId ? '#ef4444' : '#6b7280', backgroundColor: '#1f293d', transform: errorZone === zoneId ? 'translateX(5px)' : 'none', transition: 'all 0.2s', animation: errorZone === zoneId ? 'shake 0.4s' : 'none', fontSize: '13px' }}
                            >
                              {errorZone === zoneId ? 'Sai lệnh!' : 'Thả lệnh vào đây'}
                            </div>
                          ) : (
                            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '100%', opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} style={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: zoneConfig.lineStyle === 'solid' ? '4px solid #10b981' : '3px dashed #10b981' }}>
                              
                              {/* 🎯 CUSTOM SVG ARROWS CHUẨN UML */}
                              {zoneConfig.correct === 'include' && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" style={{ position: 'absolute', right: '-12px', top: '-13px' }}>
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              )}
                              
                              {zoneConfig.correct === 'extend' && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" style={{ position: 'absolute', left: '-12px', top: '-13px' }}>
                                  <polyline points="15 18 9 12 15 6" />
                                </svg>
                              )}
                              
                              {zoneConfig.correct === 'generalization' && (
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="#111827" stroke="#10b981" strokeWidth="2" style={{ position: 'absolute', right: '-13px', top: '-14px' }}>
                                  <polygon points="6 5 18 12 6 19" />
                                </svg>
                              )}

                              {zoneConfig.correct !== 'association' && (
                                <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: -25, opacity: 1 }} transition={{ delay: 0.4 }} style={{ color: '#10b981', fontWeight: 'bold', letterSpacing: '1px', fontSize: '13px', backgroundColor: '#111827', padding: '0 5px' }}>
                                  {zoneConfig.correct === 'generalization' ? '' : `<< ${zoneConfig.correct} >>`}
                                </motion.span>
                              )}
                            </motion.div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '60px auto 0 auto', display: 'flex', gap: '30px' }}>
        
        <div style={{ flex: 1.2 }}>
          <h3 style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '15px' }}>Kho lệnh (Kéo thả vào sơ đồ):</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            
            <div draggable onDragStart={(e) => handleDragStart(e, 'association')} style={{ padding: '12px', backgroundColor: '#1f293d', border: '1px solid #374151', borderRadius: '8px', cursor: 'grab', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ width: '40px', height: '3px', backgroundColor: '#cbd5e1' }}></div>
              <span style={{ fontWeight: 'bold', color: '#f8fafc', fontSize: '13px' }}>Giao tiếp</span>
            </div>
            
            <div draggable onDragStart={(e) => handleDragStart(e, 'include')} style={{ padding: '12px', backgroundColor: '#1f293d', border: '1px solid #374151', borderRadius: '8px', cursor: 'grab', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '30px', height: '2px', borderBottom: '2px dashed #818cf8' }}></div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="3" style={{ marginLeft: '-4px' }}><polyline points="9 18 15 12 9 6" /></svg>
              </div>
              <span style={{ fontWeight: 'bold', color: '#818cf8', fontSize: '13px' }}>&lt;&lt; include &gt;&gt;</span>
            </div>

            <div draggable onDragStart={(e) => handleDragStart(e, 'extend')} style={{ padding: '12px', backgroundColor: '#1f293d', border: '1px solid #374151', borderRadius: '8px', cursor: 'grab', display: 'flex', flexDirection: 'column', gap: '5px' }}>
               <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" style={{ marginRight: '-4px' }}><polyline points="15 18 9 12 15 6" /></svg>
                <div style={{ width: '30px', height: '2px', borderBottom: '2px dashed #34d399' }}></div>
              </div>
              <span style={{ fontWeight: 'bold', color: '#34d399', fontSize: '13px' }}>&lt;&lt; extend &gt;&gt;</span>
            </div>

            <div draggable onDragStart={(e) => handleDragStart(e, 'generalization')} style={{ padding: '12px', backgroundColor: '#1f293d', border: '1px solid #374151', borderRadius: '8px', cursor: 'grab', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '30px', height: '2px', backgroundColor: '#fcd34d' }}></div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1f293d" stroke="#fcd34d" strokeWidth="2" style={{ marginLeft: '-2px' }}><polygon points="6 5 18 12 6 19" /></svg>
              </div>
              <span style={{ fontWeight: 'bold', color: '#fcd34d', fontSize: '13px' }}>Kế thừa</span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1.5 }}>
           <AnimatePresence mode="wait">
             {showWhy && !isSuccess && (
               <motion.div key="error" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} style={{ padding: '20px', backgroundColor: '#312e81', border: '1px solid #4338ca', borderRadius: '12px', display: 'flex', gap: '15px' }}>
                 <HelpCircle size={30} color="#818cf8" style={{ flexShrink: 0 }} />
                 <div><h4 style={{ margin: '0 0 5px 0', color: '#c7d2fe' }}>Koji Bot nói:</h4><p style={{ margin: 0, color: '#e0e7ff', fontSize: '14px', lineHeight: '1.5' }}>{whyText}</p></div>
               </motion.div>
             )}
             {isSuccess && (
               <motion.div key="success" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} style={{ padding: '20px', backgroundColor: '#064e3b', border: '1px solid #059669', borderRadius: '12px', display: 'flex', gap: '15px' }}>
                 <CheckCircle size={30} color="#34d399" style={{ flexShrink: 0 }} />
                 <div><h4 style={{ margin: '0 0 5px 0', color: '#a7f3d0' }}>Bài học rút ra:</h4><p style={{ margin: 0, color: '#d1fae5', fontSize: '14px', lineHeight: '1.5' }}>{current.successText}</p></div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

      </div>
      <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 50% { transform: translateX(8px); } 75% { transform: translateX(-8px); } }`}</style>
    </div>
  );
}
