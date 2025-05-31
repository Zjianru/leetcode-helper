# LeetCode 刷题助手

一个现代化的 LeetCode 刷题管理系统，帮助你更好地追踪和管理刷题进度。

## ✨ 功能特性

- 📊 **刷题记录管理** - 记录每日刷题进度和解题思路
- 🎯 **目标设定** - 设置每日/每周刷题目标
- 📈 **数据统计** - 可视化展示刷题趋势和进度
- 🏷️ **分类管理** - 按算法类型、难度等维度分类
- 📝 **错题本** - 记录和复习做错的题目
- 🌙 **夜间模式** - 支持明暗主题切换
- 📱 **响应式设计** - 完美适配桌面和移动端

## 🛠️ 技术栈

**前端：**
- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS 样式框架
- Framer Motion 动画库
- Recharts 图表库

**后端：**
- Node.js + Express
- MySQL 8.0 数据库
- Sequelize ORM

**部署：**
- Docker + Docker Compose
- Nginx 反向代理

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

## 📝 注意事项

- 首次启动时会自动创建数据库表结构
- 确保 MySQL 服务正在运行（本地开发）
- Docker 部署时会自动处理数据库初始化
- 建议使用 Chrome 或 Firefox 浏览器以获得最佳体验

## 🔧 故障排除

**Docker 启动失败：**
- 检查 Docker 服务是否正在运行
- 确保端口 80、5001、3306 未被占用
- 查看日志：`docker-compose logs`

**数据库连接失败：**
- 检查 `.env` 文件中的数据库配置
- 确保 MySQL 服务正常运行
- 验证数据库用户权限

**前端页面无法访问：**
- 检查前端服务是否正常启动
- 确认端口配置是否正确
- 清除浏览器缓存后重试

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](../../issues)
- 发送邮件至项目维护者

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

