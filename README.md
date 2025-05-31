# LeetCode 刷题助手

一个现代化的 LeetCode 刷题管理系统，帮助你更好地追踪和管理刷题进度。

## 🚀 快速开始

### Docker 部署（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd "leetcode-helper"

# 一键启动
docker-compose up -d

# 访问应用
# 前端：http://localhost
# 后端：http://localhost:5001
```

详细的 Docker 部署说明请参考 [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md)。

## 本地开发

### 环境准备

- 安装 [Node.js](https://nodejs.org/en) (推荐 18+)
- 安装 [MySQL](https://dev.mysql.com/downloads/mysql/) 8.0+

### 操作步骤

1. 安装依赖

```sh
npm install
```

2. 配置环境变量

```sh
cp .env.example .env
# 编辑 .env 文件，配置数据库连接信息
```

3. 启动后端服务

```sh
node server/server.js
```

4. 启动前端开发服务器

```sh
npm run dev
```

5. 在浏览器访问 http://localhost:5173

