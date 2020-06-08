{% extends "base.html" %}
{% block body %}
	<nav class="navbar is-info" role="navigation" aria-label="main navigation">
		<div class="navbar-brand">
			<a class="navbar-item" href="">
				<img src="https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png" width="112" height="28">
			</a>
			<a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</a>
		</div>
		<div id="navbarBasicExample" class="navbar-menu">
			<div class="navbar-start">
				<a class="navbar-item">
					用户管理
				</a>
				<a class="navbar-item">
					客户病例
				</a>
				
			</div>
			<div class="navbar-end">
				<div class="navbar-item">
					<div class="navbar-item has-dropdown is-hoverable">
						<a>
							<span class="icon is-medium has-text-white">
								<i class="fas fa-lg fa-user"></i>
							</span>
						</a>
						<div class="navbar-dropdown is-right">
							<a class="navbar-item">
								修改密码
							</a>
							<a class="navbar-item">
								退出登录
							</a>
						</div>
					</div>
					
					<!-- <figure class="image is-24x24">
														<img class="is-rounded" src="https://bulma.zcopy.site/images/placeholders/128x128.png">
					</figure> -->
				</div>
				<div class="navbar-item">
					
				</div>
				<div class="navbar-item">
					
				</div>
			</div>
		</div>
	</nav>
	<section class="section">
		<div class="container">
			<h1 class="title">客户病例</h1>
			<table class="table is-fullwidth is-hoverable is-striped is-bordered">
				<thead>
					<tr>
						<th>序号</abbr></th>
						<th>姓名</abbr></th>
						<th>年龄</abbr></th>
						<th>账户号</abbr></th>
						<th>地区</abbr></th>
						<th>疾病类型</abbr></th>
						<th>微信号</abbr></th>
						<th>备注</abbr></th>
						<th>登记时间</abbr></th>
					</tr>
				</thead>
				<tbody>
					{% set index = 1 %}
					{% for item in customers %}
						<tr>
							<th>{{index}}</th>
							<td>{{item.name}}</td>
							<td>{{item.age}}</td>
							<td>{{item.username}}</td>
							<td>{{item.address}}</td>
							<td>{{item.disease}}</td>
							<td>{{item.wechat}}</td>
							<td>{{item.remark}}</td>
							<td>+{{item.date}}</td>
						</tr>
						{% set index = index + 1 %}
					{% endfor %}
				</tbody>
			</table>
		</div>
		<section class="section">
			<nav class="level">
				<div class="level-left">
					
				</div>
				<!-- Right side -->
				<div class="level-right">
					<nav id="pagination" class="pagination is-centered is-rounded" role="navigation" aria-label="pagination">
						
					</nav>
				</div>
			</nav>
		</section>
	</section>
	<script>
	window.onload = function () {
		
	new Page({
	id: 'pagination',
	pageTotal: 50, //必填,总页数
	pageAmount: 20,  //每页多少条
	dataTotal: 500, //总共多少条数据
	curPage:1, //初始页码,不填默认为1
	pageSize: 5, //分页个数,不填默认为5
	showPageTotalFlag:false, //是否显示数据统计,不填默认不显示
	showSkipInputFlag:false, //是否支持跳转,不填默认不显示
	getPage: function (page) {
	//获取当前页数
	console.log(page);
	}
	})
	//如有问题可联系VX(base64): REo5ODc4OQ==
	}
	</script>
{% endblock %}