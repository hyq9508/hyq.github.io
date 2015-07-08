var d=document.getElementById('task-list');//左侧栏的分类列表的父容器
var d_active=document.getElementById('init_active');//左侧栏中获得焦点的选项
var task_info=document.getElementById('task-info');//中间栏的任务信息列表
var btn_status=document.getElementById('btn-status');//三个任务状态按钮的父容器
var btn_active=document.getElementById('all-task');//三个按钮中的焦点按钮，默认是第一个
var m_active;//中间栏显示在右边的任务
var content=document.getElementById('task_content');//右侧栏的事件内容
var myTitle=document.getElementById('yourtitle');//右侧栏上方的标题
var mydate=document.getElementById('yourdate');//右侧栏上方的日期
var spanTitle=myTitle.parentNode.getElementsByTagName('span')[0];//显示的标题
var spanDate=mydate.parentNode.getElementsByTagName('span')[0];//显示的时间
var right_btn=document.getElementById('right_btn');//新建任务后是否保存按钮的父元素
var twoLabel=right_btn.parentNode.getElementsByTagName('label');//两个label
var textarea=document.getElementById('textarea');//内容输入框
var overlay=document.getElementById('overlay');//阴影层
var popup=document.getElementById('popup');//弹出框
var cancel_btn=document.getElementById('cancel_pop');//弹出框的取消按钮
var ensure_btn=document.getElementById('ensure_pop');//弹出框的确认按钮
var master_name=document.getElementById('master');//弹出框的总分支选择框
var chlid_list=document.getElementById('child_list');//弹出框上子分支的输入框
window.onload= function init () {
	storage_init();
	storage_read();
	d_active=first_child(d);
	if(first_child(task_info)){
		m_active=node_after(first_child(task_info));
	}
	// console.log(d_active.innerHTML);
	d_active.classList.add('active');
}

Object.defineProperty(Element.prototype, 'classList', {
    get: function() {
        var self = this, bValue = self.className.split(" ")

        bValue.add = function (){
            var b;
            for(i in arguments){
                b = true;
                for (var j = 0; j<bValue.length;j++)
                    if (bValue[j] == arguments[i]){
                        b = false
                        break
                    }
                if(b)
                    self.className += (self.className?" ":"")+arguments[i]
            }
        }
        bValue.remove = function(){
            self.className = ""
            for(i in arguments)
                for (var j = 0; j<bValue.length;j++)
                    if(bValue[j] != arguments[i])
                        self.className += (self.className?" " :"")+bValue[j]
        }
        bValue.toggle = function(x){
            var b;
            if(x){
                self.className = ""
                b = false;
                for (var j = 0; j<bValue.length;j++)
                    if(bValue[j] != x){
                        self.className += (self.className?" " :"")+bValue[j]
                        b = false
                    } else b = true
                if(!b)
                    self.className += (self.className?" ":"")+x
            } else throw new TypeError("Failed to execute 'toggle': 1 argument required")
            return !b;
        }

        return bValue; 
    },
    enumerable: false
});



/**IE9以下不支持getElementByClassName的兼容**/
	if(!document.getElementsByClassName){
        document.getElementsByClassName = function (cls){
            var ret = [];
            var els = document.getElementsByTagName('*');
            for(var i = 0 ; i < els.length; i++){
                if(els[i].className === cls 
                   || els[i].className.indexOf(cls + ' ') > -1 
                   || els[i].className.indexOf(' ' + cls + ' ') > -1 
                   || els[i].className.indexOf(' ' + cls) > -1){
                   ret.push(els[i]);
                }    
            }
            return ret;
        }
    };
/***兼容不能使用localStorage的版本，使用cookie来模拟localStorage的操作****/
ls=window.localStorage?localStorage:function() {
if (!window.localStorage) {
	console.log("not surpost localStorage");
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
}
/**
 *
 * @参数   data  任务对象
 * @传回值      有两种可能：
 *               1) 参数为null时，将右侧栏任务信息恢复空白
 *               2) 不为null时，设置task信息
 */
/*****设置任务信息******/
function setTaskInfo (date) {
	if (!!date) {
		if (date.status==1) {
			var status= "(已完成)";
		}else{
			var status= "(未完成)"
		}
		spanDate.innerHTML=date.date;
		spanTitle.innerHTML=date.title+status;
		content.innerHTML=date.content;
	}else{
		spanDate.innerHTML="";
		spanTitle.innerHTML="";
		content.innerHTML="";
	}
	
}

/**
 *
 * @参数   e  	window对象或者是目标元素事件
 * @传回值      目标节点
 */
function returnNode (e) {
	if (e.target) {
		return e.target
	} else if (e.srcElement) {
		return e.srcElement;
	}else if(e.nodeType==1){
		return e;
	}
}

/**************************左侧列表******************************************/

/**使用代理监听来响应左侧栏的点击事件，在其父元素上捕获事件***/
if (d.addEventListener) {
	d.addEventListener('click',leftList,false);
} else if (d.attchEvent) {
	d.attchEvent('onclick',leftList);
};

/**左侧栏列表的响应函数*/
function leftList (e) {
	var target=returnNode(e);
	if (target&&(target.nodeName.toUpperCase()=='H3'||target.nodeName.toUpperCase()=='LI')) {
		//清除原本列表的任务信息
			var listarr=task_info.getElementsByTagName('li');
			console.log('原本任务表中有多少li：'+listarr.length);
			d_active.classList.remove('active');
			d_active=target;
			d_active.classList.add('active');
			var len=listarr.length;
			for (var i = 0; i <len; i++) {
			task_info.removeChild(listarr[0]);
			};
			setTaskInfo();
		if (target.nodeName.toUpperCase()=='H3') {
			var ulnode=node_after(target);
			if(ulnode&&ulnode.nodeName.toUpperCase()=="UL"){
				var arr=ulnode.getElementsByTagName('li');
				for (var i = 0; i < arr.length; i++) {
				var li_name=arr[i].innerHTML;
				var datarr=json_parse(ls[li_name]);
				if (datarr) {
					for (var j = 0; j < datarr.length; j++) {
						addtask_info(datarr[j]);
			    	}; 
				}
				};
			};
			
		} else{
			var datarr=json_parse(ls[e.target.innerHTML]);
			if (datarr!=null) {
				for (var j = 0; j < datarr.length; j++) {
				addtask_info(datarr[j]);
			    };
			}
		};
		m_active=node_after(first_child(task_info));
		if (datarr) {
			setTaskInfo(datarr[0]);
		} else{
			setTaskInfo();
		};
	};

}



/******点击左侧的添加按钮，显示弹出框相关内容*****/
var add_btn=document.getElementsByClassName('add_btn')[0];
console.log(add_btn);
add_btn.onclick=function(e) {
	overlay.style.display="block";
	popup.style.display="block";
	var data_list=json_parse(ls['master']);
	for (var i = master_name.options.length-1; i < data_list.length; i++) {
			var option=document.createElement('option');
			var textnode=document.createTextNode(data_list[i]);
			option.appendChild(textnode);
			master_name.appendChild(option);
		
	};
}

/*******************************************中间栏************************************/

/******点击三个状态按钮的响应函数*******/
function middleButton (e) {
	var target=returnNode(e);
	if (!!target&&target.nodeName.toUpperCase()=='BUTTON') {
		if (target!=btn_active) {//当前的焦点按钮与点击的按钮不一致时，才查询更改列表
			//清楚之前的任务列表
			var a=task_info.getElementsByTagName('li');
			var len=a.length;
			for (var i = 0; i < len; i++) {
			task_info.removeChild(a[0]);
			};
			setTaskInfo();
			var taskarr;
			if (target==document.getElementById('all-task')) {//显示所有任务
				taskarr=findAlltask();
				for (var i = 0; i < taskarr.length; i++) {
					addtask_info(taskarr[i]);
				};
			}else if (target==document.getElementById('finished-task')) {//显示所有已完成任务
				taskarr=findAlltask(1);
				for (var i = 0; i < taskarr.length; i++) {
						addtask_info(taskarr[i]);
				};
			}else if (target==document.getElementById('unfished-task')) {//显示所有未完成任务
				taskarr=findAlltask(0);
				for (var i = 0; i < taskarr.length; i++) {
						addtask_info(taskarr[i]);
				};
			};
			setTaskInfo(taskarr[0]);
			btn_active=target;

		};
	};
}

if (btn_status.addEventListener) {
	btn_status.addEventListener('click',middleButton,false);
} else if (btn_status.attchEvent) {
	btn_status.attchEvent('onclick',middleButton);
};




/*******点击中间栏的列表的响应函数*******/
function middlelist (e) {
		var tar=returnNode(e);
		console.log("目标节点是："+tar);
	if (tar.nodeName.toUpperCase()=="LI") {
		console.log('监听到中间任务栏的事件列表');
		m_active=tar;//设置焦点列表项
		//注意：这里不能使用element.style方式来获取样式，因此element.style获取的是内联样式
		var dstyle=tar.currentStyle?tar.currentStyle:window.getComputedStyle(tar,null);
		console.log(dstyle.backgroundColor);
		if (dstyle.backgroundColor=='rgb(255, 255, 255)'||dstyle.backgroundColor=='#fff') {
			var dtitle=tar.innerHTML;//获得标题
			var ddate=tar.previousSibling.innerHTML;//获得日期
			console.log('监听到中间任务栏d-title:'+dtitle);
			console.log('监听到中间任务栏d-date'+ddate);
			var dateArr=json_parse(ls[d_active.innerHTML]);
		//	console.table(dateArr);
			if (d_active.nodeName.toUpperCase()=='LI'&&!!dateArr) {//属于二级列表中的内容
				for (var i = 0; i < dateArr.length; i++) {
					if (dtitle==dateArr[i].title&&ddate==dateArr[i].date) {
						setTaskInfo(dateArr[i]);

						break;
					};
				};
			}else{//属于一级列表中的内容
				for (var i = 0; i < dateArr.length; i++) {
					var dateArr2=json_parse(ls[dateArr[i]]);
					for (var j = 0; j < dateArr2.length; j++) {
						if (dtitle==dateArr2[j].title&&ddate==dateArr2[j].date) {
							setTaskInfo(dateArr2[j]);
							break;
						};
					};
					break;
				};
			};
		};
	}
}

/*****监听中间栏的任务列表，做出响应*******/
if (task_info.addEventListener) {
task_info.addEventListener('click',middlelist,false);

} else if (task_info.attchEvent) {
	task_info.attchEvent('onclick',middlelist);
};



/*****点击中间的添加按钮，新建任务********/
var AddNewTask=node_after(task_info.parentNode);
AddNewTask.onclick=function(e) {
	console.log(twoLabel);
	setTaskInfo();
	toggleRight(0);
	content.style.display="none";
//	console.table(textarea.style);
	textarea.parentNode.style.display="block";
	right_btn.style.display= "block";
	console.log("click the middle button");
}

/*******************************右侧栏***************************************/

/*******保存或者舍弃任务的按钮监听*******/
function rightcol (e) {
	var target=returnNode(e);
	var twoBtn=right_btn.getElementsByTagName('button');
	if (target==myTitle||target==mydate||target==textarea) {
		target.classList.remove('warnning');
	}else if (target&&target.nodeName.toUpperCase()=="BUTTON") {//点击保存或舍弃按钮
		if (target==twoBtn[0]) {//将新的任务存到localstorage
			console.log("右侧栏的保存按钮被点击");
			if (!myTitle.value||!mydate.value||!textarea.value) {//还有选项没有填写
				console.log("任务选项未填写全");
				if (!myTitle.value) {
					myTitle.classList.add('warnning');
				};
				if (!mydate.value) {
					mydate.classList.add('warnning');
				};
				if (!textarea.value) {
					textarea.classList.add('warnning');
				};
			}else{//所有选项均已填写
				console.log("任务选项均填写完整");
				var newtitle=myTitle.value;
				var newdate=mydate.value;
				var newtask=taskinfo_add(newdate,newtitle,textarea.value,0);//生成task对象
				toggleRight(1);//设置添加任务的几个元部件不可见
				setTaskInfo(newtask);//回复到之前的页面，并将任务显示在页面上
			
				//获得焦点的是一级分类H3
				if (d_active.nodeName.toUpperCase()=="H3") {
					console.log("左侧获得焦点的是一级分类");
					var ulnode=node_after(d_active);
					if (!!ulnode&&ulnode.nodeName.toUpperCase()=="UL") {//一级分类下已经存在二级分类
					var liinner=last_child(ulnode).innerHTML;
					storage_add(liinner,newtask);
					}else{  //该一级分类下并没有二级分类
						addli(d_active,newtitle);
						storage_add(d_active.innerHTML,newtitle);
						storage_add(newtitle,newtask);
					}
				}else if (d_active.nodeName.toUpperCase()=='LI') {
				storage_add(d_active.innerHTML,newtask);
			}
			//将添加的任务信息添加在中间栏
			addli(task_info,newdate);
			addli(task_info,newtitle);
			content.innerHTML=textarea.value;
			clearTask();
			}
		} else{//舍弃

			toggleRight(1);
			console.log("点击右侧的放弃按钮");
			middlelist(m_active);
			clearTask();
			myTitle.classList.remove('warnning');
			mydate.classList.remove('warnning');
			textarea.classList.remove('warnning');
		};	
	};
};
var rightCol=document.getElementsByClassName('right')[0];
console.log("右侧栏："+rightCol);
if (rightCol.addEventListener) {
	console.log("右侧栏被监听");
	rightCol.addEventListener('click',rightcol,false);
} else if (rightCol.attchEvent) {
	console.log("右侧栏被监听");
	rightCol.attchEvent('onclick',rightcol);
};

/**恢复右边的创建任务栏**/
function clearTask () {
	textarea.value="";
	textarea.parentNode.style.display="none";
	right_btn.style.display= "none";
	content.style.display="block";
}

/**添加列表项**/
function addli (ulnode,name) {
	var linode=document.createElement('li');
	var textnode=document.createTextNode(name);
	linode.appendChild(textnode);
	ulnode.appendChild(linode);
}

/*****右侧栏上方的几个元素，通过一个函数来设置显示与否*******/
function toggleRight (status) {
	var s=["inline","none"]
	if(status>0){
		mydate.value="";
		myTitle.value="";
	}
	mydate.style.display=s[status];
	myTitle.style.display=s[status];
	twoLabel[0].style.display=s[status];
	twoLabel[1].style.display=s[status];
}
/*****************************弹出框********************************************/
/**弹出框的监听以及相应函数***/
function popUp (e) {
	var target=returnNode(e);
	if (!!target&&target==chlid_list) {
		chlid_list.classList.remove('warnning');
	};
	

	if (target&&target.nodeName.toUpperCase()=="BUTTON") {
		var index=master_name.selectedIndex;
		var mnode=master_name.options[index];
		

		if (target==ensure_btn) {//确认按钮
			if (child_list.value=="") {//分类名为空
			chlid_list.classList.add('warnning');
			}else{//分类名不为空
				var master_content=mnode.text;
				if (index==0) {//新建主分类
					storage_add('master', child_list.value);
					var m=document.createElement('h3');
					var text=document.createTextNode(child_list.value);
					m.appendChild(text);
					d.appendChild(m);
				} else{//向已有的分支中添加子分支
					storage_add(master_content, child_list.value);
					var mm=find_master(master_content);//找到主分支
					var par_node;//定义二级列表的父元素
					if (mm.nextSibling.nodeName.toUpperCase()=="UL") {
						par_node=mm.nextSibling;
					} else{
						par_node=document.createElement("ul");
					};
					var newli=document.createElement("li");
					var linode=document.createTextNode(child_list.value);
					newli.appendChild(linode);
					par_node.appendChild(newli);
			};
			clearPop(index);//清除弹出框上做的操作
			}
		}else{
			clearPop(index);//清除弹出框上做的操作
			chlid_list.classList.remove('warnning');
		}
	};
}

if (popup.addEventListener) {
	popup.addEventListener('click',popUp,false);
} else if (popup.attchEvent) {
	popup.attchEvent('onclick',popUp);
};

/****清除输入内容，恢复并清除弹出框*****/
function clearPop (index) {
	master_name.options[index].selected= false;
	master_name.options[0].selected= true;
	overlay.style.display="none";
	popup.style.display="none";
	child_list.value="";
}

/**************************以下是本地存取相关函数*********************************/


/**
 * 本地存储的格式是键值对，分为3种，格式如下：
 *    key            value
 *   master        first-list([h3.1,h3.2...])将所有的一级分类放在一个数组中
 *   first-li      second-list([li1,li2...])一个一级分类对应多个二级分类，数组方式存储
 *   second-li     task-info([{data,title,content,status},{data,title,content,status}]..)一个二级分类对应多个处理事件
 */

function taskinfo_add (tdata,ttitle,tcontent,tstatus) {
	return {
		"date": tdata,
		"title": ttitle,
		"content": tcontent,
		"status": tstatus
	};
}

/***由于localstorage只能以字符串方式存储
****而我们是要用数组的方式存储，因此使用JSON转化一下    
*/
function json_parse (key) {
	if (key) {
		return JSON.parse(key);
	} else{
		return null;
	};
}

function json_str (key) {
	if (key) {
		return JSON.stringify(key);
	} else{
		return null;
	};
}
/**将键值对存储在本地，若没有，则创建*/
function storage_add (key, value) {
	if (!ls[key]) {
		var valuearr=[value];
	} else{
		var valuearr=json_parse(ls[key]);
		valuearr[valuearr.length]=value;
	};
	ls.setItem(key,json_str(valuearr));	

}

/**本地存储，初始时默认在本地存一组数据，当第一次访问页面时，会显示出来，之后正常读取**/
function storage_init () {
	if (window.localStorage) {
		if (!ls['fistvisit']) {
			storage_add('master', '默认列表');
			storage_add('默认列表', '默认子列表');
			storage_add('master', 'task2');
			storage_add('task2', 'task21');
			storage_add('task21', taskinfo_add('2013-2-1','233','dfdf',0));
			storage_add('默认子列表',taskinfo_add('2012-3-2','sas','初始设置',1));
			storage_add('默认子列表',taskinfo_add('2012-3-2','ss','初始置',0));
			ls.setItem('fistvisit','1');
		}
	} 
}
/**读取本地存取，显示到页面上***/
function storage_read () {
	var listarr=[];//保存一级列表的节点
	var valuearr=ls['master'];
	valuearr=json_parse(valuearr);//保存一级列表的信息
	for (var i = 0; i < valuearr.length; i++) {
		listarr[i]= addfirstlist(valuearr[i]);//将一级列表显示出来,并保存节点信息
	};

	for (var i = 0; i < valuearr.length; i++) {
		var firstli=json_parse(ls[valuearr[i]]); 
		var ulnode=insertafter_h3(listarr[i]);//创建ul列表
		if (!!firstli) {
			for (var j = 0; j < firstli.length; j++) {
			addsecond(ulnode,firstli[j]);//显示二级列表
			if (i==0&&j==0) {
				var info_list=json_parse(ls[firstli[0]]);
				for (var k = 0; k < info_list.length; k++) {
					addtask_info(info_list[k]);
				};
				setTaskInfo(info_list[0]);
			};
			};
		};
		
	};
}
/****添加一级分类名*****/
function addfirstlist (name) {
	var h3name=document.createElement('h3');
	var node=document.createTextNode(name);
	h3name.appendChild(node);
	d.appendChild(h3name);
	
	return h3name;

}
/**在h3之后插入一个ul节点，并返回该节点**/
function insertafter_h3 (h3_node) {
	var ulnode=document.createElement('ul');
	if (h3_node.nextSibling) {//如果该h3有后继元素，则使用insertbefore插入ul
		d.insertBefore(ulnode, h3_node.nextSibling);
	}else{     //如果这是最后一个元素，则用appendchild插入
		d.appendChild(ulnode);
	}
	return ulnode;
}

/****添加二级分类名*****/
function addsecond (ulnode,name) {
	var list=document.createElement('li');
	var node=document.createTextNode(name);
	list.appendChild(node);
	ulnode.appendChild(list);
	return list;
}
/**添加任务信息**/
function addtask_info (data) {
	//将时间日期显示在中间一栏
	var date=document.createElement('li');
	var node=document.createTextNode(data.date);
	date.appendChild(node);
	var title=document.createElement('li');
	var info=document.createTextNode(data.title);
	title.appendChild(info);
	task_info.appendChild(date);
	task_info.appendChild(title);
}
/******查找一级分类，返回节点*******/
function find_master (name) {
	var mm=json_parse(ls['master']);
	for (var i = 0; i < mm.length; i++) {
		if (name == mm[i]) {
			return d.getElementsByTagName('h3')[i];
		} 
	};
}
/**
 * 查找左侧焦点列表的所有任务
 * @参数        task的状态值，如果没有说明是所有任务
 * @传回值      task对象数组
 */
function findAlltask (status) {
	var taskarr=[];
	var	index=0;
	if (d_active.nodeName.toUpperCase()=='H3') {//焦点分类为一级分类
		if (node_after(d_active).nodeName.toUpperCase()=='UL') {//该一级分类下有子分类
			var listarr=json_parse(ls[d_active.innerHTML]);
			for (var i = 0; i < listarr.length; i++) {
				if (!!ls[listarr[i]]) {//子分类存在并存在任务
					for (var j = 0,m=json_parse(ls[listarr[i]]); j < m.length; j++) {
						if (!(!!status||status==0)) {
							console.log('查找任务时，添加到数组中第几位：'+ index);
							taskarr[index++]=m[j];//将任务添加到任务列表中
						} else{
							if (m[j].status==status) {
								console.log('查找任务时，添加到数组中第几位：'+ index);
								taskarr[index++]=m[j];//将任务添加到任务列表中
							};
						};
					};
				};
			};
		};
	} else{
		if (!!ls[d_active.innerHTML]) {//该分类下存在任务
			for (var i = 0, m=json_parse(ls[d_active.innerHTML]); i < m.length; i++) {
				if (!(!!status||status==0)) {
					console.log('查找任务时，添加到数组中第几位：'+ index);
					taskarr[index++]=m[i];//将任务添加到任务列表中
				} else{
						console.log('查找任务时status is:'+status);
					if (m[i].status==status) {
						console.log('查找任务时，添加到数组中第几位：'+ index);
						taskarr[index++]=m[i];//将任务添加到任务列表中
					};
				};
			};
		};
	};	
	return taskarr;
}

/***********以上是本地读取以及显示相关函数***********/


/**
 * 测知某节点的文字内容是否全为空白。
 *
 * @参数   nod  |CharacterData| 类的节点（如  |Text|、|Comment| 或 |CDATASection|）。
 * @传回值      若 |nod| 的文字内容全为空白则传回 true，否则传回 false。
 */
function is_all_ws( nod )
{
  // Use ECMA-262 Edition 3 String and RegExp features
  return !(/[^\t\n\r ]/.test(nod.data));
}

/**
 * 测知是否该略过某节点。
 *
 * @参数   nod  DOM1 |Node| 对象
 * @传回值      若 |Text| 节点内仅有空白符或为 |Comment| 节点时，传回 true，
 *              否则传回 false。
 */

function is_ignorable( nod )
{
  return ( nod.nodeType == 8) || // 注释节点
         ( (nod.nodeType == 3) && is_all_ws(nod) ); // 仅含空白符的文字节点
}
/**
 * 此为会跳过空白符节点及注释节点的 |nextSibling| 函数
 *
 * @参数   sib  节点。
 * @传回值      有两种可能：
 *               1) |sib| 的下一个“非空白、非注释”节点。
 *               2) 若该节点后无任何此类节点，则传回 null。
 */
function node_after( sib )
{
	if (!!sib&&!!sib.nextSibling) {
		while ((sib = sib.nextSibling)) {
   		 if (!is_ignorable(sib)) return sib;
  }
	};
  
  return null;
}
/**
 * 此为会跳过空白符节点及注释节点的 |firstChild| 函数
 *
 * @参数   par  节点。
 * @传回值      有两种可能：
 *               1) |par| 中第一个“非空白、非注释”节点。
 *               2) 若该节点中无任何此类子节点，则传回 null。
 */
function first_child( par )
{
  var res=par.firstChild;
  while (res) {
    if (!is_ignorable(res)) return res;
    res = res.nextSibling;
  }
  return null;
}
/**
 * 此为会跳过空白符节点及注释节点的 |lastChild| 函数
 * （ lastChild| 是 DOM 节点的特性值，为该节点之中最后一个子节点。）
 *
 * @参数   par  节点。
 * @传回值      有两种可能：
 *               1) |par| 中最后一个“非空白、非注释”节点。
 *               2) 若该节点中无任何此类子节点，则传回 null。
 */
function last_child( par )
{
  var res=par.lastChild;
  while (res) {
    if (!is_ignorable(res)) return res;
    res = res.previousSibling;
  }
  return null;
}
