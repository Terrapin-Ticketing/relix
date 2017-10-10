
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

(function($) {
  "use strict"; // Start of use strict

  function emailSend(name, email) {
    $('.request-form-button').attr('disabled', 'disabled');
    $('.request-form-button').css('border-color', 'gray');
    $('.request-form-button').css('color', 'gray');
    $('.request-form-button').css('cursor', 'default');

    emailjs.send('info','template_0iOPQteR', {
      email: email, name: name
    })
      .then(function(response) {
        // close modal
        $('.request-modal').css('display', 'none');
        console.log('SUCCESS. status=%d, text=%s', response.status, response.text);
      }, function(err) {
        alert('FAILED TO SEND EMAIL: ', err);
      });
  }

  $('#request-access-button').click(function(e) {
    $('.request-form').click(function(e) {
      e.preventDefault();
      e.stopPropagation();
    });

    $('.request-modal').css('display', 'flex');
    $('.request-modal').click(function(e) {
      e.preventDefault();
      $('.request-modal').css('display', 'none');
    });

    $('.request-form-button').click(function(e) {
      e.preventDefault();
      var name = $('.request-form-name').val();
      var email = $('.request-form-email').val();

      if (validateEmail(email)) {
        return emailSend(name, email);
      }

      $('.request-form-email').css('border-color', 'red');

    });
  });


  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 48)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 48
  });

  // Collapse the navbar when page is scrolled
  $(window).scroll(function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  });

  // Scroll reveal calls
  window.sr = ScrollReveal();
  sr.reveal('.sr-icons', {
    duration: 600,
    scale: 0.3,
    distance: '0px'
  }, 200);
  sr.reveal('.sr-button', {
    duration: 1000,
    delay: 200
  });
  sr.reveal('.sr-contact', {
    duration: 600,
    scale: 0.3,
    distance: '0px'
  }, 300);

  // Magnific popup calls
  $('.popup-gallery').magnificPopup({
    delegate: 'a',
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    mainClass: 'mfp-img-mobile',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1]
    },
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
    }
  });

})(jQuery); // End of use strict
