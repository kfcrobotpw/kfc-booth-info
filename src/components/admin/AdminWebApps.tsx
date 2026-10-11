import React, { useState } from 'react';
import { WebAppIdea, WebAppCategory, WebAppDevStatus } from '../../types';
import { Smartphone, Plus, Edit2, Trash2, CheckCircle2, Clock, X } from 'lucide-react';

interface AdminWebAppsProps {
  webApps: WebAppIdea[];
  onAddWebApp: (app: WebAppIdea) => void;
  onUpdateWebApp: (app: WebAppIdea) => void;
  onDeleteWebApp: (id: string) => void;
}

export const AdminWebApps: React.FC<AdminWebAppsProps> = ({
  webApps,
  onAddWebApp,
  onUpdateWebApp,
  onDeleteWebApp,
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
    setSummary('');
    setDescription('');
    setFeaturesStr('');
    setDevStatus('planned_idea');
    setAuthor('');
    setBoothBenefit('');
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
        author: author.trim() || 'K.F.C.',
        boothBenefit: boothBenefit.trim(),
      };
      onUpdateWebApp(updated);
    } else {
      const newApp: WebAppIdea = {
        id: 'app-' + Date.now(),
        title: title.trim(),
        category,
        summary: summary.trim(),
        description: description.trim(),
        features,
        devStatus,
        author: author.trim() || 'K.F.C.',
        boothBenefit: boothBenefit.trim(),
      };
      onAddWebApp(newApp);
    }
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: WebAppDevStatus) => {
    switch (status) {
      case 'production':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            부스 실전 배포 완료
          </span>
        );
      case 'in_development':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            개발/제작 중
          </span>
        );
      case 'planned_idea':
      default:
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
            아이디어 제안 단계
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            운영 웹앱 & 부스 소프트웨어 관리
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            부스 운영 자동화 및 관제를 위해 K.F.C.가 개발한 웹앱과 신규 아이디어를 등록하세요.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          웹앱 및 신규 아이디어 추가
        </button>
      </div>

      {/* Grid of WebApps & Ideas */}
      {webApps.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 p-8 space-y-3">
          <Smartphone className="w-12 h-12 text-slate-500 mx-auto" />
          <h4 className="text-base font-bold text-white">등록된 웹앱이 없습니다</h4>
          <p className="text-xs text-slate-400">
            '웹앱 및 신규 아이디어 추가' 버튼을 눌러 새 부스 운영 웹앱을 등록해 보세요.
          </p>
        </div>
      ) : (
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
                {app.summary && <p className="text-xs text-indigo-300 font-medium mb-3">{app.summary}</p>}
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{app.description}</p>

                {/* Feature Points */}
                {app.features && app.features.length > 0 && (
                  <div className="space-y-1 mb-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">핵심 기능:</span>
                    {app.features.map((feat, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {app.boothBenefit && (
                  <div className="text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/20">
                    💡 <strong>부스 운영 효과:</strong> {app.boothBenefit}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {app.category === 'booth_operation' ? '부스 관제' : '하드웨어 연동'}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(app)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                    title="수정"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`'${app.title}'을 삭제하시겠습니까?`)) {
                        onDeleteWebApp(app.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 text-xs transition cursor-pointer"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                {editingApp ? '웹앱 정보 수정' : '새 운영 웹앱 등록'}
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
                <label className="text-xs font-semibold text-slate-300">웹앱 명칭 / 시스템명</label>
                <input
                  type="text"
                  placeholder="예: K.F.C. 부스 관제 웹 대시보드"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">카테고리</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as WebAppCategory)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none"
                  >
                    <option value="booth_operation">부스 현장 운영 관제</option>
                    <option value="robot_control">로봇 제어 & 텔레메트리</option>
                    <option value="internal_tool">내부 스태프 도구</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">개발 상태</label>
                  <select
                    value={devStatus}
                    onChange={e => setDevStatus(e.target.value as WebAppDevStatus)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none"
                  >
                    <option value="production">부스 실전 배포 완료</option>
                    <option value="in_development">개발/제작 진행 중</option>
                    <option value="planned_idea">아이디어 기획 단계</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">한 줄 요약 (서브타이틀)</label>
                <input
                  type="text"
                  placeholder="예: 부스 일정 및 팀원 교대 실시간 관제"
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">상세 설명</label>
                <textarea
                  rows={2}
                  placeholder="앱의 목적 및 사용 방법을 입력하세요."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">주요 기능 (쉼표로 구분)</label>
                <input
                  type="text"
                  placeholder="예: 실시간 상태 확인, 다중 기기 연동, 교대표 알림"
                  value={featuresStr}
                  onChange={e => setFeaturesStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">개발자 / 담당자</label>
                  <input
                    type="text"
                    placeholder="예: K.F.C. 소프트웨어팀"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">부스 운영 효과</label>
                  <input
                    type="text"
                    placeholder="예: 운영진 간 실시간 소통 강화"
                    value={boothBenefit}
                    onChange={e => setBoothBenefit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
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
                  {editingApp ? '수정 완료' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
