import React, { useState } from 'react';
import { Festival, Member } from '../../types';
import { Users, Clock, MapPin, CheckSquare, Phone, ShieldCheck, AlertCircle, HeartHandshake } from 'lucide-react';

interface SubteamsViewProps {
  festival: Festival;
  members: Member[];
}

export const SubteamsView: React.FC<SubteamsViewProps> = ({ festival, members }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(festival.subteams?.[0]?.id || '');

  const activeSubteam = festival.subteams?.find(st => st.id === selectedTeamId) || festival.subteams?.[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-400" />
          부스 내부 소팀 편성 & 근무 교대표
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          K.F.C.는 축제 부스에서 혼잡과 안전사고를 방지하기 위해 4개 운영 소팀으로 역할을 분담하여 운영합니다.
          자신의 배정 팀, 담당 위치, 교대 시간 및 체크리스트를 확인하세요.
        </p>
      </div>

      {/* Subteam Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {festival.subteams?.map(st => {
          const isSelected = st.id === (activeSubteam?.id || '');
          const teamMembers = members.filter(m => st.memberIds?.includes(m.id));

          return (
            <button
              key={st.id}
              onClick={() => setSelectedTeamId(st.id)}
              className={`p-4 rounded-xl text-left border transition relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: st.color }} />
                  <span className="text-xs font-bold text-white">{st.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2">{st.description}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">인원: {teamMembers.length}명</span>
                <span className="text-indigo-400 font-semibold">{isSelected ? '선택됨' : '보기'}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Team Detailed Dashboard */}
      {activeSubteam && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: activeSubteam.color }} />
                <h3 className="text-lg font-bold text-white">{activeSubteam.name}</h3>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded">
                  {activeSubteam.roleTitle}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{activeSubteam.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-indigo-300">
                <MapPin className="w-3.5 h-3.5" />
                위치: {activeSubteam.mainLocation}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                교대: {activeSubteam.shiftTime}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Team Roster Members (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                배정된 팀원 명단 ({members.filter(m => activeSubteam.memberIds?.includes(m.id)).length}명)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {members
                  .filter(m => activeSubteam.memberIds?.includes(m.id))
                  .map(mem => (
                    <div
                      key={mem.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${mem.avatarColor || 'from-indigo-500 to-purple-600'} flex items-center justify-center text-white font-bold text-sm shadow`}
                        >
                          {mem.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            {mem.name}
                            {mem.isLeader && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 rounded">
                                리더
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">{mem.grade}</div>
                        </div>
                      </div>

                      <div className="text-xs text-indigo-300 font-medium">
                        임무: {mem.role}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {mem.skills.slice(0, 3).map((sk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-900 text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{mem.phone}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Checklist & Operational Standard (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                소팀 행동 지침 & 체크리스트
              </h4>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                {activeSubteam.checklist?.map((chk, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-4 h-4 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{chk}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2 text-xs">
                <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  교대 시 인수인계 절차
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  교대 10분 전 다음 조 팀원에게 장비 상태, 배터리 잔량, 대기열 호출 현황을 구두로 보고하고 무전기를 인계합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Roster Summary Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Phone className="w-4 h-4 text-indigo-400" />
          부스 참가자 전원 비상연락망 (Emergency Contact)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">이름</th>
                <th className="py-2.5 px-3">학년/소속</th>
                <th className="py-2.5 px-3">동아리 역할</th>
                <th className="py-2.5 px-3">개인 연락처</th>
                <th className="py-2.5 px-3">보호자 비상연락망</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-bold text-white">{m.name}</td>
                  <td className="py-2 px-3 text-slate-400">{m.grade}</td>
                  <td className="py-2 px-3 text-indigo-300">{m.role}</td>
                  <td className="py-2 px-3">{m.phone}</td>
                  <td className="py-2 px-3 text-slate-400">{m.emergencyContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
