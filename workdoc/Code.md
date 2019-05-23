# 常用代码整理

### javascript常用代码
#### 字符串相关
``` javascript
substr(start, length) // 截取start开始长度为length的字符串
slice(start, end) // 返回start到end的子串，不改变原字符串
splice(start, deleteCount, item...) // 改变原来子串，从start位置开始，删除deleteCount个元素，插入item元素。后两个参数可选
```
#### 判断数组中是否有该元素（可传比较函数）
``` javascript
/**
* find item in array
* @param  {[type]} array [description]
* @param  {[type]} item  [description]
* @return {[boolean]}    is the item in array
*/
function find(array, item) {
    return !!~array.findIndex(element => (element === item));
}
```
#### 日期格式化相关
``` javascript
function formatTime(date) {
  var now = date || new Date();
  var result = "";
  result = now.getFullYear() + "年";
  result += ("0" + (now.getMonth() + 1)).slice(-2) + "月";
  result += ("0" + now.getDate()).slice(-2) + "日 ";
  result += ("0" + now.getHours()).slice(-2) + ":";
  result += ("0" + now.getMinutes()).slice(-2) + ":";
  result += ("0" + now.getSeconds()).slice(-2) + " 星期";
  result += transformZhCn(now.getDay());
  return result;
}

function transformZhCn(index) {
    let dataObj = {
        0: '日',
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六'
    };
    return dataObj[index];
}

```
#### 编码解码相关
``` javascript
JSON.parse(text, reviver); // 将text字符串转换为JSON对象，对每个对象成员调用reviver
JSON.stringify(value, replacer, space); //将value转换为字符串，每个对象键值调用replacer,插入space数量的空格
encodeURI(URIstring); // 编码url
encodeURIComponent(URIstring); // 以组件形式编码url
decodeURI(URIstring); // 解码url
decodeURIComponent(URIstring); // 以组件形式解码url
```

### 实用方法
```javascript
[...Array(3).keys()] // 创建特定大小的数组[0, 1, 2]
(arr) => arr.slice().sort(() => Math.random() - 0.5) // 随机打乱数组
```

### CSS常用代码
#### 超出省略
``` css
.line-camp( @clamp:2 ) {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @clamp;
    -webkit-box-orient: vertical;
}

```

#### 两端对齐
``` css
div {
    margin: 10px 0;
    width: 100px;
    border: 1px solid red;
    text-align: justify;
    text-align-last:justify
}
div:after{
    content: '';
    display: inline-block;
    width: 100%;
}
```

#### 处理1px细线问题
``` css
// transform + 伪类处理方案 (低版本可能会出现断裂)
.border_bottom {
    overflow: hidden;
    position: relative;
    border: none!important;
}
.border_bottom:after {
    content: ".";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: #d4d6d7;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
}

// box-shadow 替代方案 (颜色会变浅)
.border_bottom {
  box-shadow: inset 0px -1px 1px -1px #d4d6d7;
}
```

### git常用资源
#### 标签功能
``` Shell
git tag #显示所有标签
git tag -l 'v1.0.*' #显示v1.0开头的标签
git tag -a -m 'some tip' #增加标签并展示
git show v1.0 #查看v1.0的信息
git push origin --tags #推送所有标签
```
#### 分支功能
``` Shell
git checkout -b newBranch origin/oldBranch #以远程分支为基础创建新分支
git branch -D curBranch #删除现有分支
git merge newBranch #merge新分支到现有分支
```
#### 远程常用功能
``` Shell
git pull #拉取所有信息到本地
git push #推送本地信息到远程
git remote -v #查看远程分支信息
git remote add upstream git@github.com:sfilata/gitskills.git #添加远程主机
git fetch #拉取远程主机信息
```
