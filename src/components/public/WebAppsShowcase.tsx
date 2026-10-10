import React, { useState } from 'react';
import { WebAppIdea } from '../../types';
import { Smartphone, Play, Lightbulb, CheckCircle2, Clock, Sparkles, Plus, ExternalLink } from 'lucide-react';

interface WebAppsShowcaseProps {
  webApps: WebAppIdea[];
  onLaunchInteractive: (type: 'queue' | 'controller' | 'quiz' | 'guestbook') => void;
  onOpenAdminMode?: () => void;
}

export const WebAppsShowcase: React.FC<WebAppsShowcaseProps> = ({
  webApps,
  onLaunchInteractive,
  onOpenAdminMode,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredApps = filter === 'all'
    ? webApps
    : webApps.filter(w => w.devStatus === filter);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-indigo-400" />
            K.F.C. 웹앱 & 부스 운영 아이디어 허브
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            "우리가 어떤 웹앱과 로봇을 사용하는지"를 관람객과 팀원 모두가 바로 실행하고 체험해볼 수 있는 인터랙티브 쇼케이스입니다.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'all', label: '전체 보기' },
            { id: 'production', label: '부스 실전 배포' },
            { id: 'in_development', label: '개발 중' },
            { id: 'planned_idea', label: '아이디어 제안' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === f.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive WebApps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredApps.map(app => (
          <div
            key={app.id}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                {app.devStatus === 'production' ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    부스 라이브 운영 중
                  </span>
                ) : app.devStatus === 'in_development' ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    프로토타입 개발 중
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-semibold">
                    <Lightbulb className="w-3.5 h-3.5" />
                    신규 아이디어
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">제작: {app.author}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{app.title}</h3>
              <p className="text-xs text-indigo-300 font-medium mb-3">{app.summary}</p>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{app.description}</p>

              {/* Features List */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs mb-3">
                <span className="font-semibold text-slate-400 block text-[11px]">핵심 기능 및 특징:</span>
                {app.features.map((feat, idx) => (
                  <div key={idx} className="text-slate-300 flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {app.boothBenefit && (
                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
                  🎯 <strong>운영 혁신 효과:</strong> {app.boothBenefit}
                </div>
              )}
            </div>

            {/* Launch Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              {app.interactiveType ? (
                <button
                  onClick={() => onLaunchInteractive(app.interactiveType!)}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
                >
                  <Play className="w-4 h-4 fill-white" />
                  실시간 웹앱 체험 실행하기
                </button>
              ) : (
                <span className="text-xs text-slate-500 italic">
                  기획 검토 중인 부스 아이디어입니다.
                </span>
              )}

              {onOpenAdminMode && (
                <button
                  onClick={onOpenAdminMode}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  관리자에서 수정
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
