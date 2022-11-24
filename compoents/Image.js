class Image extends WC {
  props() {
    return ['src', 'width', 'height', 'alt', 'class']
  }
  
  render(props) {
    return `
      <picture class="block ${props.class || ''}">
        <source
          class="block"
          srcset="${props.src}.webp, ${props.width}w, ${props.height}h"
          type="image/webp"
        />
        <img
          class="block"
          src="${props.src}.png"
          alt="${props.alt}"
          width="${props.width}"
          height="${props.height}"
        />
      </picture>
    `
  }
}
  
define('x-image', Image)