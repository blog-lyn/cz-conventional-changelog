
# Recommended workflow


```
// 先安装
npm install commitizen -g

// 在project目录初始化
commitizen init lyn-conventional-changelog --save-dev --save-exact

```

1. Make changes(修改)
2. Commit those changes(提交)
3. Make sure Travis turns green(运行ci)
4. Bump version in package.json(提高版本号)
5. conventionalChangelog(生成changelog)
6. Commit package.json and CHANGELOG.md files(提交package.json和changelog)
7. Tag(打tag)
8. Push(push 代码)