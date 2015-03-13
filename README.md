# analytics_util

本插件是为了方便添加用户点击日志（打点），生成层级的事件统计

例：

* 首页　登录框　登录按钮
* 首页　登陆框　注册按钮

## 添加办法：

* 在`ga`或者`百度统计`代码后边

## 使用方法：

```html
<body gap="首页">
    <div gap="登陆框">
        <a href="" ga="登录按钮">登录</a>
        <a href="" ga="注册按钮">注册</a>
    </div>
</body>
```

## 要点：

* `ga`事件源，只有用户点击了携带`ga`的标签才会发出事件
* `gap`层级片区划分。
* `^`是代表顶级层级，不会再向上查找
* `body`永远是最顶级的标签 它如果没有`gap`，则自动将`body`的`gap`值设置为页面`title`
    * 在页面展现时自动发送一条页面展现统计：`PV　(body[gap])`

```html
<body gap="^首页">
    <div gap="登陆框">
        <a href="" ga="登录按钮">登录</a>
        <a href="" ga="注册按钮">注册</a>
    </div>
    <div gap="^foot">
        <a href="" ga="关于">关于</a> <!-- “foot 关于” 而不是 “首页 foot 关于” -->
    </div>
</body>
```


## 页面跳转
本页跳转的链接会打断日志请求，所以设计了由下一个页面来发送本次事件。（存到localStorage或cookie里）

用法：在`ga`末尾添加`$`

```html
<body gap="首页">
    <div gap="登陆框">
        <a href="" ga="登录按钮">登录</a>
        <a href="" ga="注册按钮$">注册</a>
    </div>
</body>
```


## html层级和日志层级不对应
有时候会遇到类似这样的情况：

```html
<body gap="首页">
    <div gap="登陆框">
        <a href="" ga="登录按钮">登录</a>
    </div>
    ···
    <span gap="登陆框"> <!-- 纯粹为了添加一个 gap -->
        <a href="" ga="注册按钮">注册</a>
    </span>
    ...
</body>
```

等效于

```html
<body gap="首页">
    <div gap="登陆框">
        <a href="" ga="登录按钮">登录</a>
    </div>
    ···
    <a href="" ga="登陆框|注册按钮">注册</a>
    ...
</body>
```