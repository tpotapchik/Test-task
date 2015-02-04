$(function () {
    $('input[type="text"], input[type="email"], input[type="tel"], textarea').focus(function () {
        if ($(this).val() == $(this).attr("title")) {
            $(this).val("");
        }
    }).blur(function () {
                if ($(this).val() == "") {
                    $(this).val($(this).attr("title"));
                }
            });

    $('.slider').slick({
        dots: false
    });
    $('.partners').slick({
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        speed: 300
    });

    $('.medium-select').chosen({
        disable_search: true,
        inherit_select_classes: true,
        width: "200px"
    });
    $('.small-select').chosen({
        disable_search: true,
        inherit_select_classes: true,
        width: "100px"
    });

    $('.more-btn').click(function () {
        var $this = $(this);
        $this.closest('.main-text-block-wrap').find('.news-body').slideToggle();

        if ($this.hasClass('opened')) {
            $this.text('Читать полностью');
        } else {
            $this.text('Свернуть');
        }
        $this.toggleClass('opened');

    });

    $(".fancybox").fancybox({
        nextEffect:'fade',
        prevEffect:'fade'
    });

    $(window).on('scroll', function () {
        if ($(document).scrollTop() >= 900) {
            $('.back-top').fadeIn();
        }
        else {
            $('.back-top').fadeOut();
        }
    });

    $('.back-top').click(function () {
        $('body,html').animate({
            'scrollTop': 0
        }, 400)
    });

    $(".popup").fancybox();

    $('#js-submit').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var popup = $('.order-call');
        var message = popup.find('.message');
        var $form = popup.find('form');
        var $inputName = $form.find('input[type="text"]');
        var $inputTel = $form.find('input[type="tel"]');

        if ($inputName.val() == '') {
            $inputName.addClass('error');

        } else if ($inputTel.val() == '') {
            $inputTel.addClass('error');

        } else if (!validatePhone($inputTel.val())) {
            $inputTel.addClass('error');

        } else {
            $this.attr('disabled', 'disabled');
            $.ajax({
                url: $form.attr('action'),
                type: "POST",
                data: $form.serialize(),
                success: function (data) {

                    if (data.error) {
                        alert('Произошла ошибка');
                    } else {
                        message.slideDown();

                        setTimeout(function () {
                            $.fancybox.close();
                            $form[0].reset();
                            message.hide();
                            $this.removeAttr('disabled');
                        }, 5000);
                    }
                },
                error: function () {
                    alert('Произошла ошибка. Попробуйте еще раз.');
                }
            });
        }
    });

    $('.order-call form').find('input').focus(function () {
        $(this).removeClass('error');
    })


});

function validatePhone(phone) {
    var reg = /^[0-9\s\-\(\)\+]+$/;
    return reg.test(phone);
}

var myMap, myPlacemark, MyBalloonLayout;

ymaps.ready(init);

function init() {
    myMap = new ymaps.Map('officeMap', {
        center: [53.925486, 27.507860],
        zoom: 16,
        controls: []
    });

    MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="contacts-popup">'
                    + '<img src="img/logo.png" alt="" style="width: 100px; height: 39px"/>'
                    + '220035, Республика Беларусь,<br>'
                    + 'г.Минск, ул. Тимирязева, 67, 10 этаж, оф.1009<br><br>'
                    + 'Тел: 375 17 677 10 59<br>'
                    + 'Тел: 375 29 677 10 59<br>'
                    + 'E-mail: <a href="mailto:info@site.by">info@site.by</a>'
                    + '</div>', {

                build: function () {
                    this.constructor.superclass.build.call(this);
                    this._$element = $('.contacts-popup', this.getParentElement());
                    this.applyElementOffset();
                },
                clear: function () {
                    this.constructor.superclass.clear.call(this);
                },
                onSublayoutSizeChange: function () {
                    MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);
                    if (!this._isElement(this._$element)) {
                        return;
                    }
                    this.applyElementOffset();
                    this.events.fire('shapechange');
                },
                applyElementOffset: function () {
                    this._$element.css({
                        left: -(this._$element[0].offsetWidth + 25),
                        top: -(this._$element[0].offsetHeight + 42) / 2
                    });
                },
                getShape: function () {
                    if (!this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }
                    var position = this._$element.position();
                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top],
                        [
                            position.left + this._$element[0].offsetWidth,
                            position.top + this._$element[0].offsetHeight
                        ]
                    ]));
                },
                _isElement: function (element) {
                    return element && element[0];
                }
            });

    myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
        hintContent: ''
    }, {
//        iconLayout: 'default#image',
//        iconImageHref: 'img/pin-contacts.png',
//        iconImageSize: [87, 92],
//        iconImageOffset: [-38, -90],
        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonPanelMaxMapArea: 0,
        hideIconOnBalloonOpen: false
    });

    myMap.geoObjects.add(myPlacemark);

    myMap.events.add('click', function () {
        myMap.balloon.close(true);
    });
}