{% extends "base.html" %}
{% block body %}
	<section class="hero is-success is-fullheight" style="background-image: url('/public/login-bg.jpg');">
		<div class="hero-body">
			<div class="container">
				<div class="columns">
					<div class="column is-3 is-offset-8">
						<div class="card">
							<header class="card-header">
								<p class="card-header-title">
									欢迎登录
								</p>
							</header>
							<div class="card-content">
								<div class="content">
									<form action="/login?_csrf={{csrf}}" method="post">
										<div class="field">
											<p class="control has-icons-left has-icons-right">
												<input class="input " type="text" name="username" placeholder="输入用户名">
												<span class="icon is-small is-left">
													<i class="fas fa-user"></i>
												</span>
												<span class="icon is-small is-right">
													<i class="fas fa-check"></i>
												</span>
											</p>
										</div>
										<div class="field">
											<p class="control has-icons-left">
												<input class="input" type="password" name="password" placeholder="输入密码">
												<span class="icon is-small is-left">
													<i class="fas fa-lock"></i>
												</span>
											</p>
										</div>
										<div class="field">
											<p class="control">
												<button class="button is-info" style="width: 100%" type="submit" value="Submit">
												登 录
												</button>
											</p>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
				
			</div>
			
		</div>
	</div>
</div>
</div>
</section>
{% endblock %}