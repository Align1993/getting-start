<template>
    <div>
      <main class="progress-page">
        <div class="carousel-wrap" id="carousel">
          <transition-group tag="ul" class="slide-ul" name="list">
            <li v-for="(list, index) in slideList" :key="index" v-show="index===currentIndex" @mouseenter="stop" @mouseleave="go">
              <a :href="list.clickUrl">
                <img :src="list.image" :alt="list.desc">
              </a>
            </li>
          </transition-group>
          <div class="carousel-items">
            <span v-for="(item, index) in slideList.length" :class="{'active': index === currentIndex}" @mouseover="change(index)"></span>
          </div>
        </div>
        <div class="border-wrap">{{ percent }}%
          <progress :value="percent" max="100"></progress>
        </div>
      </main>
    </div>
</template>

<script>
    const ipcR = require('electron').ipcRenderer
    export default {
      name: 'check-update',
      data () {
        return {
          percent: 0,
          slideList: [
            {clickUrl: '#', desc: 'title', image: 'http://dummyimage.com/1745x492/f1d65b'},
            {clickUrl: '#', desc: 'title', image: 'http://dummyimage.com/1745x492/40b7ea'},
            {clickUrl: '#', desc: 'title', image: 'http://dummyimage.com/1745x492/e3c933'}
          ],
          currentIndex: 0,
          timer: ''
        }
      },
      mounted () {
        var _this = this
        ipcR.send('checkVersion')
        ipcR.on('message', function (event, state, text) {
          console.log(state)
          console.log(text)
          if (state === 3) {
            _this.percent = text
          }
        })
      },
      create () {
        this.$nextTick(() => {
          this.timer = setInterval(() => {
            this.autoPlay()
          }, 4000)
        })
      },
      methods: {
        go () {
          this.timer = setInterval(() => {
            this.autoPlay()
          }, 4000)
        },
        stop () {
          clearInterval(this.timer)
          this.timer = null
        },
        change (index) {
          this.currentIndex = index
        },
        autoPlay () {
          this.currentIndex++
          if (this.currentIndex > this.slideList.length - 1) {
            this.currentIndex = 0
          }
        }
      }
    }
</script>

<style scoped lang="less">
  .progress-page {
    width: 600px;
    height: 460px;
    background-color: #ccc;
    .carousel-wrap {
      position: relative;
      height: 440px;
      width: 100%;
      overflow: hidden;
      background: #fff;
      .list-enter-to {
        transition: all 1s ease;
        transform: translateX(0);
      }
      .list-leave-active {
        transition: all 1s ease;
        transform: translateX(-100%)
      }

      .list-enter {
        transform: translateX(100%)
      }

      .list-leave {
        transform: translateX(0)
      }
      .slide-ul {
        width: 100%;
        height: 100%;
        li {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .carousel-items {
        position: absolute;
        z-index: 10;
        bottom: 30px;
        width: 100%;
        margin: 0 auto;
        text-align: center;
        font-size: 0;
        span {
          display: inline-block;
          height: 6px;
          width: 30px;
          background-color: #b2b2b2;
          cursor: pointer;
        }
        .active {
          background-color: orange
        }
      }
    }
    .border-wrap {
      // border: 1px solid #465f88;
      text-align: center;
      line-height: 18px;
      progress {
        width: 100%;
        background: #fff
      }
      progress::-webkit-progress-bar { 
        background: #fff;
      }  
      progress::-webkit-progress-value {
        background: #465f88;
      }
      progress::-webkit-progress-inner-element { 
        border-radius: 6px;
      }
      progress::-webkit-progress-value {
        border-radius: 6px;
      }
      progress::-webkit-progress-bar {
        border-radius: 6px;
      }
    } 
  }
  
</style>

