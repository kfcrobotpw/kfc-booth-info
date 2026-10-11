import React from 'react';
import { Festival, Member, Robot, WebAppIdea } from '../../types';
import { 
  Calendar, MapPin, Sparkles, Move, Users, Bot, 
  Smartphone, ShieldAlert, Clock, ArrowRight, Key, CheckCircle2, UserCheck
} from 'lucide-react';

interface PublicOverviewProps {
  festival?: Festival;
  members: Member[];
  robots: Robot[];
  webApps: WebAppIdea[];
  onNavigateTab: (tab: string) => void;
  currentOperator?: Member | null;
  onOpenOperatorLogin?: () => void;
}

export const PublicOverview: React.FC<PublicOverviewProps> = ({
  festival,
  members,
  robots,
  webApps,
  onNavigateTab,
  currentOperator,
  onOpenOperatorLogin,
}) => {
  // Find current operator's assigned subteam and robot
  const operatorSubteam = currentOperator && festival
    ? festival.subteams?.find(st => st.memberIds?.includes(currentOperator.id))
    : undefined;

  const operatorRobot = currentOperator
    ? robots.find(r => r.primaryPilotId === currentOperator.id)
    : undefined;

  if (!festival) {
    return (
      <div className="text-center py-20 rounded-3xl bg-slate-900/50 border border-slate-800 p-8 space-y-4">
        <Bot className="w-16 h-16 text-indigo-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">등록된 축제 부스가 없습니다</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          현재 활성화된 축제 부스 정보가 없습니다. 상단의 탭에서 축제 목록을 확인해 보세요.
        </p>
        <button
          onClick={() => onNavigateTab('festivals')}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
        >
          참여 축제 목록 확인하기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 1. Personalized Booth Operator Greeting & Status (If Logged In) */}
      {currentOperator ? (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border-2 border-indigo-500/50 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white text-xl font-black">
                  {currentOperator.name[0]}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    안녕하세요, <span className="text-cyan-300 font-extrabold">{currentOperator.name}</span>님! 👋
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    운영자 정상 로그인됨
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    코드: {currentOperator.accessCode}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  {currentOperator.grade} · <strong className="text-white">{currentOperator.role}</strong>
                  {operatorSubteam && (
                    <span className="text-indigo-300 font-medium"> | 배정 소팀: <strong className="text-white">{operatorSubteam.name}</strong> ({operatorSubteam.mainLocation})</span>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Shift & Task Badge */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 self-start lg:self-auto">
              <div className="text-xs text-slate-300 pr-2">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">내 교대 시간</span>
                <span className="font-mono font-bold text-amber-300">{operatorSubteam?.shiftTime || '전일 운영'}</span>
              </div>
              <div className="h-8 w-px bg-slate-800 mx-1 hidden sm:block" />
              <div className="text-xs text-slate-300 pl-2">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">담당 로봇</span>
                <span className="font-bold text-cyan-300">{operatorRobot?.name || '공동 관제'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        onOpenOperatorLogin && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  K.F.C. 부스 운영자이신가요?
                </h3>
                <p className="text-xs text-slate-400">
                  관리자에게 발급받은 전용 접속 코드를 입력하시면 본인의 소팀 편성표와 투입 로봇 승인 신청 기능을 이용할 수 있습니다.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenOperatorLogin}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-amber-300" />
              운영자 코드 입력하기
            </button>
          </div>
        )
      )}

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
            축제 현장에서 부스를 운영하는 K.F.C. 운영진과 팀원들을 위한 맞춤형 부스 안내 관제 시스템입니다.
            어디서 활동하고 누가 참가하며, 어떤 로봇과 웹앱을 사용하고, 부스 내에서 팀을 어떻게 나누어 효율적으로 운영하는지 한눈에 확인하세요.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => onNavigateTab('floorplan')}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              <Move className="w-4 h-4" />
              부스 배치도 보기 ({festival.layoutItems?.length || 0}개 집기)
            </button>
            <button
              onClick={() => onNavigateTab('subteams')}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              소팀 편성 & 교대표
            </button>
            <button
              onClick={() => onNavigateTab('robots')}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              출전 로봇 라인업 ({robots.length}대)
            </button>
            <button
              onClick={() => onNavigateTab('festivals')}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              참여 축제 일정표
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
            {festival.theme && <div className="text-xs text-indigo-300 font-medium mt-1">"{festival.theme}"</div>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              부스 번호: {festival.boothNumber || '미정'}
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              규격: {festival.boothDimensions?.widthMeters || 5}m × {festival.boothDimensions?.depthMeters || 5}m
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
            <div className="text-[11px] text-slate-500 mt-0.5">운영 소팀 {festival.subteams?.length || 0}개</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 mb-1">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              투입 로봇
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {robots.length}대
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">시연 및 운영 로봇</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 mb-1">
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              활용 웹앱
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {webApps.length}개
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">운영 관제 웹앱</div>
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
              <strong>{festival.date || '일정 등록 예정'}</strong> {festival.timeRange && `(${festival.timeRange})`}
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[11px]">장소</span>
              <strong>{festival.location || '장소 등록 예정'}</strong>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[11px]">관람객 타깃</span>
              <strong>{festival.targetAudience || '전 연령 관람객'}</strong>
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
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
          >
            교대표 전체보기 <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {(!festival.subteams || festival.subteams.length === 0) ? (
          <div className="p-8 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center text-slate-400 text-xs space-y-2">
            <Users className="w-8 h-8 text-slate-600 mx-auto" />
            <p>아직 편성된 소팀이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {festival.subteams.map(st => {
              const teamMembers = members.filter(m => st.memberIds?.includes(m.id));
              const isMyTeam = currentOperator && st.memberIds?.includes(currentOperator.id);

              return (
                <div
                  key={st.id}
                  className={`p-4 rounded-xl bg-slate-900 border transition flex flex-col justify-between space-y-3 ${
                    isMyTeam ? 'border-indigo-500 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500/50' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: st.color }} />
                        <span className="font-bold text-xs text-white">{st.name}</span>
                      </div>
                      {isMyTeam && (
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold border border-indigo-500/30">
                          내 소팀
                        </span>
                      )}
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
                        {teamMembers.length === 0 ? (
                          <span className="text-[10px] text-slate-500">배정된 부원 없음</span>
                        ) : (
                          teamMembers.map(m => (
                            <span
                              key={m.id}
                              className={`text-[10px] px-2 py-0.5 rounded border ${
                                m.id === currentOperator?.id
                                  ? 'bg-indigo-600 text-white font-bold border-indigo-400 shadow-sm'
                                  : 'bg-slate-800 text-slate-200 border-slate-700'
                              }`}
                            >
                              {m.name} {m.id === currentOperator?.id && '(나)'}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                    교대: {st.shiftTime || '미정'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

          {(!festival.timeline || festival.timeline.length === 0) ? (
            <div className="p-6 rounded-xl bg-slate-950/50 border border-dashed border-slate-800 text-center text-slate-500 text-xs">
              아직 등록된 운영 타임테이블이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {festival.timeline.map((item, idx) => (
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
          )}
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
              {(!festival.safetyRules || festival.safetyRules.length === 0) ? (
                <div className="text-xs text-slate-400 space-y-2 text-center py-6 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                  <ShieldAlert className="w-8 h-8 text-amber-500/40 mx-auto mb-2" />
                  <p>등록된 안전 수칙이 없습니다.</p>
                  <p className="text-[11px] text-slate-500">현장 안전 수칙이 실시간으로 동기화됩니다.</p>
                </div>
              ) : (
                festival.safetyRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950 text-xs text-slate-300 border border-slate-800/80 flex items-start gap-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rule}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300">
            ⚡ <strong>비상 상황 발생 시:</strong> 부스 총괄 기장 및 수련관 지도 교사/선생님께 즉시 연락 바랍니다.
          </div>
        </div>
      </div>
    </div>
  );
};
