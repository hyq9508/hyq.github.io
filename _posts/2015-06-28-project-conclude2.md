---
layout: post
title: 学习笔记(二)之Html5 Web 存储
modified: 2015-06-27
categories: [html5, DOM, javascript, css]
tags:
  - html5
  - localStorage
  - 浏览器
comment: true
---

###1.Html5 Web 存储(localStorage与sessionStorage)

####为什么使用Storgae

* cookie:限制数据大小为4k，而且不支持组织持久数据，并且每次发送同源的请求时，cookie数据都会跟着一起发过去。
* Storage对于不同浏览器分配的大小不同，chrome中是5M，主流浏览器一般都在5-10M，这里的大小限制是指一个子域最大课使用的空间。这可比cookie好用太多了，数据存在本地，这就意味着可以离线使用啊，很赞对不对

<em>注意：localStorage不能设置有效期，写入之后永远存在，可以使用clear()清除，我设想是可以在写入时就定义一个访问次数字段，每次读取时都+1，次数累计到一个值后，读取完毕后删除这些数据，不知道</em>

####Storage类型及兼容

主要分为localStorage与sessionStorage，顾名思义，localStorage是没有时间限制的数据存储，sessionStorage是针对一个会话的数据存储。还有一个 globalStorageglobalStorage，不是Storage的实例，而是StorageObsolete的一个实例。，非标准接口，很多浏览器也不再支持，还是不要用的好.

当然，不是所有浏览器都支持storage的，移动版支持性能还不明，0pera HD版上是支持的，但电脑端支持情况如下：


| Storage(Desktop) | Chrome | Firefox (Gecko) |   IE   |  Opera | Safari (WebKit) |
|  localStorage    |   4    |       3.5       |    8   |  10.50 |     4           |
|  sessionStorage  |   5    |       2         |    8   |  10.50 |     4           |
|  globalStorage   | 未实现 |      2-13       | 未实现 | 未实现 |    未实现       |

从上面的表格可以看到，这个新属性对于IE8以下并没有什么用，如果你想要去兼容IE8以下版本的话，在使用前，要判断一下是否支持storage属性，然后用cookie来实现。之后我们会附上方法。先来看看怎么使用Storage。

####Storage使用

使用前先检测一下浏览器是不是能支持storage，可以使用特征检查。如下：

{% highlight javascript lineons %}
window.localStorage&&window.localStorage.getItem
{% endhighlight %}

Storage被定义在WhatWG Storage Interface 中,如下:

{% highlight javascript lineons %}
interface Storage {
  readonly attribute unsigned long length;
  [IndexGetter] DOMString key(in unsigned long index);
  [NameGetter] DOMString getItem(in DOMString key);
  [NameSetter] void setItem(in DOMString key, in DOMString data);
  [NameDeleter] void removeItem(in DOMString key);
  void clear();
};
{% endhighlight %}

对应的使用方法为：

* length：只读属性，本地存储数据的个数
* key(i): 获得第i个数据的值
* getItem(key): 得到字段为key的值
* setItem(key, value)：向key字段中写入值value
* removeItem(key): 从本地数据中移除key字段
* clear(): 清除同一个域下的所有数据

<em>注意：storage和cookie一样，以键值对的方式存储数据。在存储数据前，不管value值是什么类型，都会被toString方法转化成字符串存储，一般的做法都是使用浏览器提供的JSON或者是序列化方法来存取对象。</em>

举个例子：

{% highlight javascript lineons %}
var ls=localStorage;
var data={
  user:"John",
  sex:"female"
};
ls.setItem('data',data);
ls.setItem('realData',JSON.stringify(data));
console.info(ls.data); //[object Object]
console.info(ls.realData); //{"user":"John","sex":"female"}
{% endhighlight %}


####不支持Storge怎么办

对于IE6和IE7，也可以使用userData，最多提供1024kb的空间，并且可以设置有效期，但是仍然存在写满报错的问题，并且userData创建的存储文件不能被枚举，因此需要人为地维护。
另外还可以使用内嵌flash控件，使用flash的本地存储空间，flash默认提供100kb，使用更多需要用户授权。

下面给大家介绍一个办法，使用cookie模拟Storage的操作，来自MDN官网，亲测好使

{% highlight javascript lineons %}
if (!window.localStorage) {
  window.localStorage = {
    getItem: function (sKey) {
      if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
      return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    },
    key: function (nKeyId) { return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]); },
    setItem: function (sKey, sValue) {
      if(!sKey) { return; }
      document.cookie = escape(sKey) + "=" + escape(sValue) + "; path=/";
      this.length = document.cookie.match(/\=/g).length;
    },
    length: 0,
    removeItem: function (sKey) {
      if (!sKey || !this.hasOwnProperty(sKey)) { return; }
      var sExpDate = new Date();
      sExpDate.setDate(sExpDate.getDate() - 1);
      document.cookie = escape(sKey) + "=; expires=" + sExpDate.toGMTString() + "; path=/";
      this.length--;
    },
    hasOwnProperty: function (sKey) { return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie); }
  };
  window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
}
{% endhighlight %}

(PS:今天晚上在餐馆吃饭的时候碰到一个超帅的男生，聊了两句眼睛放亮啊，一整个晚上心情都超好)



















