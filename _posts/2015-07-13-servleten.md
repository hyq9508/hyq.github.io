---
layout: post
title: servlet中request.getparameter()出现中文乱码
modified: 2015-07-13
categories: [servlet]
tags:
  - servlet
comment: true
---

####问题描述

在servlet中使用request.getParameter时，可能会出现中文乱码的问题，这是为什么呢

####原因解释

首先，客户端http请求默认是ISO-8859-1的编码方式来传送url的，服务端也是默认以ISO-8859-1来将字节流转化成字符串。
假如说页面中设置了<code><meta charset=utf-8></code>,那么发送请求时，url是以UTF-8发送字节流，而服务端使用request.getparameter直接得到的字符串，也就是用ISO-8859-1将字节流转化成字符串，因此出现乱码。
简而言之，一个字符串，以什么编码方式转化成字节流，就要用什么编码方式还原

####解决办法

request.getparameter的解码方式我们没有办法改变，但是可以将得到的字符串再以ISO-8859-1转化成字节流，这样就回到了初始时服务端收到了UTF-8编码的字节流，使用new String(byte,"UTF-8")就可以得到正确的字符串
使用如下语句可以得到正确的字符串：
{% highlight java %}
String request=new String(request.getParameter("key").getBytes("ISO-8859-1"),"UTF-8")
{% endhighlight %}