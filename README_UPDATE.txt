在 README.md 的 "🚀 快速开始" 部分之前添加：

## ⚡ 一键自动部署

### 最简单的方式（推荐）

```bash
git clone https://github.com/phaip88/cursor.git
cd cursor
./setup-auto-deploy.sh
```

自动化脚本会完成所有配置，包括：
- ✅ Cloudflare 登录
- ✅ KV 命名空间创建
- ✅ 配置文件更新
- ✅ 密码设置
- ✅ 自动部署

### GitHub Actions 自动部署

配置 GitHub Secrets 后，每次推送代码自动部署：

1. 添加 Secrets（Settings → Secrets → Actions）：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. 推送代码即自动部署：
   ```bash
   git push origin main
   ```

详细配置请查看：[自动部署指南](./CLOUDFLARE_DEPLOY.md) | [快速开始](./QUICK_START.md)

---
