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

* IE8及以下添加监听使用的是attchEvent，并且响应函数里this的值是window对象而不是触发事件的元素
* 获取元素之前的宽高时，用先获取到元素的宽高，这里就可以用我们之前讨论过的方法，IE用element.currentStyle,其他用<code>window.getComputedStyle(element,[, pseudoElt])</code>,不清楚的看这里->[获取样式表](/_posts/2015-06-27-project-conclude.md)
* 利用parseInt转化类型时，如果在字符串开始处无法获得任何数字，会返回NaN，IE中用currentStyle获取样式表的话，如果margin未定义的话，值是auto
* 想要获取元素的最终样式，如果你这么写：

{% highlight javascript lineons %}
var style=window.getComputedStyle(e)||e.currentStyle;
{% endhighlight %}

IE8及以前就会报错，说不支持getComputedStyle属性或方法，IE中，如果碰到未定义的变量就会开始报错，不管是不是在if判断句还是或运算符前，不知道这不是一个bug啊，按理说第一句为假的时候应该要判断后面一句的啊，现在我们只能调换顺序了

js代码如下：

{% highlight javascript lineons %}
/**attachEvent响应函数中this的值会变成window对象而不是触发事件的元素*/
	function returnEvent(e) {
		if (e.target) {
			return e.target;	
		} else if(e.srcElement){
			return e.srcElement;
		};
	}；
		/**针对IE中currentStyle获取到的属性值可能是auto，导致转化成int时出现NaN的情况**/
	function improInt (attr) {
		if (parseInt(attr)) {
			return parseInt(attr);
		} else{
			return 0;
		};
	}
	/**div变大***/
	function bigger(e) {
		var node=returnEvent(e);
		if (!!node&&node.nodeName.toUpperCase()=="DIV") {
			node.style.zIndex=100;
			var style=(node.currentStyle||window.getComputedStyle(node));//非IE和IE
			node.style.width=1.2*improInt(style.width)+"px";//宽度放大1.2倍
			node.style.height=1.2*improInt(style.height)+"px";//高度放大1.2倍
			node.style.marginTop=(improInt(style.marginTop)-20)+"px";
			node.style.marginLeft=(improInt(style.marginLeft)-20)+"px";
			node.style.backgroundColor="red";
		};
	}
	/**鼠标离开时，图片恢复原样**/
	function smaller(e) {
		var node=returnEvent(e);
		console.log("returnEvent(e)"+returnEvent(e));
		if (!!node&&node.nodeName.toUpperCase()=="DIV") {
			node.style.zIndex=0;
			var style=node.currentStyle||window.getComputedStyle(node);//非IE和IE
			node.style.width=improInt(style.width)/1.2+"px";
			node.style.height=improInt(style.height)/1.2+"px";//高度缩减1.2倍
			node.style.marginTop=(improInt(style.marginTop)+20)+"px";
			node.style.marginLeft=(improInt(style.marginLeft)+20)+"px";
			node.style.backgroundColor="grey";
		};
	}
	//在document上监听鼠标事件
	if (document.addEventListener) {//其他浏览器和IE8以上都支持
		document.addEventListener('mouseover',bigger,false);
		document.addEventListener('mouseout', smaller, false);
	} else if(document.attachEvent){//IE8及以下下事件监听使用的是attachEvent
		document.attachEvent('onmouseover',bigger);
		document.attachEvent('onmouseout',smaller);
	};
	
{% endhighlight %}

####具体实现：

具体实现：[DEMO例子](/demo/changeSize.html)
