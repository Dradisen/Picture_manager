
let images = document.querySelectorAll('img');
let wrapper = document.querySelector('body');

let div = document.createElement("div");

div.className = "picture__wrapper";


div.onclick = function(){
    div.style.display = "none";
    div.innerHTML = '';
}

wrapper.appendChild(div);

images.forEach(element => {
    element.onclick = function(){
        div.style.display = "block";
        let copy_image = document.createElement('img');
        copy_image.src = element.src;
        copy_image.style.top = element.getBoundingClientRect().top+"px";
        copy_image.style.left = element.getBoundingClientRect().left+"px";
        copy_image.style.position = "absolute";
        div.appendChild(copy_image);
        // let widthXCenter = element.getBoundingClientRect().width/2;
        // let heightYCenter = element.getBoundingClientRect().height/2;
        //console.log(copy_image.getBoundingClientRect());
        // copy_image.style.top = centerY-heightYCenter+"px";
        // copy_image.style.left = centerX-widthXCenter+"px";
        // copy_image.style.position = "absolute";
        animate(copy_image, 250);
    }
});

function animate(el, duration){
    let centerX = document.documentElement.clientWidth/2;
    let centerY = document.documentElement.clientHeight/2;

    let widthXCenter = el.getBoundingClientRect().width/2;
    let heightYCenter = el.getBoundingClientRect().height/2;
    
    let beginTop = el.getBoundingClientRect().top;
    let beginLeft = el.getBoundingClientRect().left;

    let endTop = centerY - heightYCenter;
    let endLeft = centerX - widthXCenter;

    let deltaTop = endTop - beginTop;
    let deltaLeft = endLeft - beginLeft;

    //console.log(beginTop, beginLeft, endTop, endLeft);
    
    let start = performance.now();

    requestAnimationFrame(function animate(time){

        let timeFraction = (time - start) / duration;

        if(timeFraction > 1) timeFraction = 1;

        el.style.top = beginTop + (deltaTop*circ(timeFraction))+"px";
        el.style.left = beginLeft + (deltaLeft*circ(timeFraction))+"px";

        if(timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    })
}


function circ(time){
    return Math.pow(time, 2);
}

function easeIn(time){
    return 1 - Math.pow(1 - time, 4);
}