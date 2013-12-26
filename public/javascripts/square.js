var c = document.createElement("canvas");
c.width = document.innerWidth();
c.height = document.innerHeight();
c.style.overflow = "hidden";
var ctx=c.getContext("2d");
function main(){
    var numBlockSize = Math.floor((Math.random()*5+1));
    var blockSizes = [];
    for (var i =0; i <= numBlockSize; i++){
        blockSizes[i] = [600, 120, 50, 300, 200, 150, 5000, 60, 20][Math.floor((Math.random()*9))];
    }
    blockSizes.sort().reverse();
    console.log(blockSizes);
    for(i = 0; i<= numBlockSize; i++){
        drawSquare(blockSizes[i]);
    }
}
function drawSquare(x){
    for(i = 0; i < 50; i+= x){
        for(j = 0; j < 50; j+=x){
            console.log('print');
            ctx.fillStyle = colorGenerator();
            ctx.fillRect(Math.floor((Math.random()*90)), Math.floor((Math.random()*90)), x, x);
        }
    }
}
function colorGenerator(){
    return "rgb("+Math.floor(Math.random()*255+1)+", "+Math.floor(Math.random()*255+1)+", "+Math.floor(Math.random()*255+1)+")";
}
main();
document.body.appendChild(c);