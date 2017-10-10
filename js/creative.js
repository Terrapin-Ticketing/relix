/* SmtpJS.com */
var Email = {send: function (a, b, c, d, e, f, g) { var h = Math.floor(1e6 * Math.random() + 1), i = "https://smtpjs.com/smtp.aspx?"; i += "From=" + a, i += "&to=" + b, i += "&Subject=" + encodeURIComponent(c), i += "&Body=" + encodeURIComponent(d), void 0 == e.token ? (i += "&Host=" + e, i += "&Username=" + f, i += "&Password=" + g, i += "&Action=Send") : (i += "&SecureToken=" + e.token, i += "&Action=SendFromStored"), i += "&cachebuster=" + h, Email.ajax(i) }, sendWithAttachment: function (a, b, c, d, e, f, g, h) { var i = Math.floor(1e6 * Math.random() + 1), j = "https://smtpjs.com/smtp.aspx?"; j += "From=" + a, j += "&to=" + b, j += "&Subject=" + encodeURIComponent(c), j += "&Body=" + encodeURIComponent(d), j += "&Attachment=" + encodeURIComponent(h), void 0 == e.token ? (j += "&Host=" + e, j += "&Username=" + f, j += "&Password=" + g, j += "&Action=Send") : (j += "&SecureToken=" + e.token, j += "&Action=SendFromStored"), j += "&cachebuster=" + i, Email.ajax(j) }, ajax: function (a) { var b = Email.createCORSRequest("GET", a); b.onload = function () { var a = b.responseText; console.log(a) }, b.send() }, createCORSRequest: function (a, b) { var c = new XMLHttpRequest; return "withCredentials" in c ? c.open(a, b, !0) : "undefined" != typeof XDomainRequest ? (c = new XDomainRequest, c.open(a, b)) : c = null, c } };

(function($) {
  "use strict"; // Start of use strict

  console.log('seinding meail');

  // Email.send("info@terrapinticketing.com",
  // "reeder@terrapinTicketing.com", //"to@them.com",
  // "This is a subject",
  // "this is the body",
  // {token: "bab0058e-cf4f-4ccb-9bcc-3bfb926f3da2"});

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
