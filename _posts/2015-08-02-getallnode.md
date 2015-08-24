---
layout: post
title: JS获取所有宽高大于50的节点
publish: true
modified: 2015-08-02
categories: [JavaScript]
tags: 
   - JavaScript
comment: true
---

####js输出页面所有宽高大于50的节点

js获取所有节点，我们可以递归使用element.childNodes。
获取宽高可以用element.style.width来获得，需要注意的是，有可能有些节点不存在宽高，style.width获取到的可能是undefined，如果直接赋值的话，可能会报错
综上所述，代码如下：

{% highlight javascript lineons %}
function traverse (var node) {
	var oranode=[];
	node = node||document.body;
	if (node.nodeType == 1) {//element节点
		var height = parseInt(node.style.height,10)||0; //为了避免if中比较报错，添加默认值0
		var width = parseInt(node.style.width,10)||0;
		if (height>50&&width>50) {
			oranode.push(node);
		};
	};
	var childnodes = node.childNodes;
	for (var i = 0; i < childnodes.length; i++) {
		oranode.splice(0,0,traverse(childnodes[i]));
	};
	return oranode;
}	
{% endhighlight %}

