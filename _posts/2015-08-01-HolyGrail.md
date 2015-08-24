---
layout: post
title: 圣杯布局
publish: true
modified: 2015-08-1
categories: [css]
tags: 
   - css
comment: true
---

说起圣杯布局真的是老生长谈啊，又叫双飞翼布局。最开始是Kevin Cornell在2006年提出的一个布局模型概念，其布局要求如下：


1. 三列布局，两边定宽，中间自适应
2. 中间内容要求优先展示渲染
3. 允许任意列的高度最高
4. 要求只用一个额外的div标签
5. 最简单的css，最少的hack语句


效果图如下(先不考虑边距):
![圣杯布局](/images/diagram_05.gif)

####首先定义html结构：要优先加载中间内容，因此在布局时应将中间内容放在最前

{% highlight html lineons %}
<div id="header">header</div>
<div id="container">
	<div id="center" class="column">center</div>
	<div id="left" class="column">left</div>
	<div id="right" class="column">right</div>
</div>
<div id="footer">footer</div>
{% endhighlight %}

####定义container的宽度，给左右都预留出左右列的宽度

{% highlight css lineons %}
#container{
	padding-left: 200px;   /* LC width */
 	padding-right: 150px;  /* RC width */
}
{% endhighlight %}

效果如下：
![圣杯布局](/images/diagram_01.gif)


####不用多说，我们需要定义左浮动，为每一列设置好宽度：

{% highlight css lineons %}
body{
	min-width:650px;
}
#container{
	padding-left: 200px; 
 	padding-right: 150px; 
}
#container.column{
	float:left;
}
#left{
	width:200px;
}
#right{
	width:150px;
}
#footer{
	clear:both;
}
{% endhighlight %}


根据，左浮动元素布局的规则，中间列会在第一行，占满整个container，左边列和右边列依次放在第二行，效果图如下：

![圣杯布局](/images/diagram_02.gif)



####现在需要将左边列放到中间列的前方，在container中，由于中间列的宽度占的100%，而左边列在中间列后面，即中间列距离container中元素起始位置的宽度也为100%，于是我们可以添加一句话达到效果


{% highlight css lineons %}
#left{
	width:200px;
 	margin-left:-100%; 
}
{% endhighlight %}

效果图如下：
![圣杯布局](/images/diagram_03.gif)



####将左边列放到container的左边距中，可以使用相对定位，将左边列的右边界向左移动200px
{% highlight css lineons %}
#container.column{
	float:left;
	postion:relative;
}
#left{
	width:200px;
 	margin-left:-100%; 
 	right:200px;
 	_left: 200px; /*IE6 hack*/
}
{% endhighlight %}
效果图如下：
![圣杯布局](/images/diagram_04.gif)



####最后将右边列放到container的右边距中，就ok了，使用负的外边距，设置右边框距离中间列的边框为负的右边列的宽度即可达到效果：
{% highlight css lineons %}
#right{
	width:150px;
	margin-right:-150px;
}
{% endhighlight %}


附上demo:[圣杯布局](/demo/HolyGrail.html)

参考文献：[http://www.alistapart.com/articles/holygrail/](http://www.alistapart.com/articles/holygrail/, "圣杯布局")