const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "data.db");
const db = new sqlite3.Database(dbPath);

// 初始化表结构
db.serialize(() => {
    // 全局设置表（只有 1 条记录）
    db.run(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY,
            voting_enabled INTEGER DEFAULT 0,
            updated_at TEXT
        )
    `);

    // 如果没有初始化 settings，就插入一条
    db.get("SELECT COUNT(*) as count FROM settings", (err, row) => {
        if (row.count === 0) {
            db.run(`
                INSERT INTO settings (id, voting_enabled, updated_at)
                VALUES (1, 0, datetime('now'))
            `);
        }
    });

    // 用户投票表（每台设备一条）
    db.run(`
        CREATE TABLE IF NOT EXISTS device_votes (
            device_id TEXT PRIMARY KEY,
            singer_votes TEXT,       -- JSON 字符串
            best_song_id INTEGER,
            updated_at TEXT
        )
    `);
});

module.exports = db;
