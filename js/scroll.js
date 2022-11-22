'use strict';

const SIZE_VALUE = {
  HOME_RATE: 3,
  YEAR_RATE: 3,
  YEAR_SCALE_RATE: 2,
  STORY_RATE: 2,
  CONTINUE_RATE: 6,
}

let isScrolling

function $(query) {
  const selectAll = document.querySelectorAll(query)

  if (selectAll.length === 1) {
    return selectAll[0]
  } else if (selectAll.length === 0) {
    return document
  } else {
    return selectAll
  }
}
function animation(prev, cur, fn) {
  if (prev > cur) {
    const value = prev - 1

    return setTimeout(() => {
      fn(value)

      animation(value, cur, fn)
    }, 1)
  } else if (prev < cur) {
    const value = prev + 1

    return setTimeout(() => {
      fn(value)

      animation(value, cur, fn)
    })
  }
}

class Scroll {
  constructor() {
    this.scrollTop = 0
    this.scrollingDown = false
    this.loading = 0
  }

  set scTop(value) {
    this.scrollingDown = this.scrollTop < value
    this.scrollTop = value

    this.videoAnimation()
    this.storyScroll(0)
    this.championAnimation()
    this.continueAnimation()
  }

  get scTop() {
    return this.scrollTop
  }
  get isScrollingDown() {
    return this.scrollingDown
  }

  _init() {
    const $story = $('#story')
    const $continue = $('#continue')
    const $home = $('#home')
    const $list = $('#story .list')

    $('#loading h1').innerText = '0%'

    $home.style.height = `${SIZE_VALUE.HOME_RATE * 100}vh`
    $continue.style.height = `${SIZE_VALUE.CONTINUE_RATE * 100}vh`

    let videoCount = 0

    const $videoList = $('.video video')

    $videoList.forEach((dom) => {
      const src = dom.dataset.src

      Array.from(dom.children).forEach((child) => {
        const type = child.type

        child.setAttribute('src', `${src}.${type.replace('video/', '')}`)
      })

      dom.load()

      dom.addEventListener('canplay', () => {
        videoCount += 1

        this.loadingCount(() => {
          if (window.innerWidth > window.innerHeight) {
            document.body.classList.remove('hidden')
          } else {
            return
          }

          setTimeout(() => {
            $story.style.height = `${$list.offsetWidth + (window.innerHeight * 3)}px`

            setTimeout(() => {
              window.scrollTo({ top: 0 })

              $('#loading').classList.add('on')
            }, 100)
          }, 500)
        }, videoCount * (100 / $videoList.length))
      })
    })


    window.addEventListener('scroll', () => {
      clearTimeout(isScrolling)

      this.scTop = window.scrollY

      isScrolling = setTimeout(function() {
        // console.log( 'Scrolling has stopped.' )
      }, 66);
    })
  }

  videoAnimation() {
    const $content = $('#home .content')
    const $champion = $('#champion-text')
    const $year = $('#home .year')

    const firstStep = window.innerHeight
    const secondStep = window.innerHeight * 2

    if (this.scTop <= firstStep) {
      $content.classList.remove('on')
      $content.classList.remove('delay')

      $champion.classList.remove('on')
      $champion.classList.remove('delay')
      $champion.classList.remove('fix')

      if (this.isScrollingDown) {
        $champion.classList.remove('opacity')

        $year.classList.remove('transition')
        $year.classList.remove('on')

        $year.style.transform = `matrix(1, 0, 0, 1, -${$year.offsetWidth / 2}, -${$year.offsetHeight / 2}) scale(${3 - this.scTop * (2 / firstStep)})`
      } else {
        window.scrollTo({ top: 0 })

        $year.style.transform = 'matrix(1, 0, 0, 1, -377, -192) scale(3)'
      }
    } else if (firstStep < this.scTop && this.scTop <= secondStep) {
      $content.classList.add('delay')
      $content.classList.add('on')

      $champion.classList.add('opacity')
      $champion.classList.add('transition')
      $champion.classList.add('delay')
      $champion.classList.add('on')

      $year.classList.add('transition')

      $year.style.transform = ``
    }
  }
  championAnimation() {
    const $text = $('#champion-text')
    const $start = $('#start')
    const $slogan = $('#start .slogan .sticky')
    const firstStep = window.innerHeight * (SIZE_VALUE.HOME_RATE - 1) + 173

    if (firstStep <= this.scTop && this.scTop < $start.offsetTop) {
      $text.classList.remove('fix')
      $text.classList.remove('delay')
      $text.classList.remove('transition')
      $text.classList.remove('font-size')
      $text.classList.remove('opacity')

      $text.style.transform = `matrix(1, 0, 0, 1, -291, ${(this.scTop - firstStep) + 189})`
    } else if ($start.offsetTop <= this.scTop && this.scTop < $slogan.offsetTop) {
      $text.classList.remove('fix')
      $text.classList.add('font-size')

      const foo = (this.scTop - $start.offsetTop) * (180 / window.innerHeight) > 180 ? 180 : (this.scTop - $start.offsetTop) * (180 / window.innerHeight)

      $text.style.transform = `matrix(1, 0, 0, 1, -${291 - foo}, ${(this.scTop - firstStep) + 189})`
    } else if (this.scTop >= $slogan.offsetTop) {
      $text.classList.add('transition')
      $text.classList.add('fix')

      $text.style.transform = `matrix(1, 0, 0, 1, -111, ${($slogan.offsetTop - firstStep) + 189})`
    } else {
      $text.style.transform = ``
    }
  }
  storyScroll() {
    const $story = $('#story')
    const $list = $('#story .list')

    if (
      this.scTop >= $story.offsetTop &&
      this.scTop < ($list.offsetWidth + $story.offsetTop - window.innerWidth)
    ) {
      $list.style.transform = `matrix(1, 0, 0, 1, ${$story.offsetTop - this.scTop}, 0)`
    } else if (this.scTop >= ($list.offsetWidth + $story.offsetTop - window.innerWidth)) {
      $list.style.transform = `matrix(1, 0, 0, 1, ${window.innerWidth - $list.offsetWidth}, 0)`
    } else {
      $list.style.transform = `matrix(1, 0, 0, 1, 0, 0)`
    }
  }
  continueAnimation() {
    const $continue = $('#continue')
    const blockHeight = $continue.offsetHeight / SIZE_VALUE.CONTINUE_RATE

    if (this.scTop > $continue.offsetTop) {
      const targetNumber = 1 + Number(((this.scTop - $continue.offsetTop) / blockHeight).toFixed(0))

      if (targetNumber < 5) {
        $continue.querySelectorAll(`.typo`).forEach((dom) => {
          dom.classList.remove('on')
        })
        $continue.querySelector(`.typo.item${targetNumber}`).classList.add('on')
        $continue.querySelector(`.typo.logo-wrap`).classList.remove('change')
      } else if (targetNumber >= SIZE_VALUE.CONTINUE_RATE){
        $continue.querySelector(`.typo.logo-wrap`).classList.add('change')
      }
    } else {
      $continue.querySelector(`.typo.logo-wrap`).classList.remove('change')
      $continue.querySelectorAll(`.typo`).forEach((dom) => {
        dom.classList.remove('on')
      })
    }
  }
  loadingCount(fn, cur) {
    const $loading = document.querySelector('#loading')
    const counting = () => {
      if (this.loading <= cur) {
        $loading.querySelector('h1').innerText = `${this.loading}%`

        return setTimeout(() => {
          this.loading += 1

          return counting()
        }, 10)
      } else if (this.loading >= 100) {
        $loading.querySelector('h1').innerText = `${100}%`

        fn()
      }
    }

    if (!$loading.classList.contains('on')) {
      counting()
    }
  }
}

const scroll = new Scroll()

scroll._init()

let resizeTimeOut = null

window.addEventListener('resize' , function () {
  if (resizeTimeOut !== null) clearTimeout(resizeTimeOut)

  if (window.innerWidth <= window.innerHeight) {
    document.body.classList.add('hidden')
  } else {
    document.body.classList.remove('hidden')
  }
})

const startIO = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('on')
    } else {
      entry.target.classList.remove('on')
    }
  })
}, {
  threshold: 0.3,
})
const videoIO = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.querySelector('video').play()
  })
}, {
  threshold: 0.5,
})
const videoImageIO = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('on')
    }
  })
}, {
  threshold: 0.8,
})
const seasonIO = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('on')
    }
  })
}, {
  threshold: 0.5,
})

startIO.observe($('#start .slogan .sticky'))

$('.video').forEach((dom) => {
  videoIO.observe(dom)
  videoImageIO.observe(dom)
})
$('#start .season .content').forEach((dom) => {
  seasonIO.observe(dom)
})
