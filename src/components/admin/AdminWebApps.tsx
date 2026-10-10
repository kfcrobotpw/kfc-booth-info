import React, { useState } from 'react';
import { WebAppIdea, WebAppCategory, WebAppDevStatus } from '../../types';
import { Smartphone, Plus, Edit2, Trash2, Play, Lightbulb, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface AdminWebAppsProps {
  webApps: WebAppIdea[];
  onAddWebApp: (app: WebAppIdea) => void;
  onUpdateWebApp: (app: WebAppIdea) => void;
  onDeleteWebApp: (id: string) => void;
  onLaunchInteractive: (type: 'queue' | 'controller' | 'quiz' | 'guestbook') => void;
}

export const AdminWebApps: React.FC<AdminWebAppsProps> = ({
  webApps,
  onAddWebApp,
  onUpdateWebApp,
  onDeleteWebApp,
  onLaunchInteractive,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingApp, setEditingApp] = useState<WebAppIdea | null>(null);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<WebAppCategory>('booth_operation');
  const [summary, setSummary] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [featuresStr, setFeaturesStr] = useState<string>('');
  const [devStatus, setDevStatus] = useState<WebAppDevStatus>('in_development');
  const [author, setAuthor] = useState<string>('');
  const [boothBenefit, setBoothBenefit] = useState<string>('');

  const openAddModal = () => {
    setEditingApp(null);
    setTitle('');
    setCategory('booth_operation');
    setSummary('부스 운영의 효율성을 높이기 위한 새로운 웹 애플리케이션');
    setDescription('');
    setFeaturesStr('스마트폰 반응형 UI, 실시간 데이터 동기화, 간편한 조작');
    setDevStatus('planned_idea');
    setAuthor('K.F.C. 아이디어 랩');
    setBoothBenefit('관람객 대기 피로도 감소 및 부스 인지도 향상');
    setIsModalOpen(true);
  };

  const openEditModal = (app: WebAppIdea) => {
    setEditingApp(app);
    setTitle(app.title);
    setCategory(app.category);
    setSummary(app.summary);
    setDescription(app.description);
    setFeaturesStr(app.features.join(', '));
    setDevStatus(app.devStatus);
    setAuthor(app.author);
    setBoothBenefit(app.boothBenefit);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const features = featuresStr
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);

    if (editingApp) {
      const updated: WebAppIdea = {
        ...editingApp,
        title: title.trim(),
        category,
        summary: summary.trim(),
        description: description.trim(),
        features,
        devStatus,
        author: author.trim(),
        boothBenefit: boothBenefit.trim(),
      };
      onUpdateWebApp(updated);
    } else {
      const newApp: WebAppIdea = {
        id: 'w-' + Date.now(),
        title: title.trim(),
        category,
        summary: summary.trim(),
        description: description.trim(),
        features,
        devStatus,
        author: author.trim(),
        boothBenefit: boothBenefit.trim(),
      };
      onAddWebApp(newApp);
    }
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: WebAppDevStatus) => {
    if (status === 'production') {
      return (
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          부스 실전 배포 완료
        </span>
      );
    }
    if (status === 'in_development') {
      return (
        <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          프로토타입 개발 중
        </span>
      );
    }
    return (
      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
        <Lightbulb className="w-3 h-3" />
        기획 및 아이디어 제안
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            사용할 웹앱 & 부스 운영 아이디어 관리
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            관람객 인터랙션 및 부스 운영 자동화를 위해 K.F.C.가 개발한 웹앱과 신규 아이디어를 등록하세요.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          웹앱 및 신규 아이디어 추가
        </button>
      </div>

      {/* Grid of WebApps & Ideas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {webApps.map(app => (
          <div
            key={app.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                {getStatusBadge(app.devStatus)}
                <span className="text-xs text-slate-400 font-mono">기획/개발: {app.author}</span>
              </div>

              <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                {app.title}
              </h4>
              <p className="text-xs text-indigo-300 font-medium mb-3">{app.summary}</p>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{app.description}</p>

              {/* Feature Points */}
              <div className="space-y-1 mb-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">핵심 기능:</span>
                {app.features.map((feat, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {app.boothBenefit && (
                <div className="text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/20">
                  💡 <strong>부스 운영 효과:</strong> {app.boothBenefit}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              {app.interactiveType ? (
                <button
                  onClick={() => onLaunchInteractive(app.interactiveType!)}
                  className="py-1.5 px-3 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-indigo-500/40 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  실시간 데모 실행해보기
                </button>
              ) : (
                <span className="text-xs text-slate-500 italic">아이디어 기획 단계</span>
              )}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(app)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {webApps.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`'${app.title}'을 삭제하시겠습니까?`)) {
                        onDeleteWebApp(app.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-base font-bold text-white">
                {editingApp ? '웹앱 / 아이디어 정보 수정' : '신규 웹앱 및 부스 아이디어 추가'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">웹앱 / 아이디어 이름 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 관람객 로봇 스피드 측정기 웹앱"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">분류 카테고리</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as WebAppCategory)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  >
                    <option value="booth_operation">부스 현장 운영 & 대기열</option>
                    <option value="robot_control">로봇 무선 제어</option>
                    <option value="visitor_interaction">관람객 참여 & 퀴즈</option>
                    <option value="internal_tool">내부 장비 & 배터리 관리</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">개발 및 적용 상태</label>
                  <select
                    value={devStatus}
                    onChange={e => setDevStatus(e.target.value as WebAppDevStatus)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  >
                    <option value="production">부스 실전 배포 완료 (운영 중)</option>
                    <option value="in_development">프로토타입 개발 진행 중</option>
                    <option value="planned_idea">아이디어 기획 및 제안 단계</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">한 줄 요약</label>
                <input
                  type="text"
                  placeholder="앱의 목적을 한 문장으로 설명"
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">주요 기능들 (쉼표로 구분)</label>
                <input
                  type="text"
                  placeholder="원터치 발권, 남은 시간 카운트다운, 모바일 알림"
                  value={featuresStr}
                  onChange={e => setFeaturesStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">아이디어 제안자 / 개발자</label>
                  <input
                    type="text"
                    placeholder="예: 박서연 (SW 리드)"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">부스 운영 기대 효과</label>
                  <input
                    type="text"
                    placeholder="대기열 혼잡 방지 및 참여도 향상"
                    value={boothBenefit}
                    onChange={e => setBoothBenefit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">상세 설명</label>
                <textarea
                  rows={2}
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
                  {editingApp ? '수정 완료' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
