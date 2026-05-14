/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Plus, 
  Trash2, 
  Hammer, 
  Layers, 
  Printer, 
  Info, 
  Sparkles, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  FileSearch, 
  Settings2, 
  ShieldCheck, 
  AlertTriangle,
  BookOpen,
  MousePointer2,
  Package,
  BrickWall,
  Droplets,
  PaintRoller,
  Lightbulb,
  Box,
  DoorOpen,
  Component,
  GripVertical
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('structure');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [specData, setSpecData] = useState({
    structure: [
      { id: 1, item: "Cát xây tô (Hồ sơ thiết kế)", specs: "Ml = 1.5 - 2.0", reference: "TCVN 7570:2006", standard: "Mô đun độ lớn Ml = 1.5 - 2.0. Hàm lượng bùn, bụi, sét ≤ 3% (theo khối lượng). Hàm lượng tạp chất hữu cơ (thử bằng phương pháp so màu) không sậm hơn màu chuẩn. Hàm lượng ion Cl- ≤ 0.05%.", brand: "Cát Sông Tiền / Sông Hậu", notes: "Lưu kho trên nền bê tông/bạt" },
      { id: 2, item: "Gạch xây Tuynel", specs: "Gạch ống 4 lỗ 8x8x18", reference: "TCVN 1450:2009", standard: "Kích thước danh nghĩa 180x80x80mm. Sai lệch cho phép: Dài ±6mm, Rộng ±4mm, Dày ±3mm. Cường độ nén trung bình (Mác 75) ≥ 7.5 MPa. Cường độ uốn trung bình ≥ 1.5 MPa. Độ hút nước ≤ 16%. Khuyết tật ngoại quan: Độ cong vênh trên mặt lớn nhất ≤ 4mm.", brand: "Tám Quỳnh / Thành Tâm", notes: "Tưới nước sũng gạch trước khi xây ít nhất 2h" }
    ],
    finishing: [
      { id: 101, item: "Gạch Porcelain lát nền", specs: "600x600mm", reference: "TCVN 13113:2020", standard: "Độ hút nước E ≤ 0.5% (Nhóm BIa). Cường độ uốn ≥ 35 MPa. Lực phá vỡ ≥ 1300 N. Sai lệch kích thước chiều dài/rộng ± 0.6%. Sai lệch độ dày ± 5%. Độ phẳng bề mặt (độ cong trung tâm) ± 0.5%.", brand: "Eurotile / Taicera", notes: "Dùng keo dán gạch, không dùng hồ dầu" }
    ],
    mep: [
      { id: 201, item: "Ống nhựa uPVC", specs: "PN10 - PN25", reference: "TCVN 8491-2:2011", standard: "Độ bền với áp suất bên trong: Không vỡ ở áp suất thử nghiệm. Độ bền va đập Charpy ≥ 15 kJ/m2. Độ mờ đục ≤ 0.2%. Sự thay đổi kích thước theo chiều dọc ≤ 5%.", brand: "Bình Minh / Tiền Phong", notes: "Bảo quản tránh ánh nắng trực tiếp" }
    ]
  });

  const [newItem, setNewItem] = useState({ item: '', specs: '', reference: '', standard: '', brand: '', notes: '' });
  const [projectInfo, setProjectInfo] = useState({
    name: "CÔNG TRÌNH NHÀ PHỐ TÂN CỔ ĐIỂN",
    address: "KDC Him Lam, Quận 7, TP.HCM",
    date: new Date().toLocaleDateString('vi-VN')
  });

  const aiKnowledgeBase = {
    // PHẦN THÔ - THÔNG SỐ ĐỊNH LƯỢNG CHI TIẾT
    "bê tông móng": {
      specs: "Mác 300 (B22.5)",
      reference: "TCVN 4453:1995",
      standard: "Độ sụt tại hiện trường sai số ± 20mm. Cường độ nén mẫu lập phương 150x150x150mm ở 28 ngày tuổi R28 ≥ 22.5 MPa. Tần suất lấy mẫu: 01 tổ mẫu (03 viên) cho mỗi 50m3 bê tông móng. Sai lệch lớp bảo vệ cốt thép ± 5mm.",
      brand: "LafargeHolcim / Lê Phan",
      notes: "Bảo dưỡng ẩm liên tục 7 ngày đầu, 3 lần/ngày."
    },
    "thép": {
      specs: "CB400V - SD390",
      reference: "TCVN 1651-2:2018",
      standard: "Giới hạn chảy ≥ 400 MPa. Giới hạn bền kéo ≥ 570 MPa. Độ giãn dài sau đứt A5 ≥ 14%. Tỷ số giới hạn bền kéo/giới hạn chảy thực tế ≥ 1.25. Sai lệch khối lượng 1m chiều dài: ± 5% (d≤10mm), ± 4% (d>10mm).",
      brand: "Việt Nhật / Hòa Phát",
      notes: "Sử dụng con kê bê tông đúc sẵn mác tương đương."
    },
    "xi măng": {
      specs: "PCB40",
      reference: "TCVN 6260:2020",
      standard: "Cường độ nén ở 28 ngày tuổi ≥ 40 MPa. Thời gian đông kết: Bắt đầu ≥ 45 phút, Kết thúc ≤ 600 phút. Độ ổn định thể tích (độ nở Le Chatelier) ≤ 10mm. Hàm lượng SO3 ≤ 3.5%.",
      brand: "Insee Đa Dụng / Hà Tiên 1",
      notes: "Xếp cao không quá 10 bao, cách tường 20cm."
    },
    "đá 1x2": {
      specs: "Dmax = 20mm",
      reference: "TCVN 7570:2006",
      standard: "Kích thước hạt lớn nhất Dmax = 20mm. Hàm lượng hạt thoi dẹt ≤ 15% (theo khối lượng). Hàm lượng bùn, bụi, sét ≤ 1%. Độ nén dập trong xi lanh ≤ 11%. Hàm lượng hạt mềm yếu ≤ 10%.",
      brand: "Mỏ đá Hóa An / Tân Cang",
      notes: "Đá xanh, không dùng đá đen mục."
    },
    "đá 4x6": {
      specs: "Lót móng d=100",
      reference: "TCVN 7570:2006",
      standard: "Kích thước hạt 40-60mm. Hàm lượng bùn, bụi, sét ≤ 1% (theo khối lượng). Độ nén dập trong xi lanh ≤ 11%. Cường độ đá gốc ≥ 80 MPa. Không lẫn tạp chất hữu cơ.",
      brand: "Hóa An / Núi Nhỏ",
      notes: "Dùng máy đầm bàn hoặc đầm cóc để lèn chặt."
    },
    "cát bê tông": {
      specs: "Cát hạt vàng, hạt to",
      reference: "TCVN 7570:2006",
      standard: "Mô đun độ lớn Ml = 2.0 - 3.3. Hàm lượng bùn, bụi, sét ≤ 1.5% (theo khối lượng). Hàm lượng tạp chất hữu cơ (thử bằng phương pháp so màu) không sậm hơn màu chuẩn. Hàm lượng ion Cl- ≤ 0.01%.",
      brand: "Cát Sông Tiền / Sông Hậu",
      notes: "Rửa sạch nếu có lẫn bùn đất. Lưu kho trên nền bê tông."
    },
    "gạch xây tuynel": {
      specs: "Gạch ống 4 lỗ 8x8x18",
      reference: "TCVN 1450:2009",
      standard: "Kích thước danh nghĩa 180x80x80mm. Sai lệch cho phép: Dài ±6mm, Rộng ±4mm, Dày ±3mm. Cường độ nén trung bình (Mác 75) ≥ 7.5 MPa. Cường độ uốn trung bình ≥ 1.5 MPa. Độ hút nước ≤ 16%. Khuyết tật ngoại quan: Độ cong vênh trên mặt lớn nhất ≤ 4mm.",
      brand: "Tám Quỳnh / Thành Tâm",
      notes: "Tưới nước sũng gạch trước khi xây ít nhất 2h."
    },
    "gạch đinh": {
      specs: "Gạch đặc 4x8x18",
      reference: "TCVN 1451:1998",
      standard: "Kích thước danh nghĩa 180x80x40mm. Sai lệch cho phép: Dài ±4mm, Rộng ±3mm, Dày ±2mm. Cường độ nén trung bình ≥ 7.5 MPa. Độ hút nước ≤ 16%. Khuyết tật ngoại quan: Độ cong vênh ≤ 3mm.",
      brand: "Tám Quỳnh / Dương Hải Phát",
      notes: "Tưới nước sũng trước khi xây ít nhất 2h."
    },
    "chống thấm": {
      specs: "2 Thành phần (Gốc xi)",
      reference: "TCVN 9065:2012",
      standard: "Cường độ bám dính trên nền bê tông ≥ 0.8 MPa. Độ thấm nước dưới áp lực thủy tĩnh 1.5 bar trong 7 ngày: Không thấm. Cường độ chịu uốn ≥ 4.0 MPa. Cường độ chịu nén ≥ 15.0 MPa.",
      brand: "Sika Topseal 107 / Kova CT11A",
      notes: "Quét lớp 2 sau lớp 1 từ 4-8 tiếng (khi lớp 1 còn ẩm)."
    },
    // HOÀN THIỆN - THÔNG SỐ ĐỊNH LƯỢNG CHI TIẾT
    "sơn": {
      specs: "Hệ sơn 3 lớp",
      reference: "TCVN 8652:2012",
      standard: "Độ mịn ≤ 30 µm. Thời gian khô bề mặt ≤ 2h, khô hoàn toàn ≤ 24h. Độ bám dính (thử nghiệm cắt chéo) ≤ điểm 1. Độ bền nước sau 96h: màng sơn không bị phồng rộp, bong tróc.",
      brand: "Dulux Ambiance / Jotun Majestic",
      notes: "Lăn sơn lót kháng kiềm trước khi sơn phủ."
    },
    "ống nước": {
      specs: "PPR PN20 / PVC C2",
      reference: "TCVN 10022:2013",
      standard: "Độ bền với áp suất bên trong: Không vỡ ở 16 MPa (20°C, 1h) và 4.3 MPa (95°C, 22h). Độ bền va đập Charpy ≥ 15 kJ/m2. Độ mờ đục ≤ 0.2%. Sự thay đổi kích thước theo chiều dọc ≤ 2%.",
      brand: "Bình Minh / Vesbo / Dekko",
      notes: "Cố định ống bằng đai thép mỗi 1m chiều dài."
    },
    "thạch cao": {
      specs: "Tấm 9mm / Khung 0.4mm",
      reference: "TCVN 8256:2009",
      standard: "Độ dày 9.0mm ± 0.4mm. Tải trọng phá hủy uốn: Chiều dọc ≥ 360N, Chiều ngang ≥ 140N. Độ biến dạng ẩm ≤ 1.5mm. Khối lượng riêng bề mặt ≤ 12 kg/m2.",
      brand: "Vĩnh Tường / Boral",
      notes: "Chừa khe giãn nở 5mm tại vị trí tiếp giáp tường."
    },
    "cửa nhôm": {
      specs: "Profile dầy 1.4-2.0mm",
      reference: "TCVN 9366-2:2012",
      standard: "Độ lọt khí ≤ 3.0 m3/(m.h.m2) (Class 3). Độ kín nước: Không thấm ở áp suất chênh lệch 150 Pa. Độ bền áp lực gió: Độ võng lớn nhất của thanh profile ≤ L/200.",
      brand: "Xingfa Quảng Đông / BM Windows",
      notes: "Silicon Apollo A500 cho đường viền ngoài."
    },
    "đá granite": {
      specs: "Dầy 18mm (±1mm)",
      reference: "TCVN 4732:2016",
      standard: "Độ hút nước ≤ 0.5%. Cường độ nén khô ≥ 60 MPa. Cường độ uốn khô ≥ 8 MPa. Độ bóng bề mặt ≥ 80 đơn vị. Sai lệch kích thước chiều dài/rộng ± 1.0mm. Sai lệch độ phẳng ≤ 0.5mm/2m.",
      brand: "Đen Ấn Độ / Trắng Suối Lau",
      notes: "Dùng keo dán đá chuyên dụng, không dùng hồ dầu."
    },
    "thiết bị điện": {
      specs: "Module Cao cấp",
      reference: "TCVN 7447 (IEC 60364)",
      standard: "Điện trở cách điện ≥ 0.5 MΩ (điện áp thử nghiệm 500V DC). Điện trở nối đất hệ thống Rđ ≤ 4Ω. Khả năng chịu dòng ngắn mạch và bảo vệ quá tải theo chuẩn IEC 60898.",
      brand: "Panasonic / Schneider",
      notes: "Lắp đặt sau khi đã hoàn thiện sơn nước lớp 1."
    },
    "sàn gỗ": {
      specs: "HDF Siêu chịu nước",
      reference: "TCVN 11822:2017",
      standard: "Độ trương nở chiều dày sau 24h ngâm nước ≤ 8%. Độ bền mài mòn bề mặt ≥ 2000 vòng (Cấp AC3/AC4). Lực bám giữ đinh vít ≥ 1000 N. Hàm lượng formandehyde phát tán ≤ 0.124 mg/m3 (E1).",
      brand: "Robina / Inovar",
      notes: "Trải lớp xốp bạc dầy 2mm bên dưới sàn."
    },
    "cáp điện": {
      specs: "Cu/PVC/PVC 0.6/1kV",
      reference: "TCVN 5935-1:2013",
      standard: "Điện trở ruột dẫn ở 20°C đạt chuẩn. Chiều dày cách điện và vỏ bọc không nhỏ hơn giá trị quy định. Khả năng chịu điện áp thử nghiệm 3.5kV trong 5 phút không đánh thủng.",
      brand: "Cadivi / Thịnh Phát",
      notes: "Luồn ống bảo vệ khi đi ngầm."
    },
    "ống luồn dây": {
      specs: "PVC chống cháy",
      reference: "TCVN 7417-1:2010",
      standard: "Khả năng chịu nén ≥ 320N. Khả năng chịu va đập: Không nứt vỡ khi thử nghiệm thả rơi vật nặng. Khả năng chống cháy lan: Tự tắt lửa trong vòng 30s sau khi lấy nguồn lửa ra.",
      brand: "Sino / Panasonic",
      notes: "Sử dụng lò xo uốn ống chuyên dụng."
    }
  };

  const library = {
    structure: ["Bê tông móng", "Thép", "Xi măng", "Cát bê tông", "Đá 1x2", "Đá 4x6", "Gạch xây Tuynel", "Gạch đinh", "Chống thấm"],
    finishing: ["Sơn", "Gạch lát nền", "Thạch cao", "Cửa nhôm", "Đá Granite", "Sàn gỗ"],
    mep: ["Ống nước", "Đèn Led", "Thiết bị điện", "Cáp điện", "Ống luồn dây"]
  };

  const getIconForMaterial = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('gạch')) return <BrickWall size={12} />;
    if (lowerName.includes('nước') || lowerName.includes('chống thấm')) return <Droplets size={12} />;
    if (lowerName.includes('sơn')) return <PaintRoller size={12} />;
    if (lowerName.includes('đèn') || lowerName.includes('điện')) return <Lightbulb size={12} />;
    if (lowerName.includes('bê tông')) return <Box size={12} />;
    if (lowerName.includes('sàn') || lowerName.includes('thạch cao')) return <Layers size={12} />;
    if (lowerName.includes('cửa')) return <DoorOpen size={12} />;
    if (lowerName.includes('đá') || lowerName.includes('cát')) return <Component size={12} />;
    if (lowerName.includes('xi măng')) return <Package size={12} />;
    if (lowerName.includes('thép')) return <GripVertical size={12} />;
    return <MousePointer2 size={12} />;
  };

  const addItem = async () => {
    if (!newItem.item) return;
    
    let itemToAdd = { ...newItem };
    
    // Nếu người dùng nhập trực tiếp mà chưa có thông số, tự động tra cứu AI Knowledge Base
    if (!itemToAdd.specs && !itemToAdd.standard) {
      setIsGenerating(true);
      const input = itemToAdd.item.toLowerCase();
      const entry = Object.entries(aiKnowledgeBase).find(([key]) => input.includes(key) || key.includes(input));
      
      if (entry) {
        itemToAdd = { ...itemToAdd, ...entry[1] };
        setIsGenerating(false);
      } else {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Cung cấp thông số kỹ thuật và tiêu chuẩn nghiệm thu cho vật liệu xây dựng: "${itemToAdd.item}". Trả về tiếng Việt.`,
            config: {
              systemInstruction: "Bạn là một kỹ sư xây dựng và giám sát chất lượng (QA/QC) tại Việt Nam. Hãy cung cấp thông số kỹ thuật chính xác, tiêu chuẩn TCVN áp dụng, và tiêu chuẩn nghiệm thu cho vật liệu xây dựng được yêu cầu.",
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  specs: { type: Type.STRING, description: "Thông số kỹ thuật ngắn gọn (VD: Mác 300, Dmax=20mm, Dầy 18mm)" },
                  reference: { type: Type.STRING, description: "Tiêu chuẩn áp dụng (VD: TCVN 4453:1995)" },
                  standard: { type: Type.STRING, description: "Tiêu chuẩn nghiệm thu chi tiết, sai số cho phép định lượng" },
                  brand: { type: Type.STRING, description: "Các thương hiệu phổ biến, uy tín tại Việt Nam" },
                  notes: { type: Type.STRING, description: "Ghi chú thi công hoặc bảo quản tại hiện trường" }
                },
                required: ["specs", "reference", "standard", "brand", "notes"]
              }
            }
          });
          
          if (response.text) {
            const aiData = JSON.parse(response.text);
            itemToAdd = {
              ...itemToAdd,
              specs: aiData.specs || "Theo hồ sơ thiết kế",
              reference: aiData.reference || "TCVN hiện hành",
              standard: aiData.standard || "Thông số kỹ thuật: Sai số hình học ±1mm. Cường độ vật liệu đạt TCVN hiện hành.",
              brand: aiData.brand || "Loại 1 chuyên dụng",
              notes: aiData.notes || "Nghiệm thu thực tế từng đợt tại hiện trường."
            };
          }
        } catch (error) {
          console.error("Lỗi khi gọi AI:", error);
          itemToAdd = {
            ...itemToAdd,
            specs: "Theo hồ sơ thiết kế",
            reference: "TCVN hiện hành",
            standard: "Thông số kỹ thuật: Sai số hình học ±1mm. Cường độ vật liệu đạt TCVN hiện hành. Nhà thầu cung cấp chứng chỉ xuất xưởng và kết quả thí nghiệm độc lập trước khi lắp đặt.",
            brand: "Loại 1 chuyên dụng",
            notes: "Nghiệm thu thực tế từng đợt tại hiện trường."
          };
        } finally {
          setIsGenerating(false);
        }
      }
    }

    const id = Date.now();
    setSpecData(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], { ...itemToAdd, id }]
    }));
    setNewItem({ item: '', specs: '', reference: '', standard: '', brand: '', notes: '' });
  };

  const fillFromLibrary = (libItem) => {
    const key = libItem.toLowerCase();
    const entry = Object.entries(aiKnowledgeBase).find(([k]) => key.includes(k) || k.includes(key));
    if (entry) {
      setNewItem({
        item: libItem,
        ...entry[1]
      });
    } else {
      setNewItem({ ...newItem, item: libItem, specs: '', reference: '', standard: '', brand: '', notes: '' });
    }
  };

  const addAllFromLibrary = () => {
    const newItems = library[activeTab].map((libItem, index) => {
      const key = libItem.toLowerCase();
      const entry = Object.entries(aiKnowledgeBase).find(([k]) => key.includes(k) || k.includes(key));
      
      if (entry) {
        return {
          id: Date.now() + index,
          item: libItem,
          ...entry[1]
        };
      } else {
        return {
          id: Date.now() + index,
          item: libItem,
          specs: "Theo hồ sơ thiết kế",
          reference: "TCVN hiện hành",
          standard: "Thông số kỹ thuật: Sai số hình học ±1mm. Cường độ vật liệu đạt TCVN hiện hành. Nhà thầu cung cấp chứng chỉ xuất xưởng và kết quả thí nghiệm độc lập trước khi lắp đặt.",
          brand: "Loại 1 chuyên dụng",
          notes: "Nghiệm thu thực tế từng đợt tại hiện trường."
        };
      }
    });

    setSpecData(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], ...newItems]
    }));
  };

  const handleAIGenerate = async () => {
    if (!newItem.item) return;
    setIsGenerating(true);
    
    const input = newItem.item.toLowerCase();
    const entry = Object.entries(aiKnowledgeBase).find(([key]) => input.includes(key) || key.includes(input));
    
    if (entry) {
      setNewItem({ ...newItem, ...entry[1] });
      setIsGenerating(false);
    } else {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Cung cấp thông số kỹ thuật và tiêu chuẩn nghiệm thu cho vật liệu xây dựng: "${newItem.item}". Trả về tiếng Việt.`,
          config: {
            systemInstruction: "Bạn là một kỹ sư xây dựng và giám sát chất lượng (QA/QC) tại Việt Nam. Hãy cung cấp thông số kỹ thuật chính xác, tiêu chuẩn TCVN áp dụng, và tiêu chuẩn nghiệm thu cho vật liệu xây dựng được yêu cầu.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                specs: { type: Type.STRING, description: "Thông số kỹ thuật ngắn gọn (VD: Mác 300, Dmax=20mm, Dầy 18mm)" },
                reference: { type: Type.STRING, description: "Tiêu chuẩn áp dụng (VD: TCVN 4453:1995)" },
                standard: { type: Type.STRING, description: "Tiêu chuẩn nghiệm thu chi tiết, sai số cho phép định lượng" },
                brand: { type: Type.STRING, description: "Các thương hiệu phổ biến, uy tín tại Việt Nam" },
                notes: { type: Type.STRING, description: "Ghi chú thi công hoặc bảo quản tại hiện trường" }
              },
              required: ["specs", "reference", "standard", "brand", "notes"]
            }
          }
        });
        
        if (response.text) {
          const aiData = JSON.parse(response.text);
          setNewItem({
            ...newItem,
            specs: aiData.specs || "Theo hồ sơ thiết kế",
            reference: aiData.reference || "TCVN hiện hành",
            standard: aiData.standard || "Thông số kỹ thuật: Sai số hình học ±1mm. Cường độ vật liệu đạt TCVN hiện hành.",
            brand: aiData.brand || "Loại 1 chuyên dụng",
            notes: aiData.notes || "Nghiệm thu thực tế từng đợt tại hiện trường."
          });
        }
      } catch (error) {
        console.error("Lỗi khi gọi AI:", error);
        setNewItem({
          ...newItem,
          specs: "Theo hồ sơ thiết kế",
          reference: "TCVN hiện hành",
          standard: `Thông số kỹ thuật: Sai số hình học ±1mm. Cường độ vật liệu đạt TCVN hiện hành. Nhà thầu cung cấp chứng chỉ xuất xưởng và kết quả thí nghiệm độc lập trước khi lắp đặt.`,
          brand: "Loại 1 chuyên dụng",
          notes: "Nghiệm thu thực tế từng đợt tại hiện trường."
        });
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const exportPDF = async () => {
    const element = document.querySelector('.a4-container') as HTMLElement;
    if (!element) return;

    setIsExporting(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Tieu_Chuan_Ky_Thuat_${projectInfo.name.replace(/\\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col overflow-hidden font-inter">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 p-4 shadow-sm flex justify-between items-center print:hidden shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-lg shadow-lg rotate-3">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-800 uppercase leading-none">Engineering Spec Pro</h1>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Hệ thống lập tiêu chuẩn kỹ thuật</p>
          </div>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={exportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? <RefreshCw className="animate-spin" size={16} /> : <Printer size={16} />} 
            {isExporting ? 'ĐANG XUẤT...' : 'XUẤT HỒ SƠ PDF'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Input */}
        <aside className="w-[380px] bg-white border-r border-zinc-200 flex flex-col overflow-y-auto print:hidden shadow-xl z-10">
          <div className="p-6 space-y-6">
            
            <div className="bg-white border border-zinc-200 p-5 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={14} /> Thông tin dự án
              </label>
              <input 
                value={projectInfo.name}
                onChange={e => setProjectInfo({...projectInfo, name: e.target.value})}
                className="w-full bg-transparent border-b border-zinc-300 py-1 font-bold text-sm focus:border-emerald-500 outline-none text-slate-800 uppercase"
              />
              <input 
                value={projectInfo.address}
                onChange={e => setProjectInfo({...projectInfo, address: e.target.value})}
                className="w-full bg-transparent border-b border-zinc-300 py-1 text-xs text-zinc-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#f4f4f5cc] p-1.5 rounded-2xl border border-[#e4e4e780]">
              <button 
                onClick={() => setActiveTab('structure')}
                className={`py-3 text-[11px] font-black rounded-xl transition-all duration-300 ${activeTab === 'structure' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-[#e4e4e780]' : 'text-zinc-500 hover:text-emerald-600 hover:bg-zinc-50'}`}
              >
                KẾT CẤU
              </button>
              <button 
                onClick={() => setActiveTab('finishing')}
                className={`py-3 text-[11px] font-black rounded-xl transition-all duration-300 ${activeTab === 'finishing' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-[#e4e4e780]' : 'text-zinc-500 hover:text-emerald-600 hover:bg-zinc-50'}`}
              >
                HOÀN THIỆN
              </button>
              <button 
                onClick={() => setActiveTab('mep')}
                className={`py-3 text-[11px] font-black rounded-xl transition-all duration-300 ${activeTab === 'mep' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-[#e4e4e780]' : 'text-zinc-500 hover:text-emerald-600 hover:bg-zinc-50'}`}
              >
                CƠ ĐIỆN
              </button>
            </div>

            {/* THƯ VIỆN VẬT LIỆU */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                  <Package size={14} /> Thư viện vật liệu (Chi tiết AI)
                </label>
                <button 
                  onClick={addAllFromLibrary}
                  className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1"
                  title="Thêm tất cả vật liệu trong tab này"
                >
                  <Plus size={10} /> THÊM TẤT CẢ
                </button>
              </div>
              <div className="bg-[#ecfdf54d] p-3 rounded-2xl border border-emerald-100 flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto shadow-inner">
                {library[activeTab].map(libItem => (
                  <button
                    key={libItem}
                    onClick={() => fillFromLibrary(libItem)}
                    title={libItem}
                    className="max-w-[140px] px-2.5 py-1.5 bg-white hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 rounded-lg text-[10.5px] font-bold text-emerald-800 hover:text-white transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
                  >
                    {getIconForMaterial(libItem)}
                    <span className="truncate">{libItem}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundImage: 'linear-gradient(to right, #34d399, #14b8a6)' }}></div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-2 tracking-widest">
                  <Sparkles size={14} className="text-emerald-500" /> Biên tập thông số
                </label>
                <div className="flex gap-2">
                  <input 
                    placeholder="Tên vật liệu..."
                    className="flex-1 px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                    value={newItem.item}
                    onChange={e => setNewItem({...newItem, item: e.target.value})}
                  />
                  <button 
                    onClick={handleAIGenerate}
                    disabled={isGenerating || !newItem.item}
                    className="p-3 bg-slate-800 text-white rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center shadow-lg active:scale-90"
                  >
                    {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
                  </button>
                </div>
              </div>

              <div className={`space-y-4 transition-all ${isGenerating ? 'opacity-50 blur-[1px]' : ''}`}>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Thông số KT</span>
                    <input 
                      value={newItem.specs}
                      onChange={e => setNewItem({...newItem, specs: e.target.value})}
                      className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Căn cứ TC</span>
                    <input 
                      value={newItem.reference}
                      onChange={e => setNewItem({...newItem, reference: e.target.value})}
                      className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Nhãn hiệu</span>
                    <input 
                      value={newItem.brand}
                      onChange={e => setNewItem({...newItem, brand: e.target.value})}
                      className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                   <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tiêu chuẩn nghiệm thu (Định lượng)</span>
                   <textarea 
                    value={newItem.standard}
                    onChange={e => setNewItem({...newItem, standard: e.target.value})}
                    className="w-full p-4 bg-white border border-zinc-200 rounded-lg text-[12px] leading-relaxed min-h-[140px] font-medium text-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="Nhập nội dung nghiệm thu chi tiết..."
                  />
                </div>

                <button 
                  onClick={addItem}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg hover:shadow-[0_10px_15px_-3px_rgba(5,150,105,0.2)] active:scale-95 flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Thêm vào hồ sơ
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 bg-[#e4e4e7cc] overflow-y-auto flex flex-col items-center p-10 print:p-0 print:bg-white">
          <div className="a4-container bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-[210mm] min-h-[297mm] p-[15mm] md:p-[20mm] relative print:shadow-none print:max-w-none print:w-full transition-all border-t-[12px] border-emerald-700 doc-preview ring-1 ring-[#0000000d]">
            
            {/* Header Văn Bản */}
            <div className="flex justify-between items-start mb-10 border-b-2 border-slate-900 pb-6">
              <div className="w-[150px] text-[10px] font-bold uppercase text-slate-500">
                <p>Mã hiệu: QC-FLD-2026</p>
                <p>Mẫu số: 01/KTTC</p>
              </div>
              <div className="flex-1 text-center px-4">
                <h1 className="text-[26px] font-black uppercase tracking-tight leading-tight mb-1 text-slate-900">BẢNG TIÊU CHÍ KỸ THUẬT VÀ SAI SỐ</h1>
              </div>
              <div className="w-[150px] text-right text-[11px] font-bold text-slate-800">
                {projectInfo.date}
              </div>
            </div>

            {/* Thông tin dự án */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-[11px]">
              <div className="border border-slate-300 p-4 bg-zinc-50 rounded shadow-sm">
                <p className="text-[9px] text-zinc-400 font-bold uppercase mb-1 tracking-wider">Thông tin dự án</p>
                <p className="font-black text-slate-900 uppercase leading-snug text-[13px]">{projectInfo.name}</p>
                <p className="font-semibold text-slate-600 italic mt-1">{projectInfo.address}</p>
              </div>
              <div className="border border-slate-300 p-4 bg-[#f2fdf8] rounded shadow-sm">
                <p className="text-[9px] text-zinc-400 font-bold uppercase mb-1 tracking-wider">Hạng mục kiểm soát</p>
                <p className="font-black text-emerald-900 uppercase leading-snug text-[13px]">{activeTab === 'structure' ? '01: KỸ THUẬT THI CÔNG KẾT CẤU' : activeTab === 'finishing' ? '02: KỸ THUẬT THI CÔNG HOÀN THIỆN' : '03: KỸ THUẬT THI CÔNG CƠ ĐIỆN (MEP)'}</p>
                <p className="text-[10px] text-emerald-700 mt-1 font-bold italic">Tiêu chuẩn: TCVN & Hồ sơ thiết kế đã phê duyệt</p>
              </div>
            </div>

            {/* Bảng Nội Dung */}
            <table className="w-full border-collapse border-2 border-slate-900 text-[11px] mb-8 font-serif-doc">
              <thead>
                <tr className="bg-slate-900 text-white uppercase font-inter-ui">
                  <th className="border border-slate-900 p-2 w-[35px]">STT</th>
                  <th className="border border-slate-900 p-2 w-[16%]">Chủng loại</th>
                  <th className="border border-slate-900 p-2 w-[12%]">Thông số KT</th>
                  <th className="border border-slate-900 p-2 w-[12%]">Căn cứ TC</th>
                  <th className="border border-slate-900 p-2 text-left">Tiêu chuẩn kỹ thuật / Sai lệch cho phép (Định lượng)</th>
                  <th className="border border-slate-900 p-2 w-[14%]">Thương hiệu</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {specData[activeTab].map((item, idx) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={item.id} 
                      className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#fdfdfd]'} hover:bg-[#f5fef9] transition-colors group relative`}
                    >
                      <td className="border border-slate-400 p-2 text-center font-bold font-inter-ui">{idx + 1}</td>
                      <td className="border border-slate-400 p-2 font-black uppercase text-slate-800 align-top leading-tight relative">
                        {item.item}
                        <button 
                          onClick={() => {
                            setSpecData(prev => ({
                              ...prev,
                              [activeTab]: prev[activeTab].filter(i => i.id !== item.id)
                            }));
                          }}
                          className="absolute left-[-30px] top-1/2 -translate-y-1/2 p-1.5 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity print:hidden hover:bg-red-200"
                          title="Xóa mục này"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                      <td className="border border-slate-400 p-2 text-center font-bold text-emerald-800 align-top text-[11px] uppercase">{item.specs}</td>
                      <td className="border border-slate-400 p-2 text-center font-bold text-slate-700 align-top text-[10px] uppercase">{item.reference}</td>
                      <td className="border border-slate-400 p-3 text-justify leading-relaxed align-top">
                        <div className="whitespace-pre-line italic font-medium text-slate-700 mb-2">{item.standard}</div>
                        {item.notes && (
                          <div className="pt-2 border-t border-dotted border-zinc-400 text-[9px] font-bold text-slate-500 uppercase font-inter-ui">
                             Ghi chú hiện trường: {item.notes}
                          </div>
                        )}
                      </td>
                      <td className="border border-slate-400 p-2 text-center font-bold uppercase align-top text-slate-700 leading-tight">{item.brand}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {[...Array(Math.max(0, 4 - specData[activeTab].length))].map((_, i) => (
                  <tr key={`empty-${i}`} className="h-24">
                    <td className="border border-slate-400"></td>
                    <td className="border border-slate-400"></td>
                    <td className="border border-slate-400"></td>
                    <td className="border border-slate-400"></td>
                    <td className="border border-slate-400"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Quy định ký tên */}
            <div className="mt-auto pt-10">
              <div className="grid grid-cols-2 text-center text-[13px] font-bold text-slate-900 uppercase">
                <div className="space-y-24">
                  <p>Phê duyệt bởi (Chủ đầu tư)</p>
                  <div className="w-48 h-[1px] bg-slate-300 mx-auto"></div>
                </div>
                <div className="space-y-24">
                  <p>Người lập (Kỹ sư Giám sát)</p>
                  <div className="w-48 h-[1px] bg-slate-300 mx-auto"></div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center text-[8px] text-zinc-400 font-bold uppercase tracking-[1.5em] print:hidden">
              Engineering Spec Pro - Internal Quality Standard
            </div>
          </div>
        </main>
      </div>

      <style>
        {`
          .font-inter { font-family: 'Inter', sans-serif; }
          .font-inter-ui { font-family: 'Inter', sans-serif; }
          .font-serif-doc { font-family: "Times New Roman", Times, serif; }
          
          .doc-preview { color: #000; line-height: 1.5; }

          @media print {
            body { background: white !important; overflow: visible !important; }
            .print\\:hidden { display: none !important; }
            @page { size: A4; margin: 10mm; }
            .a4-container { 
              padding: 0 !important; 
              margin: 0 !important; 
              box-shadow: none !important; 
              max-width: 100% !important;
              width: 100% !important;
              min-height: auto !important;
              border-top: none !important;
            }
            main { padding: 0 !important; background: white !important; overflow: visible !important; width: 100% !important; }
            table { border: 2.5px solid #000 !important; }
            th { background-color: #000 !important; color: #fff !important; -webkit-print-color-adjust: exact; }
            td { border: 1px solid #000 !important; color: #000 !important; }
          }

          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
          ::-webkit-scrollbar-track { background: #f1f1f1; }
        `}
      </style>
    </div>
  );
};

export default App;
