---
layout: post
title: 屏蔽chrome(webkit)中的input.textarea的默认点击/聚焦高亮的样式
publish: true
modified: 2015-07-01
categories: [css, 浏览器]
tags: 
   - css
comment: true
---

Webkit作为一个开源的浏览器引擎，而且apple和google都大力推广，其重要性不言而喻
chrome和Safari浏览器中添加了一些小功能

1.input标签/textarea标签聚焦高亮
屏蔽方法：
{% highlight css %}
input, textarea{outline: none;}
{% endhighlight %}

2.textarea标签缩放
去掉缩放：
{% highlight css %}
/**css2.0*/
textarea {width: 400px; max-width: 400px; height: 400px; max-height: 400px; }
/**css3.0*/
textarea{resize: none;}
{% endhighlight %}

注意：如果考虑兼容webkit核心的浏览器，要注意输入框(文本框)要尽量保持原来的样式。
当你隐藏了点击前的样式，又忘记去掉聚焦之后的默认样式，webkit引擎浏览器就会出现问题。


