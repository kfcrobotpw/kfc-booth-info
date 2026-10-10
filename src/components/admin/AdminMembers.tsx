import React, { useState } from 'react';
import { Member, Festival, SubTeam } from '../../types';
import { Users, Plus, Edit2, Trash2, Shield, Phone, Sparkles, Check, ArrowRight } from 'lucide-react';

interface AdminMembersProps {
  members: Member[];
  activeFestival: Festival;
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  onUpdateFestivalSubteams: (subteams: SubTeam[]) => void;
}

export const AdminMembers: React.FC<AdminMembersProps> = ({
  members,
  activeFestival,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onUpdateFestivalSubteams,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [grade, setGrade] = useState<string>('고등학교 1학년');
  const [role, setRole] = useState<string>('체험 지도 멘토');
  const [skillsStr, setSkillsStr] = useState<string>('로봇 제어, 관람객 안내, 친절한 설명');
  const [phone, setPhone] = useState<string>('010-0000-0000');
  const [emergency, setEmergency] = useState<string>('010-0000-0000 (학부모)');
  const [bio, setBio] = useState<string>('K.F.C. 부스에서 열정적으로 활동하겠습니다!');

  const openAddModal = () => {
    setEditingMember(null);
    setName('');
    setGrade('고등학교 1학년');
    setRole('로봇 조종 파일럿 & 체험 지도');
    setSkillsStr('아두이노, 3D 프린팅, 로봇 조작');
    setPhone('010-');
    setEmergency('010- (학부모)');
    setBio('부스 관람객들에게 로봇의 매력을 알리겠습니다.');
    setIsModalOpen(true);
  };

  const openEditModal = (mem: Member) => {
    setEditingMember(mem);
    setName(mem.name);
    setGrade(mem.grade);
    setRole(mem.role);
    setSkillsStr(mem.skills.join(', '));
    setPhone(mem.phone);
    setEmergency(mem.emergencyContact);
    setBio(mem.bio || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const skills = skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const colors = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-purple-500 to-indigo-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600',
      'from-cyan-500 to-blue-600',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    if (editingMember) {
      const updated: Member = {
        ...editingMember,
        name: name.trim(),
        grade: grade.trim(),
        role: role.trim(),
        skills,
        phone: phone.trim(),
        emergencyContact: emergency.trim(),
        bio: bio.trim(),
      };
      onUpdateMember(updated);
    } else {
      const newMem: Member = {
        id: 'm-' + Date.now(),
        name: name.trim(),
        grade: grade.trim(),
        role: role.trim(),
        skills,
        phone: phone.trim(),
        emergencyContact: emergency.trim(),
        bio: bio.trim(),
        avatarColor: randomColor,
      };
      onAddMember(newMem);
    }
    setIsModalOpen(false);
  };

  // Subteam assignment toggle
  const handleAssignToSubteam = (memberId: string, subteamId: string) => {
    const updatedSubteams = (activeFestival.subteams || []).map(st => {
      const isCurrentlyIn = st.memberIds.includes(memberId);
      if (st.id === subteamId) {
        return {
          ...st,
          memberIds: isCurrentlyIn ? st.memberIds.filter(id => id !== memberId) : [...st.memberIds, memberId],
        };
      }
      return st;
    });
    onUpdateFestivalSubteams(updatedSubteams);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            참여 부원 명단 및 소팀 배치 관리
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            등록된 K.F.C. 부원 정보를 관리하고, 현재 축제({activeFestival.name})의 부스 내 운영 소팀에 배정합니다.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          신규 참여 인원 추가
        </button>
      </div>

      {/* Subteam Assignment Matrix for Active Festival */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              부스 내 소팀 편성표 ({activeFestival.name})
            </span>
            <span className="text-xs text-slate-400">
              클릭하여 부원을 원하는 운영팀에 즉시 배정/해제할 수 있습니다.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeFestival.subteams?.map(st => {
            const assignedMembers = members.filter(m => st.memberIds.includes(m.id));
            return (
              <div
                key={st.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                      {st.name}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {assignedMembers.length}명
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-2">{st.mainLocation}</div>

                  <div className="space-y-1">
                    {assignedMembers.length > 0 ? (
                      assignedMembers.map(m => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900 text-xs text-slate-200 border border-slate-800"
                        >
                          <span className="font-semibold">{m.name}</span>
                          <span className="text-[10px] text-slate-400">{m.role}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-[11px] text-slate-600 italic py-2 text-center">
                        배정된 인원 없음
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                  교대 시간: {st.shiftTime}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Members Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(member => {
          // Check which subteams this member is in
          const inTeams = activeFestival.subteams?.filter(st => st.memberIds.includes(member.id)) || [];

          return (
            <div
              key={member.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${member.avatarColor || 'from-indigo-500 to-purple-600'} flex items-center justify-center text-white font-bold text-sm shadow`}
                    >
                      {member.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        {member.name}
                        {member.isLeader && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                            리더
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{member.grade} · {member.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(member)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {members.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`${member.name} 부원을 삭제하시겠습니까?`)) {
                            onDeleteMember(member.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {member.skills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-slate-400 space-y-1 mb-2 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span>비상: {member.emergencyContact}</span>
                  </div>
                </div>

                {member.bio && (
                  <p className="text-xs text-slate-400 line-clamp-2 italic bg-slate-950/60 p-2 rounded-lg">
                    "{member.bio}"
                  </p>
                )}
              </div>

              {/* Subteam Quick Assign Controls */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400">부스 소팀 배정 토글:</span>
                <div className="flex flex-wrap gap-1">
                  {activeFestival.subteams?.map(st => {
                    const isAssigned = st.memberIds.includes(member.id);
                    return (
                      <button
                        key={st.id}
                        onClick={() => handleAssignToSubteam(member.id, st.id)}
                        className={`text-[10px] px-2 py-1 rounded transition border flex items-center gap-1 ${
                          isAssigned
                            ? 'bg-indigo-600 border-indigo-500 text-white font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isAssigned && <Check className="w-3 h-3" />}
                        {st.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-base font-bold text-white">
                {editingMember ? '부원 정보 수정' : '신규 참여 부원 추가'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">이름 *</label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">학년 / 소속</label>
                  <input
                    type="text"
                    placeholder="고등학교 1학년"
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">동아리 내 역할</label>
                <input
                  type="text"
                  placeholder="예: 메카넘 로봇 파일럿, 체험 지도 멘토"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">보유 기술 / 스킬 (쉼표 구분)</label>
                <input
                  type="text"
                  placeholder="ROS2, 3D 프린팅, 회로 납땜, 친절한 말씨"
                  value={skillsStr}
                  onChange={e => setSkillsStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">연락처</label>
                  <input
                    type="text"
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">비상연락망 (보호자)</label>
                  <input
                    type="text"
                    placeholder="010-0000-0000 (부)"
                    value={emergency}
                    onChange={e => setEmergency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">한 줄 각오 / 비고</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
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
                  {editingMember ? '수정 완료' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
