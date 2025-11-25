扫码进入投票页

每个设备 10 票 + 1 个年度歌曲选择

管理后台能开关投票、清空数据、查看结果

前端带动画、票数反馈、本地缓存

部署在 AWS Lightsail

Caddy 反代 + Node 后端 + Vite 前端 (自动 https)



前端 投票/管理

Vite + React + Tailwind

<img width="697" height="1319" alt="image" src="https://github.com/user-attachments/assets/e7edc821-639d-4aa5-9731-c6f927595a93" />
<img width="806" height="1409" alt="image" src="https://github.com/user-attachments/assets/a22d270f-b5f8-4f3d-a73a-f63b5bbadf66" />



后端

Node.js + Express + SQLite：

投票时间开关 / 每设备投票记录 / 票数统计 / 投票清空



部署环境

Ubuntu 22
Node 20+
PM2
Caddy（自动 SSL）




API 文档


1. 获取当前配置
GET /api/config

返回内容：
{
  "success": true,
  "votingEnabled": true
}


2. 提交投票
POST /api/vote
Body：
{
  "deviceId": "xxxxx",
  "singerVotes": { "1": 2, "3": 3, "6": 5 },
  "bestSongId": 302
}

返回（正常）：
{ "success": true }

返回（未开启投票）：
{
  "success": false,
  "code": "VOTING_CLOSED",
  "message": "投票未开放"
}


3. Admin：获取投票汇总
GET /api/admin/summary?token=xxx

返回示例：
{
  "success": true,
  "data": {
    "votingEnabled": true,
    "totalDevices": 123,
    "singers": [
      { "id": 1, "name": "A", "votes": 88 },
      { "id": 2, "name": "B", "votes": 66 }
    ],
    "songs": [
      { "id": 101, "title": "Song A", "votes": 44 }
    ]
  }
}


4. Admin：切换投票开关
POST /api/admin/toggle-voting
Body：
{ "token": "SUPER_ADMIN_12345", "enabled": true }


5. Admin：清空所有票数
POST /api/admin/reset-votes
Body：
{ "token": "SUPER_ADMIN_12345" }
