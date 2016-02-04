/*检测浏览器的支持*/
function _checkIE() {
	var browser = navigator.appName;
	var b_version = navigator.appVersion;
	var version = b_version.split(";");
	var trim_Version = version[1].replace(/[ ]/g, "");
	if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE6.0") {
		//alert("IE 6.0"); 
		_showNotAllow();
	} else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0") {
		//alert("IE 7.0"); window.location.href="http://xxxx.com";
		_showNotAllow();
	} else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
		//alert("IE 8.0"); 
		_showNotAllow();
	} else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
		//alert("IE 9.0"); 
		_showNotAllow();
	} else {
		//your code goes here
	}
}

function _showNotAllow() {
	alert("对不起，您的浏览器不支持，请升级IE或改用其他浏览器访问！");
	window.location = "/page/ieupdate.html";
}

/*关键字检索*/
function searchKey() {
	var key = $("#key").val();
	$.ajax({
		type: "POST",
		url: "/app/SearchByKey",
		data: {
			key: key
		},
		success: function(data) {
			var res = "<ul class='am-list'>";
			for (var i in data) {
				res += "<li class='am-g'><a href='/app/post?id=" + data[i].id + "' class='am-list-item-hd'>【" + data[i].name + "】" + data[i].title + "</a></li>";
			}
			res += "</ul>";
			$("#result").html(res);
		}
	});
}

/*判断是移动端还是PC端访问*/
function checkTerminal() {
	var _width = $(window).width();
	var url = window.location.href;
	if (_width > 1264) {
		var tmp = url.split("/app");
		var nurl = tmp[0] + tmp[1];
		window.location = nurl;
	}
}

/*加载技术分类菜单
 *默认读取localStorage里的数据，如果没有则访问服务器调取数据
 * */
function loadMenu() {
	var _storage = window.sessionStorage;
	if (_storage.getItem("menu")) {
		console.log("read data in storage");
		$("#ajax_menu").html(_storage.getItem("menu"));
	} else {
		console.log("read data from server");
		$.ajax({
			type: "POST",
			url: "/app/getMenu",
			success: function(data) {
				var res = "";
				for (var i in data) {
					res += "<li class=''><a href='/app/list?c=" + data[i].id + "'>" + data[i].name + "</a></li>";
				}
				$("#ajax_menu").html(res);
				_storage.setItem("menu", res);
			}
		});
	}
}

/*加载主页的文章列表
 *默认读取sessionStorage里的数据，如果没有则访问服务器调取数据
 * */
function loadHomelist() {
	var _storage = window.sessionStorage;
	if (_storage.getItem("homelist")) {
		console.log("read data in storage");
		$("#ajax_list").html(_storage.getItem("homelist"));
	} else {
		console.log("read data from server");
		$.ajax({
			type: "POST",
			url: "/app/getHomelist",
			success: function(data) {
				var res = "";
				for (var i in data) {
					res += "<li class='am-g'><a href='/app/post?id=" + data[i].id + "' class='am-list-item-hd'>【" + data[i].name + "】" + data[i].title + "</a></li>";
				}
				$("#ajax_list").html(res);
				_storage.setItem("homelist", res);
			}
		});
	}
}

$(function() {
	_checkIE();
	checkTerminal();
	loadMenu();
	var url = window.location.href;
	var parm = url.split("/");
	if(!parm[4]){
		loadHomelist();
	}
})