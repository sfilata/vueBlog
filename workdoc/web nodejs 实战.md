# 课程目标

- 使用 node 实现一个带 cli 的爬虫应用

# 知识要点

## 爬虫的概念

自动浏览万维网的网络机器人

- 网络引擎使用爬虫更新自己的网站以及索引
- 个人使用爬虫获取网站内容

> 爬虫访问会耗尽对方网站的流量、带宽、服务器资源。
> 个人网站反爬虫需要通过`robots.txt`文件进行，指定当前网站可以供爬虫的内容。

```
User-agent: \*
Disallow:
```

允许所有爬虫访问

```
User-agent: baidu_spider
Allow:
```

允许百度爬虫访问

```
User-agent: \*
Disallow: /
```

禁止所有爬虫访问

## 如何编写一个爬虫应用

1. 确定需要爬取的接口和资源
2. 查看 DOM 结构，确定需要爬取信息的位置
3. 确定技术选型
   - 模拟浏览器端请求
     - request 但是已经不再维护
     - superagent \*
   - 解析 DOM
     - cheerio 基本类似于 jquery 的 API \*
     - jsdom
   - 模拟用户行为
     - puppeteer 经常在 Node 层用来截图和巡查

# 补充知识点
