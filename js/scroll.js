'use strict';

const SIZE_VALUE = {
  YEAR_RATE: 3,
  YEAR_SCALE_RATE: 2,
  VIDEO_RATE: 9,
  STORY_RATE: 2,
  CONTINUE_RATE: 3,
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
    const $list = $('#story .list')

    document.querySelector('#video').style.height = `${SIZE_VALUE.VIDEO_RATE * 100}vh`
    $story.style.height = `${$list.offsetWidth - window.innerHeight}px`

    this.loadingCount(() => {
      document.body.classList.remove('hidden')

      setTimeout(() => {
        window.scrollTo({ top: 0 })
        document.querySelector('#loading').classList.add('on')
      }, 500)
    })

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

    if (this.scTop >= $start.offsetTop) {

    }

    const $season = $start.querySelector('.season')

    if ($text.offsetTop / 2 <= setZero + 161) { // 텍스트 배경에 고정
      if (this.scTop >= $start.querySelector('.sticky').offsetTop) { // 텍스트 변경될 위치에 도달
        if (this.scTop >= ($season.offsetTop - window.innerHeight)) { // 텍스트 변경된 위치에 고정
          $text.style.transform = `matrix(1, 0, 0, 1, 472, ${(window.innerHeight * 2.5) - 161 - 21 - 11}) scale(0.584)`
        } else { // 텍스트 변경된 위치에 맞춰서 이동
          $text.style.transform = `matrix(1, 0, 0, 1, 472, ${161 + setZero - ($text.offsetTop / 2)}) scale(0.584)`
        }
      } else { // 텍스트 배경따라 이동
        $text.classList.add('fix')

        if (this.scTop >= $start.offsetTop) {
          $text.style.transform = `matrix(1, 0, 0, 1, 169, ${(setZero - ($text.offsetTop / 2)) - 21 + 161})`
        } else {
          $text.style.transform = `matrix(1, 0, 0, 1, 169, ${(setZero - ($text.offsetTop / 2)) - 21 + 161})`
        }
      }
    } else { // 텍스트 원래 위치 도달
      if (this.scTop <= ($start.offsetTop - window.innerHeight)) {
        $text.classList.remove('fix')
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

      $continue.querySelectorAll(`.typo`).forEach((dom) => {
        dom.classList.remove('on')
      })
      $continue.querySelector(`.typo.item${targetNumber}`).classList.add('on')
    } else {
      $continue.querySelectorAll(`.typo`).forEach((dom) => {
        dom.classList.remove('on')
      })
    }
  }
  loadingCount(fn) {
    const $loading = document.querySelector('#loading')
    const counting = (count) => {
      if (count <= 100) {
        $loading.querySelector('h1').innerText = `${count}%`

        return setTimeout(() => {
          return counting(count + 1)
        }, 10)
      } else {
        fn()
      }
    }

    if (!$loading.classList.contains('on')) {
      counting(0)
    }
  }
}

const scroll = new Scroll($main)

scroll._init()

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

io.observe($('#start .slogan'))

//
// let mainScrollTop = 0
// let mainScrollCount = 0
//
// const $main = $('#app .main')
// const $videoSlogan = $('#video .slogan .year')
//
// function translate(list) {
//   const value = list
//     .map(function (value) {
//       return `${value}px`
//     })
//     .join(', ')
//
//   return `translate3d(${value}, 0)`
// }
//
// function valueChange(fn, prev, cur) {
//   if (prev !== cur) {
//     if (prev < 0) {
//       const changeValue = prev - 1
//
//       fn(changeValue)
//
//       return setTimeout(() => {
//         valueChange(fn, changeValue, cur)
//       }, 1)
//     } else {
//       const changeValue = prev + 1
//
//       fn(changeValue)
//
//       return setTimeout(() => {
//         valueChange(fn, prev + 1, cur)
//       }, 1)
//     }
//   }
//
//
//   // $videoSlogan
//   //   .style.transform = `${translate([mainScrollTop / 10, 270 + (mainScrollTop / 10)])} scale(2.5)`
// }
//
// function moveScroll(amount){
//   mainScrollTop -= amount
//
//   if(mainScrollTop < ($main.offsetHeight - (window.innerWidth/2)) * -1){
//     mainScrollTop = ($main.offsetHeight - (window.innerWidth/2)) * -1
//   } else if(mainScrollTop > 0) {
//     mainScrollTop = 0
//   }
//
//   $main.style.transform = `translateY(${mainScrollTop}px)`
// }
//
// function videoAnimation() {
//
// }
//
// $main.addEventListener('wheel', function (event) {
//   event.preventDefault()
//
//   mainScrollTop -= event.deltaY.toFixed(0)
//
//   if (event.deltaY < 0 && mainScrollTop >= 0) {
//     return setTimeout(()=>{
//       mainScrollTop = 0
//     },500)
//   }
//
//   videoAnimation()
//
//   // valueChange(function (value) {
//   //   $videoSlogan
//   //     .style.transform = `${translate([value, 270])} scale(2.5)`
//   // }, 100 * mainScrollCount, 100 * (mainScrollCount + 1))
//
//   // moveScroll(event.deltaY < 0 ? -50 : 50)
// })
//
// const io = new IntersectionObserver(function (entries) {
//   entries.forEach(function (entry) {
//     if (entry.isIntersecting) {
//       entry.target.classList.add('view')
//     }
//   })
// }, {
//   threshold: 1,
// })
//
// io.observe($('#content2.container .slogan'))
