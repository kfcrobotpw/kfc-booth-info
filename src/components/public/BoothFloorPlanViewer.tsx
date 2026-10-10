import React, { useState } from 'react';
import { Festival, BoothItem, ZoneCategory } from '../../types';
import { Move, Info, Eye, Layers, Shield, Zap, Sparkles, User, Bot, HelpCircle } from 'lucide-react';

interface BoothFloorPlanViewerProps {
  festival: Festival;
  onOpenAdminMode?: () => void;
}

export const BoothFloorPlanViewer: React.FC<BoothFloorPlanViewerProps> = ({
  festival,
  onOpenAdminMode,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');

  const items = festival.layoutItems || [];
  const selectedItem = items.find(i => i.id === selectedItemId);

  const filteredItems = selectedZoneFilter === 'all'
    ? items
    : items.filter(i => i.zone === selectedZoneFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Filter Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Move className="w-6 h-6 text-indigo-400" />
            부스 실시간 배치도 및 위치 안내
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {festival.name} ({festival.boothNumber}) 부스의 가로 {festival.boothDimensions.widthMeters}m × 세로 {festival.boothDimensions.depthMeters}m 몽골텐트 내부 배치도입니다.
            각 집기를 클릭하면 담당 스태프와 운영 로봇 정보를 확인할 수 있습니다.
          </p>
        </div>

        {/* Zone Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'all', label: '전체 보기' },
            { id: 'experience', label: '체험 구역' },
            { id: 'queue', label: '대기 & 접수' },
            { id: 'safety', label: '배터리 & 정비' },
            { id: 'display', label: '스크린 & 배너' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedZoneFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedZoneFilter === f.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Floor Plan Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Floor Map Interactive Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col items-center justify-center">
          {/* Booth Orientation Header */}
          <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="text-purple-400 font-bold flex items-center gap-1.5">
              ▲ 관람객 주 통로 (입장 동선 & 대기열 라인)
            </span>
            <span className="text-slate-500 font-mono">
              텐트 폭 {festival.boothDimensions.widthMeters}M
            </span>
          </div>

          {/* Canvas Area */}
          <div className="relative w-full aspect-square max-w-[560px] bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden booth-grid-bg shadow-inner select-none">
            {/* Center dividers */}
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-800/80 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-slate-800/80 pointer-events-none" />

            {/* Entrance / Exit Markers */}
            <div className="absolute top-2 left-4 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
              IN 번호표 발권소
            </div>
            <div className="absolute top-2 right-4 text-[10px] font-bold text-indigo-400 bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-500/30">
              OUT 스탬프 & 기념품 교환처
            </div>
            <div className="absolute bottom-2 inset-x-0 text-center text-[10px] text-slate-500">
              ▼ 후방 스태프 정비 및 휴식 구역 (외부인 출입 제한)
            </div>

            {/* Render Placed Items */}
            {filteredItems.map(item => {
              const isSelected = item.id === selectedItemId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`absolute rounded-md transition-all text-center p-1 flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 shadow-2xl z-20 scale-105'
                      : 'border border-black/40 shadow hover:brightness-110 z-10'
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
                  title={item.label}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden px-1 text-white drop-shadow">
                    <span className="text-[10px] sm:text-xs leading-tight font-bold truncate w-full">
                      {item.label}
                    </span>
                    {item.assignedStaff && (
                      <span className="text-[9px] opacity-80 truncate hidden sm:block">
                        👤 {item.assignedStaff.split(',')[0]}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 체험존
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> 시연 경기장
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> 접수/대기
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 배터리/안전
              </span>
            </div>
            {onOpenAdminMode && (
              <button
                onClick={onOpenAdminMode}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                관리자 모드에서 배치도 수정하기 →
              </button>
            )}
          </div>
        </div>

        {/* Selected Item Info Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              배치 집기 세부 안내
            </h3>

            {selectedItem ? (
              <div className="space-y-4 pt-1">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedItem.color }} />
                    <span className="font-bold text-sm text-white">{selectedItem.label}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    구역 분류: <strong className="text-indigo-300">{selectedItem.zone}</strong>
                  </div>
                </div>

                {selectedItem.assignedStaff && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      배치 담당 스태프
                    </div>
                    <div className="text-white font-bold text-sm">{selectedItem.assignedStaff}</div>
                  </div>
                )}

                {selectedItem.assignedRobotOrApp && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-emerald-400" />
                      운영 로봇 및 웹앱
                    </div>
                    <div className="text-emerald-300 font-bold">{selectedItem.assignedRobotOrApp}</div>
                  </div>
                )}

                {selectedItem.notes && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-400 font-semibold">운영 주의사항 & 메모:</div>
                    <div className="text-slate-300 leading-relaxed">{selectedItem.notes}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-500 space-y-2">
                <Eye className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="text-xs text-slate-400">
                  좌측 배치도에서 가구나 집기를 클릭해 보세요.
                </div>
                <div className="text-[11px] text-slate-600">
                  누가 앉아 있고, 어떤 로봇이 시연 중인지 실시간으로 확인할 수 있습니다.
                </div>
              </div>
            )}
          </div>

          {/* Quick Booth Dimensions Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              부스 하드웨어 제원 요약
            </div>
            <div className="text-slate-400 leading-relaxed text-[11px]">
              • 몽골텐트 규격: 가로 {festival.boothDimensions.widthMeters}m × 세로 {festival.boothDimensions.depthMeters}m (높이 2.8m)<br />
              • 전력 배전: 220V 단상 3kW 콘센트 2회선 공급<br />
              • 통신망: K.F.C. LTE 고속 Wi-Fi 에그 (보안 비번 공유)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
