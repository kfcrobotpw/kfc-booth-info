import React, { useState } from 'react';
import { Festival } from '../../types';
import { 
  ShieldAlert, Plus, Trash2, Edit3, Check, X, ArrowUp, ArrowDown, 
  Sparkles, CheckCircle2, AlertTriangle, ShieldCheck 
} from 'lucide-react';

interface AdminSafetyRulesProps {
  festival?: Festival;
  onUpdateFestival: (festival: Festival) => void;
}

const PRESET_SAFETY_RULES = [
  '로봇 시연 경기장 주변 1m 안전거리 유지 및 펜스 이탈 금지',
  '고방전 Li-Po 배터리는 반드시 전용 방화 파우치 및 충전 안전 구역에 보관',
  '관람객(어린이 등)의 회전 기어, 바퀴, 고속 모터 직접 접촉 절대 제한',
  '부스 내 모든 전원 케이블 및 멀티탭은 바닥 보호 몰드로 안전 마감',
  '이상 발열, 연기, 스파크 감지 시 즉시 비상 전원 차단 및 기장·지도교사 보고',
  '부스 교대 시 배터리 잔량 및 공구 정리 상태 상호 인수인계 필수',
];

export const AdminSafetyRules: React.FC<AdminSafetyRulesProps> = ({
  festival,
  onUpdateFestival,
}) => {
  const [newRuleText, setNewRuleText] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [saveToast, setSaveToast] = useState<boolean>(false);

  if (!festival) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
        선택된 축제가 없습니다. 먼저 축제를 선택하거나 등록해 주세요.
      </div>
    );
  }

  const rules = festival.safetyRules || [];

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;

    const updated: Festival = {
      ...festival,
      safetyRules: [...rules, newRuleText.trim()],
    };
    onUpdateFestival(updated);
    setNewRuleText('');
    triggerToast();
  };

  const handleStartEdit = (index: number, currentText: string) => {
    setEditingIndex(index);
    setEditingText(currentText);
  };

  const handleSaveEdit = (index: number) => {
    if (!editingText.trim()) return;
    const nextRules = [...rules];
    nextRules[index] = editingText.trim();
    const updated: Festival = {
      ...festival,
      safetyRules: nextRules,
    };
    onUpdateFestival(updated);
    setEditingIndex(null);
    setEditingText('');
    triggerToast();
  };

  const handleDeleteRule = (index: number) => {
    const updated: Festival = {
      ...festival,
      safetyRules: rules.filter((_, i) => i !== index),
    };
    onUpdateFestival(updated);
    triggerToast();
  };

  const handleMoveRule = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= rules.length) return;

    const nextRules = [...rules];
    const temp = nextRules[index];
    nextRules[index] = nextRules[targetIdx];
    nextRules[targetIdx] = temp;

    const updated: Festival = {
      ...festival,
      safetyRules: nextRules,
    };
    onUpdateFestival(updated);
    triggerToast();
  };

  const handleLoadPresets = () => {
    if (rules.length > 0) {
      if (!confirm('기존 수칙에 K.F.C. 표준 로봇 부스 안전 수칙 6개 항목을 추가하시겠습니까?')) {
        return;
      }
    }
    const combined = Array.from(new Set([...rules, ...PRESET_SAFETY_RULES]));
    const updated: Festival = {
      ...festival,
      safetyRules: combined,
    };
    onUpdateFestival(updated);
    triggerToast();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">
              부스 현장 필수 안전 수칙 관리
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold font-mono">
              {festival.name}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            부스 당일 모든 부원과 운영진이 준수해야 하는 필수 안전 수칙을 등록하고 수정합니다. 수정 즉시 클라우드 및 관제 화면에 실시간 반영됩니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              실시간 저장 완료
            </span>
          )}

          <button
            onClick={handleLoadPresets}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>표준 안전 수칙 불러오기</span>
          </button>
        </div>
      </div>

      {/* Add New Rule Form */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
        <form onSubmit={handleAddRule} className="space-y-3">
          <label className="text-xs font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            새 안전 수칙 항목 추가
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newRuleText}
              onChange={e => setNewRuleText(e.target.value)}
              placeholder="예: 경기장 내 로봇 전원 차단 상태 확인 후 경기장 입장"
              className="flex-1 bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!newRuleText.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>수칙 추가</span>
            </button>
          </div>
        </form>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-white">등록된 안전 수칙 목록 ({rules.length}개)</span>
          <span>드래그 또는 화살표 버튼으로 우선순위를 조정할 수 있습니다</span>
        </div>

        {rules.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 space-y-3">
            <ShieldAlert className="w-10 h-10 text-amber-500/40 mx-auto" />
            <h3 className="text-sm font-bold text-white">등록된 안전 수칙이 없습니다</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              상단의 '표준 안전 수칙 불러오기'를 누르면 로봇동아리 권장 필수 안전 수칙 6가지가 즉시 채워집니다.
            </p>
            <button
              onClick={handleLoadPresets}
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              표준 수칙 자동으로 채우기
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {rules.map((rule, idx) => {
              const isEditing = editingIndex === idx;

              return (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingText}
                          onChange={e => setEditingText(e.target.value)}
                          className="flex-1 bg-slate-950 border border-indigo-500 text-xs sm:text-sm text-white rounded-lg px-3 py-1.5 focus:outline-none"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveEdit(idx);
                            if (e.key === 'Escape') setEditingIndex(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveEdit(idx)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs cursor-pointer"
                          title="저장"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
                          title="취소"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed break-words">
                        {rule}
                      </span>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Move Up */}
                      <button
                        onClick={() => handleMoveRule(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                        title="위로 이동"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMoveRule(idx, 'down')}
                        disabled={idx === rules.length - 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                        title="아래로 이동"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleStartEdit(idx, rule)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/40 cursor-pointer transition"
                        title="수칙 수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteRule(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer transition"
                        title="수칙 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Safety Guideline Footer Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-slate-200">운영진 안전 브리핑 팁</div>
          <div>
            부스 오픈 30분 전 전체 부원 대상 브리핑에서 위 안전 수칙을 소리 내어 함께 확인하고, 비상정지 스위치 및 소화기 위치를 숙지하도록 안내하세요.
          </div>
        </div>
      </div>
    </div>
  );
};
