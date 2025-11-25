const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const { TOTAL_VOTES, ADMIN_TOKEN, SINGERS, SONGS } = require("./constants");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// -------------------- 工具函数 --------------------
function now() {
    return new Date().toISOString();
}

// -------------------- /api/config --------------------
app.get("/api25/config", (req, res) => {
    db.get("SELECT voting_enabled FROM settings WHERE id = 1", (err, row) => {
        res.json({
            votingEnabled: row.voting_enabled === 1,
            totalVotesPerDevice: TOTAL_VOTES
        });
    });
});

// -------------------- /api/vote（用户提交投票） --------------------
app.post("/api25/vote", (req, res) => {
    const { deviceId, singerVotes, bestSongId } = req.body;

    if (!deviceId || !singerVotes) {
        return res.status(400).json({
            success: false,
            message: "参数不完整"
        });
    }

    // 检查是否在投票期
    db.get("SELECT voting_enabled FROM settings WHERE id = 1", (err, row) => {
        if (row.voting_enabled !== 1) {
            return res.status(403).json({
                success: false,
                code: "VOTING_CLOSED",
                message: "投票未开启"
            });
        }

        // 校验票数
        const totalUsed = Object.values(singerVotes).reduce((a, b) => a + b, 0);
        if (totalUsed > TOTAL_VOTES) {
            return res.status(400).json({
                success: false,
                message: `票数不能超过 ${TOTAL_VOTES}`
            });
        }

        // 校验最佳歌曲
        const validSong = SONGS.some(s => s.id === bestSongId);
        if (!validSong && bestSongId !== null) {
            return res.status(400).json({
                success: false,
                message: "最佳歌曲不合法"
            });
        }

        // 写入数据库（覆盖模式）
        const sql = `
            INSERT INTO device_votes (device_id, singer_votes, best_song_id, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(device_id)
            DO UPDATE SET
                singer_votes = excluded.singer_votes,
                best_song_id = excluded.best_song_id,
                updated_at = excluded.updated_at
        `;

        db.run(sql, [
            deviceId,
            JSON.stringify(singerVotes),
            bestSongId,
            now()
        ], () => {
            return res.json({
                success: true,
                message: "投票成功，感谢参与！"
            });
        });
    });
});

// -------------------- 管理端 - 校验 --------------------
function adminCheck(req, res, next) {
    const token = req.query.token || req.body.token;
    if (token !== ADMIN_TOKEN) {
        return res.status(401).json({ success: false, message: "未授权" });
    }
    next();
}

// -------------------- /api/admin/summary --------------------
app.get("/api25/admin/summary", adminCheck, (req, res) => {
    db.get("SELECT voting_enabled FROM settings WHERE id = 1", (err, settings) => {
        db.all("SELECT * FROM device_votes", (err, rows) => {

            // 汇总歌手票数
            const singerTotals = {};
            SINGERS.forEach(s => singerTotals[s.id] = 0);

            // 汇总年度歌曲票数
            const songTotals = {};
            SONGS.forEach(s => songTotals[s.id] = 0);

            rows.forEach(r => {
                const votes = JSON.parse(r.singer_votes || "{}");
                Object.keys(votes).forEach(sid => {
                    singerTotals[sid] += votes[sid];
                });

                if (r.best_song_id) {
                    songTotals[r.best_song_id] += 1;
                }
            });

            res.json({
                success: true,
                data: {
                    votingEnabled: settings.voting_enabled === 1,
                    singers: SINGERS.map(s => ({
                        id: s.id,
                        name: s.name,
                        votes: singerTotals[s.id]
                    })),
                    songs: SONGS.map(s => ({
                        id: s.id,
                        title: s.title,
                        votes: songTotals[s.id]
                    })),
                    totalDevices: rows.length
                }
            });
        });
    });
});

// -------------------- /api/admin/toggle-voting --------------------
app.post("/api25/admin/toggle-voting", adminCheck, (req, res) => {
    const enabled = req.body.enabled ? 1 : 0;

    db.run(`
        UPDATE settings
        SET voting_enabled = ?, updated_at = ?
        WHERE id = 1
    `, [enabled, now()], () => {
        res.json({
            success: true,
            data: {
                votingEnabled: enabled === 1
            }
        });
    });
});

// -------------------- /api/admin/reset-votes --------------------
app.post("/api25/admin/reset-votes", adminCheck, (req, res) => {
    db.run("DELETE FROM device_votes", () => {
        res.json({
            success: true,
            message: "所有投票已清空"
        });
    });
});

// -------------------- 启动服务器 --------------------
app.listen(4000, () => {
    console.log("vote-backend running at http://localhost:4000");
});
