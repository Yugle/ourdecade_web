# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 先复制 package.json（利用缓存）
COPY package.json ./

# 安装 pnpm
RUN npm install -g pnpm && \
    pnpm config set registry https://mirrors.huaweicloud.com/repository/npm

# 安装依赖
RUN pnpm install

# 复制源码
COPY . .

# 构建时接收环境变量并执行构建（关键：把环境变量注入构建流程）
ARG UMI_APP_COS_SECRET_BUCKET
ARG UMI_APP_COS_SECRET_ID
ARG UMI_APP_COS_SECRET_KEY
ARG UMI_APP_COS_SECRET_REGION

# 将构建参数转为环境变量，供 pnpm build 使用
ENV UMI_APP_COS_SECRET_BUCKET=$UMI_APP_COS_SECRET_BUCKET
ENV UMI_APP_COS_SECRET_ID=$UMI_APP_COS_SECRET_ID
ENV UMI_APP_COS_SECRET_KEY=$UMI_APP_COS_SECRET_KEY
ENV UMI_APP_COS_SECRET_REGION=$UMI_APP_COS_SECRET_REGION

# 构建应用
RUN pnpm build

# 生产阶段
FROM caddy:2-alpine

# 复制构建好的静态文件
COPY --from=builder /app/dist /usr/share/caddy

# 复制 Caddy 配置文件
COPY Caddyfile /etc/caddy/Caddyfile

# 暴露端口
EXPOSE 80
EXPOSE 443
