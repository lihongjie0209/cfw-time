# 时区时间 API (Time Zone API)

这是一个基于 Cloudflare Workers 的时区时间 API，可以接收一个或多个时区参数，返回对应时区的当前时间。

## 功能特点

- 支持单个或多个时区查询
- 支持 GET 和 POST 请求方式
- 返回 JSON 格式的时间数据
- 支持 CORS 跨域请求
- 错误处理和参数验证
- 使用标准的 IANA 时区标识符

## API 使用方法

### 1. GET 请求 - 单个时区

```bash
curl "http://127.0.0.1:8787/?timezone=Asia/Shanghai"
```

返回：
```json
{
  "Asia/Shanghai": {
    "formatted": "08/20/2025, 11:30:00",
    "iso": "2025-08-20 11:30:00",
    "timestamp": 1724128200000,
    "timezone": "Asia/Shanghai"
  }
}
```

### 2. GET 请求 - 多个时区

```bash
curl "http://127.0.0.1:8787/?timezone=Asia/Shanghai,America/New_York,Europe/London"
```

返回：
```json
{
  "Asia/Shanghai": {
    "formatted": "08/20/2025, 11:30:00",
    "iso": "2025-08-20 11:30:00",
    "timestamp": 1724128200000,
    "timezone": "Asia/Shanghai"
  },
  "America/New_York": {
    "formatted": "08/19/2025, 23:30:00",
    "iso": "2025-08-19 23:30:00",
    "timestamp": 1724128200000,
    "timezone": "America/New_York"
  },
  "Europe/London": {
    "formatted": "08/20/2025, 04:30:00",
    "iso": "2025-08-20 04:30:00",
    "timestamp": 1724128200000,
    "timezone": "Europe/London"
  }
}
```

### 3. POST 请求 - JSON 格式

```bash
curl -X POST "http://127.0.0.1:8787/" \
  -H "Content-Type: application/json" \
  -d '{
    "timezones": ["Asia/Tokyo", "Europe/Paris", "Australia/Sydney"]
  }'
```

### 4. 获取使用说明

直接访问根路径不带任何参数：

```bash
curl "http://127.0.0.1:8787/"
```

## 返回数据格式

每个时区的返回数据包含以下字段：

- `formatted`: 格式化的时间字符串 (MM/dd/yyyy, HH:mm:ss)
- `iso`: ISO 格式的时间字符串 (yyyy-MM-dd HH:mm:ss)
- `timestamp`: Unix 时间戳 (毫秒)
- `timezone`: 时区标识符

## 错误处理

### 无效时区

```json
{
  "Invalid/Timezone": {
    "error": "Invalid timezone",
    "message": "\"Invalid/Timezone\" is not a valid IANA timezone identifier"
  }
}
```

### 无效 JSON

```json
{
  "error": "Invalid JSON body",
  "message": "Expected format: {\"timezones\": [\"timezone1\", \"timezone2\"]}"
}
```

## 常用时区标识符

- `Asia/Shanghai` - 中国上海
- `Asia/Tokyo` - 日本东京
- `America/New_York` - 美国纽约
- `America/Los_Angeles` - 美国洛杉矶
- `Europe/London` - 英国伦敦
- `Europe/Paris` - 法国巴黎
- `Australia/Sydney` - 澳大利亚悉尼
- `UTC` - 协调世界时

更多时区标识符可参考：[IANA Time Zone Database](https://www.iana.org/time-zones)

## 开发和部署

### 本地开发

```bash
npm run dev
```

访问 http://127.0.0.1:8787

### 运行测试

```bash
npm test
```

### 部署到 Cloudflare

```bash
npm run deploy
```

## 技术栈

- Cloudflare Workers
- JavaScript ES6+
- Vitest (测试框架)
- Wrangler CLI (开发和部署工具)

## CORS 支持

API 支持跨域请求，包含以下 CORS 头：

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`
