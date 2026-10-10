import React, { useState, useRef, useEffect } from 'react';
import { BoothItem, BoothItemType, ZoneCategory, Festival } from '../../types';
import { 
  RotateCw, Trash2, Copy, Save, Sparkles, Move, Maximize2, 
  Grid, Compass, ShieldAlert, Check, Plus, Layers, Monitor, 
  Zap, Table, UserCheck, ShieldCheck, Flag
} from 'lucide-react';

interface BoothSimulatorProps {
  festival: Festival;
  onSaveLayout: (updatedItems: BoothItem[]) => void;
}

interface PaletteItem {
  type: BoothItemType;
  label: string;
  defaultWidth: number; // percentage width
  defaultHeight: number; // percentage height
  color: string;
  zone: ZoneCategory;
  icon: string;
  description: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  { type: 'table_long', label: '긴 테이블 (1800×600)', defaultWidth: 32, defaultHeight: 12, color: '#10b981', zone: 'experience', icon: 'table', description: '체험객 조작용 또는 정비용 1.8m 테이블' },
  { type: 'table_short', label: '보조 테이블 (1200×600)', defaultWidth: 22, defaultHeight: 12, color: '#3b82f6', zone: 'control', icon: 'table', description: '노트북 관제 및 물품 거치대' },
  { type: 'arena_mat', label: '로봇 경기장 매트 (2×2m)', defaultWidth: 42, defaultHeight: 32, color: '#3b82f6', zone: 'experience', icon: 'grid', description: '사족보행/슈팅 로봇 시연 안전 매트' },
  { type: 'chair_visitor', label: '관람객 체험 의자', defaultWidth: 8, defaultHeight: 8, color: '#10b981', zone: 'experience', icon: 'chair', description: '로봇 조종 체험 어린이/학생 좌석' },
  { type: 'chair_staff', label: '스태프 의자', defaultWidth: 8, defaultHeight: 8, color: '#6366f1', zone: 'control', icon: 'chair', description: '동아리원 운영 및 정비 대기 좌석' },
  { type: 'info_desk', label: '접수 & 번호표 데스크', defaultWidth: 24, defaultHeight: 14, color: '#8b5cf6', zone: 'queue', icon: 'desk', description: '스마트 대기열 태블릿 거치 및 접수처' },
  { type: 'monitor_display', label: '55인치 TV 모니터 스탠드', defaultWidth: 24, defaultHeight: 10, color: '#8b5cf6', zone: 'display', icon: 'tv', description: '호출 번호판 & 방명록 웹앱 송출 스크린' },
  { type: 'power_battery', label: '배터리 급속충전 & 공구함', defaultWidth: 26, defaultHeight: 14, color: '#f59e0b', zone: 'safety', icon: 'battery', description: 'LiPo 방화 파우치 & 멀티탭 전력 스테이션' },
  { type: 'barrier_stanchion', label: '대기열 안전 차단봉', defaultWidth: 6, defaultHeight: 6, color: '#ef4444', zone: 'queue', icon: 'barrier', description: '관람객 대기 라인 및 시연장 통제선' },
  { type: 'banner_stand', label: 'K.F.C. X-배너 홍보대', defaultWidth: 16, defaultHeight: 9, color: '#06b6d4', zone: 'display', icon: 'flag', description: '수련관 동아리 안내 및 QR코드 배너' },
  { type: 'visitor_arrow', label: '관람객 동선 화살표', defaultWidth: 20, defaultHeight: 8, color: '#a855f7', zone: 'queue', icon: 'arrow', description: '입장 및 퇴장 이동 방향 표시' },
  { type: 'trash_bin', label: '분리수거 쓰레기통', defaultWidth: 7, defaultHeight: 7, color: '#64748b', zone: 'safety', icon: 'trash', description: '체험 후 폐기물 및 부스 청결 관리' },
];

const ZONE_COLORS: Record<ZoneCategory, { bg: string; text: string; label: string }> = {
  experience: { bg: 'bg-emerald-500/20 border-emerald-500/40', text: 'text-emerald-400', label: '체험 구역' },
  queue: { bg: 'bg-purple-500/20 border-purple-500/40', text: 'text-purple-400', label: '대기 & 안내' },
  control: { bg: 'bg-blue-500/20 border-blue-500/40', text: 'text-blue-400', label: '스태프 관제' },
  safety: { bg: 'bg-amber-500/20 border-amber-500/40', text: 'text-amber-400', label: '배터리 & 안전' },
  display: { bg: 'bg-cyan-500/20 border-cyan-500/40', text: 'text-cyan-400', label: '전시 & 스크린' },
};

export const BoothSimulator: React.FC<BoothSimulatorProps> = ({ festival, onSaveLayout }) => {
  const [items, setItems] = useState<BoothItem[]>(festival.layoutItems || []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [showFlowGuide, setShowFlowGuide] = useState<boolean>(true);
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync when festival layout changes externally
  useEffect(() => {
    setItems(festival.layoutItems || []);
  }, [festival.id]);

  const selectedItem = items.find(i => i.id === selectedId);

  // Add Item from Palette
  const handleAddItem = (palette: PaletteItem) => {
    const newItem: BoothItem = {
      id: 'item-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type: palette.type,
      label: palette.label,
      x: 35 + Math.floor(Math.random() * 10),
      y: 35 + Math.floor(Math.random() * 10),
      width: palette.defaultWidth,
      height: palette.defaultHeight,
      rotation: 0,
      color: palette.color,
      zone: palette.zone,
    };
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  // Pointer drag logic
  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setDraggingId(id);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const item = items.find(i => i.id === id);
    if (!item) return;

    // Calculate pointer position in percentage
    const pointerPercentX = ((e.clientX - rect.left) / rect.width) * 100;
    const pointerPercentY = ((e.clientY - rect.top) / rect.height) * 100;

    setDragOffset({
      x: pointerPercentX - item.x,
      y: pointerPercentY - item.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    let newX = ((e.clientX - rect.left) / rect.width) * 100 - dragOffset.x;
    let newY = ((e.clientY - rect.top) / rect.height) * 100 - dragOffset.y;

    if (snapToGrid) {
      newX = Math.round(newX / 2.5) * 2.5;
      newY = Math.round(newY / 2.5) * 2.5;
    }

    // Clamp within canvas boundaries
    newX = Math.max(0, Math.min(94, newX));
    newY = Math.max(0, Math.min(94, newY));

    setItems(prev =>
      prev.map(item => (item.id === draggingId ? { ...item, x: newX, y: newY } : item))
    );
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  // Rotate selected item
  const handleRotate = () => {
    if (!selectedId) return;
    setItems(prev =>
      prev.map(item => {
        if (item.id === selectedId) {
          const nextRot = (item.rotation + 90) % 360;
          return {
            ...item,
            rotation: nextRot,
            // Swap width & height for realistic 90deg orientation
            width: item.height,
            height: item.width,
          };
        }
        return item;
      })
    );
  };

  // Duplicate item
  const handleDuplicate = () => {
    if (!selectedItem) return;
    const dup: BoothItem = {
      ...selectedItem,
      id: 'item-' + Date.now(),
      label: `${selectedItem.label} (복사)`,
      x: Math.min(85, selectedItem.x + 5),
      y: Math.min(85, selectedItem.y + 5),
    };
    setItems(prev => [...prev, dup]);
    setSelectedId(dup.id);
  };

  // Delete item
  const handleDelete = () => {
    if (!selectedId) return;
    setItems(prev => prev.filter(i => i.id !== selectedId));
    setSelectedId(null);
  };

  // Save layout
  const handleSave = () => {
    onSaveLayout(items);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  // Load Presets
  const handleLoadPreset = (presetType: 'standard_exp' | 'battle_arena' | 'compact_walkthrough') => {
    if (presetType === 'standard_exp') {
      // Standard experience booth (Front desks + Center arena + Rear charging)
      setItems([
        { id: 'p1', type: 'table_long', label: '체험 책상 1 (슈팅)', x: 8, y: 26, width: 34, height: 12, rotation: 0, color: '#10b981', zone: 'experience' },
        { id: 'p2', type: 'table_long', label: '체험 책상 2 (로봇팔)', x: 58, y: 26, width: 34, height: 12, rotation: 0, color: '#10b981', zone: 'experience' },
        { id: 'p3', type: 'arena_mat', label: '중앙 4족 로봇 시연 경기장', x: 28, y: 44, width: 44, height: 28, rotation: 0, color: '#3b82f6', zone: 'experience' },
        { id: 'p4', type: 'info_desk', label: '대기열 번호표 접수처', x: 6, y: 6, width: 24, height: 14, rotation: 0, color: '#8b5cf6', zone: 'queue' },
        { id: 'p5', type: 'monitor_display', label: '55인치 호출 TV 모니터', x: 38, y: 6, width: 24, height: 10, rotation: 0, color: '#8b5cf6', zone: 'display' },
        { id: 'p6', type: 'table_long', label: '배터리 급속충전 & 정비대', x: 10, y: 80, width: 46, height: 14, rotation: 0, color: '#f59e0b', zone: 'safety' },
        { id: 'p7', type: 'table_short', label: '스태프 휴식 & 관제석', x: 62, y: 80, width: 30, height: 14, rotation: 0, color: '#64748b', zone: 'control' },
        { id: 'p8', type: 'chair_visitor', label: '체험 의자 1', x: 12, y: 16, width: 8, height: 8, rotation: 0, color: '#10b981', zone: 'experience' },
        { id: 'p9', type: 'chair_visitor', label: '체험 의자 2', x: 28, y: 16, width: 8, height: 8, rotation: 0, color: '#10b981', zone: 'experience' },
        { id: 'p10', type: 'chair_visitor', label: '체험 의자 3', x: 62, y: 16, width: 8, height: 8, rotation: 0, color: '#10b981', zone: 'experience' },
        { id: 'p11', type: 'chair_visitor', label: '체험 의자 4', x: 78, y: 16, width: 8, height: 8, rotation: 0, color: '#10b981', zone: 'experience' },
      ]);
    } else if (presetType === 'battle_arena') {
      // Giant central battle arena
      setItems([
        { id: 'b1', type: 'arena_mat', label: '대형 로봇 배틀 필드 (3×3m)', x: 20, y: 25, width: 60, height: 45, rotation: 0, color: '#3b82f6', zone: 'experience' },
        { id: 'b2', type: 'table_long', label: '조종 조작대 (레드팀/블루팀)', x: 20, y: 74, width: 60, height: 12, rotation: 0, color: '#10b981', zone: 'experience' },
        { id: 'b3', type: 'monitor_display', label: '실시간 배틀 중계 스크린', x: 35, y: 6, width: 30, height: 12, rotation: 0, color: '#8b5cf6', zone: 'display' },
        { id: 'b4', type: 'power_battery', label: '배터리 고속 충전 허브', x: 6, y: 80, width: 12, height: 14, rotation: 0, color: '#f59e0b', zone: 'safety' },
        { id: 'b5', type: 'barrier_stanchion', label: '좌측 안전선', x: 12, y: 40, width: 6, height: 6, rotation: 0, color: '#ef4444', zone: 'queue' },
        { id: 'b6', type: 'barrier_stanchion', label: '우측 안전선', x: 82, y: 40, width: 6, height: 6, rotation: 0, color: '#ef4444', zone: 'queue' },
      ]);
    } else {
      // Compact walkthrough
      setItems([
        { id: 'w1', type: 'table_long', label: '전시 테이블 A (4족 로봇)', x: 10, y: 20, width: 14, height: 45, rotation: 90, color: '#10b981', zone: 'experience' },
        { id: 'w2', type: 'table_long', label: '전시 테이블 B (로봇팔)', x: 76, y: 20, width: 14, height: 45, rotation: 90, color: '#10b981', zone: 'experience' },
        { id: 'w3', type: 'info_desk', label: '입구 번호표 & 스탬프', x: 35, y: 8, width: 30, height: 12, rotation: 0, color: '#8b5cf6', zone: 'queue' },
        { id: 'w4', type: 'table_long', label: '후방 중앙 정비 데스크', x: 28, y: 78, width: 44, height: 14, rotation: 0, color: '#f59e0b', zone: 'safety' },
      ]);
    }
  };

  // Calculate metrics
  const tablesCount = items.filter(i => i.type.startsWith('table')).length;
  const chairsCount = items.filter(i => i.type.startsWith('chair')).length;
  const hasChargingStation = items.some(i => i.type === 'power_battery');
  const hasDisplayScreen = items.some(i => i.type === 'monitor_display');

  return (
    <div className="space-y-4">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Move className="w-5 h-5 text-indigo-400" />
              부스 배치도 드래그 앤 드롭 시뮬레이터
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {festival.boothDimensions.widthMeters}m × {festival.boothDimensions.depthMeters}m 부스 기준
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            의자, 책상, 시연 매트, 충전소 등을 자유롭게 배치하고 관람객 및 스태프의 동선을 설계하세요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2">프리셋:</span>
            <button
              onClick={() => handleLoadPreset('standard_exp')}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              표준 체험형
            </button>
            <button
              onClick={() => handleLoadPreset('battle_arena')}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              로봇 배틀형
            </button>
            <button
              onClick={() => handleLoadPreset('compact_walkthrough')}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              순환 전시형
            </button>
          </div>

          {/* Grid snap toggle */}
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition ${
              snapToGrid
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="격자 자석 스냅 켜기/끄기"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">격자 스냅</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
          >
            {isSavedFeedback ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSavedFeedback ? '저장 완료!' : '배치도 축제에 저장'}
          </button>
        </div>
      </div>

      {/* Main Workspace: Palette on Left, Canvas in Center, Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Item Palette (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col max-h-[640px]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              배치 요소 추가 (팔레트)
            </span>
            <span className="text-[11px] text-slate-500">클릭 시 캔버스 추가</span>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {PALETTE_ITEMS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleAddItem(item)}
                className="w-full p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/80 text-left transition group flex items-start justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {item.description}
                  </div>
                </div>
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 mt-0.5" />
              </button>
            ))}
          </div>

          {/* Quick Metrics */}
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
            <div className="font-semibold text-slate-300 text-[11px] uppercase">부스 집기 현황 통계</div>
            <div className="flex justify-between">
              <span>테이블 / 책상:</span>
              <strong className="text-white">{tablesCount}개</strong>
            </div>
            <div className="flex justify-between">
              <span>의자 (스태프+관람객):</span>
              <strong className="text-white">{chairsCount}개</strong>
            </div>
            <div className="flex justify-between">
              <span>충전 안전소:</span>
              <strong className={hasChargingStation ? 'text-emerald-400' : 'text-rose-400'}>
                {hasChargingStation ? '정상 배치됨 ✓' : '미배치 (경고!)'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>호출 스크린 TV:</span>
              <strong className={hasDisplayScreen ? 'text-indigo-400' : 'text-slate-500'}>
                {hasDisplayScreen ? '배치됨 ✓' : '미배치'}
              </strong>
            </div>
          </div>
        </div>

        {/* Center: Interactive Canvas (6 cols) */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Canvas Frame */}
          <div className="relative bg-slate-950 border-2 border-slate-700 rounded-xl overflow-hidden shadow-2xl p-4 flex flex-col items-center justify-center">
            {/* Top Indicator: Front of Booth (Entrance) */}
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-purple-400 font-semibold">
                ▲ 부스 전면 (관람객 통로 & 입장 동선)
              </span>
              <span className="text-slate-500 font-mono">몽골텐트 3면 차단 / 전면 개방</span>
              <span className="text-slate-400 font-mono">가로 {festival.boothDimensions.widthMeters}m</span>
            </div>

            {/* Canvas Surface with Grid */}
            <div
              ref={canvasRef}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative w-full aspect-square max-w-[520px] bg-slate-900/90 rounded-lg border border-slate-800 select-none overflow-hidden booth-grid-bg cursor-crosshair shadow-inner"
              style={{ touchAction: 'none' }}
            >
              {/* Meter rulers / center marks */}
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-800/80 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-slate-800/80 pointer-events-none" />

              {/* Entrance & Exit Markers */}
              {showFlowGuide && (
                <>
                  <div className="absolute top-2 left-6 text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 pointer-events-none">
                    IN 입구 (번호표 접수)
                  </div>
                  <div className="absolute top-2 right-6 text-[10px] font-bold text-indigo-400 flex items-center gap-1 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30 pointer-events-none">
                    OUT 출구 (기념품 수령)
                  </div>
                  <div className="absolute bottom-2 inset-x-0 text-center text-[10px] text-slate-500 pointer-events-none">
                    ▼ 후방 스태프 전용 공간 (외부 관람객 출입 통제)
                  </div>
                </>
              )}

              {/* Placed Items on Canvas */}
              {items.map(item => {
                const isSelected = item.id === selectedId;
                return (
                  <div
                    key={item.id}
                    onPointerDown={e => handlePointerDown(e, item.id)}
                    className={`absolute rounded-md cursor-grab active:cursor-grabbing transition-shadow flex items-center justify-center p-1 text-center font-semibold select-none ${
                      isSelected
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 shadow-xl z-20'
                        : 'border border-black/40 shadow-md z-10 hover:brightness-110'
                    }`}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      width: `${item.width}%`,
                      height: `${item.height}%`,
                      backgroundColor: item.color || '#3b82f6',
                      transform: `rotate(${item.rotation || 0}deg)`,
                      transformOrigin: 'center center',
                    }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden px-1 pointer-events-none text-white drop-shadow">
                      <span className="text-[10px] sm:text-xs leading-tight font-bold truncate w-full">
                        {item.label}
                      </span>
                      {item.assignedStaff && (
                        <span className="text-[9px] opacity-80 truncate hidden sm:block">
                          👤 {item.assignedStaff}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Indicator */}
            <div className="w-full flex items-center justify-between pt-2 mt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="text-slate-500">배치된 총 요소: {items.length}개</span>
              <span className="text-slate-400 font-mono">세로 {festival.boothDimensions.depthMeters}m</span>
              <button
                onClick={() => setItems([])}
                className="text-rose-400 hover:text-rose-300 text-[11px] flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> 전체 비우기
              </button>
            </div>
          </div>
        </div>

        {/* Right: Item Inspector / Editor (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col max-h-[640px]">
          <div className="pb-2 mb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              선택 요소 상세 설정
            </span>
          </div>

          {selectedItem ? (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Item Label Input */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">요소 명칭</label>
                <input
                  type="text"
                  value={selectedItem.label}
                  onChange={e => {
                    const val = e.target.value;
                    setItems(prev =>
                      prev.map(i => (i.id === selectedItem.id ? { ...i, label: val } : i))
                    );
                  }}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Zone Category */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">구역 카테고리</label>
                <select
                  value={selectedItem.zone}
                  onChange={e => {
                    const zone = e.target.value as ZoneCategory;
                    setItems(prev =>
                      prev.map(i => (i.id === selectedItem.id ? { ...i, zone } : i))
                    );
                  }}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                >
                  <option value="experience">체험 구역 (녹색)</option>
                  <option value="queue">대기 & 안내 (보라)</option>
                  <option value="control">스태프 관제 (파랑)</option>
                  <option value="safety">배터리 & 안전 (주황)</option>
                  <option value="display">전시 & 스크린 (시안)</option>
                </select>
              </div>

              {/* Color Picker */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">표시 색상</label>
                <div className="flex gap-2">
                  {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#64748b'].map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        setItems(prev =>
                          prev.map(i => (i.id === selectedItem.id ? { ...i, color: c } : i))
                        );
                      }}
                      className={`w-6 h-6 rounded-full border transition ${
                        selectedItem.color === c ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Assigned Staff */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">배치 담당 부원</label>
                <input
                  type="text"
                  placeholder="예: 최예은, 정우진"
                  value={selectedItem.assignedStaff || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setItems(prev =>
                      prev.map(i => (i.id === selectedItem.id ? { ...i, assignedStaff: val } : i))
                    );
                  }}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Assigned Robot or Webapp */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">배치 로봇 또는 웹앱</label>
                <input
                  type="text"
                  placeholder="예: Mecanum-Striker 로봇"
                  value={selectedItem.assignedRobotOrApp || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setItems(prev =>
                      prev.map(i => (i.id === selectedItem.id ? { ...i, assignedRobotOrApp: val } : i))
                    );
                  }}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">운영 메모 & 준비물</label>
                <textarea
                  rows={2}
                  placeholder="예: 멀티탭 6구 연결 필수, 전선 테이핑"
                  value={selectedItem.notes || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setItems(prev =>
                      prev.map(i => (i.id === selectedItem.id ? { ...i, notes: val } : i))
                    );
                  }}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none resize-none"
                />
              </div>

              {/* Actions: Rotate, Duplicate, Delete */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRotate}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> 90° 회전
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5" /> 복제하기
                  </button>
                </div>
                <button
                  onClick={handleDelete}
                  className="w-full py-2 px-3 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> 선택 요소 삭제
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
              <Move className="w-8 h-8 text-slate-600 animate-pulse" />
              <div className="text-xs font-medium text-slate-400">
                캔버스 위 요소를 클릭하거나 좌측 팔레트에서 새 집기를 추가하세요.
              </div>
              <div className="text-[11px] text-slate-600">
                드래그하여 위치 이동, 90도 회전 및 담당 스태프/로봇 지정이 가능합니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
