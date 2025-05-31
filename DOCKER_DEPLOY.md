# Docker 部署指南

本项目支持使用 Docker 和 Docker Compose 进行一键部署。

## 前置要求

- Docker 20.10+
- Docker Compose 2.0+

## 快速开始

### 1. 构建并启动所有服务

```bash
# 构建镜像
npm run docker:build

# 启动服务（后台运行）
npm run docker:up
```

### 2. 访问应用

- 前端应用：http://localhost
- 后端 API：http://localhost:5001
- MySQL 数据库：localhost:3306

### 3. 查看日志

```bash
# 查看所有服务日志
npm run docker:logs

# 查看特定服务日志
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mysql
```

## 服务架构

项目包含以下 Docker 服务：

### Frontend (前端)
- **镜像**: 基于 nginx:alpine
- **端口**: 80
- **功能**: 提供静态文件服务和 API 代理

### Backend (后端)
- **镜像**: 基于 node:18-alpine
- **端口**: 5001
- **功能**: 提供 REST API 服务

### MySQL (数据库)
- **镜像**: mysql:8.0
- **端口**: 3306
- **数据库**: leetcode_helper
- **用户**: leetcode / leetcode123

## 环境配置

### 数据库配置

默认数据库配置：
- 数据库名：`leetcode_helper`
- 用户名：`leetcode`
- 密码：`leetcode123`
- Root 密码：`123456`

### 自定义配置

**修改数据库配置：**
如需修改配置，请编辑 `docker-compose.yml` 文件中的环境变量。

**自定义数据存储位置：**
如需将数据存储到其他位置，请修改 `docker-compose.yml` 中的 volumes 配置：

```yaml
volumes:
  - /your/custom/path:/var/lib/mysql  # 自定义数据目录
  - ./server/database/init_db.sql:/docker-entrypoint-initdb.d/init.sql
```

**重要提示：**
- 确保自定义目录有适当的读写权限
- 首次启动前该目录应为空，以便正确执行初始化脚本
- 数据目录一旦设定，请勿随意更改，以免数据丢失

## 常用命令

```bash
# 构建镜像
npm run docker:build

# 启动服务
npm run docker:up

# 停止服务
npm run docker:down

# 重启服务
npm run docker:restart

# 查看日志
npm run docker:logs

# 清理所有容器和镜像
npm run docker:clean
```

## 数据持久化

- MySQL 数据存储在项目根目录的 `./data/mysql/` 文件夹中
- 数据在容器重启后会保持，完全由用户控制
- 可以自定义数据存储位置，便于备份和迁移
- 首次启动时会自动执行 `server/database/init_db.sql` 初始化数据库表结构

### 数据目录说明

```
项目根目录/
├── data/
│   └── mysql/          # MySQL 数据文件目录
│       ├── ibdata1     # InnoDB 数据文件
│       ├── ib_logfile* # InnoDB 日志文件
│       └── leetcode_helper/ # 应用数据库目录
└── server/
    └── database/
        └── init_db.sql # 数据库初始化脚本
```

## 健康检查

所有服务都配置了健康检查：

- **Frontend**: HTTP 检查 port 80
- **Backend**: HTTP 检查 `/api/v1/health` 接口
- **MySQL**: mysqladmin ping 检查

## 故障排除

### 1. 端口冲突

如果端口被占用，请修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "8080:80"  # 前端改为 8080
  - "5002:5001" # 后端改为 5002
```

### 2. 数据库连接失败

等待 MySQL 服务完全启动（约 30-60 秒），或查看日志：

```bash
docker-compose logs mysql
```

### 3. 前端无法访问后端

检查 nginx 配置和后端服务状态：

```bash
docker-compose ps
docker-compose logs backend
```

## 生产环境部署

### 1. 安全配置

- 修改默认密码
- 配置 HTTPS
- 设置防火墙规则

### 2. 性能优化

- 调整 MySQL 配置
- 配置 nginx 缓存
- 设置资源限制

### 3. 监控和日志

- 配置日志收集
- 设置监控告警
- 定期备份数据

## 开发模式

如需在开发模式下运行：

```bash
# 只启动数据库
docker-compose up -d mysql

# 本地运行前后端
npm run dev
```