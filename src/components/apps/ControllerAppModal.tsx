import React, { useState, useEffect } from 'react';
import { X, Wifi, BatteryCharging, Gauge, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, RotateCw, Crosshair, AlertOctagon, Sparkles } from 'lucide-react';

interface ControllerAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControllerAppModal: React.FC<ControllerAppModalProps> = ({ isOpen, onClose }) => {
  const [speedLimit, setSpeedLimit] = useState<number>(30); // 30% for visitors
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number>(12.2);
  const [ping, setPing] = useState<number>(14);
  const [shotsCount, setShotsCount] = useState<number>(18);
  const [isEmergencyStopped, setIsEmergencyStopped] = useState<boolean>(false);
  const [robotMode, setRobotMode] = useState<'mecanum' | 'hound'>('mecanum');

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setPing(Math.floor(11 + Math.random() * 6));
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerAction = (actionName: string) => {
    if (isEmergencyStopped) return;
    setActiveAction(actionName);
    if (actionName.includes('슛')) {
      setShotsCount(prev => Math.max(0, prev - 1));
    }
    setTimeout(() => setActiveAction(null), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                K.F.C. WebPad™ 로봇 무선 컨트롤러
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  ESP32 WebSocket
                </span>
              </div>
              <div className="text-xs text-slate-400">
                연결 대상: {robotMode === 'mecanum' ? 'Mecanum-Striker (슈팅 로봇)' : 'CyberHound (사족보행 로봇)'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRobotMode(robotMode === 'mecanum' ? 'hound' : 'mecanum')}
              className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
            >
              기종 전환: {robotMode === 'mecanum' ? '사족보행 모드' : '슈팅 모드'}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* HUD Telemetry Strip */}
        <div className="bg-slate-950/80 px-5 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Wifi className="w-3.5 h-3.5" /> {ping}ms (안정)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <BatteryCharging className="w-3.5 h-3.5" /> {batteryLevel}V (3S LiPo)
            </span>
            <span className="hidden sm:inline text-slate-500">
              탄약: <strong className="text-white">{shotsCount}발</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">속도 제한:</span>
            {[30, 60, 100].map(val => (
              <button
                key={val}
                onClick={() => setSpeedLimit(val)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  speedLimit === val
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {val}% {val === 30 && '(체험객)'}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Pad Zone */}
        <div className="p-5 overflow-y-auto space-y-5 select-none bg-gradient-to-b from-slate-900 to-slate-950">
          {/* Action Feedback Banner */}
          <div className="h-9 flex items-center justify-center">
            {isEmergencyStopped ? (
              <div className="text-rose-400 font-bold text-xs flex items-center gap-1.5 bg-rose-950/50 px-3 py-1.5 rounded-lg border border-rose-500/50">
                <AlertOctagon className="w-4 h-4 animate-spin" /> E-STOP 긴급 비상정지 작동 중! 해제하려면 버튼을 누르세요.
              </div>
            ) : activeAction ? (
              <div className="text-cyan-300 font-bold text-xs bg-cyan-950/50 px-4 py-1 rounded-full border border-cyan-500/40 animate-pulse">
                ▶ 명령 송신: [{activeAction}] (속도 {speedLimit}%)
              </div>
            ) : (
              <div className="text-slate-500 text-xs">
                화면의 가상 버튼을 터치하거나 클릭하여 로봇을 기동해 보세요.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Pad: Direction / Movement */}
            <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                {robotMode === 'mecanum' ? '전방향 메카넘 주행 패드' : '사족보행 전후좌우 스텝'}
              </span>

              <div className="grid grid-cols-3 gap-2 w-48 h-48">
                <div />
                <button
                  onMouseDown={() => triggerAction('전진')}
                  className="bg-slate-800 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition shadow-md"
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
                <div />

                <button
                  onMouseDown={() => triggerAction(robotMode === 'mecanum' ? '좌측 게걸음 주행' : '좌측 이동')}
                  className="bg-slate-800 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition shadow-md"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onMouseDown={() => triggerAction('모터 브레이크')}
                  className="bg-slate-900 border border-slate-700 text-slate-400 text-xs font-mono font-bold rounded-xl flex items-center justify-center hover:bg-slate-800"
                >
                  STOP
                </button>
                <button
                  onMouseDown={() => triggerAction(robotMode === 'mecanum' ? '우측 게걸음 주행' : '우측 이동')}
                  className="bg-slate-800 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition shadow-md"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>

                <div />
                <button
                  onMouseDown={() => triggerAction('후진')}
                  className="bg-slate-800 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition shadow-md"
                >
                  <ArrowDown className="w-6 h-6" />
                </button>
                <div />
              </div>
            </div>

            {/* Right Pad: Rotation & Actions */}
            <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                  제자리 선회 & 특수 미션
                </span>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onMouseDown={() => triggerAction('좌선회 회전')}
                    className="py-3 px-3 bg-slate-800 hover:bg-cyan-600 active:bg-cyan-700 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-4 h-4" /> 좌회전 360°
                  </button>
                  <button
                    onMouseDown={() => triggerAction('우선회 회전')}
                    className="py-3 px-3 bg-slate-800 hover:bg-cyan-600 active:bg-cyan-700 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition"
                  >
                    <RotateCw className="w-4 h-4" /> 우회전 360°
                  </button>
                </div>
              </div>

              {/* Special Mission Buttons */}
              <div className="space-y-2">
                {robotMode === 'mecanum' ? (
                  <button
                    onMouseDown={() => triggerAction('탁구공 발사 슛! 🎯')}
                    disabled={isEmergencyStopped || shotsCount <= 0}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] disabled:opacity-40 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition text-sm"
                  >
                    <Crosshair className="w-5 h-5" />
                    과녁 슈팅 발사 (남은 공 {shotsCount}개)
                  </button>
                ) : (
                  <button
                    onMouseDown={() => triggerAction('관람객 손인사 포즈 🐾')}
                    disabled={isEmergencyStopped}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition text-sm"
                  >
                    <Sparkles className="w-5 h-5" />
                    4족 손인사 & 푸시업 모션
                  </button>
                )}

                <button
                  onClick={() => setIsEmergencyStopped(!isEmergencyStopped)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    isEmergencyStopped
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                      : 'bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900'
                  }`}
                >
                  <AlertOctagon className="w-4 h-4" />
                  {isEmergencyStopped ? '비상정지(E-STOP) 해제하기' : '긴급 비상정지 (E-STOP)'}
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>* 안전 수칙: 관람객 체험 시 최고 속도를 30%로 고정해 급발진을 방지합니다.</span>
            <span className="text-indigo-400 font-mono">Firmware v2.4 (KFC-IoT)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>기구 및 SW 제작: 용인시청소년수련관 로봇동아리 K.F.C.</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
