# 📘 使用手册

## 快速开始

### 1. 首次登录

1. 打开部署的系统 URL
2. 输入管理员密码（默认：`admin123`）
3. 点击"登录"按钮

> ⚠️ **安全提示**: 首次登录后，请立即在"设置"页面修改默认密码！

### 2. 配置 Resend

1. 点击导航栏的"设置"
2. 填写以下信息：
   - **Resend API Key**: 您的 Resend API 密钥
   - **Resend 发件邮箱**: 已验证的域名邮箱（如 `noreply@yourdomain.com`）
3. 点击"保存设置"

## 发送邮件

### 基础发送

1. 点击导航栏的"发送邮件"
2. 填写表单：
   - **收件人**: 接收邮件的邮箱地址
   - **主题**: 邮件标题
   - **内容**: 邮件正文（支持 HTML）
3. 点击"发送邮件"

### 使用自定义前缀

**场景**: 您想从 `newsletter@yourdomain.com` 发送邮件，而不是默认的 `noreply@yourdomain.com`

**步骤**:
1. 在"邮箱名前缀"输入框中填入 `newsletter`
2. 系统会自动使用 `newsletter@yourdomain.com` 作为发件地址
3. 填写其他信息并发送

### 使用随机前缀

**场景**: 您需要每次使用不同的发件地址，避免被识别为群发邮件

**步骤**:
1. 点击"随机生成"按钮
2. 系统会自动生成一个 8 位随机字符串（如 `a7x9m2k5`）
3. 发件地址将变为 `a7x9m2k5@yourdomain.com`
4. 填写其他信息并发送

### 发送附件

1. 在"附件"区域点击"选择文件"
2. 选择要发送的文件（最大 40MB）
3. 填写其他信息并发送

**支持的文件类型**:
- 文档: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- 图片: JPG, PNG, GIF, SVG
- 压缩包: ZIP, RAR, 7Z
- 其他: TXT, CSV, JSON 等

## 高级功能

### HTML 邮件

在"内容"区域，您可以直接输入 HTML 代码：

```html
<h1>欢迎使用我们的服务</h1>
<p>尊敬的用户，您好！</p>
<p>这是一封 <strong>HTML</strong> 格式的邮件。</p>
<a href="https://example.com" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">点击这里</a>
```

### 批量发送（需手动循环）

虽然系统目前不支持一键批量发送，但您可以通过以下方式实现：

1. 使用随机前缀功能
2. 每次发送后，点击"随机生成"更换前缀
3. 修改收件人
4. 重复发送

## 使用场景

### 场景 1: 营销邮件

```
收件人: customer@example.com
邮箱名前缀: [点击随机生成]
主题: 🎉 限时优惠 - 全场8折！
内容: [HTML 营销内容]
附件: 优惠券.pdf
```

### 场景 2: 通知邮件

```
收件人: user@example.com
邮箱名前缀: notification
主题: 您的订单已发货
内容: 您的订单 #12345 已发货，预计3天内送达。
附件: 无
```

### 场景 3: 报告邮件

```
收件人: manager@example.com
邮箱名前缀: report
主题: 2024年第一季度销售报告
内容: 请查看附件中的详细报告。
附件: Q1_report.xlsx
```

### 场景 4: 客服回复

```
收件人: customer@example.com
邮箱名前缀: support
主题: Re: 关于产品咨询
内容: 感谢您的咨询，以下是详细解答...
附件: 产品手册.pdf
```

## 常见问题

### Q1: 为什么邮件发送失败？

**可能原因**:
1. ❌ API Key 未配置或无效
2. ❌ 域名未在 Resend 验证
3. ❌ 发件邮箱不属于已验证域名
4. ❌ 收件人邮箱格式错误
5. ❌ 附件过大（超过 40MB）

**解决方案**:
1. ✅ 检查设置页面的配置
2. ✅ 登录 Resend 确认域名验证状态
3. ✅ 确保发件邮箱使用已验证的域名
4. ✅ 检查收件人邮箱格式
5. ✅ 压缩或减小附件大小

### Q2: 如何知道邮件是否发送成功？

系统会显示实时反馈：
- ✅ **绿色提示框**: "邮件发送成功！"
- ❌ **红色提示框**: 显示具体错误信息

### Q3: 可以发送多个附件吗？

目前版本仅支持单个附件。如需发送多个文件，建议：
1. 将多个文件打包成 ZIP
2. 上传 ZIP 文件作为附件

### Q4: 邮件会进入垃圾箱吗？

为避免邮件进入垃圾箱，请确保：
1. ✅ 在 Resend 中正确配置 SPF、DKIM、DMARC
2. ✅ 发件域名有良好的发信声誉
3. ✅ 邮件内容不包含垃圾邮件关键词
4. ✅ 使用随机前缀避免频繁从同一地址发送

### Q5: 忘记密码怎么办？

联系管理员重置密码：
```bash
npx wrangler secret put ADMIN_PASSWORD
```

### Q6: 可以发送多少封邮件？

取决于您的 Resend 套餐：
- **免费版**: 100 封/天
- **付费版**: 10,000+ 封/月

### Q7: 邮件发送有延迟吗？

通常情况下：
- **系统处理**: < 1 秒
- **Resend 发送**: 1-5 秒
- **收件人接收**: 取决于收件人邮箱服务器

## 最佳实践

### 1. 安全性

✅ **定期更换密码**: 每月更换一次管理员密码  
✅ **定期更换 API Key**: 每季度重新生成 API Key  
✅ **限制访问**: 仅在安全网络环境下使用  

### 2. 发送策略

✅ **使用随机前缀**: 营销邮件建议使用随机前缀  
✅ **内容合规**: 确保邮件内容符合法律法规  
✅ **提供退订**: 营销邮件应包含退订链接  

### 3. 性能优化

✅ **压缩附件**: 使用 PDF 代替图片扫描  
✅ **优化 HTML**: 使用行内样式，避免外部 CSS  
✅ **避免大图**: 使用 CDN 托管图片，邮件中使用链接  

### 4. 内容建议

✅ **个性化**: 在主题和内容中加入收件人姓名  
✅ **简洁明了**: 突出重点，避免长篇大论  
✅ **移动优先**: 确保邮件在移动设备上显示良好  
✅ **行动号召**: 包含明确的 CTA（Call-to-Action）按钮  

## 邮件模板示例

### 欢迎邮件模板

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #667eea;">欢迎加入我们！🎉</h1>
        <p>亲爱的用户，</p>
        <p>感谢您注册我们的服务。我们很高兴您能成为我们大家庭的一员。</p>
        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>您的账号信息：</strong><br>
            用户名: example@email.com<br>
            注册时间: 2024-01-01
        </div>
        <a href="https://example.com/get-started" 
           style="display: inline-block; background: #667eea; color: white; 
                  padding: 12px 24px; text-decoration: none; border-radius: 5px; 
                  margin: 10px 0;">
            开始使用
        </a>
        <p style="color: #777; font-size: 12px; margin-top: 30px;">
            如果您有任何问题，请随时联系我们的客服团队。
        </p>
    </div>
</body>
</html>
```

### 订单确认模板

```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #667eea;">订单确认 ✅</h2>
        <p>您好，</p>
        <p>您的订单已成功创建！</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f0f0f0;">
                <th style="padding: 10px; text-align: left;">订单号</th>
                <td style="padding: 10px;">#12345</td>
            </tr>
            <tr>
                <th style="padding: 10px; text-align: left;">下单时间</th>
                <td style="padding: 10px;">2024-01-01 10:30</td>
            </tr>
            <tr style="background: #f0f0f0;">
                <th style="padding: 10px; text-align: left;">总金额</th>
                <td style="padding: 10px; color: #667eea; font-weight: bold;">¥299.00</td>
            </tr>
        </table>
        <p>我们会尽快为您处理订单，感谢您的购买！</p>
    </div>
</body>
</html>
```

## 技巧与窍门

### 技巧 1: 测试邮件

在正式发送前，先发送测试邮件到自己的邮箱：
1. 检查格式是否正确
2. 确认附件能否打开
3. 测试链接是否有效

### 技巧 2: 追踪效果

在邮件链接中添加 UTM 参数：
```
https://example.com/product?utm_source=email&utm_medium=campaign&utm_campaign=spring2024
```

### 技巧 3: A/B 测试

发送两个版本的邮件：
- 版本 A: 使用前缀 `promo-a`
- 版本 B: 使用前缀 `promo-b`

通过不同链接追踪哪个版本效果更好。

### 技巧 4: 预热域名

新域名建议：
- 第 1-3 天: 发送 10-20 封/天
- 第 4-7 天: 发送 50-100 封/天
- 第 8 天起: 逐步增加到正常量

## 获取帮助

- 📚 [README 文档](./README.md)
- 📦 [部署指南](./DEPLOYMENT.md)
- 🐛 [提交 Bug](https://github.com/phaip88/cursor/issues)
- 💬 [功能建议](https://github.com/phaip88/cursor/discussions)

---

**祝您使用愉快！📧**
