
# VScode常用配置以及使用技巧
### 1. 代码片段
---
代码片段。即一些提前定义的可重复使用的小代码段，使用此功能可以比较方便地以简单的操作输入一些重复而又没有办法避免的代码段。
例如创建api, action, vue文件时，我们使用一些通用的模板，这时可以使用定义好的代码片段，不仅避免了重复拷贝操作，更从工具层面统一了这些文件的编写规范，提升团队效率。
使用：文件 -> 首选项 -> 用户代码片段 -> 新增代码片段
生成代码片段后进行代码片段文件编写，生成文件中有默认实例
snippets文件示例如下
```javascript
{
    // 添加Api主文件
    "Create an api file": {
        "scope": "javascript,typescript", // 可使用的文件类型
        "prefix": "create-api", // 调用时的命令
        "body": [
            "export const $1 = (params) => {",
            " return http.$2('$3', params)",
"}",
// 生成的代码内容，$1, $2 ...分别表示按tab键后的定位位置，方便快速输入
        ],
        "description": "initialize an action js file" // 代码片段描述
    }
}
```
使用时在相应文件输入设定好的`prefix`值，即会出现相应的命令
可配置项目相关的代码片段，放在项目中的 `.vscode` 文件夹中
### 2. 初次安装vscode时同步配置
---
安装sync-setting插件。此插件可以把vscode的设置，包括安装哪些插件，键位绑定，用户代码片段等上传到github上予以托管。当新的电脑需要这些配置的时候可以很方便地进行下载，实现了vscode的设置同步功能。
使用方法：[具体文档](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)
上传：输入sync-setting选择上传设置选项
访问 https://github.com/settings/tokens 创建token并记录，输入进行上传
下载：输入sync-setting选择下载设置选项
输入token以及Gist ID 进行设置下载，数据新员工可向老员工询问
### 3. 前端开发常用技巧以及工具
---
##### CSScomb (CSS代码规范与整理插件)
CSScomb可以很方便地对css代码进行美化功能，支持属性顺序配置。可以很方便地避免因css代码不规范造成的问题。[示例配置文件](../example/csscomb.json)
使用说明：
1. 在vscode应用中搜索csscomb并进行下载
2. 进行代码风格配置： 点击后选择相应的代码格式，生成配置文件 [生成代码风格配置](http://csscomb.com/config)
3. 进行css属性顺序配置：[配置示例](https://github.com/csscomb/csscomb.js/blob/dev/config)
4. 将配置好的文件写入setting.json文件中
##### postman（测试后端接口，发送请求）
postman经常用来发送特定请求来测试后台返回数据是否正常，在谷歌商店中安装并进行使用，也可下载本地端。官网下载：https://www.getpostman.com/products
##### FeHelper（前端常用工具合集）
此工具为百度团队开发的一款前端工具集，包含了一些前端开发中比较常用的工具。例如json格式化，编解码，正则测试等功能。
github： https://github.com/zxlie/FeHelper
##### webpack-bundle-analyzer (打包分析工具，分析包依赖以及占用的大小)
插件需在代码中进行配置，配置完成后在build完成后会打开网页展现各种依赖包的大小关系以及依赖关系，供分析依赖提升工程性能使用。
npm: https://www.npmjs.com/package/webpack-bundle-analyzer
##### iconfont（矢量图标库，可让UI负责图标库管理）
官方网站：https://www.iconfont.cn/
##### webpack alias配置
此方法可以通过比较简单的路径访问到资源，防止多层 `../` 的出现以及嵌套过深的情况
例如：
`import HelloWorld from '../../../../../HelloWrold.vue'`
此情况下，我们可以配置`package.json`文件中的alias来解决问题。在vue-cli 3.0中，我们配置`chainWebpack`进行间接修改
```javascript
/* vue.config.js */
module.exports = {
...
chainWebpack: config => {
config.resolve.alias
.set('@', resolve('src'))
.set('_lib', resolve('src/common'))
.set('_com', resolve('src/components'))
.set('_img', resolve('src/images'))
.set('_ser', resolve('src/services'))
},
...
}
```
这样，我们的例子可以改写为
`import HelloWorld from '_com/HelloWorld.vue'`
> 注意:在样式或者模板中引用路径时需在前加上`~`符号，否则路径解析会失败
