import React from 'react';
import { Robot, Member } from '../../types';
import { Bot, Cpu, Battery, ShieldAlert, Play, CheckCircle2, User } from 'lucide-react';

interface RobotsGalleryProps {
  robots: Robot[];
  members: Member[];
  onLaunchController: () => void;
}

export const RobotsGallery: React.FC<RobotsGalleryProps> = ({
  robots,
  members,
  onLaunchController,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-400" />
            부스 투입 로봇 라인업 & 하드웨어 스펙
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            용인시청소년수련관 로봇동아리 K.F.C. 학생들이 직접 설계, 3D 프린팅 및 프로그래밍한 공식 출전 로봇들입니다.
          </p>
        </div>

        <button
          onClick={onLaunchController}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
        >
          <Play className="w-4 h-4 fill-white" />
          가상 무선 웹패드로 조종해보기
        </button>
      </div>

      {/* Robots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {robots.map(robot => {
          const pilot = members.find(m => m.id === robot.primaryPilotId);

          return (
            <div
              key={robot.id}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
                    {robot.codeName}
                  </span>
                  <span className="text-xs text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    가동 가능
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5">{robot.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{robot.description}</p>

                {/* Specs Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs mb-4">
                  <div className="flex items-start gap-2">
                    <Cpu className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-semibold">하드웨어 사양: </span>
                      <span className="text-slate-200">{robot.specs}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Battery className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-semibold">배터리 및 전압: </span>
                      <span className="text-amber-300">{robot.batteryType} ({robot.operatingVoltage})</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-indigo-300">
                    <Bot className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                    <div>
                      <span className="text-slate-400 font-semibold">조종 방식: </span>
                      <span>{robot.controllerMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Scenario & Safety */}
                <div className="space-y-2 text-xs mb-3">
                  <div className="p-2.5 rounded-lg bg-slate-950/70 text-slate-300 border border-slate-800">
                    <strong className="text-white block mb-0.5">🎯 관람객 시연 시나리오:</strong>
                    {robot.demonstrationScenario}
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-950/30 text-rose-300 border border-rose-900/30 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>{robot.safetyNotes}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {robot.tags.map((tg, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pilot Card Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>담당 조종자: <strong>{pilot?.name || '미배정'}</strong> ({pilot?.grade || 'K.F.C.'})</span>
                </div>

                <button
                  onClick={onLaunchController}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  웹패드로 테스트 →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
