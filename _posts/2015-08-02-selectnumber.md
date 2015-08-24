---
layout: post
title: 选择数组中第k大的元素
modified: 2015-08-02
categories: [算法]
tags:
  - 算法
comment: true
---

查找数组中第k大的元素，能想到的有以下这么几种方法：

1. 选择排序，扫描k次，返回第k次扫描的结果，当然时间复杂度为O(K*N)，时间长度取决于K的大小

2. 使用快排，排好序之后，返回array[k-1]，时间复杂度等于快排的时间复杂度O(N*logN)

3. 堆排序，使用array[0..k-1]构造大根堆，将剩余元素依次与根节点比较，如果大于根节点，则交换元素值，重新构建大根堆，最后返回根节点。时间复杂度为O(N*logK)

4. 堆排序，将数组构造成大根堆，依次提取当前堆中最大的元素，时间复杂度为O(K*logN)

5. 二分查找，相当于查找大于最大的K个数中最小的数，举例如下：

{% highlight java lineons %}
while(max-min > 0){
	int mid = (max+min)/2;
	if(f(s,N,mid)>k){
		min = mid;
	}else{
		max = mid;
    }
}
{% endhighlight %}

f(s,N,mid)返回的是s[1..N]中大于mid的元素的个数，函数运行结束之后，会得到一个(min,max)区间，其中都是第k大的元素