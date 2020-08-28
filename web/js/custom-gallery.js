define(['jquery', 'underscore', 'swiper'], function ($, _, Swiper) {
  function getThumbMarkup(url) {
      var markup = '<img class="swiper-slide" src="' + url + '"/>';

      return markup;
  };

  function getSlideMarkup(img, full) {
      var markup = '<div class="swiper-slide"><img class="swiper-img" data-img="' + img + '" data-full="' + full +'" src="' + img + '" alt="Slide image" /></div>';

      return markup;
  };

  function GalleryAPI(gallery, config) {
      this.gallery = gallery;
      this.config = config;

      this.first = function() {
          this.gallery.slideTo(0);
      };

      this.last = function() {
          this.gallery.slideTo(this.gallery.slides.length - 1);
      };

      this.next = function() {
          this.gallery.slideNext();
      };

      this.prev = function() {
          this.gallery.slidePrev();
      };

      this.seek = function(index) {
          switch(index) {
              case 0: break;
              case -1: this.last(); break;
              default: {
                  this.gallery.slideTo(index -1);
              }
          }
      };

      this.appendNewSlides = function(image) {
          if (this.config.thumbsBreakpoint && window.innerWidth >= this.config.thumbsBreakpoint) {
              this.gallery.thumbs.swiper.appendSlide(getThumbMarkup(image.thumb));
          }
          this.gallery.appendSlide(getSlideMarkup(image.img, image.full));
      }

      this.updateData = function(newImages) {
          _.each(newImages, this.appendNewSlides.bind(this));
      };

      this.updateOptions = function(newConfig) {
          // todo
      };

      this.returnCurrentImages = function() {
          return config.images;
      };

      return this;
  }

  return function (config, el) {
      config.root = el;
      var slides = config.images;
      var thumbWrapper = $(el).find('.swiper-container-thumbs .swiper-wrapper');

      if (config.thumbsBreakpoint && window.innerWidth >= config.thumbsBreakpoint) {
          _.each(slides, function(slide) {
              thumbWrapper.append(getThumbMarkup(slide.thumb));
          });
      }

      var swiperGallery = new Swiper('.swiper-container', config.options);

      swiperGallery.on('click', function (e) {
          if (!e.clickedSlide) return;
          $(config.root).addClass('gallery--fullscreen');
          _.each(e.slides, function(slide) {
              var currentSlide = $(slide).find('img');
              currentSlide.attr('src', currentSlide.data('full'));
          });
          swiperGallery.update();
      });

      $(config.root).find('.gallery__close').click(function () {
          $(config.root).removeClass('gallery--fullscreen');
          _.each(swiperGallery.slides, function(slide) {
              var currentSlide = $(slide).find('img');
              currentSlide.attr('src', currentSlide.data('img'));
          });
          swiperGallery.update();
      });

      $(config.root).data('gallery', new GalleryAPI(swiperGallery, config));
  }
});