var classes, checkbox;
function previewOn(e){
    if(document.getElementById("square")){
       return;
    }
    a = document.createElement("div")
    a.id = "preview"
    b = document.createElement("img")
    b.id = "imgPreview"
    b.src = e.target.src
    a.appendChild(b)
    a.style.left= window.pageXOffset+e.x+10+"px"
    a.style.top = window.pageYOffset+e.y+-10+"px"
    document.body.appendChild(a)
    document.onmousemove = function(e){
        var xOffset = window.pageXOffset+e.x+10;
        var yOffset = window.pageYOffset+e.y-10;
        if(a.clientHeight >= window.innerHeight){
            b.style.height = window.innerHeight-12+"px";
            yOffset = window.pageYOffset;
        }
        else if(window.innerHeight-e.y-10 < a.clientHeight){
            yOffset+=window.innerHeight-e.y-a.clientHeight;
            // b.style.height = window.innerHeight-e.y-20+"px";
            b.style.width = "auto";
        }
        else if(window.innerWidth-e.x+10 < a.clientWidth){
            b.style.width = window.innerWidth-e.x+10+"px";
            b.style.height = "auto";

        }
        else{
            b.style.height = "auto";
            b.style.width = "auto";
        }
        a.style.left = xOffset+"px";
        a.style.top = yOffset+"px";
    }
    }

function previewOut(e){
   document.body.removeChild(document.getElementById("preview"));
   document.onmousemove = null;
}

function enablePreview(classes){
    for(i = 0; i < classes.length; i++){
        classes[i].onmouseover = function(e){previewOn(e)};
        classes[i].onmouseout = function(e){previewOut(e)};
    }
    if(document.body.getElementsByClassName("OPpic")){
        document.body.getElementsByClassName("OPpic")[0].onmouseover = function(e){previewOn(e)};
        document.body.getElementsByClassName("OPpic")[0].onmouseout = function(e){previewOut(e)}; 
    }
}

function disablePreview(classes){
    for(i = 0; i < classes.length; i++){
        classes[i].onmouseover = null;
        classes[i].onmouseout = null;
        document.onmousemove = null;
    }
    if(document.body.getElementsByClassName("OPpic")){
        document.body.getElementsByClassName("OPpic")[0].onmouseover = null;
        document.body.getElementsByClassName("OPpic")[0].onmouseout = null; 
    }
}

window.onload = function(){
    classes = document.getElementsByClassName("fileThumb");
    console.log(classes);
    checkbox = document.getElementById("previewCheck");
    if(localStorage.preview){
        checkbox.checked = parseInt(localStorage.preview);
    }
    if(checkbox.checked){
        enablePreview(classes);
    }
    checkbox.onclick = function(e){
        if(e.target.checked){
            enablePreview(classes);
        }
        else{
            disablePreview(classes);
        }
    }
}

window.onunload = function(){
    if(checkbox.checked){
        localStorage.preview = 1;
    }
    else{
        localStorage.preview = 0;
    }
}