# 📦 部署指南

本指南将帮助您将邮件发送系统部署到 Cloudflare Workers。

## 前置要求

- Node.js (v16 或更高版本)
- npm 或 yarn
- Cloudflare 账号
- Resend 账号

## 详细部署步骤

### 1️⃣ 安装依赖

```bash
npm install
```

### 2️⃣ 登录 Cloudflare

```bash
npx wrangler login
```

这将打开浏览器进行 Cloudflare 账号授权。

### 3️⃣ 创建 KV 命名空间

```bash
# 创建生产环境 KV
npx wrangler kv:namespace create "CONFIG_KV"

# 创建预览环境 KV
npx wrangler kv:namespace create "CONFIG_KV" --preview
```

命令执行后会返回类似以下内容：

```
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "CONFIG_KV", id = "abc123..." }
```

### 4️⃣ 更新 wrangler.toml

将上一步获取的 ID 更新到 `wrangler.toml` 文件：

```toml
[[kv_namespaces]]
binding = "CONFIG_KV"
id = "你的生产环境KV_ID"
preview_id = "你的预览环境KV_ID"
```

### 5️⃣ 本地测试（可选）

```bash
npm run dev
```

访问 `http://localhost:8787` 测试功能。

### 6️⃣ 部署到 Cloudflare

```bash
npm run deploy
```

部署成功后，会显示您的 Worker URL，例如：
```
✨ Published email-sender (1.23 sec)
   https://email-sender.your-subdomain.workers.dev
```

### 7️⃣ 设置管理员密码（可选但推荐）

```bash
npx wrangler secret put ADMIN_PASSWORD
```

按提示输入您的密码。如果不设置，默认密码为 `admin123`。

### 8️⃣ 配置 Resend

1. 访问部署的 URL
2. 使用管理员密码登录
3. 进入"设置"页面
4. 输入 Resend API Key 和邮箱
5. 保存配置

## 获取 Resend API Key

### 步骤 1: 注册 Resend

访问 [https://resend.com](https://resend.com) 注册账号。

### 步骤 2: 验证域名

1. 登录 Resend 控制台
2. 添加您的域名
3. 按照提示配置 DNS 记录（SPF、DKIM、DMARC）
4. 等待验证通过

### 步骤 3: 创建 API Key

1. 访问 [API Keys 页面](https://resend.com/api-keys)
2. 点击"Create API Key"
3. 选择权限（建议选择"Sending access"）
4. 复制生成的 API Key（格式：`re_xxxxx`）

### 步骤 4: 配置到系统

在系统设置页面填入：
- **Resend API Key**: `re_xxxxx`
- **Resend 发件邮箱**: `noreply@yourdomain.com`（必须是已验证域名的邮箱）

## 自定义域名（可选）

### 方法 1: 通过 Cloudflare Workers Routes

1. 登录 Cloudflare Dashboard
2. 选择您的域名
3. 进入 "Workers Routes"
4. 添加路由：`mail.yourdomain.com/*` → 选择您的 Worker

### 方法 2: 通过 wrangler.toml

在 `wrangler.toml` 中添加：

```toml
routes = [
  { pattern = "mail.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

然后重新部署：

```bash
npm run deploy
```

## 环境变量说明

| 变量名 | 说明 | 设置方式 | 默认值 |
|--------|------|----------|--------|
| `ADMIN_PASSWORD` | 管理员密码 | `wrangler secret put` | `admin123` |

## KV 存储说明

系统在 KV 中存储以下配置：

| Key | 说明 |
|-----|------|
| `RESEND_API_KEY` | Resend API 密钥 |
| `RESEND_EMAIL` | 发件邮箱地址 |
| `ADMIN_PASSWORD` | 管理员密码（可选） |

## 故障排查

### 问题 1: 部署失败

**错误**: `Error: No account ID found`

**解决方案**: 
```bash
npx wrangler login
```

### 问题 2: KV 命名空间错误

**错误**: `Error: KV namespace CONFIG_KV not found`

**解决方案**: 
检查 `wrangler.toml` 中的 KV ID 是否正确配置。

### 问题 3: 邮件发送失败

**可能原因**:
1. API Key 未配置或无效
2. 域名未验证
3. 发件邮箱不是已验证域名的邮箱

**解决方案**:
1. 检查 Resend 控制台确认域名验证状态
2. 重新生成 API Key
3. 确保发件邮箱使用已验证的域名

### 问题 4: 无法登录

**解决方案**: 
重置管理员密码：
```bash
npx wrangler secret put ADMIN_PASSWORD
```

## 更新部署

修改代码后，重新部署：

```bash
git pull
npm install
npm run deploy
```

## 回滚版本

查看部署历史：
```bash
npx wrangler deployments list
```

回滚到指定版本：
```bash
npx wrangler rollback [deployment-id]
```

## 监控和日志

### 实时日志

```bash
npx wrangler tail
```

### Cloudflare Dashboard

访问 Cloudflare Dashboard 查看：
- 请求数量
- 错误率
- CPU 使用时间
- 请求延迟

## 成本说明

### Cloudflare Workers

- **免费额度**: 每天 100,000 次请求
- **付费计划**: $5/月，包含 10,000,000 次请求

### Cloudflare KV

- **免费额度**: 
  - 100,000 次读取/天
  - 1,000 次写入/天
  - 1GB 存储
- **付费**: 超出部分按使用量计费

### Resend

- **免费额度**: 100 封邮件/天
- **付费计划**: 从 $20/月起（10,000 封邮件）

## 安全建议

1. ✅ 立即修改默认密码
2. ✅ 使用强密码（至少 16 位，包含大小写字母、数字、特殊字符）
3. ✅ 定期更换 API Key
4. ✅ 启用 Cloudflare 的安全功能（WAF、DDoS 防护）
5. ✅ 限制访问 IP（如果只有固定 IP 使用）
6. ✅ 定期检查日志，监控异常请求

## 性能优化

1. 使用 Cloudflare 的 CDN 缓存静态资源
2. 启用 HTTP/2
3. 压缩响应内容
4. 优化附件大小

## 备份

定期备份 KV 数据：

```bash
# 导出 KV 数据
npx wrangler kv:key list --binding=CONFIG_KV
npx wrangler kv:key get --binding=CONFIG_KV "RESEND_API_KEY"
npx wrangler kv:key get --binding=CONFIG_KV "RESEND_EMAIL"
```

## 技术支持

- 📧 提交 Issue: [GitHub Issues](https://github.com/phaip88/cursor/issues)
- 📚 Cloudflare 文档: [https://developers.cloudflare.com/workers/](https://developers.cloudflare.com/workers/)
- 📚 Resend 文档: [https://resend.com/docs](https://resend.com/docs)

---

**祝您部署顺利！🚀**
