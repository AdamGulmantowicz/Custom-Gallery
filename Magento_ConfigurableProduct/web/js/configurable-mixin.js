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