---
layout: post
title: Jekyll使用时遇到的各种小问题
publish: true
modified: 2015-06-23
categories: [jekyll, markdown, ruby, scss]
tags: 
   - jekyll
   - 图片路径
   - Ruby
   - markdown
comment: true
---

###图片路径异常

####1.问题描述

在博客中插入图片，在首页上是显示正常的，但是到了其他页面(比如归档页面)却没办法正常显示，图片插入方式如下：

{% highlight html %}
<img title="{{site.author}}" src="{{site.aboutme_photo}}" alt="{{site.author}}"/>
{% endhighlight %}

_config.yml中的相关部分定义如下：

{% highlight Bash shell script %}
aboutme_photo: images/aboutme.jpg
{% endhighlight %}

####2.问题解决

在主页时，查看图片路径，正常；进到关于页面时，图片路径出错。原来是进入该页面时，所有的文章都进入到相应的目录下比如<code>about/index.html</code>,而我把图片的路径设置为了相对路径，那么图片的路径也就会变成<code>about/image/aboutme_photo.jpg</code>，因此出错。

只要把路径改为绝对路径，即相对于blog的根目录的路径：<code>aboutme_photo: /images/aboutme.jpg</code>
---------------------------------------------------------
###jekyll在windows下中文编码报错

####1.问题描述

用jekyll写一个之前已经写了一半的页面时，编译时发现编码报错，这是搞什么鬼啊啊啊，仔细想过之后找到了问题所在，之前写的时候是拿sublime写的，这回为了方便就直接用记事本写的，记事本的默认编码是<code>ASNI</code>的啊，我之前设置的jekyll读取本地文件的方式是<code>UTF-8</code>,因此出现了问题.

####2.问题解决：

1.先找到一个文件，文件名是<code>convertible.rb</code>,路径一般是：<code>D:\jekyll\ruby\Ruby21\lib\ruby\gems\2.1.0\gems\jekyll-2.5.3\lib\jekyll</code> ,
修改里面的这句话：

{% highlight java %}
self.content = File.read_with_options(File.join(base, name), merged_file_read_opts(opts))
改为：
self.content = File.read(File.join(base, name),:encoding=>"utf-8")
{% endhighlight %}

2.编辑代码的时候注意编辑器的编码格式，要和之前的设置保持一致，不然读取出错，如果是特别喜欢用记事本的话，可以参照这个修改=.=[http://blog.csdn.net/cenziboy/article/details/7341923](http://blog.csdn.net/cenziboy/article/details/7341923)

---------------------------------------------------------

###ruby编译scss出现invalid GBK错误

####问题描述：

在windows7上面，通过ruby编译scss时，发现编译报错，内容如下：

{% highlight Bash shell %}
Conversion error: Jekyll::Converters::Scss encountered an error while converting 'css/main.scss':
                         Invalid GBK character "\xE3" on line 315
{% endhighlight %}

虽然给出来了报错的原因，但是尼玛，main.scss总共也没有315行啊，而且并没有中文注释什么的。查找一番之后才发现，这里编译器报错的位置不一定是scss中的位置，也有可能是你在scss中引用了其他库中含有中文字符。我在scss中引入了字体文件，文件中包含了中文字符

####解决办法：

1.在ruby的安装目录下找到engine.rb文件，目录格式如<code> D:\ruby\Ruby21\lib\ruby\gems\2.1.0\gems\sass-3.4.15\lib\sass</code>在文件中添加一行<code>Encoding.default_external = Encoding.find('utf-8')</code> 在require语句结束处，如：

{% highlight css %}
require 'sass/media'
require 'sass/supports'
module Sass   
Encoding.default_external = Encoding.find('utf-8')
{% endhighlight %}

2.在scss文件的头部加一行@charset "utf-8"
