class Video extends WC {
  props() {
    return ['src']
  }

  mounted() {
    const IO = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          await entry.target.play()
        }
      })
    },  {
      threshold: 0.7,
    })

    this.querySelector('video').oncanplay = async function () {
      IO.observe(this)
    }
  }

  render(props) {
    return `
      <video
        muted
        loop
        class="block view height width min"
      >
        <source src="${props.src}.webm" type="video/webm" />
        <source src="${props.src}.mp4" type="video/mp4" />
      </video>
    `
  }
}

define('d-video', Video)
