# ⚠️ 重要说明：本项目应部署为 Cloudflare Workers

## 🚫 不要使用 Cloudflare Pages

本项目是 **Cloudflare Workers** 项目，不是 **Cloudflare Pages** 项目。

### 区别说明

| Cloudflare Workers | Cloudflare Pages |
|-------------------|------------------|
| 边缘计算函数 | 静态网站托管 |
| 动态 API 和后端 | 静态 HTML/CSS/JS |
| 使用 `wrangler deploy` | 使用 Git 自动构建 |
| 本项目 ✅ | 不适用 ❌ |

---

## ✅ 正确的部署方式

### 方式 1: 使用 Wrangler CLI（推荐）

```bash
# 克隆项目
git clone https://github.com/phaip88/cursor.git
cd cursor

# 安装依赖
npm install

# 登录 Cloudflare
npx wrangler login

# 创建 KV 命名空间
npx wrangler kv:namespace create "CONFIG_KV"
npx wrangler kv:namespace create "CONFIG_KV" --preview

# 更新 wrangler.toml 中的 KV ID

# 部署
npm run deploy

# 设置密码
npx wrangler secret put ADMIN_PASSWORD
```

### 方式 2: 使用自动化脚本

```bash
./setup-auto-deploy.sh
```

### 方式 3: 使用 GitHub Actions

1. 配置 GitHub Secrets：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. 推送代码自动部署：
   ```bash
   git push origin main
   ```

---

## 🔧 如果您已经在 Cloudflare Pages 创建了项目

### 删除 Pages 项目

1. 登录 Cloudflare Dashboard
2. 进入 **Workers & Pages**
3. 找到您的 Pages 项目
4. 点击 **Settings** → **Delete project**

### 使用 Workers 部署

按照上述"正确的部署方式"操作即可。

---

## 📊 部署到 Workers 的优势

✅ **动态内容** - 支持后端逻辑和 API  
✅ **KV 存储** - 可以存储配置数据  
✅ **环境变量** - 支持 Secrets 管理  
✅ **完整功能** - 本项目的所有功能都能正常工作  

---

## 🆘 遇到问题？

查看以下文档：

- [快速开始](./QUICK_START.md)
- [部署指南](./DEPLOYMENT.md)
- [自动部署指南](./CLOUDFLARE_DEPLOY.md)

或提交 Issue：https://github.com/phaip88/cursor/issues

---

## 💡 关键点

本项目特点：
- ✅ 是一个 **Cloudflare Workers** 项目
- ✅ 使用 `wrangler deploy` 部署
- ✅ 不需要构建步骤（TypeScript 在部署时编译）
- ❌ 不能用 Cloudflare Pages 部署

---

**请使用上述正确的方式部署！**
