<template>
  <header class="header-nav fixed top-0 left-0 right-0 z-1000 bg-[#000]/5 backdrop-blur-[6px]">
    <div class="mx-auto px-10 flex items-center justify-between h-16 relative">
      <!-- 左侧导航菜单 -->
      <nav class="flex gap-10 flex-1">
        <a
          href="#"
          class="!text-white/95 no-underline text-sm font-semibold tracking-wider py-2 relative transition-all duration-300 hover:!text-white nav-link uppercase"
          >GEARS</a
        >
        <a
          href="#"
          class="!text-white/95 no-underline text-sm font-semibold tracking-wider py-2 relative transition-all duration-300 hover:!text-white nav-link uppercase"
          >JOURNAL</a
        >
        <a
          href="#"
          class="!text-white/95 no-underline text-sm font-semibold tracking-wider py-2 relative transition-all duration-300 hover:!text-white nav-link uppercase"
          >SUPPORT</a
        >
      </nav>

      <!-- 中央 LOGO -->
      <div class="flex-1 flex justify-center">
        <a href="/" class="no-underline relative py-2 transition-all duration-200 logo">
          <img
            src="/images/hearder/logo.svg"
            alt="UNIGEAR"
            class="h-5 w-auto brightness-0 invert transition-all duration-200"
          />
          <!-- <img
            src="/images/hearder/logo.svg"
            alt="UNIGEAR"
            class="h-5 w-auto brightness-0 invert transition-all duration-200"
          /> -->
        </a>
      </div>

      <!-- 右侧功能图标 -->
      <div class="flex gap-4 flex-1 justify-end">
        <button
          class="bg-transparent border-none p-2 cursor-pointer rounded-md transition-colors duration-200 hover:bg-white/10 focus:outline-none focus:bg-white/15"
          aria-label="语言切换"
        >
          <img
            src="/images/hearder/globe.svg"
            alt="语言切换"
            class="w-5 h-5 brightness-0 invert transition-all duration-200 hover:brightness-0 hover:invert-88"
          />
        </button>
        <button
          class="bg-transparent border-none p-2 cursor-pointer rounded-md transition-colors duration-200 hover:bg-white/10 focus:outline-none focus:bg-white/15"
          aria-label="搜索"
        >
          <img
            src="/images/hearder/search.svg"
            alt="搜索"
            class="w-5 h-5 brightness-0 invert transition-all duration-200 hover:brightness-0 hover:invert-88"
          />
        </button>
        <button
          class="bg-transparent border-none p-2 cursor-pointer rounded-md transition-colors duration-200 hover:bg-white/10 focus:outline-none focus:bg-white/15"
          aria-label="用户账户"
        >
          <img
            src="/images/hearder/user.svg"
            alt="用户账户"
            class="w-5 h-5 brightness-0 invert transition-all duration-200 hover:brightness-0 hover:invert-88"
          />
        </button>
        <button
          class="bg-transparent border-none p-2 cursor-pointer rounded-md transition-colors duration-200 hover:bg-white/10 focus:outline-none focus:bg-white/15"
          aria-label="购物车"
        >
          <img
            src="/images/hearder/cart.svg"
            alt="购物车"
            class="w-5 h-5 brightness-0 invert transition-all duration-200 hover:brightness-0 hover:invert-88"
          />
        </button>
      </div>

      <!-- 底部分割线 -->
      <div class="absolute bottom-0 left-10 right-10 h-px bg-white/30"></div>
    </div>
  </header>
</template>

<style scoped>
/* 确保导航链接颜色不被全局样式覆盖 */
.nav-link {
  color: rgba(255, 255, 255, 0.95) !important;
}

.nav-link:hover {
  color: rgba(255, 255, 255, 1) !important;
}

/* 导航链接底线动画 */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.9);
  transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.nav-link:hover::after {
  width: 100%;
}

/* Logo 底线动画 */
/* .logo::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #ffffff;
  transition: all 0.3s ease;
  transform: translateX(-50%);
} */

/* .logo:hover::after {
  width: 100%;
} */

/* 响应式设计 */
@media (max-width: 768px) {
  .mx-auto {
    padding: 0 16px;
  }

  .flex.gap-10 {
    gap: 20px;
  }

  .text-sm {
    font-size: 13px;
  }

  .h-5 {
    height: 18px;
  }

  .flex.gap-4 {
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .flex.gap-10 {
    display: none;
  }

  .flex-1.flex.justify-center {
    flex: none;
    margin-right: auto;
  }

  .flex.gap-4.flex-1.justify-end {
    flex: none;
  }
}
</style>
