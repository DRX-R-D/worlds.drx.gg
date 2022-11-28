class Image extends WC {
  props() {
    return ['src', 'width', 'height', 'alt', 'class']
  }

  render(props) {
    const width = isNaN(Number(props.width))
      ? !!props.width
        ? props.width
        : 'auto'
      : `${props.width}px`
    const height = isNaN(Number(props.height))
      ? !!props.height
        ? props.height
        : 'auto'
      : `${props.height}px`

    return `
      <picture
        class="block"
        style="width: ${width}; height: ${height};"
      >
        <source
          media="all"
          class="block"
          srcset="${props.src}.webp ${props.width}w"
          type="image/webp"
        />
        <img
          class="block"
          src="${props.src}.png"
          alt="${props.alt}"
          width="${width}"
          height="${height}"
        />
      </picture>
    `
  }
}

define('d-image', Image)
