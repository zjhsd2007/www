## 说明
这是我开发移动端项目时，用到的一些工具，感觉将这些工具整合起来后，开发起来方便不少，现在将它分享出来。
## 功能
1. 可以实时预览，修改html,scss时，不用手动刷新浏览器，多络端同步浏览。
2. 移动端开发不需要再去写媒体查询。
3. 不用手动去将px转成rem,可以直接使用已定义好的px2rem sass函数,font-size也有定义好的mixin @font-dpr,所以可以直接按效果图上的大小来写，省去了手动计算转换环节。
4. 自带静态服务器，可以发送ajax请求
5. 可以根据模板生成测试数据，不用一条条的手动去写
6. CSS里的小图标自动转换成base64，以减少http请求，超过30KB的大背景图片不会被转换

## 工具
1. browser-sync
2. lib-flexible
3. gulp
4. sass
5. bower
6. mockjs

## 安装
首先安装sass,在装sass之前需要安装ruby,可以去sass的官网了解一下安装方法，这里不再细述。
然后全局安装gulp,bower,在cmd中执行
```javascript
npm i -g gulp bower
```
## 下载
在clone这个repository后，会在本地生成一个www文件夹，这个文件夹就是以后放所有项目的地方，下面对里面的文件一一说明:

1. gitignore这是个git 忽略文件

2. gulpfile.js 这个文件里有我们制作项目时，可以运行的一些任务，包括：

	*. gulp server 用来创建一个静态服务器，如gulp server --myProject --8080
	
	*. gulp sass 用来将scss转换成css，并将小背景图标转换成base64,如gulp sass --myProject
	
	*. gulp compress 用来压缩项目的CSS和JS，如gulp compress --myProject
	
	*. gulp build 打包项目，生成一个build文件夹，提出只用到的第三方的JS，CSS文件(就是根据gulp.config.js里提供的匹配，所以如果加载了其它的第三方JS或CSS库，需要在这个JS文里的把用到的文件路径添加上)，压缩JS，CSS，最后只需要将build文件夹传到线上服务器即可，如：gulp build --myProject
3. package.json 这个就不解释了	
4. projectTpl文件夹，这个文件夹是项目模板，以后每做一个新的项目，都是先将它复制到同级目录后重命名，就是你项目的名字，文件夹里面有一个data和src文件夹，data文件里只有一个data.js文件，用来配置测试数据模板，数据是用mockjs生成的，可以去官网了解一下生成规则 ，注意属性名字必须和页面请求的文件名字相同，否则匹配不到，比如页面现在需要发一个ajax请求：
```javascript
$.ajax({
	url:'path1/path2/users.json',
	type:'GET',
	success:function(){}
})
```
那么data.js文件里相对应的数据模板就需要写到key为'users'里，如

```javascript
'users':{
      'list|1-10': [{
          'id|+1': 1,
          'name':'@NAME',
          'age|18-55':1,
          'email':'@EMAIL',
          'url':'@URL',
          'img':'@IMAGE("200x100", "#000", "#FFF", "hello")'
      }]
  }
```
至于前面的path1/path2，无关紧要，有或没有都没有关系

src里面就是我们放项目源码的地方，vendor用来存放第三方的JS库，通过bower install来安装，比如‘bower install --save jquery’,注意在这里安装完第三方库后，千万记得在config.js里加上你用到的文件，不然打包的时候遗漏了文件。

页面的css写到sass文件夹下的index.scss里面，因为我们做的移动端项目都比较小，所以就没有分多个文件，如果你的项目比较大，可以折分成多个scss文件，这个就比较随意了，一个比较方便的东西就是这里定义了一个@function，用来将px转换成rem,还一个@mixin，用来自动转换字体大小，在开发项目的时候，我们拿到的效果图一般都是750PX宽度(如果你的效果图不是750的宽度，需要修改_var.scss里的$baseFontSize,比如效果图宽度是600，则将它改成60即可)，制作html的时候，我们就可以直接按照效果图的大小来设置，只需要将值传进px2rem这个function里面，比如

```css
.col {
	width:px2rem(300)  /*这里最终输出的将会是4rem*/
	@include font-dpr(24) /*[data-dpr = '1'] .col { font-size:12px;}; [data-dpr = '2'] .col { font-size:24px;} ;[data-dpr = '3'] .col { font-size:36px;}*/
}
```
之所有会这样，主要是用到了lib-flexible，这个JS会根据访问设置的大小以及dpr，设置html的font-size，而rem则是相对于它的一个相对单位，在这里这些东西就不详细解释了，感兴趣的可以自己去了解一下

## 安装依赖
在www目录下面执行下面的语句，安装整个项目需要用到的模块
```javascript
npm i
```
说明一下，我现在的node版本是v4.0.0,npm的版本是2.7.3，如果你用的是最新版本的node和npm ,gulp-sass这个模块可能会出错，你可以将它换成gulp-ruby-sass也可以。

## 试用一下

我们新建一个项目名叫：myProject

1. 首先复制projectTpl文件夹至同级目录，并将它重命名为myProject
2. 进入myProject/src,在这个目录下执行 bower install 安装第三方的JS库，因为lib-flexible没有发布到bower上，而github里又有一个非常大的PSD，所以下载的时候会有点慢
3. 在www目录下运行
```javascript
gulp server --myProject --8080
```
这样浏览器就是自动打开localhost:8080,也就是myProject项目中src下面的index.html页面。

现在尝试着修改index.html里的内容，或者修改sass目录中的index.scss，可以发现，不用我们手动刷新浏览器，页面就会自动更新了。这其实是用到了browsersync工具。
