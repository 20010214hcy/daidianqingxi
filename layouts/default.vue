<template>
  <div class="min-h-screen flex flex-col">
    <!-- Skip-link: 键盘导航跳转 -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
    >
      跳转到主内容
    </a>
    <Header />
    <main id="main-content" role="main" aria-label="主内容" class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>
