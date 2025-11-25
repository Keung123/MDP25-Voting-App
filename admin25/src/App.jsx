import React, { useState, useEffect } from "react";
import "./App.css";

function AdminApp() {
  const [token, setToken] = useState("");
  const [savedToken, setSavedToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(false);
  const [resetting, setResetting] = useState(false);

  // 初始化时从 localStorage 读取 token
  useEffect(() => {
    const t = localStorage.getItem("vote_admin_token") || "";
    setToken(t);
    setSavedToken(t);
    if (t) {
      fetchSummary(t);
    }
  }, []);

  const handleConnect = () => {
    if (!token) {
      setError("请先输入管理 Token");
      return;
    }
    setError("");
    localStorage.setItem("vote_admin_token", token);
    setSavedToken(token);
    fetchSummary(token);
  };

  const fetchSummary = async (t = savedToken) => {
    if (!t) {
      setError("管理 Token 为空，请先输入并连接");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api25/admin/summary?token=${encodeURIComponent(
        t
      )}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "获取数据失败");
        setSummary(null);
        return;
      }
      setSummary(data.data);
    } catch (err) {
      console.error(err);
      setError("网络错误或服务器不可达");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVoting = async () => {
    if (!summary) return;
    if (!savedToken) {
      setError("管理 Token 为空");
      return;
    }
    try {
      setToggling(true);
      const res = await fetch("/api25/admin/toggle-voting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: savedToken,
          enabled: !summary.votingEnabled,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "切换失败");
        return;
      }
      // 成功后刷新 summary
      fetchSummary();
    } catch (err) {
      console.error(err);
      setError("网络错误，切换失败");
    } finally {
      setToggling(false);
    }
  };

  const handleResetVotes = async () => {
    if (!savedToken) {
      setError("管理 Token 为空");
      return;
    }
    const ok = window.confirm("确定要清空所有投票吗？该操作不可恢复！");
    if (!ok) return;

    try {
      setResetting(true);
      const res = await fetch("/api25/admin/reset-votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: savedToken }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "清空失败");
        return;
      }
      alert("已清空所有投票");
      fetchSummary();
    } catch (err) {
      console.error(err);
      setError("网络错误，清空失败");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="admin-root">
      <div className="admin-card">
        {/* 顶部标题 */}
        <header className="admin-header">
          <div>
            <h1>决赛派对 投票管理后台</h1>
            <p className="subtitle">
              控制投票开关 · 清空投票 · 查看歌手和年度歌曲票数
            </p>
          </div>
        </header>

        {/* Token 区域 */}
        <section className="token-section">
          <label className="token-label">
            管理 Token
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="请输入后台 ADMIN_TOKEN"
            />
          </label>
          <button className="btn primary" onClick={handleConnect}>
            连接后台
          </button>
        </section>

        {/* 错误提示 */}
        {error && <div className="error-box">{error}</div>}

        {/* 状态与操作按钮 */}
        <section className="status-section">
          <div className="status-row">
            <div>
              <div className="status-label">投票状态</div>
              <div className="status-value">
                {summary?.votingEnabled ? "✅ 已开启" : "⛔ 已关闭"}
              </div>
            </div>

            <button
              className={`btn toggle ${
                summary?.votingEnabled ? "danger" : "primary"
              }`}
              onClick={handleToggleVoting}
              disabled={!summary || toggling}
            >
              {toggling
                ? "切换中..."
                : summary?.votingEnabled
                ? "关闭投票"
                : "开启投票"}
            </button>
          </div>

          <div className="status-row">
            <div>
              <div className="status-label">已提交设备数</div>
              <div className="status-value">
                {summary ? summary.totalDevices : "-"}
              </div>
            </div>

            <button
              className="btn danger"
              onClick={handleResetVotes}
              disabled={!summary || resetting}
            >
              {resetting ? "清空中..." : "清空所有投票"}
            </button>
          </div>

          <button
            className="btn secondary full"
            onClick={() => fetchSummary()}
            disabled={!savedToken || loading}
          >
            {loading ? "刷新中..." : "手动刷新数据"}
          </button>
        </section>

        {/* 数据表格 */}
        {summary && (
          <section className="tables-section">
            {/* 歌手票数 */}
            <div className="table-card">
              <div className="table-header">
                <h2>歌手票数</h2>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>歌手</th>
                    <th>票数</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.singers.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.votes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 年度歌曲票数 */}
            <div className="table-card">
              <div className="table-header">
                <h2>年度歌曲票数</h2>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>歌曲</th>
                    <th>票数</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.songs.map((song) => (
                    <tr key={song.id}>
                      <td>{song.title}</td>
                      <td>{song.votes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <footer className="admin-footer">
          <span>仅内部使用 · 请勿公开此页面链接</span>
        </footer>
      </div>
    </div>
  );
}

export default AdminApp;
