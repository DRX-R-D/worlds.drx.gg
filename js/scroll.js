'use strict';

const SIZE_VALUE = {
  YEAR_RATE: 3,
  YEAR_SCALE_RATE: 2,
  VIDEO_RATE: 9,
  STORY_RATE: 2,
  CONTINUE_RATE: 6,
}
const DEFAULT_VALUE = {
  YEAR_LEFT_POSITION: 0,
  YEAR_TOP_POSITION: 270,
  YEAR_SCALE_RATE: 3,
}
const CHANGE_VALUE = {
  YEAR_LEFT_POSITION: -347,
  YEAR_TOP_POSITION: 0,
  YEAR_SCALE_RATE: 1,
}

let isScrolling

function debounce(fn, timer) {
  let timeOut

  return function (...args) {
    clearTimeout(timeOut)

    timeOut = setTimeout(() => {
      fn.apply(this, args)
    }, timer)
  }
}

function $(query) {
  return document.querySelector(query)
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

const $main = $('#app .main')

class Scroll {
  constructor(target) {
    this.target = target
    this.scrollTop = 0
    this.scrollingDown = false
    this.loading = 0
  }

  set scTop(value) {
    this.scrollingDown = this.scrollTop < value
    this.scrollTop = value

    this.videoAnimation(
      DEFAULT_VALUE.YEAR_LEFT_POSITION,
      DEFAULT_VALUE.YEAR_TOP_POSITION,
      DEFAULT_VALUE.YEAR_SCALE_RATE,
    )
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
    const $video = $('#video')
    const $list = $('#story .list')
    // const $scrollBar = $('#scroll-bar .gage')

    document.querySelector('#loading').querySelector('h1').innerText = '0%'

    $video.style.height = `${SIZE_VALUE.VIDEO_RATE * 100}vh`
    $continue.style.height = `${SIZE_VALUE.CONTINUE_RATE * 100}vh`

    let videoCount = 0

    document.querySelectorAll('video').forEach((dom) => {
      dom.addEventListener('canplay', () => {
        videoCount += 1

        this.loadingCount(() => {
          document.body.classList.remove('hidden')

          setTimeout(() => {
            window.scrollTo({ top: 0 })

            $story.style.height = `${$list.offsetWidth}px`

            document.querySelector('#loading').classList.add('on')
          }, 500)
        }, videoCount * (100 / document.querySelectorAll('video').length))
      })
    })

    // this.loadingCount(() => {
    //   document.body.classList.remove('hidden')
    //
    //   setTimeout(() => {
    //     window.scrollTo({ top: 0 })
    //     console.log(window.scrollY)
    //
    //     $story.style.height = `${$list.offsetWidth}px`
    //
    //     document.querySelector('#loading').classList.add('on')
    //   }, 500)
    // })

    window.addEventListener('scroll', () => {
      clearTimeout(isScrolling)

      this.scTop = window.scrollY

      isScrolling = setTimeout(function() {
        // console.log( 'Scrolling has stopped.' )

      }, 66);
    })
  }

  videoAnimation(left, top, scale) {
    const $slogan = this.target.querySelector('#video .slogan')
    const $year = this.target.querySelector('#video .year')

    if (this.scTop <= (window.innerHeight * SIZE_VALUE.YEAR_SCALE_RATE)) {
      scale = DEFAULT_VALUE.YEAR_SCALE_RATE - (this.scTop / window.innerHeight)

      $slogan.classList.remove('ready')

      $year
        .style
        .transform = `matrix(1, 0, 0, 1, ${DEFAULT_VALUE.YEAR_LEFT_POSITION}, ${DEFAULT_VALUE.YEAR_TOP_POSITION}) scale(${scale})`
    } else if (this.scTop <= window.innerHeight * (SIZE_VALUE.YEAR_RATE + SIZE_VALUE.YEAR_SCALE_RATE)) {
      const setZero = this.scTop - window.innerHeight * SIZE_VALUE.YEAR_SCALE_RATE
      const rateHeight = window.innerHeight * SIZE_VALUE.YEAR_RATE

      left = setZero * (CHANGE_VALUE.YEAR_LEFT_POSITION / rateHeight)
      top = DEFAULT_VALUE.YEAR_TOP_POSITION - (setZero * (DEFAULT_VALUE.YEAR_TOP_POSITION / rateHeight))

      $slogan.classList.add('ready')
      $slogan.classList.remove('on')

      $year
        .style
        .transform = `matrix(1, 0, 0, 1, ${left}, ${top}) scale(${CHANGE_VALUE.YEAR_SCALE_RATE})`
    } else {
      $slogan.classList.add('on')

      $year
        .style
        .transform = `matrix(1, 0, 0, 1, ${CHANGE_VALUE.YEAR_LEFT_POSITION}, ${CHANGE_VALUE.YEAR_TOP_POSITION}) scale(${CHANGE_VALUE.YEAR_SCALE_RATE})`
    }
  }
  championAnimation() {
    const $text = document.querySelector('#champion-text')
    const $start = document.querySelector('#start')
    const setZero = this.scTop - window.innerHeight * (SIZE_VALUE.VIDEO_RATE - 1)

    if (this.scTop >= $start.querySelector('.sticky').offsetTop) {
      $start.querySelector('.sticky').classList.add('on')
    } else {
      $start.querySelector('.sticky').classList.remove('on')
    }

    const $season = $start.querySelector('.season')

    if ($text.offsetTop / 2 <= setZero + 161) { // 텍스트 배경에 고정
      if (this.scTop >= $start.querySelector('.sticky').offsetTop) { // 텍스트 변경될 위치에 도달
        $text.classList.add('position')

        if (this.scTop >= ($season.offsetTop - window.innerHeight)) { // 텍스트 변경된 위치에 고정
          $text.style.transform = `matrix(1, 0, 0, 1, 230, 2113)`
        } else { // 텍스트 변경된 위치에 맞춰서 이동
          $text.style.transform = `matrix(1, 0, 0, 1, 230, ${161 + setZero - ($text.offsetTop / 2)})`
        }
        // matrix(1, 0, 0, 1, 230, 2113)
      } else { // 텍스트 배경따라 이동
        $text.classList.add('fix')
        $text.classList.remove('position')

        if (this.scTop >= $start.offsetTop) {
          $text.style.transform = `matrix(1, 0, 0, 1, 169, ${(setZero - ($text.offsetTop / 2)) - 21 + 161})`
        } else {
          $text.style.transform = `matrix(1, 0, 0, 1, 169, ${(setZero - ($text.offsetTop / 2)) - 21 + 161})`
        }
      }
    } else { // 텍스트 원래 위치 도달
      if (this.scTop <= ($start.offsetTop - window.innerHeight)) {
        $text.classList.remove('fix')
        $text.classList.remove('position')
      }

      $text.style.transform = ``
    }


    if ($text.offsetTop / 2 <= setZero) {
      // if ($start.offsetTop <= this.scTop) {
      //   $text.classList.remove('fix')
      //   $text.classList.add('position')
      // } else {
      //   $text.classList.add('fix')
      //   $text.classList.remove('position')
      //
      //   $text.style.transform = `matrix(1, 0, 0, 1, 169, ${setZero - ($text.offsetTop / 2)})`
      // }
    } else if ($text.offsetTop / 2 > setZero) {
      // $text.classList.remove('fix')
      // $text.classList.remove('position')
      //
      // $text.style.transform = ``
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

const scroll = new Scroll($main)

scroll._init()

let resizeTimeOut = null

window.addEventListener('resize' , function () {
  if (resizeTimeOut !== null) clearTimeout(resizeTimeOut)

  document.querySelector('#loading').classList.remove('on')

  resizeTimeOut = setTimeout(() => {
    window.scrollTo({ top: 0 })
    scroll._init()
  }, 500)
})

const io = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('on')
    } else {
      entry.target.classList.remove('on')
    }
  })
}, {
  threshold: 0.8,
})
const videoIo = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.play()
    }
  })
}, {
  threshold: 0.5,
})

io.observe($('#start .slogan'))

document.querySelectorAll('video').forEach((dom) => {
  videoIo.observe(dom)
})
