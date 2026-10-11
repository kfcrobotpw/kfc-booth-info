import React, { useState } from 'react';
import { Festival, SubTeam } from '../../types';
import { Plus, Calendar, MapPin, Edit3, Trash2, CheckCircle, ShieldAlert, Sparkles, AlertTriangle, Users, Layers, X } from 'lucide-react';

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
  const [safetyRules, setSafetyRules] = useState<string[]>([]);
  const [newSafetyRuleInput, setNewSafetyRuleInput] = useState<string>('');

  // Quick Safety Rules Editor State
  const [quickSafetyModalFest, setQuickSafetyModalFest] = useState<Festival | null>(null);
  const [quickRuleText, setQuickRuleText] = useState<string>('');

  const openAddModal = () => {
    setEditingFest(null);
    setName('');
    setDate('');
    setTimeRange('');
    setLocation('');
    setBoothNumber('');
    setTheme('');
    setWidthMeters(5);
    setDepthMeters(5);
    setDescription('');
    setTargetAudience('');
    setSafetyRules([]);
    setNewSafetyRuleInput('');
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
    setWidthMeters(fest.boothDimensions?.widthMeters || 5);
    setDepthMeters(fest.boothDimensions?.depthMeters || 5);
    setDescription(fest.description);
    setTargetAudience(fest.targetAudience);
    setSafetyRules(fest.safetyRules || []);
    setNewSafetyRuleInput('');
    setIsModalOpen(true);
  };

  const handleAddSafetyRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSafetyRuleInput.trim()) return;
    setSafetyRules([...safetyRules, newSafetyRuleInput.trim()]);
    setNewSafetyRuleInput('');
  };

  const handleRemoveSafetyRule = (index: number) => {
    setSafetyRules(safetyRules.filter((_, i) => i !== index));
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
        safetyRules: safetyRules.filter(Boolean),
      };
      onUpdateFestival(updated);
    } else {
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
        subteams: [],
        layoutItems: [],
        timeline: [],
        safetyRules: safetyRules.filter(Boolean),
      };
      onAddFestival(newFest);
    }
    setIsModalOpen(false);
  };

  // Quick Safety Rule Actions for existing festival
  const openQuickSafetyModal = (fest: Festival) => {
    setQuickSafetyModalFest(fest);
    setQuickRuleText('');
  };

  const handleAddQuickRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSafetyModalFest || !quickRuleText.trim()) return;
    const currentRules = quickSafetyModalFest.safetyRules || [];
    const updated: Festival = {
      ...quickSafetyModalFest,
      safetyRules: [...currentRules, quickRuleText.trim()],
    };
    onUpdateFestival(updated);
    setQuickSafetyModalFest(updated);
    setQuickRuleText('');
  };

  const handleRemoveQuickRule = (index: number) => {
    if (!quickSafetyModalFest) return;
    const currentRules = quickSafetyModalFest.safetyRules || [];
    const updated: Festival = {
      ...quickSafetyModalFest,
      safetyRules: currentRules.filter((_, i) => i !== index),
    };
    onUpdateFestival(updated);
    setQuickSafetyModalFest(updated);
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
            K.F.C.가 참가하는 축제를 추가하고 안전 수칙 및 부스 규격을 수정하세요.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
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
                      현재 선택된 행사
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectActive(fest.id)}
                      className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 transition cursor-pointer"
                    >
                      이 행사로 선택
                    </button>
                  )}
                </div>

                <h4 className="text-lg font-bold text-white">{fest.name}</h4>
                {fest.theme && <p className="text-xs text-indigo-300 font-medium mt-0.5">"{fest.theme}"</p>}

                <div className="mt-3 space-y-1 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{fest.date || '일정 미정'} {fest.timeRange && `(${fest.timeRange})`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{fest.location || '장소 미정'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>규격: {fest.boothDimensions?.widthMeters || 5}m × {fest.boothDimensions?.depthMeters || 5}m · 집기 {fest.layoutItems?.length || 0}개</span>
                  </div>
                </div>

                {/* Safety Rules Summary Badge & Quick Edit Button */}
                <div className="mt-3 p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      부스 현장 필수 안전 수칙 ({fest.safetyRules?.length || 0}개)
                    </span>
                    <button
                      onClick={() => openQuickSafetyModal(fest)}
                      className="text-[11px] text-amber-400 hover:text-amber-200 underline font-medium cursor-pointer"
                    >
                      안전 수칙 수정
                    </button>
                  </div>

                  {fest.safetyRules && fest.safetyRules.length > 0 ? (
                    <div className="space-y-1">
                      {fest.safetyRules.slice(0, 2).map((r, i) => (
                        <div key={i} className="text-[11px] text-slate-300 truncate">
                          • {r}
                        </div>
                      ))}
                      {fest.safetyRules.length > 2 && (
                        <div className="text-[10px] text-slate-500">
                          외 {fest.safetyRules.length - 2}개 수칙 더보기
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 italic">
                      등록된 안전 수칙이 없습니다. '안전 수칙 수정' 버튼을 눌러 추가하세요.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(fest)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs cursor-pointer"
                    title="축제 정보 수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>축제 수정</span>
                  </button>
                  <button
                    onClick={() => openQuickSafetyModal(fest)}
                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center gap-1 text-xs cursor-pointer"
                    title="안전 수칙 편집"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>안전 수칙</span>
                  </button>
                </div>

                {festivals.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`'${fest.name}' 축제를 삭제하시겠습니까?`)) {
                        onDeleteFestival(fest.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                    title="축제 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Safety Rules Modal */}
      {quickSafetyModalFest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    부스 현장 필수 안전 수칙 관리
                  </h3>
                  <p className="text-xs text-slate-400">
                    {quickSafetyModalFest.name} 현장에 적용되는 안전 지침
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickSafetyModalFest(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Add New Rule Form */}
              <form onSubmit={handleAddQuickRule} className="flex gap-2">
                <input
                  type="text"
                  placeholder="새로운 안전 수칙 입력 (예: 납땜 인두기 사용 후 즉시 전원 차단)"
                  value={quickRuleText}
                  onChange={e => setQuickRuleText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!quickRuleText.trim()}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  추가
                </button>
              </form>

              {/* Rules List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-400 block">
                  현재 등록된 안전 수칙 목록 ({quickSafetyModalFest.safetyRules?.length || 0}개):
                </span>

                {(!quickSafetyModalFest.safetyRules || quickSafetyModalFest.safetyRules.length === 0) ? (
                  <div className="p-6 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                    등록된 안전 수칙이 없습니다. 위의 입력창에서 수칙을 추가해 보세요.
                  </div>
                ) : (
                  quickSafetyModalFest.safetyRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{rule}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveQuickRule(idx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                        title="수칙 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setQuickSafetyModalFest(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Festival Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                {editingFest ? '축제 부스 정보 수정' : '새 축제 부스 추가'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">축제 및 행사 공식 명칭</label>
                <input
                  type="text"
                  placeholder="예: 2026 경기 청소년 미래 과학 축제"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">행사 일자</label>
                  <input
                    type="text"
                    placeholder="예: 2026. 10. 24 (토)"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">운영 시간대</label>
                  <input
                    type="text"
                    placeholder="예: 10:00 ~ 17:00"
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
                    placeholder="예: 용인시청 야외 하늘광장"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">부스 번호 / 명칭</label>
                  <input
                    type="text"
                    placeholder="예: B-04"
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
                  placeholder="예: K.F.C. 로보틱스 플레이그라운드"
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
                  placeholder="예: 관내 청소년 및 가족"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">부스 소개 및 세부 운영 계획</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none resize-none"
                />
              </div>

              {/* Safety Rules in Modal */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  부스 현장 필수 안전 수칙
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="수칙 추가 (예: 리포 배터리 충전 시 방화백 필수 사용)"
                    value={newSafetyRuleInput}
                    onChange={e => setNewSafetyRuleInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSafetyRule}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    추가
                  </button>
                </div>

                {safetyRules.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {safetyRules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs text-slate-300"
                      >
                        <span>{idx + 1}. {rule}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSafetyRule(idx)}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow cursor-pointer"
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
