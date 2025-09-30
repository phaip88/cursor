#!/bin/bash

echo "========================================="
echo "🚀 Cloudflare 自动部署配置向导"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否安装了 wrangler
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler CLI 未安装${NC}"
    echo "正在安装 Wrangler..."
    npm install -g wrangler
fi

echo -e "${GREEN}✅ Wrangler CLI 已就绪${NC}"
echo ""

# 步骤 1: 登录 Cloudflare
echo "========================================="
echo "步骤 1/4: 登录 Cloudflare"
echo "========================================="
echo "即将打开浏览器进行授权..."
sleep 2
wrangler login

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 登录失败，请重试${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 登录成功${NC}"
echo ""

# 步骤 2: 创建 KV 命名空间
echo "========================================="
echo "步骤 2/4: 创建 KV 命名空间"
echo "========================================="

echo "创建生产环境 KV..."
KV_PROD=$(wrangler kv:namespace create "CONFIG_KV" 2>&1)
KV_PROD_ID=$(echo "$KV_PROD" | grep -o 'id = "[^"]*"' | cut -d'"' -f2)

echo "创建预览环境 KV..."
KV_PREVIEW=$(wrangler kv:namespace create "CONFIG_KV" --preview 2>&1)
KV_PREVIEW_ID=$(echo "$KV_PREVIEW" | grep -o 'id = "[^"]*"' | cut -d'"' -f2)

echo -e "${GREEN}✅ KV 命名空间创建成功${NC}"
echo "生产环境 ID: $KV_PROD_ID"
echo "预览环境 ID: $KV_PREVIEW_ID"
echo ""

# 步骤 3: 更新 wrangler.toml
echo "========================================="
echo "步骤 3/4: 更新配置文件"
echo "========================================="

# 备份原文件
cp wrangler.toml wrangler.toml.bak

# 更新 KV ID
sed -i "s/请在部署时使用 wrangler kv:namespace create CONFIG_KV 创建并替换此 ID/$KV_PROD_ID/g" wrangler.toml
sed -i "s/请在部署时使用 wrangler kv:namespace create CONFIG_KV --preview 创建并替换此 ID/$KV_PREVIEW_ID/g" wrangler.toml

echo -e "${GREEN}✅ 配置文件更新成功${NC}"
echo ""

# 步骤 4: 设置管理员密码
echo "========================================="
echo "步骤 4/4: 设置管理员密码"
echo "========================================="
echo "请输入管理员密码（默认: admin123）"
echo "注意: 输入的密码不会显示在屏幕上"
echo ""

wrangler secret put ADMIN_PASSWORD

echo ""
echo -e "${GREEN}✅ 管理员密码设置成功${NC}"
echo ""

# 获取 Account ID
echo "========================================="
echo "📋 GitHub Secrets 配置信息"
echo "========================================="
echo ""
echo "请在 GitHub 仓库设置中添加以下 Secrets："
echo ""
echo -e "${YELLOW}1. CLOUDFLARE_ACCOUNT_ID${NC}"
ACCOUNT_ID=$(wrangler whoami 2>&1 | grep -o 'Account ID: [a-zA-Z0-9]*' | cut -d' ' -f3)
if [ -n "$ACCOUNT_ID" ]; then
    echo "   值: $ACCOUNT_ID"
else
    echo "   运行命令获取: wrangler whoami"
fi
echo ""
echo -e "${YELLOW}2. CLOUDFLARE_API_TOKEN${NC}"
echo "   获取方式："
echo "   1) 访问: https://dash.cloudflare.com/profile/api-tokens"
echo "   2) 创建 Token，选择 'Edit Cloudflare Workers' 模板"
echo "   3) 复制生成的 Token"
echo ""
echo "配置路径："
echo "GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret"
echo ""

# 提供一键部署选项
echo "========================================="
echo "🚀 立即部署"
echo "========================================="
read -p "是否立即部署到 Cloudflare? (y/n): " deploy_now

if [ "$deploy_now" = "y" ] || [ "$deploy_now" = "Y" ]; then
    echo "正在部署..."
    wrangler deploy
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}=========================================${NC}"
        echo -e "${GREEN}🎉 部署成功！${NC}"
        echo -e "${GREEN}=========================================${NC}"
        echo ""
        echo "您的应用已上线！"
        echo "访问地址将在上方显示"
        echo ""
        echo "下一步："
        echo "1. 访问您的应用 URL"
        echo "2. 使用管理员密码登录"
        echo "3. 在设置页面配置 Resend API Key"
        echo ""
    else
        echo -e "${RED}❌ 部署失败，请检查错误信息${NC}"
    fi
else
    echo ""
    echo "您可以稍后运行以下命令部署："
    echo "  npm run deploy"
    echo ""
fi

echo "========================================="
echo "✅ 自动部署配置完成！"
echo "========================================="
echo ""
echo "配置已保存，推送代码到 GitHub 将自动触发部署"
echo ""
echo "有用的命令："
echo "  npm run deploy          # 手动部署"
echo "  wrangler tail           # 查看实时日志"
echo "  wrangler deployments    # 查看部署历史"
echo ""
