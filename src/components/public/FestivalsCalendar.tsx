import React from 'react';
import { Festival } from '../../types';
import { Calendar, MapPin, CheckCircle, ArrowRight, Layers, Users } from 'lucide-react';

interface FestivalsCalendarProps {
  festivals: Festival[];
  activeFestivalId: string;
  onSelectActiveFestival: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const FestivalsCalendar: React.FC<FestivalsCalendarProps> = ({
  festivals,
  activeFestivalId,
  onSelectActiveFestival,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-400" />
          K.F.C. 축제 부스 참가 캘린더
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          용인시청소년수련관 로봇동아리 K.F.C.가 참여하는 과학 축제, 메이커 페어, 청소년 동아리 박람회 일정입니다.
        </p>
      </div>

      {/* Festival Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {festivals.map(fest => {
          const isActive = fest.id === activeFestivalId;

          return (
            <div
              key={fest.id}
              className={`p-6 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                isActive
                  ? 'bg-gradient-to-b from-indigo-950/50 to-slate-900 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                    부스 {fest.boothNumber}
                  </span>
                  {isActive && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      현재 선택된 부스
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{fest.name}</h3>
                <div className="text-xs text-indigo-300 font-medium mb-3">"{fest.theme}"</div>

                <div className="space-y-2 text-xs text-slate-300 mb-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{fest.date} ({fest.timeRange})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{fest.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>부스 크기: {fest.boothDimensions.widthMeters}m × {fest.boothDimensions.depthMeters}m</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">{fest.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>소팀 {fest.subteams?.length || 0}개 · 배치 집기 {fest.layoutItems?.length || 0}개</span>
                </div>

                {isActive ? (
                  <button
                    onClick={() => onNavigateTab('floorplan')}
                    className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                  >
                    배치도 확인하기 <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onSelectActiveFestival(fest.id);
                      onNavigateTab('overview');
                    }}
                    className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                  >
                    이 축제로 전환
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
