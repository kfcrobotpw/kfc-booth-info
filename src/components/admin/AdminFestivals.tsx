import React, { useState } from 'react';
import { Festival, SubTeam } from '../../types';
import { Plus, Calendar, MapPin, Edit3, Trash2, CheckCircle, Sparkles, AlertTriangle, Users, Layers } from 'lucide-react';

interface AdminFestivalsProps {
  festivals: Festival[];
  activeFestivalId: string;
  onSelectActive: (id: string) => void;
  onAddFestival: (fest: Festival) => void;
  onUpdateFestival: (fest: Festival) => void;
  onDeleteFestival: (id: string) => void;
}

export const AdminFestivals: React.FC<AdminFestivalsProps> = ({
  festivals,
  activeFestivalId,
  onSelectActive,
  onAddFestival,
  onUpdateFestival,
  onDeleteFestival,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingFest, setEditingFest] = useState<Festival | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [boothNumber, setBoothNumber] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [widthMeters, setWidthMeters] = useState<number>(5);
  const [depthMeters, setDepthMeters] = useState<number>(5);
  const [description, setDescription] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');

  const openAddModal = () => {
    setEditingFest(null);
    setName('');
    setDate('2026. 10. 31 (토)');
    setTimeRange('10:00 ~ 17:00');
    setLocation('용인시청소년수련관 야외 광장');
    setBoothNumber('A-01');
    setTheme('K.F.C. 청소년 미래 로봇 공학 체험전');
    setWidthMeters(5);
    setDepthMeters(5);
    setDescription('용인 관내 청소년들에게 메카넘 및 사족보행 로봇 조종 체험과 코딩 웹앱을 선보입니다.');
    setTargetAudience('초·중·고 학생 및 시민');
    setIsModalOpen(true);
  };

  const openEditModal = (fest: Festival) => {
    setEditingFest(fest);
    setName(fest.name);
    setDate(fest.date);
    setTimeRange(fest.timeRange);
    setLocation(fest.location);
    setBoothNumber(fest.boothNumber);
    setTheme(fest.theme);
    setWidthMeters(fest.boothDimensions.widthMeters);
    setDepthMeters(fest.boothDimensions.depthMeters);
    setDescription(fest.description);
    setTargetAudience(fest.targetAudience);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingFest) {
      const updated: Festival = {
        ...editingFest,
        name: name.trim(),
        date: date.trim(),
        timeRange: timeRange.trim(),
        location: location.trim(),
        boothNumber: boothNumber.trim(),
        theme: theme.trim(),
        boothDimensions: { widthMeters, depthMeters },
        description: description.trim(),
        targetAudience: targetAudience.trim(),
      };
      onUpdateFestival(updated);
    } else {
      const defaultSubteams: SubTeam[] = [
        {
          id: 'st-demo-' + Date.now(),
          name: '로봇 시연 & 배틀 파일럿팀',
          roleTitle: 'Demonstration & Pilot',
          color: '#3b82f6',
          description: '사족보행 로봇 및 메카넘 로봇 시연 진행',
          memberIds: [],
          shiftTime: '10:00 ~ 13:00 / 14:00 ~ 17:00',
          mainLocation: '중앙 시연 매트',
          checklist: ['통신 상태 점검', '배터리 전압 체크', 'E-STOP 비상정지 확인'],
        },
        {
          id: 'st-exp-' + Date.now(),
          name: '관람객 체험 지도 & 멘토링팀',
          roleTitle: 'Experience Mentors',
          color: '#10b981',
          description: '어린이 및 청소년 1:1 조작 지도',
          memberIds: [],
          shiftTime: '상시 교대 운영',
          mainLocation: '전면 체험 테이블',
          checklist: ['조작법 30초 설명', '손소독제 비치', '스탬프 인증'],
        },
        {
          id: 'st-app-' + Date.now(),
          name: '웹앱 관제 & 대기열·안내팀',
          roleTitle: 'Web App & Queue Manager',
          color: '#8b5cf6',
          description: '모바일 번호표 발권 및 대형 모니터 호출창 관제',
          memberIds: [],
          shiftTime: '상시 운영',
          mainLocation: '접수처 데스크',
          checklist: ['와이파이 연결', '모니터 전체화면', '기념품 배부'],
        },
        {
          id: 'st-hw-' + Date.now(),
          name: '하드웨어 정비 & 배터리 안전팀',
          roleTitle: 'Hardware & Battery Safety',
          color: '#f59e0b',
          description: 'LiPo 배터리 전압 점검, 급속충전 및 파손 긴급 수리',
          memberIds: [],
          shiftTime: '매시간 정각 점검',
          mainLocation: '후방 충전 스테이션',
          checklist: ['안전 파우치 필수 사용', '멀티탭 과부하 방지', '소화기 확인'],
        },
      ];

      const newFest: Festival = {
        id: 'f-' + Date.now(),
        name: name.trim(),
        date: date.trim(),
        timeRange: timeRange.trim(),
        location: location.trim(),
        boothNumber: boothNumber.trim(),
        theme: theme.trim(),
        status: 'upcoming',
        boothDimensions: { widthMeters, depthMeters },
        description: description.trim(),
        targetAudience: targetAudience.trim(),
        assignedMemberIds: [],
        assignedRobotIds: [],
        assignedAppIds: [],
        subteams: defaultSubteams,
        layoutItems: [],
        timeline: [],
        safetyRules: ['방화 배터리 파우치 사용 필수', '로봇 시연 반경 1m 관람객 안전거리 유지'],
      };
      onAddFestival(newFest);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            참여 축제 & 부스 행사 관리
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            K.F.C.가 참가하는 축제를 추가하고 현재 운영 중인 대표 행사를 선택하세요.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          새 축제 / 행사 추가
        </button>
      </div>

      {/* Festivals List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {festivals.map(fest => {
          const isActive = fest.id === activeFestivalId;
          return (
            <div
              key={fest.id}
              className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500 shadow-xl ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    부스 번호: {fest.boothNumber || '미정'}
                  </span>
                  {isActive ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5" />
                      현재 활성 축제
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectActive(fest.id)}
                      className="text-xs text-slate-400 hover:text-white hover:underline"
                    >
                      이 축제로 전환
                    </button>
                  )}
                </div>

                <h4 className="text-base font-bold text-white mb-1.5">{fest.name}</h4>
                <div className="text-xs text-indigo-300 font-medium mb-3">"{fest.theme}"</div>

                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{fest.date} ({fest.timeRange})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{fest.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>부스 규격: {fest.boothDimensions.widthMeters}m × {fest.boothDimensions.depthMeters}m</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{fest.description}</p>
              </div>

              {/* Subteams indicator & Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>소팀 {fest.subteams?.length || 0}개 · 배치 집기 {fest.layoutItems?.length || 0}개</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(fest)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> 수정
                  </button>
                  {festivals.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`'${fest.name}' 축제를 삭제하시겠습니까?`)) {
                          onDeleteFestival(fest.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-base font-bold text-white">
                {editingFest ? '축제 및 부스 정보 수정' : '새 축제 / 행사 추가'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">행사 / 축제 공식 명칭 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 2026 용인시 청소년 사이언스 페스티벌"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">행사 일자</label>
                  <input
                    type="text"
                    placeholder="2026. 10. 24 (토)"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">운영 시간대</label>
                  <input
                    type="text"
                    placeholder="10:00 ~ 17:00"
                    value={timeRange}
                    onChange={e => setTimeRange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">장소 / 세부 위치</label>
                  <input
                    type="text"
                    placeholder="용인시청 하늘광장 야외 무대"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">부스 번호 / 명칭</label>
                  <input
                    type="text"
                    placeholder="B-04 (로봇 체험관)"
                    value={boothNumber}
                    onChange={e => setBoothNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">부스 운영 테마 & 슬로건</label>
                <input
                  type="text"
                  placeholder="K.F.C. 로보틱스 플레이그라운드 : 미래를 움직이는 손길"
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">부스 가로 규격 (미터)</label>
                  <input
                    type="number"
                    min={2}
                    max={12}
                    value={widthMeters}
                    onChange={e => setWidthMeters(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">부스 세로 규격 (미터)</label>
                  <input
                    type="number"
                    min={2}
                    max={12}
                    value={depthMeters}
                    onChange={e => setDepthMeters(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">체험 대상 및 예상 방문객</label>
                <input
                  type="text"
                  placeholder="용인 관내 초중고 청소년 및 가족 (예상 600명)"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">부스 소개 및 세부 운영 계획</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow"
                >
                  {editingFest ? '수정 완료' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
