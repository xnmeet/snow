# 🌨️ Snow - AI 驱动的浏览器扩展

[English Version](README_EN.md) | [中文版本](README_CN.md)

Snow 是一款先进的浏览器扩展，将 AI 驱动的聊天和自动化功能直接带入您的浏览器。采用现代 Web 技术构建，提供无缝的 AI 模型配置和智能测试自动化。

## ✨ 功能特性

- **🤖 多模型 AI 支持**: 配置和切换不同的 AI 提供商（OpenAI、Claude 等）
- **🧪 智能测试自动化**: 使用 AI 生成和执行自动化测试
- **📱 响应式设计**: 针对浏览器扩展优化，最小宽度 375px
- **⚡ 实时更新**: 测试执行的实时状态更新
- **🎯 原地重试**: 无需创建新消息即可重新执行失败的测试步骤
- **💾 会话管理**: 保存和恢复聊天会话
- **🔍 视觉模型支持**: 高级图像分析能力
- **🧠 推理过程显示**: 实时 AI 推理过程可视化
- **🌐 跨浏览器兼容**: 支持 Chrome、Firefox、Edge

## 🏗️ 架构设计

```
snow/
├── packages/
│   ├── core/           # 共享工具和 AI 配置管理
│   └── extension/      # 基于 React 的浏览器扩展 UI
├── pnpm-workspace.yaml # 单体仓库配置
└── README.md
```

### 核心组件

- **AIConfigManager**: 管理 AI 模型配置的中心服务
- **ModelCard**: 显示模型配置的可复用组件
- **ModelFormDialog**: 添加/编辑 AI 模型的专用表单
- **TestStepItem**: 具有重试功能的交互式测试步骤显示
- **AutomationAgent**: 具有 AI 能力的测试执行引擎
- **PromptManager**: 智能提示生成和管理

## 🚀 快速开始

###  prerequisites
- Node.js 18+
- pnpm 包管理器
- 现代浏览器（Chrome、Firefox、Edge）

### 安装

```bash
# 克隆仓库
git clone <仓库地址>
cd snow

# 安装依赖
pnpm install

# 启动开发模式
pnpm dev

# 构建扩展
pnpm build:extension
```

### 开发命令

```bash
# 开发
pnpm dev                    # 以开发模式启动所有包
pnpm build                  # 构建所有包
pnpm build:extension        # 专门构建扩展

# 质量保证
pnpm lint                   # 运行 ESLint
pnpm format                 # 使用 Prettier 格式化
pnpm test                   # 运行测试
pnpm test:watch             # 监视模式测试

# 包特定命令
cd packages/extension
pnpm dev                    # 扩展开发服务器
pnpm build                  # 扩展构建
```

## 🎨 UI 组件

### 设置面板
- **模型配置**: 添加、编辑、删除 AI 模型，具有完整验证
- **响应式设计**: 从 375px 宽度开始工作（浏览器扩展限制）
- **Shadcn UI**: 整体一致的设计系统
- **表单验证**: 具有用户反馈的全面输入验证

### 聊天界面
- **实时流式传输**: 实时 AI 响应流
- **消息类型**: 用户消息、助手响应、测试执行状态
- **进度指示器**: 生成和执行的视觉反馈
- **错误处理**: 具有重试选项的详细错误消息

### 测试执行面板
- **实时状态**: 显示逐步执行进度
- **步骤可视化**: 颜色编码状态（等待中、运行中、成功、失败）
- **重试能力**: 无需完整测试重试即可单独重试步骤
- **执行详情**: 计时、结果和错误信息

## 🔧 配置

### AI 模型类型
- **语言模型**: 基于文本的 AI（GPT-4、Claude 等）用于文本生成
- **视觉模型**: 具有图像能力的 AI（GPT-4V 等）用于视觉分析

### 模型配置字段
- **基本信息**: 名称、描述、模型标识符
- **API 配置**: API 密钥、基础 URL、模型名称
- **高级选项**: 深度思考模式、推理显示
- **默认设置**: 为每种模型类型标记为默认

## 🧪 测试自动化

### AI 驱动的测试
- **自然语言转代码**: 将测试描述转换为可执行代码
- **多步骤自动化**: 复杂测试场景执行
- **智能 API 集成**: 未配置自定义模型时回退到智能 API
- **实时执行**: 测试运行期间的实时进度更新

### 测试步骤类型
- **AI 动作**: 自动规划和执行
- **交互动作**: 点击、输入、悬停操作
- **验证动作**: 断言、等待条件
- **数据操作**: 查询、提取、转换数据
- **高级操作**: 截图、JavaScript 执行、YAML 脚本

### 执行生命周期
```
用户输入 → AI 分析 → 测试生成 → 步骤执行 → 结果
```

## 📦 构建与分发

### 扩展构建流程
1. **开发**: `pnpm dev` - 具有实时更新的热重载开发
2. **生产**: `pnpm build:extension` - 优化、压缩的构建
3. **测试**: `pnpm test` - 全面的测试套件
4. **代码检查**: `pnpm lint` - 代码质量强制执行

### 浏览器兼容性
- **Chrome**: 完全支持（Manifest V3）
- **Firefox**: 完全支持 WebExtensions API
- **Edge**: 完全支持（基于 Chromium）
- **Safari**: 有限支持（需要额外配置）

## 🛠️ 开发指南

### 技术栈
- **前端**: React 18、TypeScript、Tailwind CSS
- **构建工具**: Vite、esbuild、pnpm workspaces
- **测试**: Jest、Testing Library
- **代码质量**: ESLint、Prettier、TypeScript 严格模式

### 代码架构
- **单体仓库结构**: 核心和扩展之间的清晰分离
- **类型安全**: 具有严格类型的完整 TypeScript 覆盖
- **组件可复用性**: 跨功能共享组件
- **状态管理**: 具有适当关注点分离的 React hooks

### 组件模式
- **可复用组件**: FormField、FormCheckbox 用于一致的表单
- **自定义 Hooks**: useChat、useAIConfig 用于状态管理
- **错误边界**: 整个 UI 中的优雅错误处理
- **加载状态**: 所有异步操作的适当加载指示器

## 🤝 贡献指南

我们欢迎贡献！请遵循以下指南：

1. **Fork** 仓库
2. **创建功能分支**: `git checkout -b feature/amazing-feature`
3. **进行更改**并进行适当测试
4. **运行测试**: `pnpm test` 和 `pnpm lint`
5. **提交更改**: 使用常规提交消息
6. **推送到分支**: `git push origin feature/amazing-feature`
7. **打开 Pull Request** 并提供详细描述

### 开发标准
- **代码风格**: 遵循现有模式和 ESLint 规则
- **测试**: 为新功能包含测试
- **文档**: 更新 README 和代码注释
- **性能**: 考虑包大小和执行效率

## 📄 许可证

### MIT 许可证

本项目采用 **MIT 许可证** - 详见 [LICENSE](LICENSE) 文件获取完整详情。

**允许的行为:**
- ✅ 商业使用
- ✅ 分发
- ✅ 修改
- ✅ 私人使用
- ✅ 专利使用

**限制:**
- ❌ 责任
- ❌ 担保

**条件:**
- © 必须包含版权声明
- 📄 必须包含许可证副本

### 第三方许可证
本项目使用多个开源包。要查看依赖项的完整许可证信息，请运行：
```bash
pnpm licenses list
```

## 🤝 贡献指南

我们欢迎社区的贡献！在提交拉取请求之前，请阅读这些指南。

### 开发工作流

1. **Fork 仓库**并创建功能分支
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **设置开发环境**
   ```bash
   pnpm install
   pnpm dev
   ```

3. **进行更改**，遵循我们的编码标准
   - 遵循 TypeScript 最佳实践
   - 使用描述性的变量和函数名称
   - 为复杂逻辑添加适当的注释
   - 确保所有代码都正确类型化

4. **为更改编写测试**
   ```bash
   pnpm test
   pnpm test:watch
   ```

5. **确保代码质量**
   ```bash
   pnpm lint
   pnpm format
   ```

6. **提交更改**，使用常规提交消息
   ```bash
   git commit -m "feat: 添加新的 AI 模型配置"
   git commit -m "fix: 解决测试执行时序问题"
   git commit -m "docs: 更新 API 文档"
   ```

7. **推送到您的 fork**并打开拉取请求
   ```bash
   git push origin feature/amazing-feature
   ```

### 拉取请求指南

- **描述**: 清晰描述更改内容和动机
- **测试**: 包含测试用例并确保所有测试通过
- **文档**: 根据需要更新 README 和代码注释
- **截图**: 包含视觉更改的 UI 截图
- **向后兼容性**: 确保更改不会破坏现有功能

### 代码审查流程

1. **初步审查**: 维护者将在 48 小时内审查
2. **反馈**: 处理所有审查评论和建议
3. **批准**: 需要至少一名维护者批准
4. **合并**: 使用描述性提交消息进行压缩合并

### 问题报告

报告问题时，请包括：
- 浏览器版本和扩展版本
- 详细的重现步骤
- 预期与实际行为
- 截图或屏幕录制
- 控制台错误消息

## 🆘 支持

### 社区支持
- **GitHub Issues**: [报告错误和请求功能](https://github.com/your-repo/issues)
- **Discord 社区**: [加入我们的社区](https://discord.gg/your-server) 获取实时帮助
- **文档**: [综合指南](https://github.com/your-repo/docs)

### 企业支持
如需商业支持和定制开发：
- 邮箱: support@your-company.com
- 网站: https://your-company.com/support

## 🔗 资源

- **📚 文档**: [完整的 API 参考](https://github.com/your-repo/docs)
- **🔄 更新日志**: [发布说明](https://github.com/your-repo/releases)
- **🐛 问题跟踪器**: [已知问题](https://github.com/your-repo/issues)
- **💬 社区论坛**: [讨论区](https://github.com/your-repo/discussions)
- **🎥 视频教程**: [YouTube 频道](https://youtube.com/your-channel)

### 开发资源
- **API 参考**: [REST API 文档](https://github.com/your-repo/docs/api)
- **组件库**: [UI 组件](https://github.com/your-repo/docs/components)
- **测试指南**: [测试自动化](https://github.com/your-repo/docs/testing)
- **部署指南**: [生产部署](https://github.com/your-repo/docs/deployment)

---

**Snow** - 让 AI 驱动的自动化在每个浏览器中都可访问。🚀