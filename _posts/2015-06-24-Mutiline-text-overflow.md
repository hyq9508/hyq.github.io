---
layout: post
title: 文本溢出显示省略号总结
modified: 2015-06-24
categories: [css]
tags:
  - 多文本溢出
comment: true
---

##1.单行文本溢出显示

大家都知道有这么个属性<code>text-overflow:ellipsis</code>用来实现单行文本的文本溢出显示省略号，当然，在一般浏览器中还要设置<code>width</code>属性，举例说明：

<iframe width="100%" height="300" src="//jsfiddle.net/donqi/w5u1gfqy/embedded/result,css,html,js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

##2.多行文本溢出显示

###1.Webkit浏览器或移动端

在webkit为内核的浏览器或移动端（绝大部分是webkit内核的浏览器）的页面实现比较简单，可以直接使用似有的css扩展属性<code>-webkit-line-clamp</code>,该属性的作用是用来限制块元素显示文本的行数，使用时还要结合其他属性，如下：

1. <code>display: -webkit-box</code>:将对象作为弹性伸缩盒子显示，必须使用
2. <code>-webkit-box-orient</code>：设置或检索子元素的排列方式，必须使用
3. <code>text-overflow:ellipsis</code>：多行文本的情况下，设置显示方式
使用例子：
<iframe width="100%" height="300" src="//jsfiddle.net/donqi/j2do1o9o/embedded/result,css,html,js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

###2.使用::after伪元素实现

这个办法可以跨浏览器兼容，使用::after伪元素在文本后添加一个省略号(...),看起来效果是还可以的
使用例子：
<iframe width="100%" height="300" src="//jsfiddle.net/donqi/dgeLb9qy/2/embedded/result,css,html,js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

*小提示：*

1. <code>::after</code>伪元素里的内容是用绝对定位的，因此，其父元素一定要设置为<code>display:relative/absolute</code>
2. 注意设置文本的高度，使其正常显示，总体高度最好是单行的整数倍。
3. 注意要给<code>::after</code>的内容添加一个背景色，可以父元素的背景色一样，也可以用一个渐变色做背景，效果更好（PS：我的例子透明度还不太恰当，可以再调）
4. IE8中要将<code>::after</code>改为<code>:after</code>，IE6.7中不能显示content的内容，需在内容中加入一个标签，比如<span>...</span>

###3.JS模拟实现

####1.Clamp.js

下载地址：[https://github.com/josephschmitt/Clamp.js](https://github.com/josephschmitt/Clamp.js "github下载地址")

使用示例:

{% highlight css linenos %}
var module = document.getElementById("clamp-this-module");
$clamp(module, {clamp: 2});
{% endhighlight %}

####2.JQuery.dotdotdot

下载地址：[https://github.com/BeSite/jQuery.dotdotdot或http://dotdotdot.frebsite.nl/](https://github.com/BeSite/jQuery.dotdotdot或http://dotdotdot.frebsite.nl/, "下载及详细文档下载")

使用方法：

{% highlight css linenos %}
$(document).ready(function(){
	$("#wrapper").dotdotdot({
	//configuration here
	});
});
{% endhighlight %}

参考资料：

1. [https://css-tricks.com/line-clampin/](https://css-tricks.com/line-clampin/, "line-clampin")
 2. [http://dotdotdot.frebsite.nl/](http://dotdotdot.frebsite.nl/, "jquery.dotdotdot")