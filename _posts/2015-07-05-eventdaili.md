---
layout: post
title: 事件代理委托机制
publish: true
modified: 2015-07-05
categories: [javascript]
tags: 
   - javascript
   - EventListener
comment: true
---

####问题模型

假设现在有一个页面，存了1000个button，点击button显示这是第几个button，怎么实现这个功能呢

以前我们通常是给一个元素绑定一个事件，但是监听器可能会导致内存泄露或者性能降低，并且监听器越多这种可能性越大，为此，我们有了另一种办法，将监听放在其父元素或者更高的元素上，减少监听器的数量。

----------------------------------------------------------------------

####背景知识

先来看看JavaScript中设置事件监听的几种办法：

1. element.['on'+type]=function(){} //所有浏览器
2. element.attachEvent('on'+type,listener); //IE6-10支持，IE11不支持
3. element.addEventListener(type,listener,[usecapture]); //IE6-8不支持


区别：

1. <code>element['on' + type]</code>不支持对一个元素的一个事件注册多个监听，并且不能使用事件捕获

2. <code>attachEvent</code>是IE为了实现绑定多个监听而引入的，不过这也也还是不能使用事件捕获，而且IE11也已经抛弃这种方法了。

3. <code>addEventListener</code>是W3C工作组在DOM Level 2开始引入的一个注册事件监听器的方法，存在3个事件阶段，捕获-目标-冒泡，传播路径如下图：

![W3C_Event](/images/w3cEvent.png)


  * 捕获阶段： 在事件对象到达目标元素之前，事件对象从window开始经过祖先节点传到目标节点
  * 目标阶段： 事件对象到达其目标节点，假如一个事件对象被标志为不能冒泡，则在目标阶段处理完之后不会进入冒泡阶段
  * 事件冒泡： 看名称应该能看出一些端倪，事件对象沿着目标节点往上传递，与捕获阶段相反，到达window结束


可以将usecapture设置为true(false)来控制监听生效的阶段，true表示在捕获阶段生效，false表示在冒泡阶段生效。如果要跳过冒泡阶段的话，可以将<code>event.bubbles</code>设置为<code>false</code>



---------------------------------------------------------------------------

####问题解决

现在让我们来解决一下之前的那个问题，我们可以在document上设置一个监听，判断点击事件到底是在第几个button发生的，那么我们可以这么做

{% highlight javascript lineons %}
document.addEventListener('click',function(e) {
	if (e.target.nodeName.toUpperCase()==='BUTTON') {
		var buttonList=document.getElementsByTagName('button');
			for (var i = 0; i < buttonList.length; i++) {
				if (e.target===buttonList[i]) {
					console.log("button:"+(i+1));
				};
			};
	};
},false);
{% endhighlight %}

---------------------------------------------------------------------

####补充

除了代理监听还有什么办法呢，有吗？有的，我们还有闭包嘛，我们可以使用闭包那些i值缓存起来，咱们来简单实现一下：

{% highlight javascript lineons %}
var buttonList=document.getElementsByTagName('button');
	for (var i = 0; i < buttonList.length; i++) {
		(function(j) {
			buttonList[j].onclick=function() {
				console.log("button:"+(j+1));
			}
		})(i);
};
{% endhighlight %}

####在线demo

[demo例子](/demo/eventlistener.html)
