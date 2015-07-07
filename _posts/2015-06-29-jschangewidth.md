---
layout: post
title: JS控制鼠标悬浮时放大元素，不影响其他元素布局
modified: 2015-06-29
categories: [javascript,EventListener]
tags:
  - javascript
  - 布局
comment: true
---

####问题描述


第一部分：
用CSS控制3个<div>标签实现下面这个布局

![buju](http://images.cnitblog.com/blog/294743/201306/23085438-9c875439cc6c4c598cffbded27e972c4.jpg)

第二部分：用javascript优化布局

由于我们的用户群喜欢放大看页面，于是我们给上一题的布局做一次优化。当鼠标略过某个区块的时候，该区块会放大25%，并且其他的区块仍然固定不动。

![jsxiaoguo](http://images.cnitblog.com/blog/294743/201306/23095227-e430ecd915844e48b71259dfaadc7270.gif)

---------------------------------------------------

####实现思路

第一部分，可以用float，也可以absoulte，看大家喜欢了，这里我使用的是absolute定位，将右边的主要内容放在前面，这样能够先加载主要内容，代码如下

{% highlight css lineons %}
div{
		background-color:grey;
		position:absolute;
	}
	#main{
		margin-left: 210px;
		height: 500px;
		width: 300px;

	}
	#left1{
		width: 200px;
		height: 245px;
	}
	#left2{
		width:200px;
		height:245px;
		top:255px;
		margin-top:10px;
	}
{% endhighlight %}

第二部分：

鼠标滑过时，将zIndex设为100，不影响其他元素布局，离开时恢复

使用事件代理，直接通过document监听鼠标

鼠标滑过时，宽高变为120%，将margin-top和margin-left减小20px；

如果图片大小都差不多大话，可以将边距减少10%，效果还比较好

在这里要注意以下几点：

* IE8及以下添加监听使用的是attchEvent，并且响应函数里传的element节点，而addEventlistener响应函数里传的是点击事件
* 获取元素之前的宽高时，用先获取到元素的宽高，这里就可以用我们之前讨论过的方法，IE用element.currentStyle,其他用<code>window.getComputedStyle(element,[, pseudoElt])</code>,不清楚的看这里->[获取样式表](/_posts/2015-06-27-project-conclude.md)

{% highlight javascript lineons %}
//在document上监听鼠标事件
		if (document.addEventListener) {//其他浏览器和IE8以上都支持
			document.addEventListener('mouseover',bigger,false);
			document.addEventListener('mouseout', smaller, false);
		} else if(document.attachEvent){//IE8一下事件监听使用的是attachEvent
			document.attachEvent('onmouseover',bigger);
			document.attachEvent('onmouseout',smaller);
		};
/**attachEvent传的参数是element节点，addeventlistener传的参数是事件对象，函数返回element*/
		function returnNode (e) {
			if (e.target) {//假设node传过来的是事件对象
				return e.target;
			} else{//传过来的是节点对象
				return e;
			};
		}

		/**div变大***/
		function bigger (node) {
			var e=returnNode(node);
			if (!!e&&e.nodeName.toUpperCase()=="DIV") {
				e.style.zIndex=100;
				var style=window.getComputedStyle(e)||e.currentStyle;//非IE和IE

				e.style.width=1.2*parseInt(style.width)+"px";//宽度放大1.2倍
				e.style.height=1.2*parseInt(style.height)+"px";//高度放大1.2倍
				e.style.marginTop=(parseInt(style.marginTop)-20)+"px";
				e.style.marginLeft=(parseInt(style.marginLeft)-20)+"px";
				e.style.backgroundColor="red";
			};
		}
		/**鼠标离开时，图片恢复原样**/
		function smaller (node) {
			var e=returnNode(node);
			if (!!e&&e.nodeName.toUpperCase()=="DIV") {
				e.style.zIndex=0;
				var style=window.getComputedStyle(e)||e.currentStyle;//非IE和IE
				e.style.width=parseInt(style.width)/1.2+"px";
				e.style.height=parseInt(style.height)/1.2+"px";//高度缩减1.2倍
				e.style.marginTop=(parseInt(style.marginTop)+20)+"px";
				e.style.marginLeft=(parseInt(style.marginLeft)+20)+"px";
				e.style.backgroundColor="grey";
			};
		}
		
{% endhighlight %}


具体实现：[DEMO例子](/demo/changeSize.html)
