<?php 
include('includes/configuration.php');

if( $gnrl->checkLogin() ){
	$gnrl->redirectTo('sitesettings.php');
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="">
	<link rel="shortcut icon" href="images/favicon.png">

	<title><?php echo SITE_NAME;?> :: Login</title>
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,400italic,700,800' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Raleway:300,200,100' rel='stylesheet' type='text/css'>
	
	<!-- Bootstrap core CSS -->
	<link href="js/bootstrap/dist/css/bootstrap.css" rel="stylesheet">

	<link rel="stylesheet" href="fonts/font-awesome-4/css/font-awesome.min.css">

	<!-- Custom styles for this template -->
	<link href="css/style.css" rel="stylesheet" />	
    
    <link href="css/common.css" rel="stylesheet" />	

</head>

<body class="texture">

<div id="cl-wrapper" class="login-container">

	<div class="middle-login">
		<div id="response"></div>
        <div class="block-flat">
        	<div class="header">							
				<h3 class="text-center"><img class="logo-img" src="images/logo.png" alt="logo"/><?php echo SITE_NAME;?></h3>
			</div>
			<div>
				<form style="margin-bottom: 0px !important;" class="form-horizontal" action="" onsubmit="doLogin(); return false;">
					<div class="content">
						<h4 class="title">Login Access</h4>
							<div class="form-group">
								<div class="col-sm-12">
									<div class="input-group">
										<span class="input-group-addon"><i class="fa fa-user"></i></span>
										<input type="text" placeholder="Username" id="v_admin_username" class="form-control" name="v_admin_username">
									</div>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-12">
									<div class="input-group">
										<span class="input-group-addon"><i class="fa fa-lock"></i></span>
										<input type="password" placeholder="Password" id="v_admin_password" class="form-control" name="v_admin_password">
									</div>
								</div>
							</div>
							
					</div>
					<div class="foot">
						<button class="btn btn-primary" data-dismiss="modal" type="submit" >Log me in</button>
					</div>
				</form>
			</div>
		</div>
		<div class="text-center out-links"><a href="#">&copy; <?php echo date("Y")?> <?php echo SITE_NAME;?></a></div>
	</div> 
	
</div>

<script src="js/jquery.js"></script>
<script type="text/javascript" src="js/behaviour/general.js"></script>

<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="js/behaviour/voice-commands.js"></script>
<script src="js/bootstrap/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/jquery.flot/jquery.flot.js"></script>
<script type="text/javascript" src="js/jquery.flot/jquery.flot.pie.js"></script>
<script type="text/javascript" src="js/jquery.flot/jquery.flot.resize.js"></script>
<script type="text/javascript" src="js/jquery.flot/jquery.flot.labels.js"></script>
<?php include('jsfunctions/jsfunctions.php');?>
</body>
</html>
