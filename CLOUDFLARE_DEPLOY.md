# ☁️ Cloudflare 一键自动部署指南

本指南将帮助您设置 Cloudflare 的自动部署，实现代码推送后自动部署到 Cloudflare Workers。

---

## 🎯 部署方式选择

### 方式 1: GitHub Actions 自动部署 ⭐ 推荐
**优点**: 
- ✅ 完全自动化
- ✅ 推送代码即部署
- ✅ 可查看部署日志
- ✅ 支持多环境部署

### 方式 2: Cloudflare Pages
**优点**:
- ✅ Cloudflare 原生支持
- ✅ 自动 HTTPS
- ✅ 无需配置 GitHub Secrets

---

## 🚀 方式 1: GitHub Actions 自动部署（推荐）

### 第一步：获取 Cloudflare API Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击右上角头像 → **My Profile**
3. 左侧菜单选择 **API Tokens**
4. 点击 **Create Token**
5. 选择 **Edit Cloudflare Workers** 模板
6. 或者使用 **Create Custom Token**，权限设置：
   ```
   Account - Cloudflare Workers Scripts - Edit
   Account - Cloudflare Workers KV Storage - Edit
   ```
7. 点击 **Continue to summary** → **Create Token**
8. 复制生成的 Token（只显示一次，请妥善保存）

### 第二步：获取 Account ID

1. 在 Cloudflare Dashboard 首页
2. 右侧栏查看 **Account ID**
3. 点击复制

### 第三步：配置 GitHub Secrets

1. 打开您的 GitHub 仓库：https://github.com/phaip88/cursor
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下两个 Secret：

   **Secret 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: `您的 Cloudflare API Token`

   **Secret 2:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: `您的 Cloudflare Account ID`

### 第四步：创建 KV 命名空间（首次部署）

在本地运行：

```bash
# 登录 Cloudflare
npx wrangler login

# 创建生产环境 KV
npx wrangler kv:namespace create "CONFIG_KV"

# 创建预览环境 KV
npx wrangler kv:namespace create "CONFIG_KV" --preview
```

将返回的 ID 更新到 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "CONFIG_KV"
id = "替换为生产环境ID"
preview_id = "替换为预览环境ID"
```

提交并推送更改：

```bash
git add wrangler.toml
git commit -m "配置 KV 命名空间"
git push origin main
```

### 第五步：触发自动部署

配置完成后，以下操作会自动触发部署：

1. **推送到 main 分支**
   ```bash
   git push origin main
   ```

2. **手动触发**
   - GitHub 仓库 → **Actions** 标签
   - 选择 "🚀 自动部署到 Cloudflare Workers"
   - 点击 **Run workflow**

### 第六步：查看部署状态

1. GitHub 仓库 → **Actions** 标签
2. 查看最新的 workflow 运行
3. 点击查看详细日志
4. 部署成功后会显示访问地址

### 第七步：设置管理员密码

部署成功后，设置密码：

```bash
npx wrangler secret put ADMIN_PASSWORD
```

---

## 🌐 方式 2: Cloudflare Pages 部署

### 第一步：连接 GitHub 仓库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单选择 **Workers & Pages**
3. 点击 **Create application** → **Pages** → **Connect to Git**
4. 选择您的 GitHub 仓库：`phaip88/cursor`
5. 点击 **Begin setup**

### 第二步：配置构建设置

```
项目名称: email-sender
生产分支: main
构建命令: npm run build
构建输出目录: dist
```

### 第三步：配置环境变量

在 Pages 设置中添加：

| 变量名 | 值 |
|--------|-----|
| `NODE_VERSION` | `18` |
| `ADMIN_PASSWORD` | `你的管理员密码` |

### 第四步：绑定 KV 命名空间

1. Pages 项目设置 → **Functions** → **KV namespace bindings**
2. 添加绑定：
   ```
   Variable name: CONFIG_KV
   KV namespace: [选择你创建的 KV]
   ```

### 第五步：部署

1. 点击 **Save and Deploy**
2. 等待部署完成
3. 访问分配的 `.pages.dev` 域名

---

## 🔄 自动部署工作流程

### GitHub Actions 流程

```
代码推送 → GitHub Actions 触发 → 安装依赖 → 
部署到 Cloudflare → 部署成功 → 自动上线
```

### Cloudflare Pages 流程

```
代码推送 → Cloudflare 检测 → 自动构建 → 
自动部署 → 即时上线
```

---

## 🛠️ 高级配置

### 多环境部署

编辑 `.github/workflows/deploy.yml`：

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy --env staging

  deploy-production:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy --env production
```

在 `wrangler.toml` 中配置环境：

```toml
[env.staging]
name = "email-sender-staging"
vars = { ENVIRONMENT = "staging" }

[env.production]
name = "email-sender"
vars = { ENVIRONMENT = "production" }
```

### 自定义域名

1. Cloudflare Dashboard → **Workers & Pages**
2. 选择您的项目
3. **Custom Domains** → **Add custom domain**
4. 输入域名（如 `mail.yourdomain.com`）
5. Cloudflare 会自动配置 DNS

### 部署前检查

在 GitHub Actions 中添加测试步骤：

```yaml
- name: 运行测试
  run: npm test

- name: 类型检查
  run: npm run type-check

- name: 代码格式检查
  run: npm run lint
```

---

## 📊 部署监控

### GitHub Actions 通知

添加部署通知（可选）：

```yaml
- name: 部署成功通知
  if: success()
  uses: actions/github-script@v6
  with:
    script: |
      github.rest.repos.createCommitComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: context.sha,
        body: '✅ 部署成功！访问: https://email-sender.YOUR_SUBDOMAIN.workers.dev'
      })
```

### Cloudflare 分析

1. Workers & Pages → 选择项目
2. **Analytics** 标签
3. 查看：
   - 请求数量
   - 错误率
   - CPU 使用时间
   - 响应时间

---

## 🐛 故障排查

### 问题 1: GitHub Actions 部署失败

**错误**: `Authentication error`

**解决方案**:
1. 检查 `CLOUDFLARE_API_TOKEN` 是否正确
2. 确认 Token 权限包含 Workers 编辑权限
3. Token 可能已过期，重新生成

### 问题 2: KV 命名空间错误

**错误**: `KV namespace not found`

**解决方案**:
1. 确认已创建 KV 命名空间
2. 检查 `wrangler.toml` 中的 ID 是否正确
3. 运行 `npx wrangler kv:namespace list` 查看所有命名空间

### 问题 3: 部署成功但无法访问

**可能原因**:
1. DNS 未生效（需等待几分钟）
2. Worker 路由配置错误
3. 防火墙或网络问题

**解决方案**:
```bash
# 查看部署状态
npx wrangler deployments list

# 查看实时日志
npx wrangler tail
```

### 问题 4: 环境变量未生效

**解决方案**:
```bash
# 设置 Secret
npx wrangler secret put ADMIN_PASSWORD

# 列出所有 Secret
npx wrangler secret list
```

---

## ✅ 部署检查清单

部署前确认：

- [ ] GitHub Secrets 已配置（API Token 和 Account ID）
- [ ] KV 命名空间已创建并配置
- [ ] `wrangler.toml` 配置正确
- [ ] 代码已推送到 main 分支
- [ ] GitHub Actions 权限已启用

部署后确认：

- [ ] GitHub Actions 运行成功
- [ ] Worker 可以访问
- [ ] 登录功能正常
- [ ] 邮件发送功能正常
- [ ] KV 存储读写正常

---

## 🎯 快速开始命令

### 一键配置（本地）

```bash
# 1. 登录 Cloudflare
npx wrangler login

# 2. 创建 KV
npx wrangler kv:namespace create "CONFIG_KV"
npx wrangler kv:namespace create "CONFIG_KV" --preview

# 3. 更新配置后部署
npm run deploy

# 4. 设置密码
npx wrangler secret put ADMIN_PASSWORD
```

### 查看部署信息

```bash
# 查看部署历史
npx wrangler deployments list

# 查看实时日志
npx wrangler tail

# 查看 KV 数据
npx wrangler kv:key list --binding=CONFIG_KV
```

---

## 📱 移动端部署管理

### 使用 Wrangler CLI（iOS/Android）

1. 安装 [Termux](https://termux.com/)（Android）或 [a-Shell](https://holzschu.github.io/a-Shell_iOS/)（iOS）
2. 安装 Node.js 和 Wrangler
3. 随时随地部署更新

---

## 🔗 相关链接

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions 文档](https://docs.github.com/actions)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)

---

## 💡 最佳实践

1. ✅ 使用 GitHub Actions 实现 CI/CD
2. ✅ 配置多环境（开发/预发布/生产）
3. ✅ 启用部署前自动测试
4. ✅ 设置部署通知
5. ✅ 定期检查部署日志
6. ✅ 使用自定义域名
7. ✅ 启用 Cloudflare Analytics

---

**现在您可以享受一键自动部署的便利了！🚀**

每次推送代码到 GitHub，都会自动部署到 Cloudflare！
