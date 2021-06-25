var section;
var lastScrollTop = 0;
var scroll = true;
$('.counter-count').each(function () {
    $(this).prop('Counter', 0).animate({
        Counter: $(this).text()
    }, {
        duration: 5000,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now));
        },
        complete: function () {
            $(this).parent().addClass('finish')
        }
    });
});
window.onbeforeunload = function () {
    $('body').addClass('loading')
    window.scrollTo(0, 0);
}
$(document).ready(() => {
    section = $($('section')[0]);
    $(window).on('scroll', function (evt) {
        if ($('body').width() > 991) {
            if (scroll && !$('body').hasClass("scrolling")) {
                //scroll = false;
                $('body').addClass("scrolling");
                $('section').removeClass('inview')
                var st = $(this).scrollTop();
                if (st > lastScrollTop) {
                    if (section.next().hasClass('max')) {
                        section = section.next().children(':nth-child(2)');
                    } else {
                        if (section.next().length === 0) {
                            if (section.parent().next().length > 0) {
                                section = section.parent().next();
                            }
                        } else {
                            section = section.next();
                        }
                    }
                    // downscroll code
                } else {
                    if (section.prev().hasClass('max')) {
                        section = section.prev().children(':last-child');
                    } else {
                        if (section.prev().length === 0 || section.prev().hasClass('bkg')) {
                            if (section.parent().prev().length > 0) {
                                section = section.parent().prev();
                            }
                        } else {
                            section = section.prev();
                        }
                    }
                    // upscroll code
                }
                lastScrollTop = section.offset().top;
                $('html, body').animate({
                    scrollTop: section.offset().top
                }, 1500, function () {
                    setTimeout(() => {
                        section.addClass('inview');
                        section.find('[data-animated]:not(.animated)').each((_, e) => {
                            $(e).addClass('animated').addClass($(e).data('animated'))
                        })  
                        $('body').removeClass("scrolling");  
                    }, 200);        
                })
            }else{
                //evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        } else {
            $('[data-animated]:inview:not(.animated)').each((_, e) => {
                $(e).addClass('animated').addClass($(e).data('animated'))
            })
        }
    })
    $('[data-animated]:inview').each((_, e) => {
        $(e).addClass('animated').addClass($(e).data('animated'))
    })
    $('[data-card]').click(function () {
        $("#" + $(this).data('card')).toggleClass("flip")
    })

    var slider = new Slider(6000, '.logos', '#show')
    $('.next').click(() => {
        slider.next();
    })
    //console.log(slider);
})

jQuery.extend(jQuery.expr[':'], {
    inview: function (elem) {
        var t = $(elem);
        var offset = t.offset();
        var win = $(window);
        var winST = win.scrollTop();
        var elHeight = t.outerHeight(true);
        if (offset.top > winST + elHeight && offset.top < winST - elHeight + win.height()) {
            return true;
        }
        return false;
    }
});

class Slider {
    constructor(time, selector, show) {
        this.time = time;
        this.selector = $(selector);
        this.showing = $(show).find('.item');
        this.clone = $(this.showing[0]).clone().addClass('clone').appendTo(this.showing.parent());
        this.showing.addClass('active')
        this.slide = 0;
        this.animation = setTimeout(() => {
            this.next()
        }, this.time);

        this.selector.find('.slide').click((event) => {
            var slide = 0;
            this.selector.find('.slide').each((i, e) => {
                if (e === event.currentTarget) {
                    slide = i;
                }
            })
            this.selectSlide(slide)
        })
    }

    next() {
        clearTimeout(this.animation);
        this.selector.find('img').removeClass('active');
        var temp = this.showing
        this.showing = this.clone
        this.clone = temp;
        this.showing.removeClass('clone').addClass('active');
        this.clone.addClass('clone').removeClass('active');
        var actual = $(this.selector.children('.slide')[this.slide]);
        this.showing.find('.title').html(actual.data('title'))
        this.showing.find('.texto').html(actual.data('texto'))
        this.showing.find('img').attr('src', actual.find('img').attr('src'))
        actual.find('img').addClass('active');
        this.animation = setTimeout(() => {
            this.next();
        }, this.time);
        if (this.slide == this.selector.children('.slide').length - 1) {
            this.slide = 0;
        } else {
            this.slide++;
        }
    }

    stop() {
        clearTimeout(this.animation);
    }

    selectSlide(i) {
        this.slide = i
        this.next()
    }
}