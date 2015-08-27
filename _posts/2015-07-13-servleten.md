---
layout: post
title: servlet中文乱码
modified: 2015-07-13
categories: [servlet]
tags:
  - servlet
comment: true
---

###问题描述


在servlet中可能经常会出现中文乱码的情况，大致分为以下三种
* 表单处理(get/post)
* 超链接(<a href="www.baidu.com?name=测试"></a>)
* sendRedirect()乱码(response.sendRedirect("test.servlet?username=测试"))

###原因解释及解决方案

------------------------------------------------------

####表单处理

首先，浏览器默认一般都是UTF-8的方式编码的，而服务端默认以ISO-8859-1编码，也是以此方式来将字节流转化成字符串。
假如说页面中设置了<code><meta charset=utf-8></code>,那么发送请求时，url是以UTF-8发送字节流，而服务端使用request.getparameter直接得到的字符串，也就是用ISO-8859-1将字节流转化成字符串，因此出现乱码。
简而言之，一个字符串，以什么编码方式转化成字节流，就要用什么编码方式还原

* post提交:

解决方法：在接收方的request.setCharacterEncoding('utf-8');

* get提交：

如果你使用以上的方法的话，结果还是乱码，原因在于，get方法中数据是在请求行中的，不是封装在请求体，而setCharacterEncoding针对的是请求体中的内容，
解决方法：
{% highlight java %}
String request=new String(request.getParameter("key").getBytes("ISO-8859-1"),"UTF-8")
{% endhighlight %}

这样写看起来很麻烦，我们可以把他写成一个工具类，

{% highlight java %}
public class MyTools{
	public static String getNewString(String str){
	String newstr=new String(str.getBytes("iso-8859-1"),"utf-8");
	return newstr;
	}
}
{% endhighlight %}

------------------------------------------------------


####超链接

从超链接的格式上可以看到，他本质上使用的get方式提交，那我们可以使用get提交的解决方案来解决此问题

------------------------------------------------------

####sendRedirect()

在使用sendRedirect发送数据之前，如果数据中有中文字段，需要先转化一下编码方式，用以下这种办法，也可以解决IE6中乱码的问题

{% highlight java %}
String message = "测试";
message = URLEncoder.encode(message,"GBK");
response.sendRedirect(url+"?message ="+message);
{% endhighlight %}
