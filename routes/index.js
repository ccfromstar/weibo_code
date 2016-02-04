var mysql = require('../models/db');
var settings = require('../settings');
var wechat = require('wechat');

/**通用函数BEGIN**/
function getToday() {
	var date = new Date(); //日期对象
	var now = "";
	now = date.getFullYear() + "-";
	var m = (date.getMonth() + 1) + "";
	if (m.length == 1) {
		m = "0" + m;
	}
	now = now + m + "-"; //取月的时候取的是当前月-1如果想取当前月+1就可以了
	var d = date.getDate() + "";
	if (d.length == 1) {
		d = "0" + d;
	}
	now = now + d;
	return now;
}

function getNow() {
	var date = new Date(); //日期对象
	var now = "";
	now = date.getFullYear() + "-";
	now = now + (date.getMonth() + 1) + "-"; //取月的时候取的是当前月-1如果想取当前月+1就可以了
	now = now + date.getDate() + " ";
	now = now + date.getHours() + ":";
	now = now + date.getMinutes() + ":";
	now = now + date.getSeconds() + "";
	return now;
}

function getClientIp(req) {
	var ipAddress;
	var forwardedIpsStr = req.header('x-forwarded-for');
	if (forwardedIpsStr) {
		var forwardedIps = forwardedIpsStr.split(',');
		ipAddress = forwardedIps[0];
	}
	if (!ipAddress) {
		ipAddress = req.connection.remoteAddress;
	}
	return ipAddress;
};

Date.prototype.Format = function(fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function getClientIp(req) {
	var ipAddress;
	var forwardedIpsStr = req.header('x-forwarded-for');
	if (forwardedIpsStr) {
		var forwardedIps = forwardedIpsStr.split(',');
		ipAddress = forwardedIps[0];
	}
	if (!ipAddress) {
		ipAddress = req.connection.remoteAddress;
	}
	return ipAddress;
};

function setLog(page, req) {
	if (getClientIp(req) != "127.0.0.1") {
		mysql.query("insert into log(page,time,ip) values('" + page + "',now(),'" + getClientIp(req) + "')", function(err, rows) {

		});
	}
}

/**通用函数END**/


/**前端BEGIN**/
exports.home = function(req, res) {
	var LIMIT = 6;
	var page = parseInt(req.query.p);
	page = (page && page > 0) ? page : 1;
	setLog("home?p=" + page, req);
	var limit = (limit && limit > 0) ? limit : LIMIT;
	var sql1 = "select a.*,b.name from posts a left join posts_category b on a.category_id = b.id where a.state_id = 2 order by a.created_at desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select id,title from posts where state_id = 2 and category_id = 1 order by created_at desc limit 0,5";
	var sql3 = "select id,title from posts where state_id = 2 and category_id = 2 order by created_at desc limit 0,5";
	var sql4 = "select id,title,created_at,category_id from posts where state_id = 2 and category_id = 3 order by created_at desc limit 0,6";
	var sql5 = "select count(*) as count from posts where state_id = 2";
	var sql6 = "select * from posts_category where id != 1 and id != 2 and id != 3";
	mysql.query(sql1, function(err, rows1) {
		for (var i in rows1) {
			var data1 = rows1[i].created_at;
			rows1[i].created_at = data1.Format("yyyy-MM-dd hh:mm:ss");
		}
		mysql.query(sql2, function(err, rows2) {
			mysql.query(sql3, function(err, rows3) {
				mysql.query(sql4, function(err, rows4) {
					mysql.query(sql5, function(err, rows5) {
						mysql.query(sql6, function(err, rows6) {
							for (var i in rows4) {
								var data4 = rows4[i].created_at;
								rows4[i].created_at = data4.Format("yyyy-MM-dd hh:mm:ss");
							}
							var total = rows5[0].count;
							var totalpage = Math.ceil(total / limit);
							var isFirstPage = page == 1;
							var isLastPage = ((page - 1) * limit + rows1.length) == total;
							var url = req.url;
							var arr1 = url.split("?");
							res.render('front/home', {
								layout: "layout",
								url: arr1[0],
								posts: rows1,
								p_c1: rows2,
								p_c2: rows3,
								p_c3: rows4,
								rows6: rows6,
								page: page,
								total: total,
								totalpage: totalpage,
								isFirstPage: isFirstPage,
								isLastPage: isLastPage
							});
						});
					});
				});
			});
		});
	});
};

exports.about = function(req, res) {
	setLog("about", req);
	res.render('front/about', {
		layout: "layout",
		url: req.url
	});
};

exports.post = function(req, res) {
	var id = req.query.id;
	setLog("post?id=" + id, req);
	var sql1 = "select a.*,b.name from posts a left join posts_category b on a.category_id = b.id where a.id =" + id;
	var sql6 = "select * from posts_category where id != 1 and id != 2 and id != 3";
	mysql.query(sql1, function(err, rows1) {
		for (var i in rows1) {
			var data1 = rows1[i].created_at;
			rows1[i].created_at = data1.Format("yyyy-MM-dd hh:mm:ss");
		}
		var url = req.url;
		var arr1 = url.split("?");
		mysql.query(sql6, function(err, rows6) {
			res.render('front/post', {
				layout: "layout",
				url: arr1[0],
				posts: rows1,
				rows6: rows6
			});
		});
	});
};

exports.list = function(req, res) {
	var LIMIT = 6;
	var page = parseInt(req.query.p);
	var category = parseInt(req.query.c);
	page = (page && page > 0) ? page : 1;
	setLog("list?c=" + category + "&p=" + page, req);
	var limit = (limit && limit > 0) ? limit : LIMIT;
	var sql1 = "select a.*,b.name from posts a left join posts_category b on a.category_id = b.id where a.state_id = 2 and a.category_id = " + category + " order by a.created_at desc limit " + (page - 1) * limit + "," + limit;
	var sql5 = "select count(*) as count from posts where state_id = 2 and category_id = " + category;
	var sql6 = "select * from posts_category where id != 1 and id != 2 and id != 3";
	mysql.query(sql1, function(err, rows1) {
		for (var i in rows1) {
			var data1 = rows1[i].created_at;
			rows1[i].created_at = data1.Format("yyyy-MM-dd hh:mm:ss");
		}
		mysql.query(sql6, function(err, rows6) {
			mysql.query(sql5, function(err, rows5) {
				var total = rows5[0].count;
				var totalpage = Math.ceil(total / limit);
				var isFirstPage = page == 1;
				var isLastPage = ((page - 1) * limit + rows1.length) == total;
				var url = req.url;
				var arr1 = url.split("&p=");
				res.render('front/list', {
					layout: "layout",
					url: arr1[0],
					posts: rows1,
					page: page,
					total: total,
					totalpage: totalpage,
					isFirstPage: isFirstPage,
					isLastPage: isLastPage,
					category: category,
					rows6: rows6
				});
			});
		});
	});
};

exports.searchdo = function(req, res) {
		var key = req.body.key;
		var LIMIT = 50;
		var page = parseInt(req.query.p);
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;
		var sql1 = "select a.*,b.name from posts a left join posts_category b on a.category_id = b.id where a.state_id = 2 and a.title like '%" + key + "%' order by a.created_at desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select id,title from posts where state_id = 2 and category_id = 1 order by created_at desc limit 0,5";
		var sql3 = "select id,title from posts where state_id = 2 and category_id = 2 order by created_at desc limit 0,5";
		var sql4 = "select id,title,created_at,category_id from posts where state_id = 2 and category_id = 3 order by created_at desc limit 0,6";
		var sql5 = "select count(*) as count from posts where state_id = 2 and title like '%" + key + "%'";
		var sql6 = "select * from posts_category where id != 1 and id != 2 and id != 3";
		mysql.query(sql1, function(err, rows1) {
			for (var i in rows1) {
				var data1 = rows1[i].created_at;
				rows1[i].created_at = data1.Format("yyyy-MM-dd hh:mm:ss");
			}
			mysql.query(sql2, function(err, rows2) {
				mysql.query(sql3, function(err, rows3) {
					mysql.query(sql4, function(err, rows4) {
						mysql.query(sql5, function(err, rows5) {
							mysql.query(sql6, function(err, rows6) {
								var total = rows5[0].count;
								var totalpage = Math.ceil(total / limit);
								var isFirstPage = page == 1;
								var isLastPage = ((page - 1) * limit + rows1.length) == total;
								var url = req.url;
								var arr1 = url.split("&p=");
								res.render('front/home', {
									rows6: rows6,
									layout: "layout",
									url: arr1[0],
									posts: rows1,
									p_c1: rows2,
									p_c2: rows3,
									p_c3: rows4,
									page: page,
									total: total,
									totalpage: totalpage,
									isFirstPage: isFirstPage,
									isLastPage: isLastPage
								});
							});
						});
					});
				});
			});
		});
	}
	/**前端END**/


/**移动端BEGIN**/
exports.test = function(req, res) {
	res.render('mobile/test', {
		layout: false,
		url: req.url
	});
};

exports.mobilehome = function(req, res) {
	var LIMIT = 6;
	var page = parseInt(req.query.p);
	page = (page && page > 0) ? page : 1;
	setLog("home?p=" + page, req);
	var limit = (limit && limit > 0) ? limit : LIMIT;
	var sql1 = "select a.*,b.name from posts a left join posts_category b on a.category_id = b.id where a.state_id = 2 order by a.created_at desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select id,title from posts where state_id = 2 and category_id = 1 order by created_at desc limit 0,5";
	var sql3 = "select id,title from posts where state_id = 2 and category_id = 2 order by created_at desc limit 0,5";
	var sql4 = "select id,title from posts where state_id = 2 and category_id = 3 order by created_at desc limit 0,5";
	var sql5 = "select count(*) as count from posts where state_id = 2";
	var sql6 = "select * from posts_category where id != 1 and id != 2 and id != 3";
	mysql.query(sql1, function(err, rows1) {
		for (var i in rows1) {
			var data1 = rows1[i].created_at;
			rows1[i].created_at = data1.Format("yyyy-MM-dd hh:mm:ss");
		}
		mysql.query(sql2, function(err, rows2) {
			mysql.query(sql3, function(err, rows3) {
				mysql.query(sql4, function(err, rows4) {
					mysql.query(sql5, function(err, rows5) {
						mysql.query(sql6, function(err, rows6) {
							var total = rows5[0].count;
							var totalpage = Math.ceil(total / limit);
							var isFirstPage = page == 1;
							var isLastPage = ((page - 1) * limit + rows1.length) == total;
							res.render('mobile/home', {
								layout: "layout",
								posts: rows1,
								p_c1: rows2,
								p_c2: rows3,
								rows6: rows6,
								p_c3: rows4,
								page: page,
								total: total,
								totalpage: totalpage,
								isFirstPage: isFirstPage,
								isLastPage: isLastPage
							});
						});
					});
				});
			});
		});
	});
};

exports.mobilesearchdo = function(req, res) {
	var key = req.body.key;
	var LIMIT = 50;
	var page = parseInt(req.query.p);
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT;
	var sql1 = "select a.*,b.name from posts a left join posts_category b on a.category_id = b.id where a.state_id = 2 and a.title like '%" + key + "%' order by a.created_at desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select id,title from posts where state_id = 2 and category_id = 1 order by created_at desc limit 0,5";
	var sql3 = "select id,title from posts where state_id = 2 and category_id = 2 order by created_at desc limit 0,5";
	var sql4 = "select id,title from posts where state_id = 2 and category_id = 3 order by created_at desc limit 0,5";
	var sql5 = "select count(*) as count from posts where state_id = 2 and title like '%" + key + "%'";
	mysql.query(sql1, function(err, rows1) {
		for (var i in rows1) {
			var data1 = rows1[i].created_at;
			rows1[i].created_at = data1.Format("yyyy-MM-dd hh:mm:ss");
		}
		mysql.query(sql2, function(err, rows2) {
			mysql.query(sql3, function(err, rows3) {
				mysql.query(sql4, function(err, rows4) {
					mysql.query(sql5, function(err, rows5) {
						var total = rows5[0].count;
						var totalpage = Math.ceil(total / limit);
						var isFirstPage = page == 1;
						var isLastPage = ((page - 1) * limit + rows1.length) == total;
						res.render('mobile/home', {
							layout: "layout",
							posts: rows1,
							p_c1: rows2,
							p_c2: rows3,
							p_c3: rows4,
							page: page,
							total: total,
							totalpage: totalpage,
							isFirstPage: isFirstPage,
							isLastPage: isLastPage
						});
					});
				});
			});
		});
	});
}

exports.mobilelist = function(req, res) {
	var LIMIT = 6;
	var page = parseInt(req.query.p);
	var category = parseInt(req.query.c);
	page = (page && page > 0) ? page : 1;
	setLog("list?c=" + category + "&p=" + page, req);
	var limit = (limit && limit > 0) ? limit : LIMIT;
	var sql1 = "select a.*,b.name from posts a left join posts_category b on a.category_id = b.id where a.state_id = 2 and a.category_id = " + category + " order by a.created_at desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select id,title from posts where state_id = 2 and category_id = 1 order by created_at desc limit 0,5";
	var sql3 = "select id,title from posts where state_id = 2 and category_id = 2 order by created_at desc limit 0,5";
	var sql4 = "select id,title from posts where state_id = 2 and category_id = 3 order by created_at desc limit 0,5";
	var sql5 = "select count(*) as count from posts where state_id = 2 and category_id = " + category;
	var sql6 = "select * from posts_category where id != 1 and id != 2 and id != 3";
	mysql.query(sql1, function(err, rows1) {
		for (var i in rows1) {
			var data1 = rows1[i].created_at;
			rows1[i].created_at = data1.Format("yyyy-MM-dd hh:mm:ss");
		}
		mysql.query(sql2, function(err, rows2) {
			mysql.query(sql3, function(err, rows3) {
				mysql.query(sql4, function(err, rows4) {
					mysql.query(sql5, function(err, rows5) {
						mysql.query(sql6, function(err, rows6) {
							var total = rows5[0].count;
							var totalpage = Math.ceil(total / limit);
							var isFirstPage = page == 1;
							var isLastPage = ((page - 1) * limit + rows1.length) == total;
							res.render('mobile/list', {
								rows6: rows6,
								layout: "layout",
								posts: rows1,
								p_c1: rows2,
								p_c2: rows3,
								p_c3: rows4,
								page: page,
								total: total,
								totalpage: totalpage,
								isFirstPage: isFirstPage,
								isLastPage: isLastPage,
								category: category
							});
						});
					});
				});
			});
		});
	});
};

exports.mobilepost = function(req, res) {
	var id = req.query.id;
	setLog("post?id=" + id, req);
	var sql1 = "select a.*,b.name from posts a left join posts_category b on a.category_id = b.id where a.id =" + id;
	var sql2 = "select id,title from posts where state_id = 2 and category_id = 1 order by created_at desc limit 0,5";
	var sql3 = "select id,title from posts where state_id = 2 and category_id = 2 order by created_at desc limit 0,5";
	var sql4 = "select id,title from posts where state_id = 2 and category_id = 3 order by created_at desc limit 0,5";
	var sql6 = "select * from posts_category where id != 1 and id != 2 and id != 3";
	mysql.query(sql1, function(err, rows1) {
		for (var i in rows1) {
			var data1 = rows1[i].created_at;
			rows1[i].created_at = data1.Format("yyyy-MM-dd hh:mm:ss");
		}
		mysql.query(sql2, function(err, rows2) {
			mysql.query(sql3, function(err, rows3) {
				mysql.query(sql4, function(err, rows4) {
					mysql.query(sql6, function(err, rows6) {
						res.render('mobile/post', {
							rows6: rows6,
							layout: "layout",
							posts: rows1,
							p_c1: rows2,
							p_c2: rows3,
							p_c3: rows4
						});
					});
				});
			});
		});
	});
};

exports.mobileabout = function(req, res) {
	setLog("about", req);
	var sql2 = "select id,title from posts where state_id = 2 and category_id = 1 order by created_at desc limit 0,5";
	var sql3 = "select id,title from posts where state_id = 2 and category_id = 2 order by created_at desc limit 0,5";
	var sql4 = "select id,title from posts where state_id = 2 and category_id = 3 order by created_at desc limit 0,5";
	var sql6 = "select * from posts_category where id != 1 and id != 2 and id != 3";
	mysql.query(sql2, function(err, rows2) {
		mysql.query(sql3, function(err, rows3) {
			mysql.query(sql4, function(err, rows4) {
				mysql.query(sql6, function(err, rows6) {
					res.render('mobile/about', {
						rows6: rows6,
						layout: "layout",
						p_c1: rows2,
						p_c2: rows3,
						p_c3: rows4
					});
				});
			});
		});
	});
};
/**移动端END**/


/**后台BEGIN**/
exports.publish = function(req, res) {
	if (!req.session.userAuth) {
		res.redirect("/login");
		req.session.backpage = "publish";
		return false;
	}
	var id = req.query.id;
	id = id ? id : 0;
	var sql = "select * from posts_category";
	var sql1 = "select * from posts where id = " + id;
	mysql.query(sql, function(err, rows) {
		mysql.query(sql1, function(err, rows1) {
			res.render('cms/publish', {
				layout: "layout_whole.ejs",
				p_c: rows,
				record: rows1
			});
		});
	});
};

exports.publishdo = function(req, res) {
	var stype = req.body.stype;
	var title = req.body.title;
	var id = req.body.id;
	var needcode = req.body.needcode;
	//转义
	title = title.replace(/'/g, "\\'");
	var category_id = req.body.category_id;
	var post = req.body.post;
	post = post.replace(/'/g, "\\'");
	var state_id = req.body.state_id;
	var sql1 = "insert into posts (title,category_id,post,state_id,created_at,needcode) values ('" + title + "'," + category_id + ",'" + post + "'," + state_id + ",now()," + needcode + ")";
	if (stype == "save") {
		sql1 = "update posts set title = '" + title + "',category_id = " + category_id + ",post = '" + post + "',needcode = " + needcode + " where id = " + id;
	}
	mysql.query(sql1, function(err, rows1) {
		res.redirect("_postlist");
	});
};

exports.login = function(req, res) {
	req.session.userAuth = false;
	res.render('cms/login', {
		layout: "false"
	});
};

exports.logindo = function(req, res) {
	var _u = req.body.username;
	var _p = req.body.password;
	//console.log(_u+";"+_p+";"+req.session.backpage);
	if (_u == "username" && _p == "password") {
		req.session.userAuth = true;
		res.redirect(req.session.backpage ? req.session.backpage : "/_postlist");
	} else {
		res.redirect("login");
	}
};

exports._postlist = function(req, res) {
	if (!req.session.userAuth) {
		res.redirect("/login");
		req.session.backpage = "_postlist";
		return false;
	}
	var LIMIT = 10;
	var page = parseInt(req.query.p);
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT;
	var sql1 = "select a.*,b.name from posts a left join posts_category b on a.category_id = b.id where a.state_id = 2 order by a.created_at desc limit " + (page - 1) * limit + "," + limit;
	var sql5 = "select count(*) as count from posts where state_id = 2";
	mysql.query(sql1, function(err, rows1) {
		for (var i in rows1) {
			var data1 = rows1[i].created_at;
			rows1[i].created_at = data1.Format("yyyy-MM-dd hh:mm:ss");
		}
		mysql.query(sql5, function(err, rows5) {
			var total = rows5[0].count;
			var totalpage = Math.ceil(total / limit);
			var isFirstPage = page == 1;
			var isLastPage = ((page - 1) * limit + rows1.length) == total;
			res.render('cms/_postlist', {
				layout: "layout_whole",
				posts: rows1,
				page: page,
				total: total,
				totalpage: totalpage,
				isFirstPage: isFirstPage,
				isLastPage: isLastPage
			});
		});
	});
};
/**后台END**/

/**APP BEGIN**/
exports.app_home = function(req, res) {
	res.render('app/home', {
		layout: "layout"
	});
}

exports.app_post = function(req, res) {
	var id = req.query.id;
	var sql2 = "select * from posts_all where id =" + id;
	mysql.query(sql2, function(err, rows2) {
		for (var i in rows2) {
			var data1 = rows2[i].created_at;
			rows2[i].created_at = data1.Format("yyyy-MM-dd hh:mm:ss");
		}
		res.render('app/posts', {
			layout: "layout",
			posts: rows2
		});
	});
};

exports.app_list = function(req, res) {
	var LIMIT = 6;
	var page = parseInt(req.query.p);
	var category = parseInt(req.query.c);
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT
	var sql1 = "select * from posts_all where state_id = 2 order by created_at desc limit " + (page - 1) * limit + "," + limit;
	var sql5 = "select count(*) as count from posts_all where state_id = 2";
	if (category) {
		sql1 = "select * from posts_all where state_id = 2 and category_id = " + category + " order by created_at desc limit " + (page - 1) * limit + "," + limit;
		sql5 = "select count(*) as count from posts_all where state_id = 2 and category_id = " + category;
	}

	mysql.query(sql1, function(err, rows1) {
		for (var i in rows1) {
			var data1 = rows1[i].created_at;
			rows1[i].created_at = data1.Format("yyyy-MM-dd hh:mm:ss");
		}
		mysql.query(sql5, function(err, rows5) {
			var total = rows5[0].count;
			var totalpage = Math.ceil(total / limit);
			var isFirstPage = page == 1;
			var isLastPage = ((page - 1) * limit + rows1.length) == total;
			res.render('app/list', {
				layout: "layout",
				rows2: rows1,
				page: page,
				total: total,
				totalpage: totalpage,
				isFirstPage: isFirstPage,
				isLastPage: isLastPage,
				category: category
			});
		});
	});
};

exports.app_about = function(req, res) {
	res.render('app/about', {
		layout: "layout"
	});
};

exports.app_adv = function(req, res) {

	res.render('app/adv', {
		layout: "layout"
	});

};

exports.appdo = function(req, res) {
	var _sql = req.params.sql;
	if (_sql == "SearchByKey") {
		/*关键字搜索*/
		var _key = req.param("key");
		var sql1 = "select name,title,id from posts_all where title like '%" + _key + "%'";
		mysql.query(sql1, function(err, rows1) {
			res.json(rows1);
		});
	} else if (_sql == "getMenu") {
		/*获取菜单*/
		var sql1 = "select * from posts_category where id > 3 and id < 100";
		mysql.query(sql1, function(err, rows1) {
			res.json(rows1);
		});
	} else if (_sql == "getHomelist") {
		/*获取首页文章列表*/
		var sql2 = "select * from posts_all order by created_at desc limit 0,6";
		mysql.query(sql2, function(err, rows2) {
			res.json(rows2);
		});
	}
};

exports.loading = function(req, res) {
	var page = req.query.page;
	res.render('loading', {
		layout: false,
		page: page
	});
};
/**APP END**/

/**通用页面BEGIN**/
exports.testcode = function(req, res) {
	res.render('testcode', {
		layout: false
	});
}

exports.upload = function(req, res) {
	res.render('upload', {
		layout: false
	});
}

exports.uploaddo = function(req, res) {
	var fname = req.files.img_url.path.replace("public\\files\\", "").replace("public/files/", "");
	console.log(fname);
	res.redirect("/uploadsuccess?p=" + fname);
};

exports.uploadsuccess = function(req, res) {
	var p = req.query.p;
	res.render('uploadsuccess', {
		layout: false,
		p: p
	});
};

exports.wechat = function(req, res) {
	wechat('weixin').text(function(message, req, res, next) {
		// TODO
		res.reply('欢迎');
	}).image(function(message, req, res, next) {
		// TODO
	}).voice(function(message, req, res, next) {
		// TODO
	}).video(function(message, req, res, next) {
		// TODO
	}).location(function(message, req, res, next) {
		// TODO
	}).link(function(message, req, res, next) {
		// TODO
	}).event(function(message, req, res, next) {
		// TODO
	}).device_text(function(message, req, res, next) {
		// TODO
	}).device_event(function(message, req, res, next) {
		// TODO
	}).middlewarify()
};
/**通用页面END**/

exports.trans = function(req, res) {
	var tr = require('transliteration');
	var p = req.query.p;
	var pingyin = tr(p).toUpperCase();
	var tmp = pingyin.split(' ');
	var xing = tmp[0];
	var ming = '';
	for (var i = 1; i < tmp.length; i++) {
		ming = ming + tmp[i];
	}
	console.log(xing);
	console.log(ming);
	res.send(pingyin);
}

exports.pingyin = function(req, res) {
	res.render('pingyin', {
		layout: false
	});
}