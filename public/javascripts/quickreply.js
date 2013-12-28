var click = 0;
function showIFrame() {  
	console.log("showing iframe");
var iframe = document.getElementById("quickreply");  
if (click % 2 == 0) {
iframe.style.visibility="visible";
//iframe.display = "none";
} else {
	iframe.style.visibility = "hidden";
}
click += 1;
}  
document.getElementById('replynum').click(function(){ console.log("aefeaf"); showIFrame(); return false; });

