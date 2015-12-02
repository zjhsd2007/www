## 说明
这是我开发移动端项目时，用到的一些工具，感觉将这些工具整合起来后，开发起来方便不少，现在将它分享出来。
## 工具
1. sass
2. gulp
3. bower
先安装上面三个工具，这些工具我就不在这里介绍了，感兴趣的可以自己去了解下。我在这里只介绍怎么样用我的方法进行开发。

在clone这个repository后，在www文件夹下执行
```javascript
npm i
```
安装依赖，说明一下，我现在的node版本是v4.0.0,npm的版本是2.7.3，如果你用的是最新版本的node和npm ,gulp-sass这个模块可能会出错，你可以将它换成gulp-ruby-sass也可以。

现在比如说，我们要新建一个项目名叫：myProject
1. 首先复制projectTpl文件夹至同级目录，并将它重命名为myProject
2. 进入myProject/src,在这个目录下执行 bower install

## 运行项目
在www目录下运行
```javascript
gulp server --myProject --8080
```
myProject就是刚刚新建的项目，8080是运行的端口号，这样浏览器就是自动打开localhost:8080,也就是myProject项目中src下面的index.html页面。

现在尝试着修改index.html里的内容，或者修改sass目录中的index.scss，可以发现，不用我们手动刷新浏览器，页面就会自动更新了。这其实是用到了browsersync工具。
