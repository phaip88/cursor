import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sendEmail, generateRandomPrefix } from './email'
import { generateToken } from './auth'

type Bindings = {
  CONFIG_KV: KVNamespace
  ADMIN_PASSWORD?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS 配置
app.use('/*', cors())

// HTML 模板
const INDEX_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>邮件发送系统 - 登录</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div class="container">
        <div class="login-box">
            <h1>📧 邮件发送系统</h1>
            <form id="loginForm">
                <div class="form-group">
                    <label>管理员密码</label>
                    <input type="password" id="password" required placeholder="请输入密码">
                </div>
                <button type="submit" class="btn btn-primary">登录</button>
            </form>
            <div id="message"></div>
        </div>
    </div>
    <script src="/app.js"></script>
    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                window.location.href = '/dashboard';
            } else {
                document.getElementById('message').innerHTML = '<div class="error">' + data.message + '</div>';
            }
        });
    </script>
</body>
</html>`

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>控制面板</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <nav class="navbar">
        <h2>📧 邮件发送系统</h2>
        <div>
            <a href="/dashboard" class="nav-link active">控制台</a>
            <a href="/send" class="nav-link">发送邮件</a>
            <a href="/settings" class="nav-link">设置</a>
            <a href="/" class="nav-link" onclick="localStorage.removeItem('token')">退出</a>
        </div>
    </nav>
    <div class="container">
        <h1>欢迎使用邮件发送系统</h1>
        <div class="card">
            <h3>系统状态</h3>
            <p id="status">正在加载...</p>
        </div>
        <div class="dashboard-grid">
            <a href="/send" class="dashboard-card">
                <h3>✉️ 发送邮件</h3>
                <p>发送带附件的邮件</p>
            </a>
            <a href="/settings" class="dashboard-card">
                <h3>⚙️ 系统设置</h3>
                <p>配置 API Key 和邮箱</p>
            </a>
        </div>
    </div>
    <script src="/app.js"></script>
    <script>
        checkAuth();
        loadStatus();
        
        async function loadStatus() {
            const response = await fetchWithAuth('/api/config');
            const data = await response.json();
            if (data.success) {
                document.getElementById('status').innerHTML = 
                    '✅ API Key: ' + (data.config.hasApiKey ? '已配置' : '未配置') + '<br>' +
                    '📧 发件邮箱: ' + (data.config.email || '未配置');
            }
        }
    </script>
</body>
</html>`

const SEND_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>发送邮件</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <nav class="navbar">
        <h2>📧 邮件发送系统</h2>
        <div>
            <a href="/dashboard" class="nav-link">控制台</a>
            <a href="/send" class="nav-link active">发送邮件</a>
            <a href="/settings" class="nav-link">设置</a>
            <a href="/" class="nav-link" onclick="localStorage.removeItem('token')">退出</a>
        </div>
    </nav>
    <div class="container">
        <div class="card">
            <h2>发送邮件</h2>
            <form id="sendForm" enctype="multipart/form-data">
                <div class="form-group">
                    <label>收件人</label>
                    <input type="email" id="to" required placeholder="recipient@example.com">
                </div>
                <div class="form-group">
                    <label>邮箱名前缀（可选）</label>
                    <div class="input-group">
                        <input type="text" id="fromPrefix" placeholder="留空使用默认邮箱">
                        <button type="button" class="btn btn-secondary" onclick="generatePrefix()">随机生成</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>主题</label>
                    <input type="text" id="subject" required placeholder="邮件主题">
                </div>
                <div class="form-group">
                    <label>内容</label>
                    <textarea id="content" rows="10" required placeholder="邮件内容（支持 HTML）"></textarea>
                </div>
                <div class="form-group">
                    <label>附件（可选）</label>
                    <input type="file" id="attachment">
                </div>
                <button type="submit" class="btn btn-primary">发送邮件</button>
            </form>
            <div id="message"></div>
        </div>
    </div>
    <script src="/app.js"></script>
    <script>
        checkAuth();
        
        async function generatePrefix() {
            const response = await fetchWithAuth('/api/generate-prefix');
            const data = await response.json();
            if (data.success) {
                document.getElementById('fromPrefix').value = data.prefix;
            }
        }
        
        document.getElementById('sendForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('to', document.getElementById('to').value);
            formData.append('subject', document.getElementById('subject').value);
            formData.append('content', document.getElementById('content').value);
            formData.append('fromPrefix', document.getElementById('fromPrefix').value);
            const attachment = document.getElementById('attachment').files[0];
            if (attachment) {
                formData.append('attachment', attachment);
            }
            
            const response = await fetchWithAuth('/api/send-email', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            const msgDiv = document.getElementById('message');
            if (data.success) {
                msgDiv.innerHTML = '<div class="success">✅ 邮件发送成功！</div>';
                document.getElementById('sendForm').reset();
            } else {
                msgDiv.innerHTML = '<div class="error">❌ ' + data.message + '</div>';
            }
        });
    </script>
</body>
</html>`

const SETTINGS_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>系统设置</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <nav class="navbar">
        <h2>📧 邮件发送系统</h2>
        <div>
            <a href="/dashboard" class="nav-link">控制台</a>
            <a href="/send" class="nav-link">发送邮件</a>
            <a href="/settings" class="nav-link active">设置</a>
            <a href="/" class="nav-link" onclick="localStorage.removeItem('token')">退出</a>
        </div>
    </nav>
    <div class="container">
        <div class="card">
            <h2>系统设置</h2>
            <form id="settingsForm">
                <div class="form-group">
                    <label>Resend API Key</label>
                    <input type="password" id="resendApiKey" placeholder="re_xxxxxxxxxxxx">
                    <small>获取 API Key: <a href="https://resend.com/api-keys" target="_blank">https://resend.com/api-keys</a></small>
                </div>
                <div class="form-group">
                    <label>Resend 发件邮箱</label>
                    <input type="email" id="resendEmail" placeholder="noreply@yourdomain.com">
                    <small>需要在 Resend 中验证的域名邮箱</small>
                </div>
                <div class="form-group">
                    <label>管理员密码（可选更改）</label>
                    <input type="password" id="adminPassword" placeholder="留空则不更改">
                </div>
                <button type="submit" class="btn btn-primary">保存设置</button>
            </form>
            <div id="message"></div>
        </div>
    </div>
    <script src="/app.js"></script>
    <script>
        checkAuth();
        loadConfig();
        
        async function loadConfig() {
            const response = await fetchWithAuth('/api/config');
            const data = await response.json();
            if (data.success) {
                document.getElementById('resendEmail').value = data.config.email;
            }
        }
        
        document.getElementById('settingsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const config = {
                resendApiKey: document.getElementById('resendApiKey').value,
                resendEmail: document.getElementById('resendEmail').value,
                adminPassword: document.getElementById('adminPassword').value
            };
            
            const response = await fetchWithAuth('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            const data = await response.json();
            const msgDiv = document.getElementById('message');
            if (data.success) {
                msgDiv.innerHTML = '<div class="success">✅ ' + data.message + '</div>';
                document.getElementById('resendApiKey').value = '';
                document.getElementById('adminPassword').value = '';
            } else {
                msgDiv.innerHTML = '<div class="error">❌ ' + data.message + '</div>';
            }
        });
    </script>
</body>
</html>`

const STYLES = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

.navbar {
    background: white;
    padding: 15px 30px;
    border-radius: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-link {
    color: #667eea;
    text-decoration: none;
    margin-left: 20px;
    font-weight: 500;
}

.nav-link.active {
    color: #764ba2;
    font-weight: 700;
}

.card, .login-box {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    margin-bottom: 20px;
}

.login-box {
    max-width: 400px;
    margin: 100px auto;
}

h1, h2 {
    color: #333;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="file"],
textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s;
}

input:focus,
textarea:focus {
    outline: none;
    border-color: #667eea;
}

textarea {
    resize: vertical;
}

.input-group {
    display: flex;
    gap: 10px;
}

.input-group input {
    flex: 1;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    width: 100%;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
    background: #f0f0f0;
    color: #333;
}

.btn-secondary:hover {
    background: #e0e0e0;
}

.success {
    background: #d4edda;
    color: #155724;
    padding: 12px;
    border-radius: 5px;
    margin-top: 15px;
}

.error {
    background: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 5px;
    margin-top: 15px;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.dashboard-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    border-radius: 10px;
    text-decoration: none;
    transition: transform 0.3s;
}

.dashboard-card:hover {
    transform: translateY(-5px);
}

.dashboard-card h3 {
    color: white;
    margin-bottom: 10px;
}

small {
    display: block;
    color: #777;
    margin-top: 5px;
}

small a {
    color: #667eea;
}`

const APP_JS = `function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
    }
}

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = options.headers || {};
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    headers['Authorization'] = 'Bearer ' + token;
    
    return fetch(url, {
        ...options,
        headers
    });
}`

// 静态文件路由
app.get('/', (c) => c.html(INDEX_HTML))
app.get('/dashboard', (c) => c.html(DASHBOARD_HTML))
app.get('/send', (c) => c.html(SEND_HTML))
app.get('/settings', (c) => c.html(SETTINGS_HTML))
app.get('/style.css', (c) => c.text(STYLES, 200, { 'Content-Type': 'text/css' }))
app.get('/app.js', (c) => c.text(APP_JS, 200, { 'Content-Type': 'application/javascript' }))

// 登录接口
app.post('/api/login', async (c) => {
  try {
    const { password } = await c.req.json()
    const adminPassword = c.env.ADMIN_PASSWORD || await c.env.CONFIG_KV.get('ADMIN_PASSWORD') || 'admin123'
    
    if (password === adminPassword) {
      const token = await generateToken(password)
      return c.json({ success: true, token })
    }
    
    return c.json({ success: false, message: '密码错误' }, 401)
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// 中间件：验证 Token
const authMiddleware = async (c: any, next: any) => {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return c.json({ success: false, message: '未授权' }, 401)
  }
  await next()
}

// 获取配置
app.get('/api/config', authMiddleware, async (c) => {
  try {
    const resendApiKey = await c.env.CONFIG_KV.get('RESEND_API_KEY')
    const resendEmail = await c.env.CONFIG_KV.get('RESEND_EMAIL')
    
    return c.json({
      success: true,
      config: {
        hasApiKey: !!resendApiKey,
        email: resendEmail || ''
      }
    })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// 更新配置
app.post('/api/config', authMiddleware, async (c) => {
  try {
    const { resendApiKey, resendEmail, adminPassword } = await c.req.json()
    
    if (resendApiKey) {
      await c.env.CONFIG_KV.put('RESEND_API_KEY', resendApiKey)
    }
    if (resendEmail) {
      await c.env.CONFIG_KV.put('RESEND_EMAIL', resendEmail)
    }
    if (adminPassword) {
      await c.env.CONFIG_KV.put('ADMIN_PASSWORD', adminPassword)
    }
    
    return c.json({ success: true, message: '配置已更新' })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// 生成随机邮箱前缀
app.get('/api/generate-prefix', authMiddleware, async (c) => {
  try {
    const prefix = generateRandomPrefix()
    return c.json({ success: true, prefix })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// 发送邮件
app.post('/api/send-email', authMiddleware, async (c) => {
  try {
    const formData = await c.req.formData()
    const to = formData.get('to') as string
    const subject = formData.get('subject') as string
    const content = formData.get('content') as string
    const fromPrefix = formData.get('fromPrefix') as string
    const attachment = formData.get('attachment') as File | null
    
    const resendApiKey = await c.env.CONFIG_KV.get('RESEND_API_KEY')
    const resendEmail = await c.env.CONFIG_KV.get('RESEND_EMAIL')
    
    if (!resendApiKey || !resendEmail) {
      return c.json({ success: false, message: '请先配置 Resend API Key 和邮箱' }, 400)
    }
    
    // 构建发件地址
    const fromEmail = fromPrefix ? `${fromPrefix}@${resendEmail.split('@')[1]}` : resendEmail
    
    const result = await sendEmail({
      apiKey: resendApiKey,
      from: fromEmail,
      to,
      subject,
      html: content,
      attachment
    })
    
    return c.json(result)
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

export default app
