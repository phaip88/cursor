# 🚀 部署方式完整指南

## ⚠️ 重要提醒

**本项目是 Cloudflare Workers 项目，不是 Pages 项目！**

请选择以下三种方式之一进行部署：

---

## 📋 三种部署方式对比

| 方式 | 难度 | 速度 | 适用场景 | 推荐度 |
|------|------|------|----------|--------|
| 自动化脚本 | ⭐ 简单 | ⚡ 最快 | 个人项目 | ⭐⭐⭐⭐⭐ |
| GitHub Actions | ⭐⭐ 中等 | ⚡⚡ 快 | 团队协作 | ⭐⭐⭐⭐⭐ |
| 手动部署 | ⭐⭐⭐ 复杂 | ⚡⚡⚡ 慢 | 调试开发 | ⭐⭐⭐ |

---

## 方式 1️⃣: 自动化脚本（推荐新手）

### 特点
- ✅ 一键完成所有配置
- ✅ 交互式引导
- ✅ 自动检测环境
- ✅ 5 分钟内完成

### 步骤

```bash
# 1. 克隆项目
git clone https://github.com/phaip88/cursor.git
cd cursor

# 2. 运行脚本
./setup-auto-deploy.sh
```

### 脚本会做什么？

1. ✅ 检查并安装 Wrangler CLI
2. ✅ 登录 Cloudflare（打开浏览器授权）
3. ✅ 创建 KV 命名空间（生产 + 预览）
4. ✅ 自动更新 wrangler.toml 配置
5. ✅ 设置管理员密码
6. ✅ 可选：立即部署

### 完成后

访问显示的 URL，开始使用！

---

## 方式 2️⃣: GitHub Actions 自动部署（推荐团队）

### 特点
- ✅ 推送代码自动部署
- ✅ CI/CD 流程
- ✅ 可查看部署日志
- ✅ 支持多环境

### 配置步骤

#### 步骤 1: 获取 Cloudflare 凭证

**API Token:**
1. 访问: https://dash.cloudflare.com/profile/api-tokens
2. Create Token → 选择 "Edit Cloudflare Workers"
3. 复制 Token

**Account ID:**
1. 访问: https://dash.cloudflare.com
2. 右侧栏复制 Account ID

#### 步骤 2: 配置 GitHub Secrets

1. 打开: https://github.com/phaip88/cursor/settings/secrets/actions
2. New repository secret
3. 添加：
   ```
   Name: CLOUDFLARE_API_TOKEN
   Value: [您的 API Token]
   
   Name: CLOUDFLARE_ACCOUNT_ID
   Value: [您的 Account ID]
   ```

#### 步骤 3: 创建 KV 命名空间

```bash
npm install
npx wrangler login
npx wrangler kv:namespace create "CONFIG_KV"
npx wrangler kv:namespace create "CONFIG_KV" --preview
```

复制输出的 ID，更新到 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "CONFIG_KV"
id = "你的生产环境ID"
preview_id = "你的预览环境ID"
```

#### 步骤 4: 推送代码触发部署

```bash
git add wrangler.toml
git commit -m "配置 KV"
git push origin main
```

✅ 自动部署开始！

#### 步骤 5: 查看部署状态

1. GitHub 仓库 → Actions 标签
2. 查看运行中的工作流
3. 部署成功后获取 URL

---

## 方式 3️⃣: 手动部署（适合开发调试）

### 完整步骤

```bash
# 1. 克隆项目
git clone https://github.com/phaip88/cursor.git
cd cursor

# 2. 安装依赖
npm install

# 3. 登录 Cloudflare
npx wrangler login

# 4. 创建 KV 命名空间
npx wrangler kv:namespace create "CONFIG_KV"
# 复制输出: { binding = "CONFIG_KV", id = "abc123..." }

npx wrangler kv:namespace create "CONFIG_KV" --preview
# 复制输出: { binding = "CONFIG_KV", preview_id = "xyz789..." }

# 5. 更新 wrangler.toml
# 手动编辑文件，替换 KV ID

# 6. 部署
npm run deploy

# 7. 设置管理员密码
npx wrangler secret put ADMIN_PASSWORD
# 输入密码（默认: admin123）

# 8. 完成！
# 访问显示的 URL
```

---

## 🔍 部署后验证

### 检查清单

- [ ] 能访问部署的 URL
- [ ] 登录页面正常显示
- [ ] 使用密码能成功登录
- [ ] 能进入设置页面
- [ ] 能保存 Resend 配置

### 测试发送邮件

1. 在设置页面配置 Resend API Key
2. 进入发送邮件页面
3. 填写测试邮件信息
4. 发送到自己的邮箱
5. 检查是否收到

---

## 🐛 常见问题

### Q1: "Missing script: build" 错误

**原因**: 在 Cloudflare Pages 部署（错误方式）

**解决**: 
- ❌ 不要使用 Cloudflare Pages
- ✅ 使用上述三种方式之一
- ✅ 本项目是 Workers 项目，不需要 build

### Q2: "KV namespace not found"

**原因**: KV 未创建或 ID 配置错误

**解决**:
```bash
# 列出所有 KV
npx wrangler kv:namespace list

# 重新创建
npx wrangler kv:namespace create "CONFIG_KV"
```

### Q3: GitHub Actions 部署失败

**检查**:
- [ ] API Token 是否正确
- [ ] Account ID 是否正确
- [ ] KV ID 是否已更新
- [ ] Token 权限是否足够

### Q4: 部署成功但无法访问

**等待**: DNS 传播需要 1-5 分钟

**检查**:
```bash
# 查看部署状态
npx wrangler deployments list

# 查看实时日志
npx wrangler tail
```

---

## 📊 部署时间对比

| 方式 | 首次部署 | 后续部署 |
|------|----------|----------|
| 自动化脚本 | ~5 分钟 | ~2 分钟 |
| GitHub Actions | ~10 分钟（配置） | ~1 分钟（自动） |
| 手动部署 | ~15 分钟 | ~3 分钟 |

---

## 🎯 选择建议

### 如果您是...

**个人开发者**: 使用自动化脚本
```bash
./setup-auto-deploy.sh
```

**团队协作**: 使用 GitHub Actions
- 一次配置，永久自动化
- 所有人都能看到部署状态

**学习调试**: 使用手动部署
- 了解每个步骤
- 完全掌控流程

---

## 🔗 详细文档

- 📖 [快速开始](./QUICK_START.md)
- ☁️ [Cloudflare 自动部署](./CLOUDFLARE_DEPLOY.md)
- 📚 [GitHub Actions 指南](./.github/AUTO_DEPLOY_GUIDE.md)
- 🚫 [Pages 部署说明](./CLOUDFLARE_PAGES_NOTE.md)

---

## ✅ 部署成功后

1. **配置系统**
   - 访问部署的 URL
   - 使用密码登录
   - 配置 Resend API Key

2. **测试功能**
   - 发送测试邮件
   - 尝试随机前缀
   - 上传附件测试

3. **安全加固**
   - 修改默认密码
   - 定期更换 API Key

---

**🚀 选择一种方式，立即开始部署吧！**
