import React, { useState } from 'react';
import { Robot, RobotCategory, Member } from '../../types';
import { Bot, Plus, Edit2, Trash2, Battery, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';

interface AdminRobotsProps {
  robots: Robot[];
  members: Member[];
  onAddRobot: (robot: Robot) => void;
  onUpdateRobot: (robot: Robot) => void;
  onDeleteRobot: (id: string) => void;
}

export const AdminRobots: React.FC<AdminRobotsProps> = ({
  robots,
  members,
  onAddRobot,
  onUpdateRobot,
  onDeleteRobot,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRobot, setEditingRobot] = useState<Robot | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [codeName, setCodeName] = useState<string>('');
  const [category, setCategory] = useState<RobotCategory>('mobile_wheeled');
  const [description, setDescription] = useState<string>('');
  const [specs, setSpecs] = useState<string>('');
  const [demonstrationScenario, setDemonstrationScenario] = useState<string>('');
  const [batteryType, setBatteryType] = useState<string>('3S LiPo 11.1V 2200mAh');
  const [operatingVoltage, setOperatingVoltage] = useState<string>('11.1V ~ 12.6V');
  const [controllerMethod, setControllerMethod] = useState<string>('K.F.C. 무선 웹패드 컨트롤러');
  const [safetyNotes, setSafetyNotes] = useState<string>('1m 안전거리 유지, 비상정지 E-STOP 확인');
  const [primaryPilotId, setPrimaryPilotId] = useState<string>('');
  const [status, setStatus] = useState<'ready' | 'maintenance' | 'testing'>('ready');
  const [tagsStr, setTagsStr] = useState<string>('체험형, 인기 로봇');

  const openAddModal = () => {
    setEditingRobot(null);
    setName('');
    setCodeName('');
    setCategory('mobile_wheeled');
    setDescription('부스에서 관람객들이 직접 조종 체험할 수 있는 로봇입니다.');
    setSpecs('메탈 서보모터, 아두이노/ESP32, 무선 통신 모듈');
    setDemonstrationScenario('장애물 코스 통과 및 미션 수행 시연');
    setBatteryType('3S LiPo 11.1V');
    setOperatingVoltage('11.1V');
    setControllerMethod('스마트폰 웹 브라우저 터치 컨트롤러');
    setSafetyNotes('급발진 방지 및 관람객 손끼임 주의');
    setPrimaryPilotId(members[0]?.id || '');
    setStatus('ready');
    setTagsStr('체험로봇, K.F.C.자체제작');
    setIsModalOpen(true);
  };

  const openEditModal = (r: Robot) => {
    setEditingRobot(r);
    setName(r.name);
    setCodeName(r.codeName);
    setCategory(r.category);
    setDescription(r.description);
    setSpecs(r.specs);
    setDemonstrationScenario(r.demonstrationScenario);
    setBatteryType(r.batteryType);
    setOperatingVoltage(r.operatingVoltage);
    setControllerMethod(r.controllerMethod);
    setSafetyNotes(r.safetyNotes);
    setPrimaryPilotId(r.primaryPilotId || '');
    setStatus(r.status);
    setTagsStr(r.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    if (editingRobot) {
      const updated: Robot = {
        ...editingRobot,
        name: name.trim(),
        codeName: codeName.trim(),
        category,
        description: description.trim(),
        specs: specs.trim(),
        demonstrationScenario: demonstrationScenario.trim(),
        batteryType: batteryType.trim(),
        operatingVoltage: operatingVoltage.trim(),
        controllerMethod: controllerMethod.trim(),
        safetyNotes: safetyNotes.trim(),
        primaryPilotId,
        status,
        tags,
      };
      onUpdateRobot(updated);
    } else {
      const newRobot: Robot = {
        id: 'r-' + Date.now(),
        name: name.trim(),
        codeName: codeName.trim() || name.trim(),
        category,
        description: description.trim(),
        specs: specs.trim(),
        demonstrationScenario: demonstrationScenario.trim(),
        batteryType: batteryType.trim(),
        operatingVoltage: operatingVoltage.trim(),
        controllerMethod: controllerMethod.trim(),
        safetyNotes: safetyNotes.trim(),
        primaryPilotId,
        status,
        tags,
      };
      onAddRobot(newRobot);
    }
    setIsModalOpen(false);
  };

  const getStatusBadge = (st: 'ready' | 'maintenance' | 'testing') => {
    if (st === 'ready') {
      return <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">출격 준비 완료 (Ready)</span>;
    }
    if (st === 'maintenance') {
      return <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">부품 정비 중 (Maintenance)</span>;
    }
    return <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">필드 테스트 중 (Testing)</span>;
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            출전 로봇 & 하드웨어 장비 관리
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            부스에 투입되는 사족보행, 메카넘휠, 로봇팔 등의 스펙과 배터리 관리 지침을 등록하세요.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          신규 로봇 등록
        </button>
      </div>

      {/* Grid of Robots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {robots.map(robot => {
          const pilot = members.find(m => m.id === robot.primaryPilotId);
          return (
            <div
              key={robot.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  {getStatusBadge(robot.status)}
                  <span className="text-xs text-slate-400 font-mono">코드명: {robot.codeName}</span>
                </div>

                <h4 className="text-base font-bold text-white mb-1">{robot.name}</h4>
                <p className="text-xs text-slate-300 mb-3">{robot.description}</p>

                {/* Specs Box */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 mb-3">
                  <div className="flex items-start gap-2">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-semibold">스펙: </span>
                      <span className="text-slate-200">{robot.specs}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Battery className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-semibold">배터리/전압: </span>
                      <span className="text-amber-300">{robot.batteryType} ({robot.operatingVoltage})</span>
                    </div>
                  </div>
                </div>

                {/* Scenario & Safety */}
                <div className="space-y-1.5 text-xs text-slate-400 mb-3">
                  <div>
                    <strong className="text-slate-300">시연 시나리오:</strong> {robot.demonstrationScenario}
                  </div>
                  <div className="text-rose-400 flex items-start gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{robot.safetyNotes}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {robot.tags.map((tg, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      #{tg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions & Pilot */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  담당 조종/파일럿: <strong className="text-white">{pilot?.name || '미지정'}</strong>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(robot)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {robots.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`'${robot.name}'을 삭제하시겠습니까?`)) {
                          onDeleteRobot(robot.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-base font-bold text-white">
                {editingRobot ? '로봇 장비 정보 수정' : '신규 로봇 등록'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">로봇 명칭 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: KFC-CyberHound"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">코드네임</label>
                  <input
                    type="text"
                    placeholder="예: CyberHound Mk.III"
                    value={codeName}
                    onChange={e => setCodeName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">로봇 유형</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as RobotCategory)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  >
                    <option value="quadruped">4족 보행 로봇</option>
                    <option value="mobile_wheeled">메카넘/전방향 주행 로봇</option>
                    <option value="robotic_arm">다축 협동 로봇팔</option>
                    <option value="autonomous">AI 자율주행 트랙카</option>
                    <option value="combat">슈팅/배틀 로봇</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">출전 상태</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  >
                    <option value="ready">출격 준비 완료 (Ready)</option>
                    <option value="testing">필드 테스트 중 (Testing)</option>
                    <option value="maintenance">정비/수리 중 (Maintenance)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">하드웨어 주요 스펙</label>
                <input
                  type="text"
                  placeholder="모터 수, 제어 MCU, 프레임 소재 등"
                  value={specs}
                  onChange={e => setSpecs(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">배터리 규격</label>
                  <input
                    type="text"
                    placeholder="예: 3S LiPo 11.1V 2200mAh"
                    value={batteryType}
                    onChange={e => setBatteryType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">정격 구동 전압</label>
                  <input
                    type="text"
                    placeholder="11.1V ~ 12.6V"
                    value={operatingVoltage}
                    onChange={e => setOperatingVoltage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">조종 및 통신 방식</label>
                  <input
                    type="text"
                    placeholder="웹소켓 Wi-Fi 터치패드 컨트롤러"
                    value={controllerMethod}
                    onChange={e => setControllerMethod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">담당 조종 부원</label>
                  <select
                    value={primaryPilotId}
                    onChange={e => setPrimaryPilotId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                  >
                    <option value="">(미지정)</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">시연 시나리오</label>
                <input
                  type="text"
                  placeholder="관람객 과녁 맞추기 및 장애물 회피 시범"
                  value={demonstrationScenario}
                  onChange={e => setDemonstrationScenario(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">안전 유의사항</label>
                <input
                  type="text"
                  placeholder="반경 1m 관람객 접촉 금지, 안전 가드레일 설치"
                  value={safetyNotes}
                  onChange={e => setSafetyNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
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
                  {editingRobot ? '수정 완료' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
