FROM node:18-alpine AS builder

WORKDIR /app

# 复制包文件
COPY package.json ./

# 安装 pnpm
RUN npm install -g pnpm

RUN pnpm config set registry https://mirrors.huaweicloud.com/repository/npm
# 安装依赖
RUN pnpm install

# 复制源码
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段 - 统一使用 alpine 版本
FROM caddy:2-alpine

# 复制构建好的静态文件到 Caddy 的 web 目录
COPY --from=builder /app/dist /usr/share/caddy

# 复制 Caddy 配置文件
COPY Caddyfile /etc/caddy/Caddyfile

# 暴露端口
EXPOSE 80 443