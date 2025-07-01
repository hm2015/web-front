<script setup>
import { ref } from 'vue'
// import { gsap } from 'gsap'

// 用于动态计算遮罩位置
const overlayImageElement = ref(null)
// const unigearLogoElement = ref(null)
// const unigearOverlay = ref(null)

// 鼠标移动事件处理
const handleMouseMove = (event) => {
  const rect = overlayImageElement.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 根据屏幕尺寸调整遮罩大小
  const screenWidth = window.innerWidth
  let maskSize = 600
  let maskOffset = 600

  if (screenWidth <= 480) {
    maskSize = 300
    maskOffset = 300
  } else if (screenWidth <= 640) {
    maskSize = 400
    maskOffset = 400
  } else if (screenWidth <= 768) {
    maskSize = 500
    maskOffset = 500
  }

  // 更新遮罩位置
  overlayImageElement.value.style.setProperty('--mask-x', `${x - maskOffset / 2}px`)
  overlayImageElement.value.style.setProperty('--mask-y', `${y - maskOffset / 2}px`)
  overlayImageElement.value.style.setProperty('--mask-size', `${maskSize}px`)
}
const handleMouseLeave = () => {
  // 鼠标移出容器时清除圆形效果
  overlayImageElement.value.style.setProperty('--mask-x', `-9999px`)
  overlayImageElement.value.style.setProperty('--mask-y', `-9999px`)
}

// UNIGEAR Logo 鼠标事件处理
/* const handleUnigearMouseMove = (event) => {
  const rect = unigearLogoElement.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 使用 GSAP 平滑更新遮罩位置，添加轻微的缩放效果
  gsap.to(unigearOverlay.value, {
    '--mask-x': `${x - 120}px`,
    '--mask-y': `${y - 120}px`,
    duration: 0.2,
    ease: 'power2.out',
  })
} */

/* const handleUnigearMouseEnter = () => {
  // 鼠标进入时显示遮罩效果，并添加轻微的缩放动画
  gsap
    .timeline()
    .to(unigearOverlay.value, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    })
    .to(
      unigearLogoElement.value,
      {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      },
      0,
    )
} */

/* const handleUnigearMouseLeave = () => {
  // 鼠标移出时隐藏遮罩效果并恢复缩放
  gsap
    .timeline()
    .to(unigearOverlay.value, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    })
    .to(
      unigearLogoElement.value,
      {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          // 动画完成后重置遮罩位置
          gsap.set(unigearOverlay.value, {
            '--mask-x': '-9999px',
            '--mask-y': '-9999px',
          })
        },
      },
      0,
    )
} */
</script>
<template>
  <footer class="bg-[#1e1e1e] text-white pt-15 mt-auto relative">
    <!-- 顶部分割线 -->
    <div
      class="absolute top-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-5rem)] h-px bg-white/30"
    ></div>

    <div class="mx-auto px-10">
      <div class="grid grid-cols-6 mb-12">
        <!-- Gears 产品系列 -->
        <div class="text-white">
          <h4
            class="text-base font-semibold mb-2 text-white tracking-wide border-b border-gray-300/30 pb-0 inline-block"
          >
            Gears
          </h4>
          <ul class="list-none p-0 m-0">
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Cosmolodge 2-person Tent</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Cosmolodge 4-person Tent</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Nomad Outdoor chair</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >FireWhip Fire Pit</a
              >
            </li>
          </ul>
        </div>

        <!-- Follow Us 社交媒体 -->
        <div class="text-white">
          <h4
            class="text-base font-semibold mb-2 text-white tracking-wide border-b border-gray-300/30 pb-0 inline-block"
          >
            Follow Us
          </h4>
          <ul class="list-none p-0 m-0">
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Facebook</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Instagram</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Tiktok</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Spotify</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Youtube</a
              >
            </li>
          </ul>
        </div>

        <!-- CLIENT SERVICES 客户服务 -->
        <div class="text-white">
          <h4
            class="text-base font-semibold mb-2 text-white tracking-wide border-b border-gray-300/30 pb-0 inline-block"
          >
            Client Services
          </h4>
          <ul class="list-none p-0 m-0">
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >FAQ</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Customer Service</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Track Order</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Exchanges and returns</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Payment</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Terms Of Service</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Contact Us</a
              >
            </li>
          </ul>
        </div>

        <!-- Business Center 商务中心 -->
        <div class="text-white">
          <h4
            class="text-base font-semibold mb-2 text-white tracking-wide border-b border-gray-300/30 pb-0 inline-block"
          >
            Business Center
          </h4>
          <ul class="list-none p-0 m-0">
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Stockists</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Become A Dealer</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Group Sale Program</a
              >
            </li>
            <li class="mb-0">
              <a
                href="#"
                class="text-gray-300 no-underline text-base font-light leading-6 transition-colors duration-200 hover:text-white"
                >Wholesale</a
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- UNIGEAR Logo -->
      <!-- <div class="py-0">
        <div class="text-center">
          <div
            class="relative flex justify-center items-center w-full max-w-full cursor-pointer overflow-hidden group transition-all duration-300 ease-out hover:shadow-lg"
            @mousemove="handleUnigearMouseMove"
            @mouseenter="handleUnigearMouseEnter"
            @mouseleave="handleUnigearMouseLeave"
            ref="unigearLogoElement"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1920 380.23"
              class="w-full opacity-30 relative z-10"
            >
              <path
                fill="#1e1e1e"
                d="M0,0v380.23h1920V0H0ZM229.86,234.78c0,49.6-24.09,69.03-89.95,69.03h-4.81c-59.17,0-87.38-19.43-87.38-67.84v-115.11h48.41v111.77c0,41.53,16.73,51.7,51.49,51.7h1.78c42.37,0,55.55-16.83,55.55-54.32v-109.16h24.9v113.92ZM533.37,300.72h-22.95s-133.73-121.5-133.73-121.5v121.5h-24.9V120.86h23.12l133.56,118.61v-118.61h24.9v179.86ZM716.33,300.72h-46.76V120.86h46.76v179.86ZM1036.17,292.42c-19.55,5.93-53.63,11.39-80.73,11.39-75.45,0-117.56-30.22-117.56-88.57v-3.85c0-60.18,42.91-95.51,119.24-95.51,24.97,0,57.57,8.79,73.27,18.84v26.18c-15.23-14.84-48.18-29.6-75.51-29.6-35.24,0-64.74,23.29-64.74,76.49,0,45.77,14.75,79.88,69.22,79.88,8.18,0,21.03-.65,30.44-2.32v-66.34h46.37v73.4ZM1305.91,138.42h-99.43v60.27h82.39v17.56h-82.39v66.92h99.43v17.56h-145.26V120.86h145.26v17.56ZM1553.46,300.73l-64.76-143.83-68.62,143.83h-26.77s86.6-179.86,86.6-179.86h38.71l83.32,179.86h-48.48ZM1822.39,300.72l-45.24-85.21c25.14-4.94,36.37-17.35,36.37-41.02,0-25.5-17.95-36.08-44.98-36.08h-23.83v162.3h-45.49s0-179.86,0-179.86h74.85c53.46,0,84.75,14.48,84.75,48.64,0,23.58-11.78,37.29-33.91,46.23l47.37,85h-49.89Z"
              />
            </svg>
            <div
              ref="unigearOverlay"
              class="absolute inset-0 w-full h-full pointer-events-none opacity-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1920 380.23"
                class="w-full h-full"
                style="
                  mask-image: radial-gradient(
                    circle 120px,
                    rgba(0, 0, 0, 1) 0%,
                    rgba(0, 0, 0, 0.8) 30%,
                    rgba(0, 0, 0, 0.4) 60%,
                    rgba(0, 0, 0, 0.1) 80%,
                    rgba(0, 0, 0, 0) 100%
                  );
                  mask-repeat: no-repeat;
                  mask-position: var(--mask-x, -9999px) var(--mask-y, -9999px);
                  mask-size: 240px 240px;
                  -webkit-mask-image: radial-gradient(
                    circle 120px,
                    rgba(0, 0, 0, 1) 0%,
                    rgba(0, 0, 0, 0.9) 15%,
                    rgba(0, 0, 0, 0.7) 35%,
                    rgba(0, 0, 0, 0.4) 60%,
                    rgba(0, 0, 0, 0.1) 80%,
                    rgba(0, 0, 0, 0) 100%
                  );
                  -webkit-mask-repeat: no-repeat;
                  -webkit-mask-position: var(--mask-x, -9999px) var(--mask-y, -9999px);
                  -webkit-mask-size: 240px 240px;
                "
              >
                <path
                  fill="#ffffff"
                  d="M0,0v380.23h1920V0H0ZM229.86,234.78c0,49.6-24.09,69.03-89.95,69.03h-4.81c-59.17,0-87.38-19.43-87.38-67.84v-115.11h48.41v111.77c0,41.53,16.73,51.7,51.49,51.7h1.78c42.37,0,55.55-16.83,55.55-54.32v-109.16h24.9v113.92ZM533.37,300.72h-22.95s-133.73-121.5-133.73-121.5v121.5h-24.9V120.86h23.12l133.56,118.61v-118.61h24.9v179.86ZM716.33,300.72h-46.76V120.86h46.76v179.86ZM1036.17,292.42c-19.55,5.93-53.63,11.39-80.73,11.39-75.45,0-117.56-30.22-117.56-88.57v-3.85c0-60.18,42.91-95.51,119.24-95.51,24.97,0,57.57,8.79,73.27,18.84v26.18c-15.23-14.84-48.18-29.6-75.51-29.6-35.24,0-64.74,23.29-64.74,76.49,0,45.77,14.75,79.88,69.22,79.88,8.18,0,21.03-.65,30.44-2.32v-66.34h46.37v73.4ZM1305.91,138.42h-99.43v60.27h82.39v17.56h-82.39v66.92h99.43v17.56h-145.26V120.86h145.26v17.56ZM1553.46,300.73l-64.76-143.83-68.62,143.83h-26.77s86.6-179.86,86.6-179.86h38.71l83.32,179.86h-48.48ZM1822.39,300.72l-45.24-85.21c25.14-4.94,36.37-17.35,36.37-41.02,0-25.5-17.95-36.08-44.98-36.08h-23.83v162.3h-45.49s0-179.86,0-179.86h74.85c53.46,0,84.75,14.48,84.75,48.64,0,23.58-11.78,37.29-33.91,46.23l47.37,85h-49.89Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Logo Section -->
      <div
        class="relative flex items-center mb-10 cursor-pointer overflow-hidden h-[249px] md:h-[200px] sm:h-[150px] xs:h-[120px] group w-full max-w-full"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
        ref="overlayImageElement"
      >
        <!-- 底图 -->
        <img
          src="/images/footer/dusk-logo.png"
          alt="Base Image"
          class="absolute inset-0 w-full h-full object-contain md:object-cover opacity-90"
        />
        <!-- 遮罩图 -->
        <div
          class="absolute inset-0 w-full h-full pointer-events-none bg-[url('/images/footer/d-logo.png')] bg-no-repeat bg-center"
          :class="['bg-contain md:bg-cover']"
          style="
            mask-image: radial-gradient(
              circle calc(var(--mask-size, 600px) / 2),
              rgba(0, 0, 0, 1) 0%,
              rgba(0, 0, 0, 0.8) 40%,
              rgba(0, 0, 0, 0.4) 70%,
              rgba(0, 0, 0, 0.1) 90%,
              rgba(0, 0, 0, 0) 100%
            );
            mask-repeat: no-repeat;
            mask-position: var(--mask-x, -9999px) var(--mask-y, -9999px);
            mask-size: var(--mask-size, 600px) var(--mask-size, 600px);
            -webkit-mask-image: radial-gradient(
              circle calc(var(--mask-size, 1200px) / 2),
              rgba(0, 0, 0, 1) 0%,
              rgba(0, 0, 0, 0.9) 15%,
              rgba(0, 0, 0, 0.7) 35%,
              rgba(0, 0, 0, 0.4) 60%,
              rgba(0, 0, 0, 0.1) 80%,
              rgba(0, 0, 0, 0) 100%
            );
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: var(--mask-x, -9999px) var(--mask-y, -9999px);
            -webkit-mask-size: var(--mask-size, 1200px) var(--mask-size, 1200px);
          "
        ></div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 968px) {
  .mx-auto {
    padding: 0 20px;
  }

  .grid-cols-6 {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
    margin-bottom: 60px;
  }
}

@media (max-width: 640px) {
  footer {
    padding: 60px 0 0 !important;
  }

  .grid-cols-6 {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-bottom: 40px;
  }

  .py-0 {
    padding: 40px 0 60px;
  }
  .w-full:last-child {
    height: 40px;
  }

  /* Logo Section 移动端优化 */
  .relative.flex.items-center {
    height: 100px !important;
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  /* 超小屏幕额外优化 */
  .relative.flex.items-center {
    height: 80px !important;
    margin-bottom: 1.5rem;
  }

  .mx-auto {
    padding: 0 15px;
  }
}
</style>
