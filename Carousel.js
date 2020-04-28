class Carousel{

    images = null;
    body = document.querySelector('body');
    err = [];
    
    constructor(setting){
        if (typeof setting == 'object'){
            this.el = setting.el;
            if(setting.el === undefined){
                console.error(`"el" key is not defined`);
            }else{
                this.images = document.querySelectorAll(this.el+" img");

                if (this.images.length){
                    this.createTemplate();
                    this.picture_container = document.querySelector("#picture__container");
                    this.button_left = document.querySelector("#picture__container .picture__button-left");
                    this.button_right = document.querySelector("#picture__container .picture__button-right");
                    this.picture_items = document.querySelector("#picture__container .picture__items");
                    this.button_close = document.querySelector("#picture__wrapper .picture__button-close");
                    this.initEvents();
                }
            }
        }else{
            console.error("first argument is not object or empty");
        }
    }

    template(){
        return `
            <div id="picture__container" onclick="event.stopPropagation()">
                <div class="picture__button picture__button-left"></div>
                <div class="picture__items"></div>
                <div class="picture__button picture__button-right"></div>
            </div>
            <div class="picture__button picture__button-close"></div>
        `;
    }
    createTemplate(){
        this.picture_wrapper = document.createElement("div");
        this.picture_wrapper.id = "picture__wrapper";
        this.picture_wrapper.innerHTML = this.template();
        this.body.appendChild(this.picture_wrapper);
    }
    
    initEvents(){
        self = this;

        let eventClose = function(){
            self.picture_items.removeChild(self.picture_items.firstChild);
            if(self.animation && self.picture_wrapper.lastChild.tagName == "IMG"){
                cancelAnimationFrame(animation);
                self.picture_wrapper.removeChild(self.picture_wrapper.lastChild);
            }
            document.removeEventListener('keydown', keypress);
            //document.removeEventListener('keydown', eventCloseKey);

            self.picture_wrapper.style.display = "none";
            self.picture_items.style.display = "flex";
            self.picture_items.style.visibility = "hidden";
        }
        let eventCloseKey = function(e){
            if(e.key == "Escape") eventClose();
        }
        document.addEventListener('keydown', eventCloseKey);
        self.picture_wrapper.addEventListener('click', eventClose);
        self.button_close.removeEventListener('click', eventClose);

        let eventNextImg = function(){
            let number = self.picture_items.lastChild.getAttribute("data-number");
            number++;
            if(number > self.images.length - 1){
                number = 0;
            }
            self.picture_items.lastChild.src = self.images[number].src;
            self.picture_items.lastChild.setAttribute("data-number", number);
        }

        let eventPrevImg = function(){
            let number = self.picture_items.lastChild.getAttribute("data-number");
            number--;
            if(number < 0){
                number = self.images.length - 1;
            }
            self.picture_items.lastChild.src = self.images[number].src;
            self.picture_items.lastChild.setAttribute("data-number", number);
        }

        let keypress = function(e){
            if(e.key == "ArrowRight"){
                eventNextImg();
            }else if(e.key == "ArrowLeft"){
                eventPrevImg();
            }
        }

        self.button_right.addEventListener('click', eventNextImg);
        self.picture_items.addEventListener('click', eventNextImg);
        self.button_left.addEventListener('click', eventPrevImg);

        self.images.forEach(function(element, i = 0){
            element.setAttribute("data-number", i++);
            element.style.cursor = "pointer";

            element.addEventListener('click', function(){
                let copy_image_animate = document.createElement('img');
                let copy_image         = document.createElement('img');

                self.picture_wrapper.style.display = "flex";

                copy_image.setAttribute("data-number", element.getAttribute("data-number"));
                copy_image.src = copy_image_animate.src = element.src;

                copy_image_animate.style.top = element.getBoundingClientRect().top+"px";
                copy_image_animate.style.left = element.getBoundingClientRect().left+"px";
                copy_image_animate.style.width = element.getBoundingClientRect().width+"px";
                copy_image_animate.style.position = "absolute";

                self.picture_wrapper.appendChild(copy_image_animate);
                self.picture_items.appendChild(copy_image);
                self.animate(copy_image_animate, copy_image, self.quad, 250);

                document.addEventListener('keydown', keypress);
            })
        });

    }

    animate(from, to, func, duration){
        self = this;

        let beginTop = from.getBoundingClientRect().top;
        let beginLeft = from.getBoundingClientRect().left;
        let beginWidth = from.getBoundingClientRect().width;

        let endTop = to.getBoundingClientRect().top;
        let endLeft = to.getBoundingClientRect().left;
        let endWidth = to.getBoundingClientRect().width;

        let deltaTop = endTop - beginTop;
        let deltaLeft = endLeft - beginLeft;
        let deltaWidth = endWidth - beginWidth;

        let start = performance.now();

        requestAnimationFrame(function animate(time){

            let timeFraction = (time - start) / duration;

            if(timeFraction > 1) timeFraction = 1;
        
            from.style.top = beginTop + (deltaTop*func(timeFraction))+"px";
            from.style.left = beginLeft + (deltaLeft*func(timeFraction))+"px";
            from.style.width = beginWidth + (deltaWidth*func(timeFraction))+"px";

            self.picture_container.style.opacity = timeFraction;
            
            if(timeFraction < 1) {
                self.animation = requestAnimationFrame(animate);
            }else{
                self.picture_wrapper.removeChild(self.picture_wrapper.lastChild);
                self.picture_items.style.display = "flex";
                self.picture_items.style.visibility = "visible";
            }
        })
    }
    
    quad(time){
        return Math.pow(time, 2);
    }
    
    easeIn(time){
        return 1 - Math.pow(1 - time, 4);
    }
    
    easeInFast(time){
        return 1 - Math.pow(1 - time, 0.5);
    }
    
    easeOutExpo(time){
        return time === 1 ? 1 : 1 - Math.pow(2, -10*time);
    }
}