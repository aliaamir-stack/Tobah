// ImageGallery.js
import React from 'react';
import Gallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const ImageGallery = ({ images }) => {
  const galleryImages = images.map(url => ({
    original: url,
    thumbnail: url,
  }));

  return (
    <Gallery
      items={galleryImages}
      showThumbnails={false}
      showPlayButton={false}
      showFullscreenButton={false}
      autoPlay={true}
      slideInterval={5000}
      additionalClass="tw-gallery"
    />
  );
};

export default ImageGallery;
