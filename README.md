# 古诗划字连词游戏

一个有趣的网页游戏，通过重组打散的汉字来练习古诗。游戏包含计时、计分和最高分记录等功能，让学习古诗变得更有趣！

## 功能特点

- 📚 收录多首经典唐诗
- 🎮 互动式拼字游戏
- ⏱️ 实时计时系统
- 🏆 分数计算与排名
- 💾 本地记录最高分
- 🔄 支持撤销和重置

## 游戏规则

1. 从下拉菜单选择想要练习的诗词
2. 点击下方字符池中的汉字，按正确顺序重组诗句
3. 完成后点击"提交答案"按钮
4. 系统会根据用时和错误次数计算最终得分

### 计分规则

- 基础分：1000分起，根据诗词长度增加
- 时间扣分：每秒扣2分
- 错误扣分：每次错误选择扣50分

## 技术栈

- React.js - 用户界面框架
- Ant Design - UI组件库
- Vite - 构建工具

## 开发环境要求

- Node.js >= 16
- pnpm >= 8

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 项目结构

```
chinese-poetry-game/
├── src/
│   ├── App.jsx        # 主应用组件
│   ├── App.css        # 样式文件
│   ├── main.jsx       # 入口文件
│   └── data/
│       └── poems.js   # 诗词数据
├── public/            # 静态资源
└── index.html         # HTML模板
```

## 使用提示

- 可以使用"撤销"按钮取消最后一次选择
- "重新开始"按钮可以重置当前游戏
- 完成诗句后需要手动点击"提交答案"
- 最高分记录会保存在浏览器本地存储中
