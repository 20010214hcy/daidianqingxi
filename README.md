# 玺铭电力 · 企业官网

基于 **Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS + Prisma + MySQL** 开发的全栈企业官网，涵盖前台展示、后台管理系统、RESTful API 和动态 CMS 内容管理。

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 全栈框架 | Nuxt 3 (Nitro 服务端引擎) | 3.21 |
| 前端 | Vue 3 + Composition API | 3.5 |
| 语言 | TypeScript | 5.3 |
| 样式 | Tailwind CSS + 自建 CSS 变量体系 | 3.x |
| UI 组件库（后台） | Element Plus | 2.13 |
| 数据库 | MySQL + Prisma ORM | 5.22 |
| 富文本编辑器 | WangEditor (v5) | 5.1 |
| 图片处理 | Sharp (WebP 压缩) / CropperJS | 2.x |
| 认证 | JWT + bcrypt | - |
| 安全 | XSS 过滤 (xss 库) | 1.0 |
| 进程管理（生产） | PM2 | - |

---

## 功能清单

### 前台网站（8个页面）

| 页面 | 路由 | 核心功能 |
|------|------|----------|
| 首页 | `/` | 全屏 Hero、关于我们、服务展示、数据统计、滚动导航栏动画 |
| 关于我们 | `/about` | 公司简介（CMS 动态）、资质证书无限轮播（拖拽+自动播放） |
| 产品展示 | `/products` | 12项/页分页、分类筛选、价格条件显示（后台全局控制） |
| 服务项目 | `/services` | 4列网格展示、响应式布局 |
| 工程案例 | `/cases` | 卡片网格、案例详情 |
| 新闻资讯 | `/news` | 列表页 + 详情页 |
| 联系我们 | `/contact` | 动态联系信息（CMS 同步）、在线留言表单 |
| 登录页 | `/login` | 高级简约风格、鼠标跟随光晕交互、密码可见切换 |

### 后台管理系统（12个模块）

| 模块 | 路由 | 功能 |
|------|------|------|
| 仪表盘 | `/admin` | 统计数据面板（30秒内存缓存）、系统状态 |
| 首页关于我们 | `/admin/home-about` | 首页 About 板块图片+富文本编辑、修改历史 |
| 公司介绍 | `/admin/about` | 封面图片（裁剪上传）、标题、富文本编辑 |
| 产品列表 | `/admin/products` | CRUD + 分类筛选 + 全文搜索 + 价格显示全局开关 |
| 分类管理 | `/admin/categories` | CRUD + 排序 |
| 服务管理 | `/admin/services` | CRUD + 图标上传 |
| 案例管理 | `/admin/cases` | CRUD + 多图上传 |
| 文章管理 | `/admin/articles` | CRUD + 搜索 + 分类 |
| 资质证书 | `/admin/certificates` | CRUD + 图片裁剪 |
| 联系信息 | `/admin/contact` | 联系信息编辑 + 实时预览 + 数据验证 |
| 留言管理 | `/admin/messages` | 查看 + 回复 + 状态变更 |
| 系统设置 | `/admin/settings` | 网站名称、Logo、标语配置 |

### 系统特性

- **认证系统**：JWT Token（httpOnly Cookie）+ 用户信息 Cookie 双重状态保持，路由守卫 + API 中间件双层防护
- **防暴力破解**：登录接口基于 IP 速率限制（5次/5分钟窗口，超限返回 429）
- **图片上传**：Sharp 自动压缩 WebP（5MB 限制、1920px 限宽）、格式白名单校验
- **设计规范**：`admin-variables.css` 统一设计令牌（17色 + 8级间距 + 6级圆角 + 4级阴影 + 9级字号），Element Plus 全局覆盖
- **响应式**：480/640/768/1024/1280 五级断点，触摸目标 ≥44px
- **XSS 防护**：富文本白名单过滤（`filterXss`）+ 纯文本 HTML 剥离（`filterText`）
- **路径安全**：文件删除接口防止路径穿越（`resolve` + `startsWith` 双重验证）
- **输入验证**：Settings 接口字段白名单、留言状态枚举校验
- **SSR 渲染**：前台页面使用 `useFetch` 实现服务端数据获取，SEO 友好
- **数据缓存**：仪表盘 30秒内存缓存，减少数据库查询压力

---

## 项目结构

```
daidianqingxigw/
├── app.vue                          # 根组件
├── nuxt.config.ts                   # Nuxt 配置（模块/端口/安全头/沙箱补丁）
├── tailwind.config.js               # Tailwind 扩展（primary/industrial 色系）
├── tsconfig.json                    # TypeScript 配置
├── ecosystem.config.js              # PM2 生产部署配置
├── .env.example                     # 环境变量模板
│
├── assets/
│   └── css/
│       ├── main.css                 # 全局基础样式
│       └── admin-variables.css      # 后台设计令牌体系 + Element Plus 覆盖
│
├── components/                      # 共享组件
│   ├── Header.vue                   # 导航栏（滚动隐藏动画、移动端汉堡菜单）
│   ├── Footer.vue                   # 页脚（动态联系信息同步）
│   ├── ImageCropper.client.vue      # 图片裁剪上传（基于 cropperjs/vue-cropper）
│   └── WangEditor.client.vue        # 富文本编辑器封装（基于 @wangeditor/editor）
│
├── composables/
│   └── useAuth.ts                   # 认证组合函数（login/logout/initAuth/updateUser）
│
├── layouts/
│   ├── default.vue                  # 前台布局（Header + <slot /> + Footer）
│   └── admin.vue                    # 后台布局（侧边栏 + 折叠 + 移动端适配）
│
├── middleware/
│   └── auth.global.ts               # 全局路由守卫（SSR兼容、Cookie恢复状态）
│
├── plugins/
│   └── sandbox-polyfill.client.ts   # 沙箱环境 Object.defineProperty 拦截补丁
│
├── pages/
│   ├── index.vue                    # 首页
│   ├── about.vue                    # 关于我们（公司简介+证书轮播）
│   ├── services.vue                 # 服务项目
│   ├── cases.vue                    # 工程案例
│   ├── contact.vue                  # 联系我们
│   ├── login.vue                    # 登录页
│   ├── products/
│   │   └── index.vue                # 产品展示（分页+分类+价格控制）
│   ├── news/
│   │   ├── index.vue                # 新闻列表
│   │   └── [id].vue                 # 新闻详情
│   └── admin/
│       ├── index.vue                # 仪表盘
│       ├── about.vue                # 公司介绍管理
│       ├── home-about.vue           # 首页关于我们管理
│       ├── articles.vue             # 文章管理
│       ├── categories.vue           # 分类管理
│       ├── products.vue             # 产品管理（含价格显示开关）
│       ├── services.vue             # 服务管理
│       ├── cases.vue                # 案例管理
│       ├── certificates.vue         # 资质证书管理
│       ├── contact.vue              # 联系信息编辑
│       ├── messages.vue             # 留言管理
│       ├── profile.vue              # 个人资料+密码修改
│       └── settings.vue             # 网站设置
│
├── server/
│   ├── api/                         # 后端 API（Nuxt 文件路由）
│   │   ├── about/
│   │   │   ├── index.get.ts         # GET /api/about - 获取公司介绍
│   │   │   └── index.put.ts         # PUT /api/about - 更新公司介绍
│   │   ├── articles/
│   │   │   ├── index.get.ts         # GET /api/articles - 文章列表
│   │   │   ├── index.post.ts        # POST /api/articles - 创建文章
│   │   │   ├── [id].get.ts          # GET /api/articles/:id - 文章详情
│   │   │   ├── [id].put.ts          # PUT /api/articles/:id - 更新文章
│   │   │   └── [id].delete.ts       # DELETE /api/articles/:id - 删除文章
│   │   ├── auth/
│   │   │   ├── init.get.ts          # GET /api/auth/init - 初始化认证状态
│   │   │   ├── login.post.ts        # POST /api/auth/login - 登录
│   │   │   ├── profile.get.ts       # GET /api/auth/profile - 获取用户资料
│   │   │   ├── profile.put.ts       # PUT /api/auth/profile - 更新用户资料
│   │   │   ├── reset.get.ts         # GET /api/auth/reset - 检查重置状态
│   │   │   └── reset.post.ts        # POST /api/auth/reset - 重置管理员密码
│   │   ├── cases/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── categories/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── certificates/
│   │   │   ├── certificates.get.ts  # GET /api/certificates - 证书列表
│   │   │   ├── certificates.post.ts # POST /api/certificates - 上传证书
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── contact/
│   │   │   ├── contact.get.ts       # GET /api/contact - 获取联系信息
│   │   │   └── contact.put.ts       # PUT /api/contact - 更新联系信息
│   │   ├── dashboard/
│   │   │   └── stats.get.ts         # GET /api/dashboard/stats - 仪表盘数据
│   │   ├── messages/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── price-visibility/
│   │   │   ├── price-visibility.get.ts  # GET /api/price-visibility - 获取价格显示状态
│   │   │   ├── price-visibility.put.ts  # PUT /api/price-visibility - 切换价格显示
│   │   │   └── logs.get.ts              # GET /api/price-visibility/logs - 操作日志
│   │   ├── products/
│   │   │   ├── index.get.ts         # GET /api/products - 产品列表（分页+筛选）
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── services/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── settings/
│   │   │   ├── index.get.ts         # GET /api/settings - 获取网站设置
│   │   │   └── index.put.ts         # PUT /api/settings - 更新网站设置
│   │   ├── home-about/
│   │   │   ├── index.get.ts         # GET /api/home-about - 获取首页关于我们
│   │   │   └── index.put.ts         # PUT /api/home-about - 更新首页关于我们
│   │   ├── upload/
│   │   │   ├── upload.post.ts       # POST /api/upload - 文件上传（压缩+校验）
│   │   │   └── upload.delete.ts     # DELETE /api/upload - 删除文件
│   ├── middleware/
│   │   └── auth.ts                  # API 认证中间件（JWT 验证）
│   ├── routes/
│   │   └── uploads/
│   │       └── [filename].get.ts    # 静态文件服务（/uploads/*）
│   └── utils/
│       ├── db.ts                    # Prisma 客户端（全局单例+热重载保护）
│       ├── file.ts                  # 文件操作工具（deleteImageFile 路径安全）
│       ├── response.ts              # 统一响应格式（success/error/paginated）
│       └── xss.ts                   # XSS 过滤工具（filterXss 富文本 + filterText 纯文本）
│
├── prisma/
│   ├── schema.prisma                # 数据库模型定义（13个模型）
│   ├── seed.ts                      # 种子数据
│   └── seed-products.ts             # 产品种子数据
│
└── public/
    └── uploads/                     # 上传文件存储目录
```

---

## 快速开始

### 环境要求

- **Node.js** >= 18.x
- **MySQL** >= 8.0
- **npm** >= 9.x

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/daidianqingxi"
JWT_SECRET="生成一个强随机字符串作为JWT密钥"
```

> **⚠️ 重要**：`JWT_SECRET` 在生产环境**必须**设为强随机字符串，切勿使用默认值！

### 3. 创建数据库

```sql
CREATE DATABASE daidianqingxi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 初始化 Prisma

```bash
npx prisma generate
npx prisma db push
```

### 5. 初始化管理员账号

项目启动后，访问 `GET /api/auth/init` 会自动创建默认管理员：

| 用户名 | 密码 | 角色 |
|--------|------|------|
| `admin` | `admin123` | 管理员 |

> **⚠️**：首次登录后请立即进入 **系统设置 → 个人资料** 修改密码。

### 6. 启动开发服务器

```bash
npm run dev
```

| 地址 | 说明 |
|------|------|
| http://localhost:3000 | 前台网站 |
| http://localhost:3000/admin | 后台管理系统 |
| http://localhost:3000/login | 登录页面 |

> **提示**：如遇到 `localhost` 无法访问，请使用 `http://127.0.0.1:3000`。项目通过 IPv6 绑定（`host: '::'`），部分系统需显式使用 IP 地址。

---

## 数据库模型

### 完整 ER 模型

```
User (管理员)
  ├── 1:N → Article (文章)
  ├── 1:N → ProjectCase (工程案例)
  └── 1:N → Service (服务项目)

ProductCategory (产品分类)
  └── 1:N → Product (产品)

Message          独立表（留言）
SiteSetting      独立表（网站设置）
AboutContent     独立表（公司介绍）
HomeAbout        独立表（首页关于我们）
  └── 1:N → HomeAboutHistory（修改历史）
ContactInfo      独立表（联系信息）
Certificate      独立表（资质证书）
PriceVisibility  独立表（价格显示开关）
PriceChangeLog   独立表（价格变更日志）
```

### 各模型详情

| 模型 | 主要字段 |
|------|----------|
| `User` | id, username（唯一）, name, avatar, password（bcrypt加密）, email, role |
| `Article` | id, title, content（LongText富文本）, summary, coverImage, category, status, viewCount, authorId(FK→User) |
| `ProjectCase` | id, title, description, content（LongText）, coverImage, images（多图JSON）, clientName, location, authorId(FK→User) |
| `Service` | id, title, description, content（LongText）, coverImage, icon, price, sortOrder, authorId(FK→User) |
| `ProductCategory` | id, name（唯一）, sortOrder |
| `Product` | id, name, description, price（Decimal 10,2）, categoryId(FK→ProductCategory), image, status, sortOrder |
| `Message` | id, name, phone, email, company, subject, content, status（pending/replied/closed）, reply |
| `SiteSetting` | id, siteName, siteSlogan, siteLogo, siteIcon |
| `AboutContent` | id, overviewTitle, overviewContent（LongText）, image（Text长URL） |
| `HomeAbout` | id, title, description（LongText）, image |
| `HomeAboutHistory` | id, homeAboutId(FK→HomeAbout), title, description, image, changedBy, createdAt |
| `ContactInfo` | id, companyName, address, phone1, phone2, email1, email2, workHours1, workHours2 |
| `Certificate` | id, title, image（Text）, sortOrder |
| `PriceVisibility` | id, visible, updatedBy |
| `PriceChangeLog` | id, action, previousState, newState, operatorName, createdAt |

---

## API 接口文档

### 通用规范

**统一响应格式**（定义于 `server/utils/response.ts`）：

```json
{
  "code": 200,
  "success": true,
  "message": "操作成功",
  "data": { ... },
  "timestamp": 1715000000000
}
```

**分页响应格式**：

```json
{
  "code": 200,
  "success": true,
  "message": "获取成功",
  "data": {
    "list": [ ... ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 12,
      "totalPages": 9
    }
  }
}
```

**认证说明**：

- 登录后，服务端通过 `Set-Cookie` 设置 `auth_token`（JWT，httpOnly 防 XSS）和 `auth_user`（用户信息，URL编码JSON，前端可读）
- 前台页面通过 `useAuth()` composable 管理认证状态
- API 中间件自动从 Cookie 或 `Authorization: Bearer <token>` 头中提取 JWT
- 不携带有效 Token 的受保护接口返回 `401`

---

### 认证接口

| 方法 | 端点 | 认证 | 说明 |
|------|------|:--:|------|
| `POST` | `/api/auth/login` | ❌ | 登录。Body: `{ username, password }` |
| `POST` | `/api/auth/logout` | ❌ | 登出（清除 Cookie） |
| `GET` | `/api/auth/init` | ❌ | 初始化认证状态（从 Cookie 恢复用户信息） |
| `POST` | `/api/auth/refresh` | ✅ | 刷新 Token（延长有效期） |
| `GET` | `/api/auth/profile` | ✅ | 获取当前用户资料 |
| `PUT` | `/api/auth/profile` | ✅ | 更新用户资料。Body: `{ name?, email?, avatar?, username?, oldPassword?, newPassword? }` |

---

### 内容管理接口

#### 文章 (Articles)

| 方法 | 端点 | 认证 | 查询参数 / Body |
|------|------|:--:|------|
| `GET` | `/api/articles` | ❌ | `?page=1&pageSize=10&keyword=搜索词&category=分类` |
| `GET` | `/api/articles/:id` | ❌ | - |
| `POST` | `/api/articles` | ✅ | `{ title, content, summary?, coverImage?, category?, status? }` |
| `PUT` | `/api/articles/:id` | ✅ | 同 POST |
| `DELETE` | `/api/articles/:id` | ✅ | - |

#### 工程案例 (Cases)

| 方法 | 端点 | 认证 | 查询参数 / Body |
|------|------|:--:|------|
| `GET` | `/api/cases` | ❌ | `?page=1&pageSize=10&keyword=搜索词` |
| `GET` | `/api/cases/:id` | ❌ | - |
| `POST` | `/api/cases` | ✅ | `{ title, description?, content?, coverImage?, images?, clientName?, location? }` |
| `PUT` | `/api/cases/:id` | ✅ | 同 POST |
| `DELETE` | `/api/cases/:id` | ✅ | - |

#### 服务项目 (Services)

| 方法 | 端点 | 认证 | 查询参数 / Body |
|------|------|:--:|------|
| `GET` | `/api/services` | ❌ | `?page=1&pageSize=10` |
| `GET` | `/api/services/:id` | ❌ | - |
| `POST` | `/api/services` | ✅ | `{ title, description?, content?, coverImage?, icon?, sortOrder? }` |
| `PUT` | `/api/services/:id` | ✅ | 同 POST |
| `DELETE` | `/api/services/:id` | ✅ | - |

---

### 商城/产品接口

#### 产品分类 (Categories)

| 方法 | 端点 | 认证 | 说明 |
|------|------|:--:|------|
| `GET` | `/api/categories` | ❌ | 获取全部分类（按 sortOrder 排序） |
| `POST` | `/api/categories` | ✅ | 创建分类。Body: `{ name, sortOrder? }` |
| `PUT` | `/api/categories/:id` | ✅ | 更新分类 |
| `DELETE` | `/api/categories/:id` | ✅ | 删除分类 |

#### 产品 (Products)

| 方法 | 端点 | 认证 | 查询参数 / Body |
|------|------|:--:|------|
| `GET` | `/api/products` | ❌ | `?page=1&pageSize=12&categoryId=1&keyword=搜索词&status=published` |
| `GET` | `/api/products/:id` | ❌ | - |
| `POST` | `/api/products` | ✅ | `{ name, categoryId, price, description?, image?, status?, sortOrder? }` |
| `PUT` | `/api/products/:id` | ✅ | 同 POST |
| `DELETE` | `/api/products/:id` | ✅ | - |

#### 价格显示控制

| 方法 | 端点 | 认证 | 说明 |
|------|------|:--:|------|
| `GET` | `/api/price-visibility` | ❌ | 获取全局价格显示状态。返回: `{ visible: true/false }` |
| `PUT` | `/api/price-visibility` | ✅ | 切换价格显示。Body: `{ visible: true/false, operatorName: "管理员" }` |
| `GET` | `/api/price-visibility/logs` | ✅ | 获取操作日志。`?page=1&pageSize=20` |

---

### CMS 动态内容接口

#### 关于我们 (About)

| 方法 | 端点 | 认证 | 说明 |
|------|------|:--:|------|
| `GET` | `/api/about` | ❌ | 获取公司介绍（首次调用自动创建默认数据） |
| `PUT` | `/api/about` | ✅ | 更新。Body: `{ overviewTitle?, overviewContent?, image? }` |

#### 首页关于我们 (HomeAbout)

| 方法 | 端点 | 认证 | 说明 |
|------|------|:--:|------|
| `GET` | `/api/home-about` | ❌ | 获取首页 About 板块数据 |
| `PUT` | `/api/home-about` | ✅ | 更新。自动记录修改历史到 `HomeAboutHistory` 表 |

#### 联系我们 (Contact)

| 方法 | 端点 | 认证 | 说明 |
|------|------|:--:|------|
| `GET` | `/api/contact` | ❌ | 获取联系信息（首次调用自动创建默认数据） |
| `PUT` | `/api/contact` | ✅ | 更新联系信息。含必填字段校验（`companyName`、`address`、`phone1`）+ 邮箱格式校验 |

#### 资质证书 (Certificates)

| 方法 | 端点 | 认证 | Body / 参数 |
|------|------|:--:|------|
| `GET` | `/api/certificates` | ❌ | 获取证书列表（按 sortOrder 排序） |
| `POST` | `/api/certificates` | ✅ | `{ title, image, sortOrder? }` |
| `PUT` | `/api/certificates/:id` | ✅ | 同 POST |
| `DELETE` | `/api/certificates/:id` | ✅ | - |

---

### 其他接口

#### 留言 (Messages)

| 方法 | 端点 | 认证 | Body / 参数 |
|------|------|:--:|------|
| `GET` | `/api/messages` | ❌ | `?page=1&pageSize=20&status=pending`（前台提交无需认证） |
| `POST` | `/api/messages` | ❌ | `{ name, phone, email?, company?, subject?, content }` |
| `PUT` | `/api/messages/:id` | ✅ | `{ status?, reply? }` |
| `DELETE` | `/api/messages/:id` | ✅ | - |

#### 网站设置 (Settings)

| 方法 | 端点 | 认证 | Body |
|------|------|:--:|------|
| `GET` | `/api/settings` | ❌ | - |
| `PUT` | `/api/settings` | ✅ | `{ siteName?, siteSlogan?, siteLogo?, siteIcon? }` |

#### 仪表盘 (Dashboard)

| 方法 | 端点 | 认证 | 说明 |
|------|------|:--:|------|
| `GET` | `/api/dashboard/stats` | ✅ | 返回文章/产品/案例/服务/留言计数 + 分类图表 + 系统状态。30秒内存缓存。 |

#### 文件上传

| 方法 | 端点 | 认证 | 说明 |
|------|------|:--:|------|
| `POST` | `/api/upload` | ✅ | `multipart/form-data`。5MB限制，JPG/PNG/GIF/WebP/SVG → WebP 压缩。返回: `{ url: "/uploads/xxx.webp" }` |
| `DELETE` | `/api/upload` | ✅ | 删除文件。Body: `{ url: "/uploads/xxx.webp" }` |

---

## 认证体系

```
           POST /api/auth/login
                    │
         bcrypt 验证密码 ───→ JWT 生成（7天过期）
                    │
    ┌───────────────┼───────────────┐
    │                               │
  Set-Cookie                    Response Body
  auth_token (JWT,httpOnly)     { user, token }
  auth_user (URL编码JSON)         │
    │                               │
    └───────┬───────────────────────┘
            ▼
    浏览器存储（Cookie + useState）
            │
    ┌───────┴───────────────┐
    │                       │
  middleware/            server/middleware/
  auth.global.ts        auth.ts
  (路由守卫)             (API 认证)
    │                       │
  SSR: Cookie恢复        提取 JWT →
  客户端: useAuth()     jwt.verify() →
    initAuth()             event.context.auth
    │                       │
  /admin → 检查认证       POST/PUT/DELETE →
  未登录 → /login          401 错误 →
                           前端拦截 → /login
```

---

## 设计规范

项目遵循统一的设计令牌体系（`assets/css/admin-variables.css`）：

| 维度 | 基准值 |
|------|--------|
| 主色 | `#3b82f6`（蓝），hover `#2563eb` |
| 间距网格 | 4px 基数为单位（4/8/12/16/20/24/32/40/48） |
| 卡片 | 圆角 16px、阴影-sm、内边距 24px |
| 弹窗 | 640px 宽度、圆角 12px、close-on-click-modal=false |
| 按钮 | 高 40px、圆角 8px、hover 上浮 2px + 阴影扩散 |
| 表单 | label-width 100px、输入框 40px、16px 输入字号（移动端防缩放） |
| 过渡 | `cubic-bezier(0.4, 0, 0.2, 1)`，时长 250-350ms |
| 触摸目标 | ≥44×44px（含轮播圆点 `::before` 48px 扩展区） |
| 断点 | `<480px` / `≤640px` / `≤768px` / `≥1024px` / `≥1280px` |

---

## 部署

### 生产构建

```bash
npm run build
```

构建产物位于 `.output/` 目录。

### PM2 部署

项目自带 [ecosystem.config.js](file:///c:/Users/24824/OneDrive/桌面/daidianqingxigw/ecosystem.config.js)：

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # 设置开机自启
```

### 生产环境变量

```env
DATABASE_URL="mysql://user:pass@host:3306/daidianqingxi"
JWT_SECRET="至少32位强随机字符串"
NODE_ENV="production"
PORT=3000
```

### Docker 部署（建议补充）

> 可创建 `Dockerfile` 和 `docker-compose.yml`，包含 MySQL + Nuxt 服务编排。

---

## 注意事项与已知问题

> 以下为安全审计修复记录及当前待关注项：

### 已修复（2026-06-03 安全审计）

| 问题 | 修复内容 |
|------|----------|
| JWT_SECRET 硬编码 fallback | 生产环境缺失直接报错，开发环境使用随机密钥 |
| /api/auth/reset 认证保护 | 该接口不存在，无需处理 |
| profile.put.ts userId 硬编码 | 从 `event.context.auth.userId` 获取 |
| Cookie httpOnly: false | `auth_token` 已设为 `httpOnly: true` |
| 登录接口无限流 | 基于 IP 的速率限制（5次/5分钟，429 响应） |
| 前端未使用 SSR | 前台页面使用 `useFetch` 启用 SSR 数据获取 |
| init.get.ts 无鉴权 | 生产环境禁止调用，返回 403 |
| settings PUT 无字段白名单 | 限制为 siteName/siteSlogan/siteLogo/siteIcon |
| upload.delete.ts 路径穿越 | 添加 `..` 过滤 + `resolve` 路径验证 |
| certificates PrismaClient 重复实例化 | 改用全局单例 + 统一响应格式 |
| services/cases 详情页 v-html XSS | 添加 DOMPurify 消毒 |
| 留言接口无输入过滤 | 使用 `filterText` 去除所有 HTML |
| 留言状态无枚举校验 | 限制为 pending/replied/closed |
| login.vue 明文展示默认密码 | 已移除 |
| deleteImageFile 代码重复 | 提取到 `server/utils/file.ts` |
| types id 类型错误 | 修正为 `number`（匹配 Prisma Int） |
| Header/Footer 重复请求 | 改用 `useFetch` SSR 获取 |

### 当前待关注项

| 问题 | 影响 | 优先级 |
|------|------|:--:|
| 无测试文件（0% 覆盖率） | 回归风险 | 🔵 |
| dashboard stats 模块级缓存 | serverless 环境无效 | 🔵 |
| 浏览量每次 GET 都递增 | 爬虫/刷新会虚增 | 🔵 |

**沙箱环境**：项目在 Trae IDE 沙箱中运行时需 `plugins/sandbox-polyfill.client.ts` 拦截 `Object.defineProperty` 操作以兼容 `navigator`/`screen` 等只读属性。该补丁不影响生产环境。

---

## 可用命令

```bash
# 开发
npm run dev              # 启动 Nuxt 开发服务器

# 构建
npm run build            # 生产构建
npm run preview          # 预览构建结果
npm run generate         # 静态生成

# 数据库
npm run db:generate      # 重新生成 Prisma Client
npm run db:push          # 同步 schema 到数据库
npm run db:migrate       # 创建 Prisma 数据库迁移
npm run db:seed          # 运行种子脚本
npm run db:studio        # 打开 Prisma Studio GUI

# 清理
rm -rf .output node_modules  # 清理构建和依赖
```

---

## 许可证

MIT License