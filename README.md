# Custom Gallery for Magento 2

# Initialize

Add Custom Gallery and swiper to your requirejs-config.js
```js
var config = {
  paths: {
      swiper: 'js/swiper.min',
      customGallery: 'js/custom-gallery'
  }
};
```
Include Custom Gallery and Swiper less files to your _extend.less

```less
@import '_swiper';
@import '_gallery';
```

Include necessary HTML structure

```phtml
<?php
// $block \Magento\Catalog\Block\Product\View\Gallery 
$imagesArray = json_decode($block->getGalleryImagesJson(), true);
?>

<div id="galleryWrapper" data-gallery-role="gallery-placeholder" class="gallery">
    <div class="gallery__close"></div>
    <div class="gallery-top swiper-container gallery__top">
        <div class="swiper-wrapper gallery__slides">
            <?php foreach($imagesArray as $imageData): ?>
                <?php if($imageData['img'] && $imageData['full']): ?>
                    <div class="swiper-slide">
                        <img class="swiper-img" data-img="<?= $imageData['img'] ?>" data-full="<?= $imageData['full'] ?>" src="<?= $imageData['img'] ?>" alt="Slide image" />
                    </div>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
        <!-- Add Arrows -->
        <div class="swiper-button-next swiper-button-white gallery__button gallery__button--next"></div>
        <div class="swiper-button-prev swiper-button-white gallery__button gallery__button--prev"></div>

        <div class="swiper-pagination gallery__pagination"></div>
    </div>
    <div class="swiper-container-thumbs gallery__bottom">
        <div class="swiper-wrapper gallery__thumbs">
          <!-- Leave this empty, because our module will render thumbs dynamically -->
        </div>
    </div>
</div>
```

Call Gallery init function

```phtml
<script type="text/x-magento-init">
    {
        "#galleryWrapper": {
            "customGallery": {
                "images": <?= /* @noEscape */ $block->getGalleryImagesJson() ?>,
                "thumbsBreakpoint": 1024,
                "options": {
                    "navigation": {
                        "nextEl": ".swiper-button-next",
                        "prevEl": ".swiper-button-prev"
                    },
                    "pagination": {
                        "el": ".swiper-pagination",
                        "type": "bullets",
                        "clickable": true
                    },
                    "thumbs": {
                        "swiper": {
                            "el": ".swiper-container-thumbs",
                            "spaceBetween": 22,
                            "slidesPerView": 4,
                            "watchSlidesVisibility": true,
                            "watchSlidesProgress": true
                        }
                    }
                }
            }
        }
    }
</script>
```

# Config Parameters

- images - array of objects with your images
- thumbsBreakpoint - breakpoint from which the thumbnails will be rendered(min-width)
- options - swiper options from Swiper API(See https://swiperjs.com/api/ for more details)

# CustomGallery API
This module provides the same API as Magento Fotorama (See https://devdocs.magento.com/guides/v2.4/javascript-dev-guide/widgets/widget_gallery.html#gallery_api for more details)

```js
var api = $('[data-gallery-role="gallery-placeholder"]').data('gallery');
```

**Methods**

- first() - displays first slide
- last() - displays last slide
- next() - displays next slide
- prev() - displays prev slide
- updateData(arrayOfNewImages) - appends new slides and thumbs
- updateOptions() - TODO - WORK IN PROGRESS

# Using with Magento_ConfigurableProduct

To use this module with Magento you must remember to keep the appropriate data-gallery-role for your gallery item:
```html
<div id="galleryWrapper" data-gallery-role="gallery-placeholder" class="gallery">
```
Then add mixin, which will overwrite the _changeProductImage function from the mage.cofigurable widget.
```
Magento_ConfigurableProduct/requirejs-config.js:
```
```js
var config = {
    config: {
        mixins: {
            'Magento_ConfigurableProduct/js/configurable': {
                'Magento_ConfigurableProduct/js/configurable-mixin': true
            }
        }
    }
}
```
```
Magento_ConfigurableProduct/js/configurable-mixin.js:
```
```js
define(['jquery'], function ($) {
    'use strict';

    return function (targetWidget) {

        $.widget('mage.configurable', targetWidget, {
            _changeProductImage: function () {
                var images,
                    initialImages = this.options.mediaGalleryInitial,
                    galleryObject = $(this.options.mediaGallerySelector).data('gallery');

                if (!galleryObject) return;

                images = this.options.spConfig.images[this.simpleProduct];

                if (!images) return;

                galleryObject.updateData(images);
                galleryObject.last();
            }
        });

        return $.mage.configurable;
    }

});
```

## License
[MIT](https://choosealicense.com/licenses/mit/)