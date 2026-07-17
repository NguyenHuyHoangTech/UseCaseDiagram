import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Search, CreditCard, Key, ShoppingCart, Ticket, HelpCircle, RotateCcw, CheckCircle, Car, MapPin, Star, Heart, Crown, ShoppingBag, Wallet, ArrowRight } from 'lucide-react';

export default function Level1AssociationWidget({ lesson, onSolved }) {
  const [droppedItems, setDroppedItems] = useState({});
  const [errorZone, setErrorZone] = useState(null);
  const [showWhy, setShowWhy] = useState(false);
  const [whyText, setWhyText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Quản lý subStep nội bộ khi học viên ở Bài cuối cùng của bạn
  // subStep 0: Bài gốc (Generalization), subStep 1: Bài 9.1 Tổng hợp (Food Delivery Canvas)
  const [subStep9, setSubStep9] = useState(0);

  const levelIndex = lesson.levelIndex || 1;

  useEffect(() => {
    setDroppedItems({});
    setIsSuccess(false);
    setShowWhy(false);
    setErrorZone(null);
    onSolved(false);
  }, [lesson, subStep9, onSolved]);

  // ==========================================
  // KHU VỰC DỮ LIỆU BÀI 1 -> BÀI 5 GỐC
  // ==========================================
  const levelData = {
    1: {
      heading: 'Interacting Customer',
      desc: 'The system needs someone to trigger it. Please choose the correct connection line.',
      flows: [
        {
          id: 'f1',
          nodes: [
            { id: 'n1', type: 'Actor', text: 'Customer', icon: <User size={40} color="#a78bfa" /> },
            { id: 'n2', type: 'Use Case', text: 'View Menu', icon: <Search size={24} color="#93c5fd" /> }
          ],
          zones: { z1: { correct: 'association', lineStyle: 'solid', arrowDir: 'none' } }
        }
      ],
      defaultWhy: 'Incorrect! Basic interaction between a Person (Actor) and a Feature (Use Case) must use Association!',
      successText: 'Exactly! Actors and Use Cases interacting directly are always connected by a solid line.'
    },
    2: {
      heading: 'Withdrawing Money at ATM',
      desc: 'To withdraw money, the system MUST check the PIN.',
      flows: [
        {
          id: 'f1',
          nodes: [
            { id: 'n1', type: 'Use Case', text: 'Withdraw Money', icon: <CreditCard size={24} color="#93c5fd" /> },
            { id: 'n2', type: 'Use Case', text: 'Check PIN', icon: <Key size={24} color="#f87171" /> }
          ],
          zones: { z1: { correct: 'include', lineStyle: 'dashed', arrowDir: 'right' } }
        }
      ],
      defaultWhy: 'Wait! How can the machine dispense money without a correct PIN? You must use <<include>> (Mandatory).',
      successText: 'Great! The <<include>> pointing to "Check PIN" signals that this action is mandatory!'
    },
    3: {
      heading: 'Buy & Apply Discount Code',
      desc: 'The system has an "Apply Discount" feature, but it is optional.',
      flows: [
        {
          id: 'f1',
          nodes: [
            { id: 'n1', type: 'Use Case', text: 'Buy Items', icon: <ShoppingCart size={24} color="#93c5fd" /> },
            { id: 'n2', type: 'Use Case', text: 'Apply Discount', icon: <Ticket size={24} color="#fcd34d" /> }
          ],
          zones: { z1: { correct: 'extend', lineStyle: 'dashed', arrowDir: 'left' } }
        }
      ],
      defaultWhy: 'Incorrect! "Apply Discount" is just an extension. You must use <<extend>> (Optional) pointing back to the base feature!',
      successText: 'Spot on! The <<extend>> arrow pointing BACK to the base feature is the key rule here!'
    },
    4: {
      heading: 'Comparing Grab Booking Flows',
      desc: 'Clearly distinguish what is mandatory and what is optional by filling in the 4 gaps.',
      flows: [
        {
          id: 'flow1',
          nodes: [
            { id: 'n1', type: 'Actor', text: 'Customer', icon: <User size={40} color="#a78bfa" /> },
            { id: 'n2', type: 'Use Case', text: 'Book Ride', icon: <Car size={24} color="#93c5fd" /> },
            { id: 'n3', type: 'Use Case', text: 'Choose Destination', icon: <MapPin size={24} color="#f87171" /> }
          ],
          zones: {
            z1: { correct: 'association', lineStyle: 'solid', arrowDir: 'none' },
            z2: { correct: 'include', lineStyle: 'dashed', arrowDir: 'right' }
          }
        },
        {
          id: 'flow2',
          nodes: [
            { id: 'n4', type: 'Actor', text: 'Customer', icon: <User size={40} color="#a78bfa" /> },
            { id: 'n5', type: 'Use Case', text: 'Rate Trip', icon: <Star size={24} color="#93c5fd" /> },
            { id: 'n6', type: 'Use Case', text: 'Send Tip', icon: <Heart size={24} color="#fcd34d" /> }
          ],
          zones: {
            z3: { correct: 'association', lineStyle: 'solid', arrowDir: 'none' },
            z4: { correct: 'extend', lineStyle: 'dashed', arrowDir: 'left' }
          }
        }
      ],
      defaultWhy: 'Invalid connection! Please compare mandatory vs optional closely.',
      customErrors: {
        z1: { 'include': 'Actors cannot use include!', 'extend': 'Actors do not use extend!', 'generalization': 'Wrong! Customer and Book Ride are not the same type.' },
        z2: { 'association': 'Two Use Cases calling each other must use dashed lines!', 'extend': 'If you book a ride without a destination, where will it go? This is mandatory!', 'generalization': 'Wrong! Book Ride does not inherit from Choose Destination.' },
        z3: { 'include': 'Actors cannot use include!', 'extend': 'Actors do not use extend!', 'generalization': 'Wrong! Customer and Rating are not the same type.' },
        z4: { 'association': 'Two Use Cases calling each other must use dashed lines!', 'include': 'Tipping is optional! You must use <<extend>>.', 'generalization': 'Wrong! Send Tip does not inherit from Rating.' }
      },
      successText: 'Awesome! Looking at the diagram, you can easily distinguish the core difference between Include and Extend!'
    },
    5: {
      heading: 'Grouping Objects',
      desc: 'A VIP Customer is still fundamentally a Customer. Use Generalization to group them.',
      flows: [
        {
          id: 'f1',
          nodes: [
            { id: 'n1', type: 'Actor', text: 'VIP Customer', icon: <Crown size={40} color="#fcd34d" /> },
            { id: 'n2', type: 'Actor', text: 'Customer', icon: <User size={40} color="#a78bfa" /> }
          ],
          zones: { z1: { correct: 'generalization', lineStyle: 'solid', arrowDir: 'right' } }
        }
      ],
      defaultWhy: 'Wrong! If two Actors have common traits, use Generalization pointing towards the base object!',
      customErrors: {
        z1: { 'association': 'Solid lines only connect People to Features. These are 2 people!', 'include': 'Include is not for Actors!', 'extend': 'Extend is not for Actors!' }
      },
      successText: 'Perfect! The Generalization arrow (Hollow Triangle) pointing to "Customer" means: VIP gets all privileges of a regular Customer!'
    }
  };

  // Cấu hình kiểm tra cho bài 9.1 tổng hợp
  const zoneRequirements91 = {
    z1: { correct: 'association', err: 'Incorrect! Direct interaction between a User and a Feature must use Association.' },
    z2: { correct: 'include', err: 'Think again! When ordering food, the system mandatory processes payment, so use <<include>>.' },
    z3: { correct: 'extend', err: 'Not quite! Applying a voucher is an optional extension when ordering food, so use <<extend>>.' },
    z4: { correct: 'generalization', err: 'Wrong! E-Wallet inherits from the general Process Payment method, so use Generalization.' }
  };

  const current = levelData[levelIndex] || levelData[1];

  // FIX LỖI ẨN/HIỆN: Kiểm tra chính xác xem tiêu đề bài học hiện tại có phải bài toán Generalization gốc hay không
  const isFinalLessonCombo = current.heading === 'Grouping Objects';

  const handleDragStart = (e, itemType) => {
    e.dataTransfer.setData("type", itemType);
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    const draggedType = e.dataTransfer.getData("type");

    // NẾU ĐANG ĐỨNG Ở PHẦN 9.1 (FOOD DELIVERY CANVAS)
    if (isFinalLessonCombo && subStep9 === 1) {
      const config = zoneRequirements91[zoneId];
      if (draggedType === config.correct) {
        const newDrops = { ...droppedItems, [zoneId]: draggedType };
        setDroppedItems(newDrops);
        setErrorZone(null);
        setShowWhy(false);

        const isAllSolved = Object.keys(zoneRequirements91).every(z => newDrops[z]);
        if (isAllSolved) {
          setIsSuccess(true);
          onSolved(true); // CHÍNH THỨC MỞ KHÓA NÚT CONTINUE TO ĐÙNG CỦA HỆ THỐNG LỚN ĐỂ SANG BÀI 10!
        }
      } else {
        setErrorZone(zoneId);
        setShowWhy(true);
        setIsSuccess(false);
        setWhyText(config.err);
        setTimeout(() => setErrorZone(null), 500);
      }
      return;
    }

    // LUỒNG XỬ LÝ GỐC CHO BÀI 1 -> BÀI 5 CŨ
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
        
        if (isFinalLessonCombo) {
          // Nếu giải xong bài 9 gốc, KHÔNG mở nút cha ngay, mà giữ lại để chuyển sang subStep 9.1
          onSolved(false);
        } else {
          onSolved(true);
        }
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

  // =========================================================
  // GIAO DIỆN HIỂN THỊ BÀI 9.1 (FOOD DELIVERY COMBO CANVAS)
  // =========================================================
  if (isFinalLessonCombo && subStep9 === 1) {
    return (
      <div style={{ backgroundColor: '#0b0f19', color: 'white', padding: '25px 30px', borderRadius: '16px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto 20px auto', position: 'relative' }}>
          <h1 style={{ fontSize: '26px', marginTop: '10px', color: '#a78bfa' }}>Lesson 9.1</h1>
          <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '15px', maxWidth: '700px' }}>
            Hệ thống đặt đồ ăn online (Food Delivery). 
          </p>
          <div style={{ position: 'absolute', top: '10px', right: '0' }}>
            <button onClick={resetLevel} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', backgroundColor: '#1f293d', color: '#9ca3af', border: '1px solid #374151', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <RotateCcw size={16} /> Retry
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#111827', borderRadius: '16px', padding: '40px 30px', border: '1px solid #1f293d', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100px' }}>
              <User size={40} color="#a78bfa" />
              <span style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '13px' }}>Customer</span>
            </div>

            {/* Z1 Zone */}
            <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'z1')} style={{ width: '100px', height: '45px', border: errorZone === 'z1' ? '2px dashed #ef4444' : droppedItems.z1 ? 'none' : '2px dashed #374151', borderRadius: '8px', backgroundColor: '#1f293d', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', color: '#6b7280', borderBottom: droppedItems.z1 ? '4px solid #10b981' : '', animation: errorZone === 'z1' ? 'shake 0.4s' : 'none' }}>
              {droppedItems.z1 ? <span style={{color: '#10b981', fontWeight: 'bold'}}>Association</span> : 'Zone Z1'}
            </div>

            <div style={{ width: '140px', height: '60px', border: '2px solid #3b82f6', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e3a8a' }}>
              <ShoppingBag size={20} color="#93c5fd" style={{marginRight: '6px'}} />
              <span style={{ color: '#bfdbfe', fontWeight: 'bold', fontSize: '12px' }}>Order Food</span>
            </div>

            {/* Z3 Zone */}
            <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'z3')} style={{ width: '100px', height: '45px', border: errorZone === 'z3' ? '2px dashed #ef4444' : droppedItems.z3 ? 'none' : '2px dashed #374151', borderRadius: '8px', backgroundColor: '#1f293d', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', color: '#6b7280', position: 'relative', borderBottom: droppedItems.z3 ? '3px dashed #10b981' : '', animation: errorZone === 'z3' ? 'shake 0.4s' : 'none' }}>
              {droppedItems.z3 ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" style={{ position: 'absolute', left: '-10px', top: '-11px' }}><polyline points="15 18 9 12 15 6" /></svg>
                  <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 'bold', position: 'absolute', top: '-25px' }}>&lt;&lt;extend&gt;&gt;</span>
                </>
              ) : 'Zone Z3'}
            </div>

            <div style={{ width: '140px', height: '60px', border: '2px solid #3b82f6', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e3a8a' }}>
              <Ticket size={20} color="#93c5fd" style={{marginRight: '6px'}} />
              <span style={{ color: '#bfdbfe', fontWeight: 'bold', fontSize: '12px' }}>Apply Voucher</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginLeft: '115px' }}>
            {/* Z2 Zone */}
            <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'z2')} style={{ width: '45px', height: '60px', border: errorZone === 'z2' ? '2px dashed #ef4444' : droppedItems.z2 ? 'none' : '2px dashed #374151', borderRadius: '8px', backgroundColor: '#1f293d', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', color: '#6b7280', position: 'relative', borderLeft: droppedItems.z2 ? '3px dashed #10b981' : '', animation: errorZone === 'z2' ? 'shake 0.4s' : 'none' }}>
              {droppedItems.z2 ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" style={{ position: 'absolute', bottom: '-10px', left: '-11px', transform: 'rotate(90deg)' }}><polyline points="9 18 15 12 9 6" /></svg>
                  <span style={{ color: '#10b981', fontSize: '10px', fontWeight: 'bold', position: 'absolute', left: '10px' }}>&lt;&lt;inc&gt;&gt;</span>
                </>
              ) : 'Z2'}
            </div>

            <div style={{ width: '140px', height: '60px', border: '2px solid #3b82f6', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e3a8a' }}>
              <CreditCard size={20} color="#93c5fd" style={{marginRight: '6px'}} />
              <span style={{ color: '#bfdbfe', fontWeight: 'bold', fontSize: '12px' }}>Process Payment</span>
            </div>

            {/* Z4 Zone */}
            <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'z4')} style={{ width: '45px', height: '60px', border: errorZone === 'z4' ? '2px dashed #ef4444' : droppedItems.z4 ? 'none' : '2px dashed #374151', borderRadius: '8px', backgroundColor: '#1f293d', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', color: '#6b7280', position: 'relative', borderLeft: droppedItems.z4 ? '4px solid #10b981' : '', animation: errorZone === 'z4' ? 'shake 0.4s' : 'none' }}>
              {droppedItems.z4 ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#111827" stroke="#10b981" strokeWidth="2" style={{ position: 'absolute', top: '-12px', left: '-12px', transform: 'rotate(-90deg)' }}><polygon points="6 5 18 12 6 19" /></svg>
              ) : 'Z4'}
            </div>

            <div style={{ width: '140px', height: '60px', border: '2px solid #3b82f6', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e3a8a' }}>
              <Wallet size={20} color="#93c5fd" style={{marginRight: '6px'}} />
              <span style={{ color: '#bfdbfe', fontWeight: 'bold', fontSize: '12px' }}>E-Wallet Pay</span>
            </div>
          </div>

        </div>

        {/* Hộp kéo thả và Thông báo */}
        <div style={{ maxWidth: '900px', margin: '30px auto 0 auto', display: 'flex', gap: '30px', width: '100%' }}>
          <div style={{ flex: 1.2 }}>
            <h3 style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '15px' }}>Connections:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div draggable onDragStart={e => handleDragStart(e, 'association')} style={{ padding: '12px', backgroundColor: '#1f293d', border: '1px solid #374151', borderRadius: '8px', cursor: 'grab', fontWeight: 'bold', textAlign: 'center' }}>Association</div>
              <div draggable onDragStart={e => handleDragStart(e, 'include')} style={{ padding: '12px', backgroundColor: '#1f293d', border: '1px solid #374151', borderRadius: '8px', cursor: 'grab', fontWeight: 'bold', color: '#818cf8', textAlign: 'center' }}>&lt;&lt; include &gt;&gt;</div>
              <div draggable onDragStart={e => handleDragStart(e, 'extend')} style={{ padding: '12px', backgroundColor: '#1f293d', border: '1px solid #374151', borderRadius: '8px', cursor: 'grab', fontWeight: 'bold', color: '#34d399', textAlign: 'center' }}>&lt;&lt; extend &gt;&gt;</div>
              <div draggable onDragStart={e => handleDragStart(e, 'generalization')} style={{ padding: '12px', backgroundColor: '#1f293d', border: '1px solid #374151', borderRadius: '8px', cursor: 'grab', fontWeight: 'bold', color: '#fcd34d', textAlign: 'center' }}>Generalization</div>
            </div>
          </div>
          <div style={{ flex: 1.5 }}>
            <AnimatePresence mode="wait">
              {showWhy && !isSuccess && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ padding: '20px', backgroundColor: '#312e81', border: '1px solid #4338ca', borderRadius: '12px', display: 'flex', gap: '15px' }}>
                  <HelpCircle size={30} color="#818cf8" style={{ flexShrink: 0 }} />
                  <div><h4 style={{ margin: '0 0 5px 0', color: '#c7d2fe' }}>Koji Bot says:</h4><p style={{ margin: 0, color: '#e0e7ff', fontSize: '14px', lineHeight: '1.5' }}>{whyText}</p></div>
                </motion.div>
              )}
              {isSuccess && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ padding: '20px', backgroundColor: '#064e3b', border: '1px solid #059669', borderRadius: '12px', display: 'flex', gap: '15px' }}>
                  <CheckCircle size={30} color="#34d399" style={{ flexShrink: 0 }} />
                  <div><h4 style={{ margin: '0 0 5px 0', color: '#a7f3d0' }}>Lesson learned:</h4><p style={{ margin: 0, color: '#d1fae5', fontSize: '14px', lineHeight: '1.5' }}>Congratulations! You have successfully completed the Stage 2 integration challenge. Click the main Continue button below to proceed!</p></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 50% { transform: translateX(8px); } 75% { transform: translateX(-8px); } }`}</style>
      </div>
    );
  }

  // =========================================================
  // GIAO DIỆN HIỂN THỊ CŨ CHO BÀI 1 -> BÀI 9 GỐC
  // =========================================================
  return (
    <div style={{ backgroundColor: '#0b0f19', color: 'white', padding: '25px 30px', borderRadius: '16px', fontFamily: 'sans-serif' }}>
      
      <div style={{ maxWidth: '900px', margin: '0 auto 20px auto', position: 'relative' }}>
        <h1 style={{ fontSize: '28px', marginTop: '10px' }}>{current.heading}</h1>
        <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '16px', maxWidth: '600px' }}>{current.desc}</p>
        
        <div style={{ position: 'absolute', top: '10px', right: '0', display: 'flex', gap: '10px' }}>
          <button onClick={resetLevel} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', backgroundColor: '#1f293d', color: '#9ca3af', border: '1px solid #374151', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <RotateCcw size={16} /> Retry
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#111827', borderRadius: '16px', padding: '40px 30px', border: '1px solid #1f293d', position: 'relative', overflowX: 'auto' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
          {current.flows.map((flow) => {
            const zoneIds = Object.keys(flow.zones);

            return (
              <div key={flow.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                {flow.nodes.map((node, index) => {
                  const zoneId = zoneIds[index]; 
                  const zoneConfig = flow.zones[zoneId];
                  const isLastNode = index === flow.nodes.length - 1;

                  return (
                    <React.Fragment key={node.id}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: node.type === 'Actor' ? '100px' : '140px' }}>
                        {node.type === 'Actor' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {node.icon}
                            <span style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'center', color: node.id === 'n1' && levelIndex === 5 ? '#fcd34d' : 'white' }}>{node.text}</span>
                          </div>
                        ) : (
                          <div style={{ width: '100%', height: '60px', border: '2px solid #3b82f6', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e3a8a', gap: '8px', padding: '0 10px' }}>
                            {node.icon}
                            <span style={{ color: '#bfdbfe', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>{node.text}</span>
                          </div>
                        )}
                        <span style={{ marginTop: '10px', fontSize: '10px', backgroundColor: '#374151', color: '#d1d5db', padding: '3px 8px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                          {node.type}
                        </span>
                      </div>

                      {!isLastNode && (
                        <div style={{ position: 'relative', width: '100px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-30px' }}>
                          {!droppedItems[zoneId] ? (
                            <div 
                              onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, zoneId)}
                              style={{ width: '100%', height: '100%', border: errorZone === zoneId ? '2px dashed #ef4444' : '2px dashed #374151', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: errorZone === zoneId ? '#ef4444' : '#6b7280', backgroundColor: '#1f293d', transform: errorZone === zoneId ? 'translateX(5px)' : 'none', transition: 'all 0.2s', animation: errorZone === zoneId ? 'shake 0.4s' : 'none', fontSize: '13px' }}
                            >
                              {errorZone === zoneId ? 'Wrong connection!' : 'Drop connection here'}
                            </div>
                          ) : (
                            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '100%', opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} style={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: zoneConfig.lineStyle === 'solid' ? '4px solid #10b981' : '3px dashed #10b981' }}>
                              
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

      <div style={{ maxWidth: '900px', margin: '30px auto 0 auto', display: 'flex', gap: '30px' }}>
        <div style={{ flex: 1.2 }}>
          <h3 style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '15px' }}>Connections (Drag and drop into diagram):</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div draggable onDragStart={(e) => handleDragStart(e, 'association')} style={{ padding: '12px', backgroundColor: '#1f293d', border: '1px solid #374151', borderRadius: '8px', cursor: 'grab', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ width: '40px', height: '3px', backgroundColor: '#cbd5e1' }}></div>
              <span style={{ fontWeight: 'bold', color: '#f8fafc', fontSize: '13px' }}>Association</span>
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
              <span style={{ fontWeight: 'bold', color: '#fcd34d', fontSize: '13px' }}>Generalization</span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1.5 }}>
           <AnimatePresence mode="wait">
             {showWhy && !isSuccess && (
               <motion.div key="error" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} style={{ padding: '20px', backgroundColor: '#312e81', border: '1px solid #4338ca', borderRadius: '12px', display: 'flex', gap: '15px' }}>
                 <HelpCircle size={30} color="#818cf8" style={{ flexShrink: 0 }} />
                 <div><h4 style={{ margin: '0 0 5px 0', color: '#c7d2fe' }}>Koji Bot says:</h4><p style={{ margin: 0, color: '#e0e7ff', fontSize: '14px', lineHeight: '1.5' }}>{whyText}</p></div>
               </motion.div>
             )}
             {isSuccess && (
               <motion.div key="success" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} style={{ padding: '20px', backgroundColor: '#064e3b', border: '1px solid #059669', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                 <div style={{ display: 'flex', gap: '15px' }}>
                   <CheckCircle size={30} color="#34d399" style={{ flexShrink: 0 }} />
                   <div><h4 style={{ margin: '0 0 5px 0', color: '#a7f3d0' }}>Lesson learned:</h4><p style={{ margin: 0, color: '#d1fae5', fontSize: '14px', lineHeight: '1.5' }}>{current.successText}</p></div>
                 </div>
                 {isFinalLessonCombo && (
                   <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                     <button onClick={() => setSubStep9(1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                       Final Combo Challenge (9.1) <ArrowRight size={16} />
                     </button>
                   </div>
                 )}
               </motion.div>
             )}
           </AnimatePresence>
        </div>

      </div>
      <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 50% { transform: translateX(8px); } 75% { transform: translateX(-8px); } }`}</style>
    </div>
  );
}