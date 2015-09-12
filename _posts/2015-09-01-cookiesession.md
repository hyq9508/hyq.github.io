---
layout: post
title: cookie 和session 的区别
publish: true
modified: 2015-09-01
categories: [web]
tags: 
   - web安全
comment: true
---

####两者定义

1.<strong>cookie</strong>：Cookie技术是客户端的解决方案，Cookie就是由服务器发给客户端的特殊信息，而这些信息以文本文件的方式存放在客户端，然后客户端每次向服务器发送请求的时候都会带上这些特殊的信息。让我们说得更具体一些：当用户使用浏览器访问一个支持Cookie的网站的时候，用户会提供包括用户名在内的个人信息并且提交至服务器；接着，服务器在向客户端回传相应的超文本的同时也会发回这些个人信息，当然这些信息并不是存放在HTTP响应体（Response Body）中的，而是存放于HTTP响应头（Response Header）；当客户端浏览器接收到来自服务器的响应之后，浏览器会将这些信息存放在一个统一的位置。

如果你把Cookies看成为http协议的一个扩展的话，其实本质上cookies就是http的一个扩展。有两个http头部是专门负责设置以及发送cookie的,它们分别是Set-Cookie以及Cookie。当服务器返回给客户端一个http响应信息时，其中如果包含Set-Cookie这个头部时，意思就是指示客户端建立一个cookie，并且在后续的http请求中自动发送这个cookie到服务器端，直到这个cookie过期。如果cookie的生存时间是整个会话期间的话，那么浏览器会将cookie保存在内存中，浏览器关闭时就会自动清除这个cookie。另外一种情况就是保存在客户端的硬盘中，浏览器关闭的话，该cookie也不会被清除，下次打开浏览器访问对应网站时，这个cookie就会自动再次发送到服务器端。一个cookie的设置以及发送过程分为以下四步：

1. 客户端发送一个http请求到服务器端(Http Request)
2. 服务器端发送一个http响应到客户端，其中包含Set-Cookie头部(Http Response+ Set-Cookie) 
3. 客户端发送一个http请求到服务器端，其中包含Cookie头部 (Http Request+Cookie)
4. 服务器端发送一个http响应到客户端(Http Response)


--------------------------------------------------------------------------------



其中cookie包含以下字段：


| 字段       |    说明    |
| Name       |    Cookie名称	 |
| Value      |    Cookie值	 |
| Domain	 |	   用于指定Cookie的有效域	 |
| Path     	 |   用于指定cookie的有效URL路径	 |
| Expires	 |    用于指定cookie的有效时间	 |
| Secure     |	   如果设置该属性，仅在https请求中提交该cookie	 |
| Http       |    如果设置该属性，客户端JavaScript就无法获取操作cookie    |

<em>注意</em>：Cookie中保存中文只能编码。一般使用UTF-8编码即可。不推荐使用GBK等中文编码，因为浏览器不一定支持，而且JavaScript也不支持GBK编码。

我们可以看看百度的cookie
![百度cookie](/images/cookie.png)


--------------------------------------------------------------------------------


2.<strong>Session</strong> :除了使用Cookie，Web应用程序中还经常使用Session来记录客户端状态。Session是服务器端使用的一种记录客户端状态的机制，使用上比Cookie简单一些，相应的也增加了服务器的存储压力。

Session技术则是服务端的解决方案，它是通过服务器来保持状态的。由于Session这个词汇包含的语义很多，因此需要在这里明确一下 Session的含义。首先，我们通常都会把Session翻译成会话，因此我们可以把客户端浏览器与服务器之间一系列交互的动作称为一个 Session。从这个语义出发，我们会提到Session持续的时间，会提到在Session过程中进行了什么操作等等；其次，Session指的是服务器端为客户端所开辟的存储空间，在其中保存的信息就是用于保持状态。从这个语义出发，我们则会提到往Session中存放什么内容，如何根据键值从 Session中获取匹配的内容等。

要使用Session，第一步当然是创建Session了。那么Session在何时创建呢？当然还是在服务器端程序运行的过程中创建的，不同语言实现的应用程序有不同创建Session的方法，Session对应的类为javax.servlet.http.HttpSession类。在Java中是通过调用HttpServletRequest的getSession方法（使用true作为参数）创建的。在创建了Session的同时，服务器会为该Session生成唯一的Session id，而这个Session id在随后的请求中会被用来重新获得已经创建的Session；在Session被创建之后，就可以调用Session相关的方法往Session中增加内容了，而这些内容只会保存在服务器中，发到客户端的只有Session id；当客户端再次发送请求的时候，会将这个Session id带上，服务器接受到请求之后就会依据Session id找到相应的Session，从而再次使用之。正式这样一个过程，用户的状态也就得以保持了。

我们来看看session的内容：
![极客学院session](/images/session.png)


####cookie和session的区别

1. Cookie数据保存在客户端，Session保存在服务器
2. 服务端保存状态机制需要在客户端做标记，所以session可能借助cookie机制，比如服务器返回的sessionId存放的容器就是cookie（注意：有些资料说ASP解决这个问题，当禁掉cookie，服务端的session任然可以正常使用，ASP没试验过，但是对于网络上很多用php和jsp编写的网站，我发现禁掉cookie，网站的session都无法正常的访问）
3. Cookie通常用于客户端保存用户的登录状态
4. 单个cookie在客户端的限制是3K，就是说一个站点在客户端存放的COOKIE不能超过3K



