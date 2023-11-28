class Swiper {
    constructor() {
        this.data = {
            index: 0,
            duration: 500,
            isLock: false,
            translateX: 0,
            defaultLength: null,
            listWidth: null,
            itemWidth: null,
            itemMargin: 0,
            timer: null,
        }

        this.nextArrow = this.nextArrow.bind(this);
        this.preArrow = this.preArrow.bind(this);
        this.init = this.init.bind(this);
        this.playTime = this.playTime.bind(this);
        this.pauseScroll = this.pauseScroll.bind(this);

        this.init();
        this.bind();
    }

    bind() {
        let preArrow = document.getElementById('pre-arrow');
        preArrow.addEventListener('click', this.preArrow);

        let nextArrow = document.getElementById('next-arrow');
        nextArrow.addEventListener('click', this.nextArrow);

        //每1.5s自动切换，当鼠标移动到teacher-carousel里面，停止自动切换，当鼠标移出时，恢复自动切换
        let teacherCarousel = document.getElementById('teacher-carousel');
        teacherCarousel.addEventListener("mouseenter", this.pauseScroll);
        teacherCarousel.addEventListener("mouseleave", this.playTime);

        window.addEventListener('resize', this.init);
    }

    init() {
        this.pauseScroll();

        let teacherCardList = document.getElementById('teacher-card-list');
        let teacherCards = document.getElementsByClassName('teacher-card');
        let listWidth = teacherCardList.offsetWidth;
        let cardItemWidth = teacherCards[0].offsetWidth;
        let itemMargin = (listWidth - 4 * cardItemWidth) / 3;
        for (let item of teacherCards) {
            item.style.marginRight = itemMargin + 'px';
        }
        let index = this.data.index;
        let translateX = - ((cardItemWidth + itemMargin) * index);
        this.data.defaultLength = teacherCards.length - 4;
        this.data.itemWidth = cardItemWidth;
        this.data.itemMargin = itemMargin;
        this.data.translateX = translateX;
        teacherCardList.style.transform = `translateX(${translateX}px)`;

        this.playTime();
    }

    animateTo(begin, end, duration, changeCallback, finishCallback) {
        let startTime = Date.now();
        let self = this;  // 将 this 存储在变量中
        requestAnimationFrame(function update() {
            let dateNow = Date.now();
            let time = dateNow - startTime;
            let value = self.linear(time, begin, end, duration);
            typeof changeCallback == 'function' && changeCallback(value);

            if (startTime + duration > dateNow) {
                requestAnimationFrame(update);
            } else {
                typeof finishCallback === 'function' && finishCallback(end);
            }
        });
    }

    linear(time, begin, end, duration) {
        return (end - begin) * time / duration + begin;
    }

    goIndex(index) {
        let swiperDuration = this.data.duration;
        let cardItemWidth = this.data.itemWidth;
        let swiperLength = this.data.defaultLength;
        let preArrow = document.getElementById('pre-arrow');
        let nextArrow = document.getElementById('next-arrow');
        if (index <= -1) {
            index = swiperLength;
        }
        if (index >= swiperLength + 1) {
            index = 0;
        }


        let itemMargin = this.data.itemMargin;
        let beginTranslateX = this.data.translateX;
        let endTranslateX = - ((cardItemWidth + itemMargin) * index);

        let isLock = this.data.isLock;
        if (isLock) return;
        this.data.isLock = true;

        let teacherCardList = document.getElementById('teacher-card-list');
        this.animateTo(beginTranslateX, endTranslateX, swiperDuration, (value) => {
            teacherCardList.style.transform = `translateX(${value}px)`;
        }, (value) => {

            teacherCardList.style.transform = `translateX(${value}px)`;
            this.data.index = index;
            this.data.translateX = value;

            this.data.isLock = false;
        });
    }

    preArrow() {
        let index = this.data.index;
        this.goIndex(index - 1)
    }

    nextArrow() {
        let index = this.data.index;
        this.goIndex(index + 1);
    }

    playTime() {
        let index = this.data.index;
        let timer = setInterval(() => {
            this.nextArrow();
        }, 1500);
        this.data.timer = timer;
    }

    pauseScroll() {
        clearInterval(this.data.timer);
        this.data.timer = null;
    }

}