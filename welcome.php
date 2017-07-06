

<!DOCTYPE html>
 
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">
<title>Hacker Experience</title>
<link href="css/bootstrap.css" rel="stylesheet">
<link href="css/tipTip.css" rel="stylesheet">
<link href="css/he_index.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
</head>
<body>
<div id="terminal"></div>
<div class="intro-header">
<div class="container">
<div class="row">
<div class="col-lg-12">
<span id="error-msg" class="alert alert-danger" style="display:none;"></span>
<div class="intro-message">
<h1>Hacker Experience</h1>
<h3 class="digital">The Internet under attack<span class="a_bebida_que_pisca">_</span></h3>
<hr class="intro-divider">
<ul class="list-inline intro-social-buttons">
<li><a id="btn-start" class="btn btn-default btn-lg btn-front" style="width: 200px;"><i class="fa fa-power-off fa-fw"></i> <span class="network-name">Start tutorial</span></a></li> </ul>
</div>
</div>
</div>
</div>
</div>
 
<script src="js/jquery.min.js"></script>
<script>$(document).ready(function(){var windowSize=$(window).height();$('.intro-header').css('min-height',windowSize+'px');$(window).resize(function(){windowSize=$(window).height();$('.intro-header').css('min-height',windowSize+'px');$('#terminal').typist({height:windowSize})});$('#btn-verify').on('click',function(){$.ajax({type:"POST",url:"welcome.php",data:{code:$('#code-input').val()},success:function(data){if(data.msg==''){$('#error-msg').hide();$('#btn-verify').hide();$('#code-input').hide();$('#btn-start').show();}else{$('#error-msg').html(data.msg);$('#error-msg').show();}}});});$.getScript('js/typed.js',function(){$('#btn-start').on('click',function(){$('.intro-message').hide();$('#terminal').typist({height:$('.intro-header').height(),backgroundColor:'#000'});typetutorial(function(){console.log('oi');})});function typetutorial(){$('#terminal').typist('print','Generating user information').typist('promptecho').typist('type','............. ').typist('println',' [OK]').typist('print','Creating virtual machine').typist('promptecho').typist('type','................ ').typist('println','[OK]').typist('print','Downloading operating system').typist('promptecho').typist('type','............ ').typist('println',' [OK]').typist('print','Installing operating system').typist('promptecho').typist('speed','veryslow').typist('type','............. ').typist('println',' [OK]').typist('print','Booting up').typist('promptecho').typist('speed','fast').typist('type','.............................. ').typist('println',' [OK]').typist('print','Starting tutorial').typist('promptecho').typist('speed','normal').typist('type','....................... ').typist('println',' [OK]');setTimeout(function(){window.location.href='university?opt=certification&learn=1';},8800);}
function typeconsole(){$('#terminal').typist('wait','300')}});});</script>
</body>
 
</html>
