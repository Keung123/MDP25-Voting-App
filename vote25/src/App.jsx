import React, { useState, useEffect } from 'react';
import { Flame, Disc, Mic2, Trophy, Zap } from 'lucide-react';


import logo from './assets/logo.png';

// 导入歌手图片
import proPic1 from './assets/singers/s1.webp';
import proPic2 from './assets/singers/s2.webp';
import proPic3 from './assets/singers/s3.webp';
import proPic4 from './assets/singers/s4.webp';
import proPic5 from './assets/singers/s5.webp';
import proPic6 from './assets/singers/s6.webp';

// 导入海报
import pCurrent from './assets/p25.png'
const posters = import.meta.glob('/src/assets/posters/*.{png,jpg,jpeg,webp}', {
  eager: true
});

// --- 模拟数据配置 ---

// 往期海报 (模拟 ID 1-16)
// const PAST_POSTERS = Array.from({ length: 16 }, (_, i) => ({
//   id: i + 1,
//   // 使用占位图
//   src: `https://placehold.co/400x600/222/666?text=Show+${2008 + i}`
// }));

const PAST_POSTERS = Object.keys(posters)
  .sort() // 按文件名排序
  .map((path, index) => ({
    id: index + 1,
    src: posters[path].default
  }));

// 本期主海报
const MAIN_POSTER = {
  id: 'current',
  src: pCurrent,
  title: '决赛派对 2025',
  subtitle: 'THE FINAL PARTY'
};

// 歌手与歌曲数据
const SINGERS = [
  {
    id: 1,
    name: "Lan",
    style: "Rock/Pop",
    color: "from-purple-500 to-indigo-600",
    img: proPic1,
    songs: [
      { id: 101, title: "Butter-Fly - Kōji Wada" },
      { id: 102, title: "妙龄童 - 陈粒" }
    ]
  },
  {
    id: 2,
    name: "Eva",
    style: "Rock/Pop",
    color: "from-pink-500 to-rose-500",
    img: proPic2,
    songs: [
      { id: 201, title: "Don't break my heart/闷 - 黑豹/王菲" },
      { id: 202, title: "她来听我的演唱会 -张学友" }
    ]
  },
  {
    id: 3,
    name: "九号狂风",
    style: "Soul",
    color: "from-red-600 to-orange-600",
    img: proPic3,
    songs: [
      { id: 301, title: "Deadman - 蔡徐坤" },
      { id: 302, title: "Love Song - 方大同" }
    ]
  },
  {
    id: 4,
    name: "Sagi",
    style: "Folk",
    color: "from-cyan-400 to-blue-500",
    img: proPic4,
    songs: [
      { id: 401, title: "29 - 许均" },
      { id: 402, title: "理想 - 赵雷" }
    ]
  },
  {
    id: 5,
    name: "Shirley",
    style: "Rnb/Pop",
    color: "from-emerald-500 to-teal-600",
    img: proPic5,
    songs: [
      { id: 501, title: "无法抗拒的你 - Maderlin Weng" },
      { id: 502, title: "躺在你的衣柜 - 陈绮贞" }
    ]
  },
  {
    id: 6,
    name: "赵九如",
    style: "Rock",
    color: "from-yellow-400 to-orange-500",
    img: proPic6,
    songs: [
      { id: 601, title: "亲爱的无情的孙小美 - 茄子蛋" },
      { id: 602, title: "郭源潮 - 宋冬野" }
    ]
  },
];


// 默认票数，真正票数以后端 /api25/config 为准
const DEFAULT_TOTAL_VOTES = 10;
const STORAGE_KEY = 'music_contest_2025_v1';
const DEVICE_KEY = 'music_contest_2025_device_id';

// 注入自定义样式 (动画与特效)
const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');

    :root {
        --font-main: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    body {
        font-family: var(--font-main);
        background-color: #0f0f13;
        color: #ffffff;
        -webkit-tap-highlight-color: transparent;
    }

    /* 隐藏滚动条但允许滚动 */
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    /* 霓虹发光效果 */
    .neon-text {
        text-shadow: 0 0 5px rgba(139, 92, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.3);
    }

    /* 火焰粒子动画 */
    @keyframes floatUp {
        0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-80px) scale(1.5) rotate(20deg); opacity: 0; }
    }
    .fire-particle {
        position: absolute;
        pointer-events: none;
        animation: floatUp 0.8s ease-out forwards;
        font-size: 24px;
        z-index: 50;
    }

    /* 选中态流光效果 */
    .active-song-gradient {
        background: linear-gradient(90deg, #ec4899, #8b5cf6);
        background-size: 200% 200%;
        animation: gradientMove 3s ease infinite;
    }
    @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    /* 开场动画 */
    .animate-fade-in {
        animation: fadeIn 0.1s ease-out forwards;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(1.05); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .animate-slide-up {
        animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* 进度条动画 */
    .progress-bar-fill {
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

// --- 子组件：火焰粒子 ---
const FireParticles = ({ particles, onComplete }) => {
  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="fire-particle text-orange-400 font-bold"
          style={{ left: p.x, top: p.y }}
          onAnimationEnd={() => onComplete(p.id)}
        >
          {p.type === 'fire' ? <Flame size={24} fill="currentColor" /> : "+1"}
        </div>
      ))}
    </>
  );
};

// 生成或读取 deviceId
const getOrCreateDeviceId = () => {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    if (window.crypto && window.crypto.randomUUID) {
      id = window.crypto.randomUUID();
    } else {
      id = 'dev_' + Math.random().toString(36).slice(2);
    }
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
};

// --- 主应用组件 ---
export default function App() {
  const [view, setView] = useState('loading'); // loading, intro, main
  const [posterIndex, setPosterIndex] = useState(0);

  // 投票状态
  const [votes, setVotes] = useState({}); // { singerId: count }
  const [bestSongId, setBestSongId] = useState(null);

  // 后端配置
  const [config, setConfig] = useState({
    votingEnabled: false,
    totalVotes: DEFAULT_TOTAL_VOTES,
  });

  const [deviceId, setDeviceId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [configError, setConfigError] = useState('');

  // 交互状态
  const [particles, setParticles] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // 初始化加载（读取本地缓存）
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setVotes(parsed.votes || {});
      setBestSongId(parsed.bestSongId || null);
    }

    const id = getOrCreateDeviceId();
    setDeviceId(id);

    // 初次拉 config
    fetchConfig();

    // 定时轮询 config，比如每 15 秒
    const timer = setInterval(fetchConfig, 15000);

    // 模拟资源预加载后进入开场
    setTimeout(() => {
      setView('intro');
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api25/config');
      const data = await res.json();
      setConfig({
        votingEnabled: !!data.votingEnabled,
        totalVotes: data.totalVotesPerDevice || DEFAULT_TOTAL_VOTES,
      });
      setConfigError('');
    } catch (e) {
      console.error(e);
      setConfigError('无法连接后台，使用本地票数设置');
    }
  };

  // 持久化保存到 localStorage（只是给用户体验，不算真正提交）
  useEffect(() => {
    if (view === 'main' && deviceId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        votes,
        bestSongId,
        deviceId,
      }));
    }
  }, [votes, bestSongId, view, deviceId]);

  // --- 动画逻辑 ---
  useEffect(() => {
    if (view === 'intro') {
      let count = 0;
      const maxImages = PAST_POSTERS.length;

      // 动态变速轮播：前慢，中快，后停
      const playSequence = () => {
        if (count < maxImages) {
          setPosterIndex(count);
          // 随着播放张数增加，间隔越来越短（加速），最后一张停留
          const delay = Math.max(50, 380 - count * 13);
          count++;
          setTimeout(playSequence, delay);
        } else {
          // 播放完毕，显示主海报
          setPosterIndex('current');
          // 停留 2.5 秒后进入主界面
          setTimeout(() => setView('main'), 4200);
        }
      };
      playSequence();
    }
  }, [view]);

  // --- 交互逻辑 ---

  const getUsedVotes = () => Object.values(votes).reduce((a, b) => a + b, 0);
  const totalVotesAllowed = config.totalVotes || DEFAULT_TOTAL_VOTES;
  const remainingVotes = totalVotesAllowed - getUsedVotes();

  const handleVote = (singerId, e) => {
    if (!config.votingEnabled) {
      triggerToast("后台还没开启投票，请等主持人提示～");
      return;
    }

    if (remainingVotes <= 0) {
      triggerToast("票数已用完！可以先减掉别的歌手再分配～");
      return;
    }

    if (navigator.vibrate) navigator.vibrate(15);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticle = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() * 20 - 10),
      y: y - 20,
      type: Math.random() > 0.5 ? 'fire' : 'text'
    };
    setParticles(prev => [...prev, newParticle]);

    setVotes(prev => ({
      ...prev,
      [singerId]: (prev[singerId] || 0) + 1
    }));
  };

  const handleDecreaseVote = (singerId) => {
    if (!config.votingEnabled) {
      triggerToast("投票未开启，无法调整～");
      return;
    }
    if (!votes[singerId] || votes[singerId] <= 0) return;
    if (navigator.vibrate) navigator.vibrate(10);
    setVotes(prev => ({
      ...prev,
      [singerId]: prev[singerId] - 1
    }));
  };

  const handleSelectSong = (songId) => {
    if (!config.votingEnabled) {
      triggerToast("投票未开启，无法选择年度歌曲～");
      return;
    }
    if (navigator.vibrate) navigator.vibrate(10);
    if (bestSongId === songId) {
      setBestSongId(null);
    } else {
      setBestSongId(songId);
    }
  };

  const cleanParticle = (id) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSubmit = async () => {
    if (!config.votingEnabled) {
      triggerToast("投票未开启");
      return;
    }
    if (remainingVotes !== 0 || !bestSongId) {
      triggerToast("请分配完全部票数，并选择一首年度歌曲");
      return;
    }
    if (!deviceId) {
      triggerToast("设备标识初始化失败，请刷新页面重试");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api25/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          singerVotes: votes,
          bestSongId,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        if (data.code === 'VOTING_CLOSED') {
          triggerToast("投票未开启");
        } else {
          triggerToast(data.message || "提交失败，请稍后再试");
        }
        return;
      }
      triggerToast("投票提交成功！感谢参与！");
      // 这里可以视情况禁用再提交（比如设置一个已提交标记）
    } catch (err) {
      console.error(err);
      triggerToast("网络出错，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  // --- 渲染部分 ---

  return (
    <>
      <style>{customStyles}</style>

      {view === 'loading' && (
        <div className="h-screen w-screen bg-black flex items-center justify-center text-white">
          <div className="animate-pulse">Loading...</div>
        </div>
      )}

      {/* 1. 开场动画视图 */}
      {view === 'intro' && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden z-50">
          <div className="relative w-full max-w-md mx-auto bg-gray-900 min-h-screen">


            {/* 图片容器 */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              {posterIndex !== 'current' ? (
                <img
                  key={posterIndex}
                  src={PAST_POSTERS[posterIndex]?.src}
                  alt="Past Poster"
                  className="w-full h-auto max-h-[80vh] object-cover shadow-2xl rounded-lg animate-fade-in"
                />
              ) : (
                <img
                  src={MAIN_POSTER.src}
                  alt="Main Poster"
                  className="w-full h-auto max-h-[80vh] object-cover shadow-2xl rounded-lg animate-fade-in"
                />
              )}
            </div>

            {/* 只有在最后一张主海报时才显示的文字 */}
            {posterIndex === 'current' && (
              <div className="absolute bottom-8 left-0 right-0 text-center p-6 animate-slide-up bg-gradient-to-t from-black via-black/80 to-transparent">
                <h1 className="text-4xl font-black italic tracking-tighter text-white neon-text mb-2">
                  {MAIN_POSTER.title}
                </h1>
                <p className="text-pink-400 font-bold tracking-widest uppercase">
                  {MAIN_POSTER.subtitle}
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="animate-bounce text-gray-400 text-sm flex items-center gap-1">
                    Loading Party <span className="animate-pulse">...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. 主投票界面 */}
      {view === 'main' && (
        <div className="min-h-screen w-screen bg-[#0f0f13] flex justify-center items-center">
          <div className="relative w-full min-h-screen bg-[#0f0f13] pb-32 max-w-md mx-auto shadow-2xl font-sans text-white">

            {/* 顶部 Sticky Header: 票数统计 */}

            <div className="sticky top-0 z-40
bg-[#0f0f13]/90 backdrop-blur-2xl
border-b border-white/10 
p-4 
transition-all">

              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={logo}
                    alt="logo"
                    className="h-14 w-auto object-contain "
                  />
                  <span className="pl-2 italic font-bold text-s text-gray-300">2025 年度派对</span>
                </div>
                <div className={`flex flex-col items-end ${remainingVotes === 0 ? 'text-gray-500' : 'text-yellow-400'}`}>
                  <span className="text-xs uppercase tracking-wider font-bold">剩余票数</span>
                  <span className="text-xl font-black font-mono leading-none">{remainingVotes} x 🎫</span>
                </div>
              </div>
              {/* 进度条 */}
              <div className="w-full backdrop-blur-2xl bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 progress-bar-fill"
                  style={{ width: `${(getUsedVotes() / totalVotesAllowed) * 100}%` }}
                ></div>
              </div>

              {configError && (
                <div className="mt-2 text-xs text-yellow-400">
                  {configError}
                </div>
              )}
              {!config.votingEnabled && (
                <div className="mt-2 text-xs text-orange-400">
                  后台暂未开启投票，请等待主持人提示。
                </div>
              )}

            </div>

            {/* 歌手列表区域 */}
            <div className="p-4 space-y-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-2">
                <Mic2 size={16} />
                <span>最佳歌手投票 (点击分配票数)</span>
              </div>

              {SINGERS.map(singer => {
                const voteCount = votes[singer.id] || 0;
                const isMax = remainingVotes === 0;

                return (
                  <div key={singer.id} className="bg-[#1a1a20] rounded-2xl p-4 border border-white/5 relative overflow-hidden group">
                    {/* 歌手基本信息 */}
                    <div className="flex gap-4 items-start">
                      {/* 方形头像 */}
                      <div className="relative">
                        <img
                          src={singer.img}
                          alt={singer.name}
                          className="w-20 h-20 rounded-xl object-cover shadow-lg"
                        />
                        {/* 风格标签 */}
                        <div className={`absolute -bottom-2 -right-2 px-2 py-0.5 text-[10px] font-bold rounded bg-gradient-to-r ${singer.color} text-white shadow-sm`}>
                          {singer.style}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white truncate">{singer.name}</h3>

                        {/* 投票控制区 */}
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            onClick={() => handleDecreaseVote(singer.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/20 transition-all ${voteCount > 0 ? 'bg-white/10 text-white active:scale-90' : 'text-gray-600 cursor-not-allowed'}`}
                            disabled={voteCount <= 0}
                          >
                            -
                          </button>

                          <div className="flex-1 text-center font-mono text-2xl font-bold text-white relative h-8 flex items-center justify-center">
                            <span className={voteCount > 0 ? "text-white" : "text-gray-600"}>{voteCount}</span>
                          </div>

                          <button
                            onClick={(e) => handleVote(singer.id, e)}
                            className={`w-12 h-10 rounded-lg flex items-center justify-center transition-all relative overflow-hidden ${isMax || !config.votingEnabled
                              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                              : `bg-gradient-to-r ${singer.color} text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] active:scale-95 active:brightness-110`
                              }`}
                            disabled={isMax || !config.votingEnabled}
                          >

                            <div className="relative z-10 flex items-center gap-1">
                              <Flame size={16} fill={isMax || !config.votingEnabled ? "none" : "currentColor"} />
                              <span className="text-sm font-bold">+1</span>
                            </div>

                            {/* 粒子容器 */}
                            <FireParticles particles={particles} onComplete={cleanParticle} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 歌曲选择区 (最佳歌曲) */}
                    <div className="mt-5 pt-4 border-t border-white/5">

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Trophy size={12} className="text-yellow-500" /> 全场最佳歌曲 (仅选1首)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {singer.songs.map(song => {
                          const isSelected = bestSongId === song.id;
                          return (
                            <button
                              key={song.id}
                              onClick={() => handleSelectSong(song.id)}
                              className={`relative w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 border ${isSelected
                                ? 'active-song-gradient text-white border-transparent shadow-lg transform scale-[1.02]'
                                : 'bg-[#25252e] text-gray-400 border-transparent hover:bg-[#2d2d38]'
                                }`}
                            >
                              <div className="flex items-center justify-between relative z-10">
                                <span>{song.title}</span>
                                {isSelected && <Zap size={16} className="text-yellow-300 fill-current" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 底部固定状态栏 */}
            <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-gradient-to-t from-[#0f0f13] via-[#0f0f13] to-transparent pt-10 pb-6 px-6 pointer-events-none">
              <div className="pointer-events-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between">
                <div className="text-sm">
                  <div className="text-gray-400">当前状态</div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {remainingVotes === 0 && bestSongId ? (
                      <span className="text-green-400 flex items-center gap-1">已完成分配 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div></span>
                    ) : (
                      <span className="text-orange-400">进行中...</span>
                    )}
                  </div>
                </div>

                <button
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${(remainingVotes === 0 && bestSongId && config.votingEnabled)
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-gray-800 text-gray-500'
                    }`}
                  onClick={handleSubmit}
                  disabled={submitting || !config.votingEnabled}
                >
                  {submitting ? "提交中..." : "提交"}
                </button>

              </div>
            </div>

            {/* Toast 提示 */}
            {showToast && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white px-6 py-3 rounded-full shadow-2xl border border-white/10 z-50 flex items-center gap-2 animate-bounce">
                <span>{toastMsg}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}