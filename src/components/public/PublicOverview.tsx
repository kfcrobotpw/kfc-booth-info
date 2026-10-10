import React from 'react';
import { Festival, Member, Robot, WebAppIdea } from '../../types';
import { 
  Calendar, MapPin, Sparkles, Move, Users, Bot, 
  Smartphone, ShieldAlert, Clock, ArrowRight, Play, CheckCircle2, Award
} from 'lucide-react';

interface PublicOverviewProps {
  festival: Festival;
  members: Member[];
  robots: Robot[];
  webApps: WebAppIdea[];
  onNavigateTab: (tab: string) => void;
  onLaunchInteractive: (type: 'queue' | 'controller' | 'quiz' | 'guestbook') => void;
}

export const PublicOverview: React.FC<PublicOverviewProps> = ({
  festival,
  members,
  robots,
  webApps,
  onNavigateTab,
  onLaunchInteractive,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              YONGIN YOUTH CENTER ROBOTICS CLUB
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              부스 실시간 운영 모드
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            용인시청소년수련관 로봇동아리 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">K.F.C.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            축제 현장에서 많은 관람객을 맞이하는 K.F.C. 팀원들을 위한 맞춤형 부스 안내 관제 시스템입니다.
            어디서 활동하고 누가 참가하며, 어떤 로봇과 웹앱을 사용하고, 부스 내에서 팀을 어떻게 나누어 효율적으로 운영하는지 한눈에 확인하세요.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => onNavigateTab('floorplan')}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              <Move className="w-4 h-4" />
              부스 배치도 보기 ({festival.layoutItems?.length || 0}개 집기)
            </button>
            <button
              onClick={() => onNavigateTab('subteams')}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              소팀 편성 & 교대표
            </button>
            <button
              onClick={() => onLaunchInteractive('controller')}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-300 font-semibold text-xs rounded-xl border border-cyan-500/40 flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-cyan-400/20" />
              로봇 무선 조종기 데모
            </button>
            <button
              onClick={() => onLaunchInteractive('queue')}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-purple-300 font-semibold text-xs rounded-xl border border-purple-500/40 flex items-center gap-2 transition"
            >
              <Smartphone className="w-4 h-4 text-purple-400" />
              대기열 스마트 번호표
            </button>
          </div>
        </div>
      </div>

      {/* Active Festival Spotlight Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-semibold">
              FEATURED FESTIVAL BOOTH
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              {festival.name}
            </h2>
            <div className="text-xs text-indigo-300 font-medium mt-1">"{festival.theme}"</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              부스 번호: {festival.boothNumber}
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              규격: {festival.boothDimensions.widthMeters}m × {festival.boothDimensions.depthMeters}m
            </span>
          </div>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              참여 부원
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {members.length}명
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">운영 소팀 {festival.subteams?.length || 4}개</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 mb-1">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              투입 로봇
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {robots.length}대
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">사족보행 · 메카넘 · 로봇팔</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 mb-1">
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              활용 웹앱
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {webApps.filter(w => w.devStatus === 'production').length}개
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">대기열 · 조종기 · 퀴즈</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 mb-1">
              <Move className="w-3.5 h-3.5 text-amber-400" />
              배치된 집기
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {festival.layoutItems?.length || 0}개
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">책상 · 의자 · 시연장</div>
          </div>
        </div>

        {/* Date, Location, Target Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[11px]">일시</span>
              <strong>{festival.date}</strong> ({festival.timeRange})
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[11px]">장소</span>
              <strong>{festival.location}</strong>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[11px]">관람객 타깃</span>
              <strong>{festival.targetAudience}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Subteam Quick Guide Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              부스 내 소팀별 임무 & 역할 분담
            </h3>
            <p className="text-xs text-slate-400">
              K.F.C.는 부스 내부에서도 전문 분야별로 팀을 나누어 안전하고 체계적으로 운영합니다.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('subteams')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
          >
            교대표 전체보기 <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {festival.subteams?.map(st => {
            const teamMembers = members.filter(m => st.memberIds?.includes(m.id));
            return (
              <div
                key={st.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: st.color }} />
                    <span className="font-bold text-xs text-white">{st.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-2">{st.description}</div>
                  <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/40 p-1.5 rounded border border-indigo-500/20 mb-2">
                    📍 {st.mainLocation}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                      배치 부원 ({teamMembers.length}명):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {teamMembers.map(m => (
                        <span
                          key={m.id}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700"
                        >
                          {m.name} ({m.grade.split(' ')[0]})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                  교대: {st.shiftTime}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Operational Timeline & Safety Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              부스 당일 운영 타임테이블
            </h3>
            <span className="text-xs text-slate-400">설치부터 철수까지 타임라인</span>
          </div>

          <div className="space-y-3">
            {festival.timeline?.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3"
              >
                <div className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/50 px-2.5 py-1 rounded border border-indigo-500/20 shrink-0">
                  {item.time}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    {item.title}
                    <span className="text-[10px] text-slate-400 font-normal">[{item.subteam}]</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Rules (1 col) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                부스 현장 필수 안전 수칙
              </h3>
            </div>

            <div className="space-y-2.5 pt-3">
              {festival.safetyRules?.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950 text-xs text-slate-300 border border-slate-800/80 flex items-start gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300">
            ⚡ <strong>비상 상황 발생 시:</strong> 김지후 기장(010-3849-1029) 및 수련관 인솔 선생님께 즉시 무전/연락 바랍니다.
          </div>
        </div>
      </div>
    </div>
  );
};
