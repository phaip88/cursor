# ⚡ 快速开始 - 一键自动部署

## 🎯 三种部署方式

### 方式 1️⃣: 自动化脚本（最简单）⭐

```bash
# 克隆项目
git clone https://github.com/phaip88/cursor.git
cd cursor

# 运行自动配置脚本
./setup-auto-deploy.sh
```

脚本会自动：
- ✅ 登录 Cloudflare
- ✅ 创建 KV 命名空间
- ✅ 更新配置文件
- ✅ 设置管理员密码
- ✅ 部署到 Cloudflare

---

### 方式 2️⃣: GitHub Actions 自动部署

#### 第一步：配置 GitHub Secrets

1. 打开仓库：https://github.com/phaip88/cursor
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 添加两个 Secret：

   ```
   CLOUDFLARE_API_TOKEN     → 您的 Cloudflare API Token
   CLOUDFLARE_ACCOUNT_ID    → 您的 Cloudflare Account ID
   ```

#### 第二步：获取 Cloudflare 凭证

**获取 API Token:**
1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. 复制生成的 Token

**获取 Account ID:**
1. 访问：https://dash.cloudflare.com
2. 右侧栏查看 **Account ID**
3. 点击复制

#### 第三步：创建 KV 命名空间

```bash
npm install
npx wrangler login
npx wrangler kv:namespace create "CONFIG_KV"
npx wrangler kv:namespace create "CONFIG_KV" --preview
```

将返回的 ID 更新到 `wrangler.toml`

#### 第四步：推送代码自动部署

```bash
git add .
git commit -m "配置自动部署"
git push origin main
```

✅ 完成！每次推送都会自动部署到 Cloudflare

---

### 方式 3️⃣: 手动部署

```bash
# 安装依赖
npm install

# 登录 Cloudflare
npx wrangler login

# 创建 KV
npx wrangler kv:namespace create "CONFIG_KV"
npx wrangler kv:namespace create "CONFIG_KV" --preview

# 更新 wrangler.toml 中的 KV ID

# 部署
npm run deploy

# 设置密码
npx wrangler secret put ADMIN_PASSWORD
```

---

## 📋 部署后配置

### 1. 访问应用

部署成功后，访问分配的 URL：
```
https://email-sender.YOUR_SUBDOMAIN.workers.dev
```

### 2. 首次登录

- 默认密码：`admin123`
- 建议立即修改

### 3. 配置 Resend

1. 进入 **设置** 页面
2. 填写：
   - Resend API Key（从 https://resend.com/api-keys 获取）
   - Resend 发件邮箱（已验证的域名邮箱）
3. 保存设置

### 4. 开始发送邮件

进入 **发送邮件** 页面，填写：
- 收件人
- 主题
- 内容
- （可选）邮箱前缀
- （可选）附件

---

## 🔄 自动部署触发条件

配置 GitHub Actions 后，以下操作会自动部署：

| 操作 | 触发部署 |
|------|----------|
| 推送到 main 分支 | ✅ 是 |
| 创建 Pull Request | ✅ 是（预览） |
| 手动触发 | ✅ 是 |
| 推送到其他分支 | ❌ 否 |

---

## 🛠️ 常用命令

```bash
# 查看部署状态
npx wrangler deployments list

# 查看实时日志
npx wrangler tail

# 本地开发
npm run dev

# 手动部署
npm run deploy

# 设置环境变量
npx wrangler secret put ADMIN_PASSWORD

# 查看 KV 数据
npx wrangler kv:key list --binding=CONFIG_KV
npx wrangler kv:key get --binding=CONFIG_KV "RESEND_API_KEY"
```

---

## 🎯 自动部署流程图

```
┌─────────────────┐
│  推送代码到 GitHub │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│   自动触发      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  安装依赖       │
│  npm ci         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  部署到 CF      │
│  wrangler       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ✅ 部署成功    │
│  自动上线       │
└─────────────────┘
```

---

## 📊 部署状态查看

### GitHub Actions 界面

1. 仓库 → **Actions** 标签
2. 查看运行历史
3. 点击查看详细日志

### Cloudflare Dashboard

1. 访问：https://dash.cloudflare.com
2. **Workers & Pages**
3. 选择项目查看分析数据

---

## ⚡ 快速故障排查

### 问题：GitHub Actions 失败

**检查项：**
- ✅ Secrets 是否正确配置
- ✅ API Token 是否有效
- ✅ Account ID 是否正确
- ✅ KV 命名空间是否创建

### 问题：部署成功但无法访问

**检查项：**
- ✅ 等待 DNS 生效（1-5 分钟）
- ✅ 查看部署日志
- ✅ 检查 Worker 路由

### 问题：邮件发送失败

**检查项：**
- ✅ Resend API Key 是否配置
- ✅ 域名是否在 Resend 验证
- ✅ 发件邮箱是否正确

---

## 🔗 相关链接

- 📖 [完整文档](./README.md)
- �� [部署指南](./DEPLOYMENT.md)
- 📘 [使用手册](./USAGE.md)
- ☁️ [自动部署详解](./CLOUDFLARE_DEPLOY.md)

---

## 💡 提示

- 🔐 部署后立即修改默认密码
- 📊 定期查看 Cloudflare Analytics
- 🔄 使用 GitHub Actions 实现 CI/CD
- 🌐 配置自定义域名提升专业度

---

**🚀 现在就开始部署吧！**

选择上述任一方式，几分钟内即可上线！
