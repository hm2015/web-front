<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import SplitText from 'gsap/SplitText'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(SplitText, ScrollTrigger)
// 开屏动画控制
const isLoading = ref(true)
const splashBackground = ref(null)
const splashLogoContainer = ref(null)
const splashLogo = ref(null)
const splashFigure = ref(null)

// 第二屏元素引用
// 图片总数
const TOTAL_FRAMES = 101
// 图片路径模板
const IMAGE_PATH = '/images/home/chair/{frame}.webp'
// canvas 和 Section 的引用
const secondSectionRef = ref(null)
const sequenceCanvasRef = ref(null)
const productCardRef = ref(null)
const rightTitleRef = ref(null)
// 存储预加载的图片
const images = ref([])
let context = null
let currentFrame = 0
//第二屏动画
// 格式化帧编号（补零）
const formatFrame = (index) => String(index).padStart(4, '0')

// 预加载图片
const preloadImages = () => {
  const isMobile = window.innerWidth <= 768
  const loadStep = isMobile ? 2 : 1 // 移动端每隔一帧加载以提升性能

  for (let i = 1; i <= TOTAL_FRAMES; i += loadStep) {
    const img = new Image()
    img.src = IMAGE_PATH.replace('{frame}', formatFrame(i))

    // 移动端设置更低的图片质量
    if (isMobile) {
      img.loading = 'lazy'
    }

    images.value.push(img)
  }

  // 如果是移动端且跳过了一些帧，填充缺失的帧
  if (isMobile && loadStep > 1) {
    for (let i = 2; i <= TOTAL_FRAMES; i += loadStep) {
      if (i <= TOTAL_FRAMES) {
        // 使用前一帧作为占位
        images.value.splice(i - 1, 0, images.value[Math.floor((i - 1) / loadStep)])
      }
    }
  }
}

// 更新 canvas 显示的图片
const updateImage = (frameIndex) => {
  if (!context || !images.value[frameIndex] || !sequenceCanvasRef.value) return
  const img = images.value[frameIndex]
  if (img.complete) {
    const canvas = sequenceCanvasRef.value
    const rect = canvas.getBoundingClientRect()
    const isMobile = window.innerWidth <= 768

    // 清除画布
    context.clearRect(0, 0, canvas.width, canvas.height)

    // 计算图片在canvas中的绘制尺寸（保持宽高比并覆盖整个canvas）
    const canvasWidth = rect.width
    const canvasHeight = rect.height
    const imgAspect = img.naturalWidth / img.naturalHeight
    const canvasAspect = canvasWidth / canvasHeight

    let drawWidth, drawHeight, drawX, drawY

    if (imgAspect > canvasAspect) {
      // 图片更宽，以高度为准，确保覆盖整个canvas
      drawHeight = canvasHeight
      drawWidth = drawHeight * imgAspect
      drawX = (canvasWidth - drawWidth) / 2
      drawY = 0
    } else {
      // 图片更高，以宽度为准，确保覆盖整个canvas
      drawWidth = canvasWidth
      drawHeight = drawWidth / imgAspect
      drawX = 0
      drawY = (canvasHeight - drawHeight) / 2
    }

    // 移动端使用requestAnimationFrame优化绘制性能
    if (isMobile) {
      requestAnimationFrame(() => {
        context.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      })
    } else {
      context.drawImage(img, drawX, drawY, drawWidth, drawHeight)
    }
  }
}

// 初始化 GSAP 和 ScrollTrigger
const initChairSequenceScrollTrigger = () => {}

// 控制第三屏帐篷产品图片显示的响应式数据
const showProduct2P = ref(false)
const showProduct4P = ref(false)

// 控制第三屏产品图层级的方法
const handleProduct2PHover = (isHovering) => {
  showProduct2P.value = isHovering

  // 动态调整产品图层级
  const leftProduct = document.querySelector('.tent-product-left')
  const rightProduct = document.querySelector('.tent-product-right')

  if (isHovering) {
    // 2P悬停时：2P产品图提升到最高层级
    leftProduct?.style.setProperty('z-index', '50')
    rightProduct?.style.setProperty('z-index', '30')
  } else {
    // 恢复默认层级
    leftProduct?.style.setProperty('z-index', '30')
    rightProduct?.style.setProperty('z-index', '30')
  }
}

const handleProduct4PHover = (isHovering) => {
  showProduct4P.value = isHovering

  // 动态调整产品图层级
  const leftProduct = document.querySelector('.tent-product-left')
  const rightProduct = document.querySelector('.tent-product-right')

  if (isHovering) {
    // 4P悬停时：4P产品图提升到最高层级
    rightProduct?.style.setProperty('z-index', '50')
    leftProduct?.style.setProperty('z-index', '30')
  } else {
    // 恢复默认层级
    leftProduct?.style.setProperty('z-index', '30')
    rightProduct?.style.setProperty('z-index', '30')
  }
}

// 按钮hover处理函数 - 保持滑出图显示
const handleButtonHover = (isHovering, productType) => {
  if (productType === '2P') {
    // 如果鼠标离开按钮，开始延迟隐藏
    if (!isHovering) {
      showProduct2P.value = false
    }
  } else if (productType === '4P') {
    // 如果鼠标离开按钮，开始延迟隐藏
    if (!isHovering) {
      showProduct4P.value = false
    }
  }
}

// 控制第四屏杂志区块拖动的响应式数据
const journalDragOffset = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startOffset = ref(0)

// 控制第六屏 New Product 区块的响应式数据
const newProductSectionRef = ref(null)
const newProductContentsSectionRef = ref(null)
const subscriberEmail = ref('')

// 防抖函数
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 响应式处理拖动范围
const updateDragLimits = () => {
  const viewportWidth = window.innerWidth
  let cardWidth = 500
  let rightTextWidth = 64
  let leftTextWidth = 288
  let cardSpacing = 5

  if (viewportWidth <= 480) {
    cardWidth = 350
    rightTextWidth = 36
    leftTextWidth = 200
    cardSpacing = 3
  } else if (viewportWidth <= 768) {
    cardWidth = 400
    rightTextWidth = 40
    leftTextWidth = 240
    cardSpacing = 4
  } else if (viewportWidth <= 968) {
    cardWidth = 450
    rightTextWidth = 48
    leftTextWidth = 240
    cardSpacing = 4
  } else if (viewportWidth <= 1200) {
    cardWidth = 480
    rightTextWidth = 56
    leftTextWidth = 260
  }

  const totalContentWidth = cardWidth * 3 + cardSpacing * 3 + rightTextWidth
  const availableWidth = viewportWidth - leftTextWidth
  const maxOffset = 0
  const minOffset = Math.min(0, availableWidth - totalContentWidth)

  // 限制当前偏移量在新的范围内
  journalDragOffset.value = Math.max(minOffset, Math.min(maxOffset, journalDragOffset.value))
}

// 响应式处理canvas尺寸
const resizeCanvas = () => {
  if (sequenceCanvasRef.value && secondSectionRef.value) {
    const rect = secondSectionRef.value.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const isMobile = window.innerWidth <= 768

    // 设置canvas的显示尺寸
    sequenceCanvasRef.value.style.width = '100%'
    sequenceCanvasRef.value.style.height = '100%'

    // 移动端降低分辨率以提升性能
    const pixelRatio = isMobile ? Math.min(dpr, 2) : dpr

    // 设置canvas的实际分辨率（考虑设备像素比和性能优化）
    sequenceCanvasRef.value.width = rect.width * pixelRatio
    sequenceCanvasRef.value.height = rect.height * pixelRatio

    // 重置并缩放绘图上下文
    if (context) {
      context.setTransform(1, 0, 0, 1, 0, 0) // 重置变换矩阵
      context.scale(pixelRatio, pixelRatio)

      // 移动端启用图像平滑以改善视觉效果
      if (isMobile) {
        context.imageSmoothingEnabled = true
        context.imageSmoothingQuality = 'high'
      }
    }

    // 重新绘制当前帧
    updateImage(currentFrame)
  }
}

// 移动端性能优化检测
const optimizeForMobile = () => {
  const isMobile = window.innerWidth <= 768
  const isLowEndDevice = navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4

  if (isMobile || isLowEndDevice) {
    // 降低帧率
    if (context) {
      context.imageSmoothingEnabled = false // 关闭图像平滑以提升性能
    }

    // 使用更小的canvas分辨率
    if (sequenceCanvasRef.value) {
      const rect = sequenceCanvasRef.value.getBoundingClientRect()
      sequenceCanvasRef.value.width = rect.width * 0.75
      sequenceCanvasRef.value.height = rect.height * 0.75
    }
  }
}

// 生命周期钩子
onMounted(() => {
  // 启动开屏动画
  startSplashAnimation()

  initSecondSectionAnimations()

  // 应用移动端性能优化
  optimizeForMobile()

  initAboutSectionAnimation()

  // 设置初始视差位置
  initParallaxInitialPositions()
  initParallaxScrollAnimation()

  // 添加窗口大小变化监听器（使用防抖优化性能）
  const debouncedResize = debounce(resizeCanvas, 100)
  const debouncedDragLimits = debounce(updateDragLimits, 100)

  window.addEventListener('resize', debouncedResize)
  window.addEventListener('resize', debouncedDragLimits)

  // 清理观察器
  onUnmounted(() => {
    // 清理ScrollTrigger
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    // 移除窗口大小变化监听器
    window.removeEventListener('resize', debouncedResize)
    window.removeEventListener('resize', debouncedDragLimits)
  })
})

// 开屏动画函数
const startSplashAnimation = () => {
  const tl = gsap.timeline()

  // 设置初始状态
  gsap.set('.hero-content', { opacity: 1 })
  gsap.set('.header-nav', { opacity: 0 })
  gsap.set(splashBackground.value, {
    opacity: 1,
  })
  gsap.set(splashLogoContainer.value, { y: 0, opacity: 1 })
  gsap.set([splashLogo.value, splashFigure.value], { y: 0, opacity: 1 })
  // 设置SVG path的初始颜色
  gsap.set(splashLogo.value?.querySelectorAll('path, rect, polygon') || [], { fill: '#fe4814' })
  gsap.set(splashFigure.value?.querySelectorAll('path') || [], { fill: '#fe4814' })

  // 初始化SplitText
  const heroTitle = new SplitText('.hero-title span', { type: 'chars' })
  const heroDesc = new SplitText('.hero-content p', { type: 'chars' })

  // 设置文字初始状态为不可见
  gsap.set([heroTitle.chars, heroDesc.chars], { opacity: 0, x: 100 })

  // 计算精确的移动距离
  // 屏幕中心Y坐标：window.innerHeight / 2
  // 需要向上移动的距离：(屏幕高度 / 2)
  const moveDistance = -(window.innerHeight / 2 + 1) // 第一阶段：白色背景从上到下逐渐褪去，同时logo组合移动到导航栏位置
  const delayTime = 0.8 // 延迟时间，单位为秒
  tl.to(splashBackground.value, {
    opacity: 0,
    duration: 4,
    ease: 'power2.out',
    delay: delayTime,
  })
    .to(
      splashLogoContainer.value,
      {
        y: moveDistance, // 整个logo组合移动到导航栏位置
        duration: 2.5,
        ease: 'power2.out',
      },
      delayTime,
    ) // 与背景淡出同时

    // SVG颜色渐变：从红色变为原始颜色
    .to(
      splashLogo.value?.querySelectorAll('path, rect, polygon') || [],
      {
        fill: '#efeee8',
        duration: 2.5,
        ease: 'power2.out',
      },
      delayTime, // 与背景淡出同时
    )
    .to(
      splashFigure.value?.querySelectorAll('path') || [],
      {
        fill: '#efeee8',
        duration: 2.5,
        ease: 'power2.out',
      },
      delayTime, // 与背景淡出同时
    )

    // 第二阶段：figure-logo继续向上移动并淡出
    .to(
      splashFigure.value,
      {
        y: -200, // 相对于logo组合继续向上移动100px
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      delayTime + 2.4, // 在logo组合移动结束后开始（延迟 + 2.5秒移动 - 0.1秒提前）
    )

    // 第三阶段：导航栏淡入
    .to(
      '.header-nav',
      {
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
      },
      delayTime + 2.5, // 导航栏在logo组合移动结束后淡入（延迟 + 2.5秒移动）
    )

    // 第四阶段：英雄标题逐字符淡入
    .to(
      heroTitle.chars,
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power2.out',
      },
      delayTime + 3.5, // 英雄标题在导航栏淡入后开始（延迟 + 3.5秒）
    )

    // 第五阶段：英雄描述文字逐字符淡入
    .to(
      heroDesc.chars,
      {
        opacity: 1,
        x: 0,
        duration: 0.2,
        stagger: 0.02,
        ease: 'power2.out',
      },
      delayTime + 5.0, // 英雄描述文字在标题后开始（延迟 + 5.0秒）
    )

    // 最后隐藏启动屏
    .call(
      () => {
        isLoading.value = false
      },
      null,
      delayTime + 3.3, // 在适当时机隐藏启动屏（延迟 + 3.3秒）
    )
}

// 第二屏ScrollTrigger动画初始化
const initSecondSectionAnimations = () => {
  preloadImages()
  // 确保图片加载后再初始化 ScrollTrigger
  images.value[0].onload = () => {
    initChairSequenceScrollTrigger()
    updateImage(0) // 显示第一帧
  }

  // 设置初始状态
  gsap.set(rightTitleRef.value, { opacity: 0, x: 100 })
  gsap.set(productCardRef.value, { opacity: 0, x: -100 })

  // 右侧标题文字进场动画 - 第二屏top到达视口80%时触发
  gsap.to(rightTitleRef.value, {
    opacity: 1,
    x: 0,
    duration: 1.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: rightTitleRef.value,
      start: 'top 80%',
      end: '+=100',
      scrub: 1,
      toggleActions: 'play pause resume reset',
    },
  })

  // 左侧产品信息卡片进场动画 - 第二屏top到达视口60%时触发
  ScrollTrigger.create({
    trigger: productCardRef.value,
    start: 'top 70%',
    end: '+=100',
    toggleActions: 'play pause resume reset',
    scrub: 1,
    animation: gsap.to(productCardRef.value, {
      opacity: 1,
      x: 0,
      duration: 1.5,
      ease: 'power2.out',
    }),
  })

  // 视频滚动播放进度控制
  // 设置 canvas 尺寸和上下文
  context = sequenceCanvasRef.value.getContext('2d')
  resizeCanvas() // 初始化canvas尺寸

  const isMobile = window.innerWidth <= 768

  ScrollTrigger.create({
    trigger: secondSectionRef.value,
    start: 'top top',
    end: isMobile ? '+=1500' : '+=2500', // 移动端缩短滚动距离
    scrub: isMobile ? 0.5 : true, // 移动端使用较慢的scrub
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true, // 窗口大小变化时重新计算
    onUpdate: (self) => {
      const progress = self.progress
      const frameIndex = Math.round(progress * (TOTAL_FRAMES - 1))
      if (frameIndex !== currentFrame) {
        currentFrame = frameIndex
        updateImage(currentFrame)
      }
    },
  })
}

// 杂志区块拖动方法
const startDrag = (event) => {
  isDragging.value = true
  const clientX = event.clientX || (event.touches && event.touches[0].clientX)
  startX.value = clientX
  startOffset.value = journalDragOffset.value
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)
}

const onDrag = (event) => {
  if (!isDragging.value) return
  event.preventDefault()
  const clientX = event.clientX || (event.touches && event.touches[0].clientX)
  const deltaX = clientX - startX.value
  const newOffset = startOffset.value + deltaX

  // 计算拖动范围限制 - 考虑响应式设计
  const viewportWidth = window.innerWidth
  let cardWidth = 500 // w-125 对应 500px
  let rightTextWidth = 64 // w-16 对应 64px
  let leftTextWidth = 288 // w-72 对应 288px
  let cardSpacing = 5 // mr-1.25 对应 5px

  // 响应式尺寸调整
  if (viewportWidth <= 768) {
    // 移动端不进行拖动
    return
  } else if (viewportWidth <= 968) {
    cardWidth = 450
    rightTextWidth = 48
    leftTextWidth = 240
    cardSpacing = 4
  } else if (viewportWidth <= 1200) {
    cardWidth = 480
    rightTextWidth = 56
    leftTextWidth = 260
  }

  const totalContentWidth = cardWidth * 3 + cardSpacing * 3 + rightTextWidth // 3张卡片 + 间距 + 右侧文字块总宽度
  const availableWidth = viewportWidth - leftTextWidth // 可用拖动区域宽度

  // 最大向右拖动：第一张卡片左侧贴合左侧文字块右侧（初始位置）
  const maxOffset = 0

  // 最大向左拖动：右侧文字块右侧贴合屏幕右侧
  // 即内容总宽度减去可用宽度
  const minOffset = Math.min(0, availableWidth - totalContentWidth)

  journalDragOffset.value = Math.max(minOffset, Math.min(maxOffset, newOffset))
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}
// 控制第五屏 About Us 区块动画的响应式数据
const aboutSectionRef = ref(null)
// About Us 区块ScrollTrigger动画初始化
const initAboutSectionAnimation = () => {
  const aboutButtonSelector = document.querySelector('.about-text-container button')
  const aboutTitleSelector = document.querySelector('.about-title')
  const aboutDescSelector = document.querySelector('.about-description')
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: aboutSectionRef.value,
      start: 'top 60%',
      end: '+=300',
      scrub: 1,
      toggleActions: 'play none none reset',
    },
  })
  // 初始化SplitText
  const aboutTitle = new SplitText(aboutTitleSelector, { type: 'words' })
  const aboutDesc = new SplitText(aboutDescSelector, { type: 'chars' })
  // 设置文字初始状态为不可见
  gsap.set([aboutTitle.words, aboutDesc.chars], { opacity: 0 })
  gsap.set(aboutTitle.words, { x: 300 })
  gsap.set(aboutDesc.chars, { x: 600 })
  // 设置按钮初始状态为不可见
  gsap.set(aboutButtonSelector, { opacity: 0, y: 50 })
  tl.to(aboutTitle.words, {
    opacity: 1,
    duration: 1.5,
    x: 0,
    stagger: 0.06,
    ease: 'power2.out',
  })
    .to(aboutDesc.chars, {
      opacity: 1,
      x: 0,
      duration: 1.2,
      stagger: 0.04,
      ease: 'power2.out',
    })
    .to(
      aboutButtonSelector,
      {
        opacity: 1,
        duration: 0.5,
        y: 0,
        ease: 'power2.out',
      },
      '-=0.8',
    ) // 在描述文字动画结束后0.5秒开始按钮动画
}

// 视差滚动动画初始化
const initParallaxScrollAnimation = () => {
  // 控制第六屏的慢速移动
  ScrollTrigger.create({
    trigger: newProductSectionRef.value,
    start: 'top 70%',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress * 0.7 // 调整滚动速度为0.2倍
      const easedProgress = gsap.parseEase('power1.out')(progress)
      // 第六屏滚动速度为0.4倍，确保它始终落后于第五屏
      if (newProductSectionRef.value) {
        gsap.set(newProductSectionRef.value, {
          y: easedProgress * 500, // 缓慢向上移动
        })
      }
    },
  })
  gsap.set(newProductContentsSectionRef.value, { y: 200 }) // 确保初始位置正确
  gsap.to(newProductContentsSectionRef.value, {
    scrollTrigger: {
      trigger: newProductContentsSectionRef.value,
      start: 'top bottom',
      onUpdate: (self) => {
        const progress = self.progress
        const easedProgress = gsap.parseEase('linear')(progress)
        if (newProductContentsSectionRef.value) {
          gsap.set(newProductContentsSectionRef.value, {
            y: -easedProgress * 300, // 缓慢向上移动
          })
        }
      },
    },
  })
}

// 初始化视差位置
const initParallaxInitialPositions = () => {
  // 确保第六屏在正确的初始位置
  if (newProductSectionRef.value) {
    gsap.set(newProductSectionRef.value, {
      y: 0, // 重置为CSS中定义的初始位置
    })
  }

  // 确保Footer在正确的初始位置
  const footer = document.querySelector('footer')
  if (footer) {
    gsap.set(footer, {
      y: 0, // 重置为CSS中定义的初始位置
    })
  }
}

// 处理订阅表单提交
const handleSubscribe = () => {
  if (subscriberEmail.value) {
    // 这里可以添加发送邮箱到后端的逻辑
    alert(`感谢订阅！我们会将最新产品信息发送到 ${subscriberEmail.value}`)
    subscriberEmail.value = ''
  }
}
</script>

<template>
  <div class="w-full parallax-container">
    <!-- 开屏动画 -->
    <div v-if="isLoading" class="fixed inset-0 z-[9999] flex items-center justify-center">
      <!-- 白色背景 -->
      <div ref="splashBackground" class="absolute inset-0 bg-white"></div>

      <!-- Logo组合 -->
      <div ref="splashLogoContainer" class="relative flex flex-col items-center z-10">
        <!-- figure-logo.svg -->
        <svg
          ref="splashFigure"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 626.54 133.71"
          class="h-19 w-auto -mb-2"
        >
          <path
            fill="#efeee8"
            d="M317.74.7c-.18-.05-.35-.1-.53-.14-.85-.2-2.51-.56-3.94-.56s-3.09.35-3.94.55c-.18.05-.35.1-.53.14C232.39,21.66,129.47,65.99,0,133.71c200.23-94.51,426.31-94.51,626.54,0C497.07,65.99,394.15,21.66,317.74.7Z"
          />
        </svg>
        <!-- logo.svg -->
        <svg
          ref="splashLogo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 239.3 24.65"
          class="h-5 w-auto"
        >
          <path
            fill="#efeee8"
            d="M20.62,14.97c0,4.92-1.73,7.12-7.29,7.12h-.23c-4.56,0-6.75-1.33-6.75-6.78V.65H0v15.1c0,6.35,3.7,8.9,11.46,8.9h.63c8.64,0,11.8-2.55,11.8-9.05V.65h-3.27v14.32Z"
          />
          <rect fill="#efeee8" x="81.56" y=".65" width="6.13" height="23.59" />
          <polygon
            fill="#efeee8"
            points="145.97 24.24 165.02 24.24 165.02 21.94 151.98 21.94 151.98 13.16 162.78 13.16 162.78 10.86 151.98 10.86 151.98 2.96 165.02 2.96 165.02 .65 145.97 .65 145.97 24.24"
          />
          <path
            fill="#efeee8"
            d="M123.56,22.23c-1.23.22-2.92.3-3.99.3-7.14,0-9.08-4.47-9.08-10.48,0-6.98,3.87-10.03,8.49-10.03,3.58,0,7.91,1.94,9.9,3.88v-3.43c-2.06-1.32-6.34-2.47-9.61-2.47-10.01,0-15.64,4.63-15.64,12.53v.51c0,7.65,5.52,11.62,15.42,11.62,3.55,0,8.02-.72,10.59-1.49v-9.63h-6.08v8.7Z"
          />
          <polygon
            fill="#efeee8"
            points="60.43 16.21 42.91 .65 39.88 .65 39.88 24.24 43.15 24.24 43.15 8.31 60.69 24.24 63.7 24.24 63.7 .65 60.43 .65 60.43 16.21"
          />
          <polygon
            fill="#efeee8"
            points="187.84 .65 176.48 24.24 179.99 24.24 188.99 5.38 197.49 24.24 203.84 24.24 192.92 .65 187.84 .65"
          />
          <path
            fill="#efeee8"
            d="M233.09,13.1c2.9-1.17,4.45-2.97,4.45-6.06,0-4.48-4.1-6.38-11.12-6.38h-9.82v23.59h5.97V2.96h3.13c3.54,0,5.9,1.39,5.9,4.73,0,3.1-1.47,4.73-4.77,5.38l5.93,11.18h6.54s-6.21-11.15-6.21-11.15Z"
          />
        </svg>
      </div>
    </div>

    <!-- 第一屏 - 英雄区块 -->
    <section class="relative h-screen flex items-center justify-start overflow-hidden">
      <!-- 背景视频 -->
      <div class="absolute inset-0 -z-20">
        <video autoplay muted loop class="w-full h-full object-cover">
          <source src="/videos/Video_hero_AFA_D.mp4" type="video/mp4" />
          您的浏览器不支持视频播放。
        </video>
        <div class="absolute inset-0 bg-black/30 -z-10"></div>
      </div>

      <!-- 英雄内容 -->
      <div class="hero-content relative z-10 mx-0 px-19 w-full">
        <div class="max-w-3xl">
          <h1
            class="hero-title font-black leading-[0.85] mb-8 uppercase tracking-[-0.05em] mt-0 mx-0"
          >
            <span
              class="block text-[clamp(2.5rem,8vw,6rem)] text-orange-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              >PLAY</span
            >
            <span
              class="block text-[clamp(2.5rem,8vw,6rem)] text-orange-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              >OUTSIDE</span
            >
            <span
              class="block text-[clamp(2.5rem,8vw,6rem)] text-orange-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              >THE</span
            >
            <span
              class="block text-[clamp(2.5rem,8vw,6rem)] text-orange-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              >LINES</span
            >
          </h1>
          <p class="text-lg text-white mb-10 leading-6 drop-shadow-md max-w-lg m-0">
            The next generation gear feels simple and works like magic.
          </p>
        </div>
      </div>
    </section>

    <!-- 第二屏 - 产品展示区块 -->
    <section ref="secondSectionRef" class="relative h-screen flex items-center overflow-hidden">
      <!--序列动画 背景 -->
      <div class="absolute inset-0 -z-20">
        <canvas ref="sequenceCanvasRef" class="w-full h-full object-cover"></canvas>
      </div>

      <!-- 内容层 -->
      <div
        class="second-section-content relative z-10 mx-auto px-10 w-full h-screen grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-5 lg:gap-15 items-end lg:items-end box-border"
      >
        <!-- 左侧产品信息卡片 -->
        <div
          ref="productCardRef"
          class="bg-brand-orange px-5 py-6 rounded-none text-black max-w-md w-full lg:max-w-md h-auto lg:h-screen-45 max-h-[350px] min-h-[250px] lg:min-h-[300px] flex flex-col justify-between self-end mb-5 lg:mb-0 box-border"
        >
          <h2 class="text-3xl font-black leading-tight text-black uppercase tracking-tighter">
            NOMAD<br />OUTDOOR CHAIR
          </h2>
          <div class="w-full h-0.25 bg-black my-1"></div>
          <p class="text-sm leading-5 mb-3 text-black">
            This chair features revolutionary instant-fold technology for quick and easy setup,
            transforming from an ultra-compact size to full-size comfort. Designed to fit
            effortlessly into any backpack.
          </p>
          <div class="flex flex-row gap-5 items-center justify-between">
            <ul class="list-none p-0 m-0 flex-1">
              <li class="text-xs leading-5 text-black font-medium m-0 list-none">
                More Ultra-Compact, Easy Setup
              </li>
              <li class="text-xs leading-5 text-black font-medium m-0 list-none">
                Four Different High-back Support
              </li>
              <li class="text-xs leading-5 text-black font-medium m-0 list-none">
                Seat Width: 17 in. x 19 inch Size
              </li>
            </ul>
            <button
              class="relative overflow-hidden group transform-gpu bg-black text-white px-4 py-2.5 border-none rounded-none text-xs font-bold cursor-pointer transition-all duration-300 uppercase tracking-wide whitespace-nowrap min-w-20 h-fit self-center hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="探索产品详情"
            >
              <div class="relative z-10 transition-colors duration-500 group-hover:text-black">
                EXPLORE
              </div>
              <div
                class="absolute inset-0 transform origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-out group-hover:scale-y-100"
              ></div>
            </button>
          </div>
        </div>

        <!-- 右侧标题文字 -->
        <div
          class="flex justify-center lg:justify-end items-start h-auto lg:h-full pt-5 lg:pt-30 self-center lg:self-start"
        >
          <h3
            ref="rightTitleRef"
            class="text-overlay font-light leading-tight text-white text-center lg:text-right drop-shadow-lg m-0"
          >
            One-handed pickup<br />
            and two-step installation
          </h3>
        </div>
      </div>
    </section>

    <!-- 第三屏 - 帐篷产品展示区块 -->
    <section class="relative h-screen-90 flex overflow-hidden">
      <!-- 左右两个背景区块 -->
      <div class="absolute inset-0 w-full h-full grid grid-cols-2 z-10">
        <!-- 左侧背景 -->
        <div
          class="relative h-full cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:brightness-105"
          @mouseenter="handleProduct2PHover(true)"
          @mouseleave="handleProduct2PHover(false)"
        >
          <img
            src="/images/home/tent/back-left.png"
            alt="2P Tent background"
            class="w-full h-full object-cover"
          />
        </div>
        <!-- 右侧背景 -->
        <div
          class="relative h-full cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:brightness-105"
          @mouseenter="handleProduct4PHover(true)"
          @mouseleave="handleProduct4PHover(false)"
        >
          <img
            src="/images/home/tent/back-right.png"
            alt="4P Tent background"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- 产品图和滑出图层 -->
      <div class="absolute inset-0 w-full h-full z-20 pointer-events-none">
        <!-- 左产品图区块 -->
        <div
          class="tent-product-block tent-product-left absolute top-0 left-0 h-full flex items-center justify-center transition-all duration-300 ease-out z-30 backdrop-blur-[0.5px] will-change-transform"
          :class="{ hovering: showProduct2P }"
        >
          <img
            src="/images/home/tent/2p_1.png"
            alt="2P Tent"
            class="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out will-change-transform hover:scale-[1.02] hover:drop-shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
          />
        </div>
        <!-- 右产品图区块 -->
        <div
          class="tent-product-block tent-product-right absolute top-0 right-0 h-full flex items-center justify-center transition-all duration-300 ease-out z-30 backdrop-blur-[0.5px] will-change-transform"
          :class="{ hovering: showProduct4P }"
        >
          <img
            src="/images/home/tent/4p_1.png"
            alt="4P Tent"
            class="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out will-change-transform hover:scale-[1.02] hover:drop-shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
          />
        </div>

        <!-- 左滑出图 -->
        <div
          class="absolute top-0 h-full w-[96vw] -left-[96vw] opacity-0 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] pointer-events-none z-40 will-change-transform backdrop-blur-sm"
          :class="{ 'left-0 opacity-100': showProduct2P }"
        >
          <!-- 背景图片 -->
          <img
            src="/images/home/tent/2p_pop.png"
            alt="2P Tent Popup"
            class="w-full h-full object-cover drop-shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out brightness-110 contrast-105 saturate-110"
          />
        </div>
        <!-- 左滑出文字和按钮叠加层 -->
        <div
          class="absolute top-0 h-full w-[50vw] -left-[50vw] flex flex-col justify-center items-start mx-auto px-10 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] pointer-events-none z-60 will-change-transform"
          :class="{ 'left-0 opacity-100': showProduct2P }"
        >
          <!-- 产品描述 -->
          <p
            class="text-lg leading-relaxed mt-[-120px] mb-5 text-white/90 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] max-w-md pointer-events-none font-medium tracking-wide"
          >
            Ultra-lightweight 2-person tent designed for backpackers who demand space without the
            weight. Quick setup technology and superior weather protection make this your perfect
            outdoor companion.
          </p>

          <!-- 行动按钮 -->
          <button
            class="relative overflow-hidden group transform-gpu bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 border-none rounded-none text-sm font-medium cursor-pointer transition-all duration-300 ease-out uppercase tracking-wide hover:scale-105 hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 backdrop-blur-sm"
            @mouseenter="handleButtonHover(true, '2P')"
            @mouseleave="handleButtonHover(false, '2P')"
            aria-label="探索2P帐篷详情"
          >
            <div class="relative z-10 transition-colors duration-500 group-hover:text-white">
              EXPLORE
            </div>
            <div
              class="absolute inset-0 transform origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"
              style="background-color: #fe4814"
            ></div>
          </button>
        </div>

        <!-- 右滑出图 -->
        <div
          class="absolute top-0 h-full w-[96vw] -right-[96vw] opacity-0 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] pointer-events-none z-40 will-change-transform backdrop-blur-sm"
          :class="{ 'right-0 opacity-100': showProduct4P }"
        >
          <!-- 背景图片 -->
          <img
            src="/images/home/tent/4p_pop.png"
            alt="4P Tent Popup"
            class="w-full h-full object-cover drop-shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out brightness-110 contrast-105 saturate-110"
          />
        </div>
        <!-- 右滑出文字和按钮叠加层 -->
        <div
          class="absolute top-0 h-full w-[50vw] -right-[50vw] flex flex-col justify-center items-end mx-auto px-10 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] pointer-events-none z-60 will-change-transform"
          :class="{ 'right-0 opacity-100': showProduct4P }"
        >
          <!-- 产品描述 -->
          <p
            class="text-lg leading-relaxed mt-[-120px] mb-5 text-white/90 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] max-w-md ml-auto pointer-events-none font-medium tracking-wide text-right"
          >
            Spacious 4-person family tent engineered for comfort and durability. Premium materials
            and thoughtful design make camping effortless for the whole family.
          </p>

          <!-- 行动按钮 -->
          <button
            class="relative overflow-hidden group transform-gpu bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 border-none rounded-none text-sm font-medium cursor-pointer transition-all duration-300 ease-out uppercase tracking-wide hover:scale-105 hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 backdrop-blur-sm"
            @mouseenter="handleButtonHover(true, '4P')"
            @mouseleave="handleButtonHover(false, '4P')"
            aria-label="探索4P帐篷详情"
          >
            <div class="relative z-10 transition-colors duration-500 group-hover:text-white">
              EXPLORE
            </div>
            <div
              class="absolute inset-0 transform origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"
              style="background-color: #fe4814"
            ></div>
          </button>
        </div>
      </div>
    </section>

    <!-- 第四屏 - 杂志新闻区块 -->
    <section class="relative h-screen-80 bg-gray-100 overflow-hidden">
      <div class="relative w-full h-full">
        <!-- 左侧固定的文字块 -->
        <div
          class="absolute left-0 top-0 w-72 h-full bg-brand-orange text-black flex items-start justify-center pt-[10%] z-10"
        >
          <div class="flex flex-col items-center">
            <h2 class="text-4xl font-black uppercase tracking-tighter mb-5 m-0">JOURNAL</h2>
            <div class="w-full h-1 bg-black"></div>
          </div>
        </div>

        <!-- 可拖动的内容区域 -->
        <div
          class="absolute left-72 top-0 h-full bg-brand-orange cursor-grab transition-transform duration-200 ease-out select-none whitespace-nowrap"
          :style="{ transform: `translateX(${journalDragOffset}px)` }"
          @mousedown="startDrag"
          @touchstart="startDrag"
          :class="{
            'cursor-grabbing transition-none': isDragging,
            'transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]': !isDragging,
          }"
        >
          <!-- 新闻卡片1 -->
          <div
            class="inline-block align-top w-125 h-full bg-white bg-cover bg-center bg-no-repeat rounded-none overflow-hidden shadow-lg relative transition-all duration-300 hover:shadow-xl hover:scale-[1.02] mr-1.25"
            style="background-image: url('/images/home/journal/j1.png')"
          >
            <div
              class="absolute bottom-0 left-0 right-0 p-5 bg-gradient-journal text-white h-1/5 flex flex-col justify-start items-start"
            >
              <span
                class="text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 drop-shadow-md"
                >News</span
              >
              <h3
                class="text-lg font-bold leading-tight text-white m-0 drop-shadow-lg max-w-full break-words overflow-visible whitespace-normal"
              >
                Unicar at the 2025 ISPO Exhibition in Grammy
              </h3>
            </div>
          </div>

          <!-- 新闻卡片2 -->
          <div
            class="inline-block align-top w-125 h-full bg-white bg-cover bg-center bg-no-repeat rounded-none overflow-hidden shadow-lg relative transition-all duration-300 hover:shadow-xl hover:scale-[1.02] mr-1.25"
            style="background-image: url('/images/home/journal/j2.png')"
          >
            <div
              class="absolute bottom-0 left-0 right-0 p-5 bg-gradient-journal text-white h-1/5 flex flex-col justify-start items-start"
            >
              <span
                class="text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 drop-shadow-md"
                >New Drop</span
              >
              <h3
                class="text-lg font-bold leading-tight text-white m-0 drop-shadow-lg max-w-full break-words overflow-visible whitespace-normal"
              >
                From The Music to Branding with Tweety Sense Earphone
              </h3>
            </div>
          </div>

          <!-- 新闻卡片3 -->
          <div
            class="inline-block align-top w-125 h-full bg-white bg-cover bg-center bg-no-repeat rounded-none overflow-hidden shadow-lg relative transition-all duration-300 hover:shadow-xl hover:scale-[1.02] mr-1.25"
            style="background-image: url('/images/home/journal/J3.png')"
          >
            <div
              class="absolute bottom-0 left-0 right-0 p-5 bg-gradient-journal text-white h-1/5 flex flex-col justify-start items-start"
            >
              <span
                class="text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 drop-shadow-md"
                >News</span
              >
              <h3
                class="text-lg font-bold leading-tight text-white m-0 drop-shadow-lg max-w-full break-words overflow-visible whitespace-normal"
              >
                Smart Gear Unicar Launches App-Controlled System
              </h3>
            </div>
          </div>

          <!-- 右侧文字块 -->
          <div
            class="inline-block align-top w-16 h-full bg-brand-orange text-black text-center relative"
          >
            <div
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap"
            >
              <h2 class="text-sm font-black uppercase tracking-widest mb-0 m-0">右侧文字块</h2>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 第五屏 - About Us 区块（叠在第六屏上方，重叠40%） -->
    <section
      ref="aboutSectionRef"
      class="relative min-h-screen flex items-center justify-center overflow-hidden z-20"
    >
      <!-- 背景图 -->
      <div class="absolute inset-0 -z-20">
        <img
          src="/images/home/back/about_us.png"
          alt="About us background"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/40 -z-10"></div>
      </div>

      <!-- About Us 内容 -->
      <div class="relative z-10 max-w-6xl mx-auto px-10 text-center text-white">
        <div class="transition-all ease-smooth about-text-container">
          <h2
            class="text-section font-black text-white mb-20 uppercase tracking-tighter drop-shadow-lg m-0 inline-block relative about-title"
          >
            ABOUT US
          </h2>
          <div class="mb-20 transition-all ease-smooth">
            <p
              class="text-xl lg:text-2xl leading-tight text-white/95 m-0 max-w-6xl mx-auto drop-shadow-md about-description"
            >
              Everyone explores differently.<br />
              Uniquear designs for every path, every pace, and every purpose.<br />
              Whether you're chilling at the camp or chasing peaks — there's no wrong way to wander.
            </p>
          </div>
          <button
            class="relative overflow-hidden group transform-gpu bg-brand-orange text-white px-7 py-3 border-none rounded-none text-base font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wide shadow-lg shadow-brand-orange/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-orange/40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            aria-label="探索关于我们的更多内容"
          >
            <div class="relative z-10 transition-colors duration-500 about-explore-text">
              EXPLORE
            </div>
            <div
              class="absolute inset-0 transform origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-out group-hover:scale-y-100"
            ></div>
          </button>
        </div>
      </div>
    </section>

    <!-- 第六屏 - New Product 区块（初始位置：第五屏到达顶部时显示40%） -->
    <section
      ref="newProductSectionRef"
      class="relative h-[150vh] flex items-center justify-end overflow-hidden -mt-[45vh] z-10"
    >
      <!-- 背景图 -->
      <div class="absolute inset-0 -z-20">
        <img
          src="/images/home/back/new_product.png"
          alt="New product background"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/30 -z-10"></div>
      </div>
      <!-- New Product 内容 -->
      <div
        ref="newProductContentsSectionRef"
        class="relative z-10 max-w-lg w-full flex justify-center items-center"
      >
        <div
          class="bg-brand-orange px-8 py-8 rounded-none text-black max-w-sm w-full shadow-xl shadow-black/30"
        >
          <h2 class="text-2xl font-black leading-tight mb-3 text-black uppercase tracking-tighter">
            MORE GEARS<br />COMING SOON...
          </h2>
          <div class="w-full h-0.5 bg-black my-2.5"></div>
          <p class="text-sm leading-snug mb-4 text-black">
            Everyone explores differently.<br />
            Unique designs for every path, every pace,<br />
            and every purpose.<br />
            Whether you're chilling at the camp or chasing<br />
            peaks — there's no wrong way to wander.<br /><br />
            Be the first to know when new gear drops.
          </p>

          <form class="w-full" @submit.prevent="handleSubscribe">
            <div class="flex flex-row gap-0 border border-black rounded-none overflow-hidden">
              <input
                type="email"
                placeholder="Your Email Address"
                v-model="subscriberEmail"
                class="flex-1 px-3 py-3 border-none rounded-none text-sm bg-white text-black outline-none box-border placeholder:text-gray-600 focus:outline-none focus:shadow-none"
                required
              />
              <button
                type="submit"
                class="bg-black text-white px-2 py-1 border-none rounded-none text-xs font-bold cursor-pointer uppercase tracking-wide whitespace-nowrap subscribe-button hover:text-brand-orange transition-colors duration-300"
              >
                SUBSCRIBE
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero title 样式优化 */
.hero-title {
  font-weight: 900;
  line-height: 0.85;
  letter-spacing: -0.05em;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.hero-title span {
  display: block;
  color: #f97316; /* Orange-500 */
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* 悬停时产品图的视觉效果 */
.tent-product-block.hovering img {
  filter: drop-shadow(0 25px 60px rgba(0, 0, 0, 0.6)) brightness(1.1) contrast(1.05);
  transform: translateZ(0);
}

.tent-product-block.hovering {
  z-index: 50 !important;
}

/* 产品图过渡动画优化 */
.tent-product-block {
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  will-change: transform, filter;
}

.tent-product-block img {
  will-change: transform, filter;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* About Us 标题底线效果 */
.about-title::after {
  content: '';
  position: absolute;
  bottom: 1rem;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

/* About Us EXPLORE按钮文字颜色动画 */
.about-explore-text {
  color: white;
}

.group:hover .about-explore-text {
  color: #fe4814;
}

/* SUBSCRIBE按钮文字颜色动画 */
.subscribe-button:hover {
  color: #fe4814 !important;
}

/* 视差滚动效果样式 */
.parallax-container {
  overflow: hidden;
}

/* 杂志区块优化样式 */
.journal-container {
  position: relative;
  overflow: hidden;
}

.journal-draggable {
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  contain: layout style paint;
}

.journal-card {
  will-change: transform, box-shadow;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  contain: layout style paint;
}

.journal-card:hover {
  transform: scale(1.02) translateZ(0);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* 自定义间距类 */
.mr-1\.25 {
  margin-right: 5px;
}

/* 拖动状态优化 */
.cursor-grabbing {
  cursor: grabbing !important;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 响应式拖动区域 */
@media (max-width: 768px) {
  .journal-draggable {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    cursor: default !important;
  }

  .journal-card {
    margin-right: 10px;
  }
}

@media (max-width: 480px) {
  .journal-card {
    margin-right: 8px;
  }
}

/* 确保第六屏的初始位置和视差效果 */
section[ref='newProductSectionRef'] {
  will-change: transform;
}

/* Footer 视差效果 */
footer {
  will-change: transform;
  position: relative;
  z-index: 30;
}

/* 移动端视差效果调整 */
@media (max-width: 768px) {
  section[ref='newProductSectionRef'] {
    height: 130vh !important;
    margin-top: -30vh !important;
  }

  .parallax-container {
    overflow-x: auto;
  }
}

/* 响应式设计 */
@media (max-width: 968px) {
  /* 第二屏产品展示区块优化 */
  .second-section-content {
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
    align-items: center !important;
    justify-items: center !important;
    padding: 2rem 1rem !important;
  }

  :deep(.text-overlay) {
    font-size: 1.5rem;
    line-height: 1.3;
  }

  :deep(.text-4xl) {
    font-size: 2rem;
  }

  :deep(.w-72:first-child) {
    width: 240px;
  }

  :deep(.left-72) {
    left: 240px;
  }

  :deep(.w-50:last-child) {
    width: 48px;
  }

  :deep(.w-125:not(:first-child):not(:last-child)) {
    width: 450px;
    margin-right: 4px;
  }

  :deep(.text-lg) {
    font-size: 1.2rem;
  }

  :deep(.max-w-sm) {
    max-width: 450px;
    padding: 50px 40px;
  }

  :deep(.text-2xl) {
    font-size: 2.4rem;
  }

  :deep(.text-sm) {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  /* 第二屏移动端优化 */
  .second-section-content {
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
    align-items: center !important;
    justify-items: center !important;
    padding: 1rem !important;
    height: auto !important;
    min-height: 100vh !important;
  }

  /* Canvas移动端优化 */
  canvas {
    will-change: transform;
    transform: translateZ(0); /* 启用硬件加速 */
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    image-rendering: optimizeSpeed; /* 优化渲染速度 */
    image-rendering: -webkit-optimize-contrast;
  }

  :deep(.text-overlay) {
    font-size: 1.25rem;
    line-height: 1.2;
    text-align: center !important;
  }

  :deep(.relative.w-full.h-full) {
    flex-direction: column;
    height: auto;
  }

  :deep(.w-72:first-child) {
    position: relative;
    width: 100%;
    height: 200px;
    margin-bottom: 30px;
    padding-top: 8%;
    align-items: flex-start;
  }

  :deep(.left-72) {
    position: relative;
    left: 0;
    height: 400px;
    overflow-x: auto;
    overflow-y: hidden;
    cursor: default;
    transform: none !important;
    white-space: normal;
    -webkit-overflow-scrolling: touch;
  }

  :deep(.w-125:not(:first-child):not(:last-child)) {
    width: 400px;
    height: 400px;
    display: inline-block;
    margin-right: 10px;
  }

  :deep(.h-4\/5) {
    padding: 15px;
    height: 75%;
  }

  :deep(.w-50:last-child) {
    width: 40px;
    height: 400px;
    display: inline-block;
  }

  :deep(.text-4xl) {
    font-size: 1.5rem;
  }

  :deep(.text-lg) {
    font-size: 1rem;
    line-height: 1.15;
  }

  :deep(.h-4\/5) {
    padding: 12px;
    height: 70%;
  }

  :deep(.max-w-sm) {
    max-width: 100%;
    padding: 40px 30px;
    margin: 20px;
  }

  :deep(.text-2xl) {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  :deep(.text-sm) {
    font-size: 0.95rem;
    margin-bottom: 28px;
  }

  :deep(.flex.flex-row.gap-0) {
    flex-direction: row;
    gap: 0;
  }

  :deep(.px-3.py-3) {
    padding: 12px 14px;
    font-size: 0.9rem;
  }

  :deep(.px-2.py-1) {
    padding: 12px 18px;
    font-size: 0.9rem;
  }

  :deep(.grid-cols-2) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .tent-product-left {
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
  }

  .tent-product-right {
    top: 50%;
    right: 0;
    width: 100%;
    height: 50%;
  }

  .tent-product-img {
    max-width: 90%;
    max-height: 70%;
  }
}

@media (max-width: 480px) {
  /* 超小屏幕设备Canvas优化 */
  canvas {
    image-rendering: pixelated; /* 像素化渲染以提升性能 */
    transform: scale(1) translateZ(0);
  }

  /* 进一步降低第二屏的复杂度 */
  .second-section-content {
    padding: 0.5rem !important;
    gap: 0.5rem !important;
  }

  :deep(.w-72:first-child) {
    height: 150px;
    padding-top: 5%;
  }

  :deep(.left-72) {
    height: 350px;
  }

  :deep(.w-125:not(:first-child):not(:last-child)) {
    width: 350px;
    height: 350px;
  }

  :deep(.w-50:last-child) {
    width: 36px;
    height: 350px;
  }

  :deep(.text-4xl) {
    font-size: 1.2rem;
  }

  :deep(.text-lg) {
    font-size: 0.9rem;
    line-height: 1.1;
  }

  :deep(.h-4\/5) {
    padding: 10px;
    height: 65%;
  }

  :deep(.max-w-sm) {
    padding: 30px 20px;
    margin: 15px;
  }

  :deep(.text-2xl) {
    font-size: 1.6rem;
    margin-bottom: 16px;
  }

  :deep(.text-sm) {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }

  :deep(.px-3.py-3) {
    padding: 10px 12px;
    font-size: 0.85rem;
  }

  :deep(.px-2.py-1) {
    padding: 10px 16px;
    font-size: 0.85rem;
  }

  .tent-product-img {
    max-width: 95%;
    max-height: 65%;
  }
}
</style>
