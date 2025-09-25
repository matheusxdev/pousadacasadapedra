// Sistema de Analytics básico para Casa da Pedra
// Pode ser facilmente substituído por Google Analytics, Mixpanel, etc.

interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

class Analytics {
  private events: AnalyticsEvent[] = []

  // Registrar evento
  track(event: AnalyticsEvent) {
    this.events.push(event)
    
    console.log('📊 Analytics Event:', event)
    
    // Aqui você pode integrar com Google Analytics, Mixpanel, etc.
    // Exemplo para Google Analytics:
    // if (typeof gtag !== 'undefined') {
    //   gtag('event', event.action, {
    //     event_category: event.category,
    //     event_label: event.label,
    //     value: event.value
    //   })
    // }
  }

  // Eventos específicos do site
  pageView(page: string) {
    this.track({
      action: 'page_view',
      category: 'Navigation',
      label: page
    })
  }

  tourViewed(_tourId: string, tourTitle: string) {
    this.track({
      action: 'view_tour',
      category: 'Tours',
      label: tourTitle,
      value: 1
    })
  }

  dateSelected(date: string, _tourId: string) {
    this.track({
      action: 'select_date',
      category: 'Booking',
      label: date
    })
  }

  peopleSelected(adults: number, children: number, _tourId: string) {
    this.track({
      action: 'select_people',
      category: 'Booking',
      label: `${adults}A ${children}C`,
      value: adults + children
    })
  }

  reservationStarted(tourId: string, totalPrice: number) {
    this.track({
      action: 'start_reservation',
      category: 'Booking',
      label: tourId,
      value: totalPrice
    })
  }

  reservationCompleted(reservationCode: string, totalPrice: number) {
    this.track({
      action: 'complete_reservation',
      category: 'Booking',
      label: reservationCode,
      value: totalPrice
    })
  }

  errorOccurred(error: string, context: string) {
    this.track({
      action: 'error',
      category: 'Error',
      label: `${context}: ${error}`
    })
  }

  // Obter todos os eventos (para debug)
  getEvents() {
    return this.events
  }

  // Limpar eventos
  clearEvents() {
    this.events = []
  }
}

// Instância global
export const analytics = new Analytics()

// Funções de conveniência
export const trackPageView = (page: string) => analytics.pageView(page)
export const trackTourView = (tourId: string, tourTitle: string) => analytics.tourViewed(tourId, tourTitle)
export const trackDateSelection = (date: string, tourId: string) => analytics.dateSelected(date, tourId)
export const trackPeopleSelection = (adults: number, children: number, tourId: string) => analytics.peopleSelected(adults, children, tourId)
export const trackReservationStart = (tourId: string, totalPrice: number) => analytics.reservationStarted(tourId, totalPrice)
export const trackReservationComplete = (code: string, totalPrice: number) => analytics.reservationCompleted(code, totalPrice)
export const trackError = (error: string, context: string) => analytics.errorOccurred(error, context)
