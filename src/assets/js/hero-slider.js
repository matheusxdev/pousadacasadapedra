/**
 * Hero Slider - Autoplay com legendas sincronizadas
 * Efeito "parece vídeo" com Ken Burns e crossfade
 */

class HeroSlider {
  constructor(container) {
    this.container = container
    this.slides = container.querySelectorAll('.hero-slider__slide')
    this.captions = container.querySelectorAll('.hero-slider__caption')
    this.controls = container.querySelectorAll('.hero-slider__control')
    this.bullets = container.querySelectorAll('.hero-slider__bullet')
    
    this.currentSlide = 0
    this.totalSlides = this.slides.length
    this.autoplayInterval = null
    this.autoplayDelay = 6000 // 6 segundos
    
    this.init()
  }
  
  init() {
    if (this.totalSlides === 0) return
    
    this.setupEventListeners()
    this.startAutoplay()
    this.showSlide(0)
    
    // Pausar autoplay se usuário prefere movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.stopAutoplay()
    }
  }
  
  setupEventListeners() {
    // Controles de navegação
    this.controls.forEach((control, index) => {
      control.addEventListener('click', () => {
        this.stopAutoplay()
        if (index === 0) {
          this.previousSlide()
        } else {
          this.nextSlide()
        }
        this.startAutoplay()
      })
    })
    
    // Bullets/pagers
    this.bullets.forEach((bullet, index) => {
      bullet.addEventListener('click', () => {
        this.stopAutoplay()
        this.showSlide(index)
        this.startAutoplay()
      })
    })
    
    // Pausar autoplay no hover
    this.container.addEventListener('mouseenter', () => {
      this.stopAutoplay()
    })
    
    this.container.addEventListener('mouseleave', () => {
      this.startAutoplay()
    })
    
    // Pausar autoplay quando página não está visível
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoplay()
      } else {
        this.startAutoplay()
      }
    })
    
    // Teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousSlide()
      } else if (e.key === 'ArrowRight') {
        this.nextSlide()
      }
    })
  }
  
  showSlide(index) {
    // Remover classes ativas
    this.slides.forEach(slide => {
      slide.classList.remove('hero-slider__slide--active')
    })
    
    this.captions.forEach(caption => {
      caption.classList.remove('hero-slider__caption--active')
    })
    
    this.bullets.forEach(bullet => {
      bullet.classList.remove('hero-slider__bullet--active')
    })
    
    // Ativar slide atual
    this.slides[index].classList.add('hero-slider__slide--active')
    this.captions[index].classList.add('hero-slider__caption--active')
    this.bullets[index].classList.add('hero-slider__bullet--active')
    
    this.currentSlide = index
    
    // Atualizar aria-live para acessibilidade
    const activeCaption = this.captions[index]
    if (activeCaption) {
      activeCaption.setAttribute('aria-live', 'polite')
    }
  }
  
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides
    this.showSlide(nextIndex)
  }
  
  previousSlide() {
    const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1
    this.showSlide(prevIndex)
  }
  
  startAutoplay() {
    this.stopAutoplay()
    this.autoplayInterval = setInterval(() => {
      this.nextSlide()
    }, this.autoplayDelay)
  }
  
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval)
      this.autoplayInterval = null
    }
  }
  
  destroy() {
    this.stopAutoplay()
    // Remover event listeners se necessário
  }
}

// Inicializar slider quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const heroSlider = document.querySelector('.hero-slider')
  if (heroSlider) {
    new HeroSlider(heroSlider)
  }
})

// Exportar para uso em módulos
export default HeroSlider
