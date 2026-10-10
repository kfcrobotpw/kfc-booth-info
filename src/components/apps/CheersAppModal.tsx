import React, { useState } from 'react';
import { X, Heart, MessageSquare, Send, Sparkles, Smile, Star } from 'lucide-react';

interface CheersAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CheerItem {
  id: string;
  author: string;
  message: string;
  tag: string;
  stars: number;
  timeAgo: string;
}

const INITIAL_CHEERS: CheerItem[] = [
  {
    id: 'c1',
    author: '용인초 5학년 민석이',
    message: '사족보행 로봇이 손인사해 줄 때 너무 신기했어요! 저도 커서 K.F.C. 들어오고 싶어요 🤖✨',
    tag: '로봇 멋져요',
    stars: 5,
    timeAgo: '5분 전',
  },
  {
    id: 'c2',
    author: '관람객 학부모님',
    message: '학생들이 직접 코딩하고 3D 프린터로 뽑았다는 게 믿기지 않네요. 설명도 너무 친절했습니다!',
    tag: '친절한 멘토링',
    stars: 5,
    timeAgo: '12분 전',
  },
  {
    id: 'c3',
    author: '보라고 1학년 친구들',
    message: '메카넘 슛팅 로봇 반응속도 대박입니다 ㅋㅋㅋ 과녁 3개 다 맞추고 키링 받아갑니다!',
    tag: '게임 꿀잼',
    stars: 5,
    timeAgo: '20분 전',
  },
  {
    id: 'c4',
    author: '수련관 댄스동아리 은지',
    message: 'K.F.C. 축제 부스 화이팅!! 배터리 안전관리도 철저해서 든든해요 👍',
    tag: '동아리 응원',
    stars: 5,
    timeAgo: '35분 전',
  },
];

export const CheersAppModal: React.FC<CheersAppModalProps> = ({ isOpen, onClose }) => {
  const [cheers, setCheers] = useState<CheerItem[]>(INITIAL_CHEERS);
  const [authorInput, setAuthorInput] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('로봇 최고!');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newCheer: CheerItem = {
      id: 'c-' + Date.now(),
      author: authorInput.trim() || '익명의 관람객',
      message: messageInput.trim(),
      tag: selectedTag,
      stars: 5,
      timeAgo: '방금 전',
    };

    setCheers([newCheer, ...cheers]);
    setMessageInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Heart className="w-5 h-5 fill-rose-500/30" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                실시간 관람객 응원 월 & 방명록
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-normal">
                  TV 실시간 연동
                </span>
              </h2>
              <p className="text-xs text-slate-400">용인청소년수련관 부스 대형 스크린 라이브 피드</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-rose-400" />
              K.F.C. 부원들에게 한 줄 응원 남기기
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="작성자 이름 / 소속 (예: 용인중 1학년 민지)"
                value={authorInput}
                onChange={e => setAuthorInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
              />
              <select
                value={selectedTag}
                onChange={e => setSelectedTag(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none"
              >
                <option value="로봇 최고!">로봇 최고! 🤖</option>
                <option value="체험 꿀잼!">체험 꿀잼! 🎮</option>
                <option value="친절해요!">친절해요! ❤️</option>
                <option value="K.F.C. 화이팅!">K.F.C. 화이팅! 🔥</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="응원의 메시지나 재미있었던 점을 적어주세요!"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition shadow"
              >
                <Send className="w-3.5 h-3.5" />
                등록
              </button>
            </div>
          </form>

          {/* Wall Message Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>오늘 등록된 응원 <strong>{cheers.length}개</strong></span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                만족도 5.0 / 5.0 만점
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {cheers.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.author}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium">
                        {item.tag}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{item.timeAgo}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>대형 모니터 표출 시스템: K.F.C. 웹앱팀</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
