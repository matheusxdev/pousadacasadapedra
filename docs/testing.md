# Guia de Testes - Casa da Pedra

## Visão Geral

O projeto Casa da Pedra implementa uma estratégia de testes abrangente usando:

- **Vitest** para testes unitários e de integração
- **Vue Test Utils** para testes de componentes Vue
- **Playwright** para testes end-to-end (E2E)
- **Nuxt Test Utils** para testes específicos do Nuxt

## Estrutura de Testes

```
tests/
├── setup.ts                 # Configuração global dos testes
├── composables/            # Testes de composables
│   ├── useAvailability.test.ts
│   └── usePricing.test.ts
├── components/              # Testes de componentes
│   ├── CalendarAvailability.test.ts
│   └── PriceSummary.test.ts
├── pages/                   # Testes de páginas
│   └── TourDetail.test.ts
├── stores/                  # Testes de stores Pinia
│   ├── auth.test.ts
│   └── cart.test.ts
└── e2e/                     # Testes end-to-end
    ├── home.spec.ts
    └── tour-detail.spec.ts
```

## Configuração

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        rootDir: '.',
        domEnvironment: 'happy-dom'
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.nuxt/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
        '**/mocks/**'
      ]
    },
    globals: true,
    setupFiles: ['./tests/setup.ts']
  }
})
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
```

## Scripts de Teste

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

## Tipos de Testes

### 1. Testes Unitários

#### Composables
```typescript
// tests/composables/useAvailability.test.ts
import { describe, it, expect, vi } from 'vitest'
import { useAvailability } from '~/composables/useAvailability'

describe('useAvailability', () => {
  it('should fetch tour month availability', async () => {
    const mockResponse = {
      data: ['2024-01-15', '2024-01-16', '2024-01-17']
    }
    
    vi.mocked($fetch).mockResolvedValue(mockResponse)
    
    const { getMonth } = useAvailability('tour', 'test-id')
    const result = await getMonth(new Date('2024-01-15'))
    
    expect($fetch).toHaveBeenCalledWith('/api/tours/test-id/availability', {
      query: { year: 2024, month: 1 }
    })
    
    expect(result).toEqual({
      year: 2024,
      month: 1,
      days: [
        { date: '2024-01-15', status: 'available' },
        { date: '2024-01-16', status: 'available' },
        { date: '2024-01-17', status: 'available' }
      ]
    })
  })
})
```

#### Stores Pinia
```typescript
// tests/stores/cart.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '~/stores/cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should add item to cart', () => {
    const store = useCartStore()
    const item = {
      id: 'tour-1',
      name: 'Tour Teste',
      type: 'tour' as const,
      price: 150.00,
      quantity: 1,
      date: '2024-01-15',
      participants: { adults: 2, children: 1 }
    }

    store.addItem(item)

    expect(store.items).toHaveLength(1)
    expect(store.items[0]).toEqual(item)
    expect(store.itemCount).toBe(1)
    expect(store.total).toBe(150.00)
  })
})
```

### 2. Testes de Componentes

```typescript
// tests/components/CalendarAvailability.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CalendarAvailability from '~/components/CalendarAvailability.vue'

describe('CalendarAvailability', () => {
  it('should render calendar for tour mode', () => {
    const wrapper = mount(CalendarAvailability, {
      props: {
        mode: 'tour',
        idOrUuid: 'test-id',
        selectedDate: new Date('2024-01-15')
      }
    })

    expect(wrapper.find('.calendar-availability').exists()).toBe(true)
    expect(wrapper.find('.calendar-availability__header').exists()).toBe(true)
    expect(wrapper.find('.calendar-availability__days').exists()).toBe(true)
  })

  it('should emit date-selected when day is clicked', async () => {
    const wrapper = mount(CalendarAvailability, {
      props: {
        mode: 'tour',
        idOrUuid: 'test-id'
      }
    })

    const dayButton = wrapper.find('.calendar-availability__day')
    await dayButton.trigger('click')

    expect(wrapper.emitted('date-selected')).toBeTruthy()
    expect(wrapper.emitted('date-selected')?.[0]).toEqual([expect.any(Date)])
  })
})
```

### 3. Testes de Páginas

```typescript
// tests/pages/TourDetail.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TourDetail from '~/pages/TourDetail.vue'

describe('TourDetail', () => {
  it('should render tour detail page', () => {
    const wrapper = mount(TourDetail, {
      props: {
        slug: 'test-tour'
      }
    })

    expect(wrapper.find('.tour-detail').exists()).toBe(true)
  })

  it('should handle date selection', async () => {
    const wrapper = mount(TourDetail, {
      props: {
        slug: 'test-tour'
      }
    })

    const mockTour = { id: 'test-id', name: 'Tour Teste' }
    wrapper.vm.tour = mockTour
    await wrapper.vm.$nextTick()

    const selectedDate = new Date('2024-01-15')
    wrapper.vm.handleDateSelected(selectedDate)

    expect(wrapper.vm.selectedDate).toEqual(selectedDate)
  })
})
```

### 4. Testes End-to-End

```typescript
// tests/e2e/tour-detail.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Tour Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tours/test-tour')
  })

  test('should load tour detail page', async ({ page }) => {
    await expect(page).toHaveTitle(/Tour Teste/)
    await expect(page.locator('.tour-detail')).toBeVisible()
  })

  test('should select date in calendar', async ({ page }) => {
    await page.waitForSelector('.calendar-availability__day')
    
    const availableDay = page.locator('.calendar-availability__day--available').first()
    await availableDay.click()
    
    await expect(availableDay).toHaveClass(/selected/)
  })

  test('should add to cart', async ({ page }) => {
    await page.waitForSelector('.calendar-availability__day')
    await page.click('.calendar-availability__day--available')
    await page.waitForSelector('.slot-picker')
    await page.click('.slot-picker__option')
    
    await page.click('[data-testid="add-to-cart"]')
    
    await expect(page.locator('.cart-notification')).toBeVisible()
  })
})
```

## Mocks e Stubs

### Mock de APIs
```typescript
// tests/setup.ts
import { beforeAll, afterAll } from 'vitest'

// Mock global para APIs
global.fetch = vi.fn()

// Mock para localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
})
```

### Mock de Composables
```typescript
// Mock dos composables
vi.mock('~/composables/useAvailability', () => ({
  useAvailability: () => ({
    loading: { value: false },
    error: { value: null },
    getMonth: vi.fn().mockResolvedValue({
      year: 2024,
      month: 1,
      days: [
        { date: '2024-01-15', status: 'available' },
        { date: '2024-01-16', status: 'available' }
      ]
    }),
    isDateAvailable: vi.fn().mockReturnValue(true),
    isPastDate: vi.fn().mockReturnValue(false)
  })
}))
```

## Cobertura de Testes

### Configuração de Cobertura
```typescript
// vitest.config.ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  exclude: [
    'node_modules/',
    'dist/',
    '.nuxt/',
    'coverage/',
    '**/*.d.ts',
    '**/*.config.*',
    '**/types/**',
    '**/mocks/**'
  ]
}
```

### Relatório de Cobertura
```bash
# Gerar relatório de cobertura
npm run test:coverage

# Visualizar relatório
open coverage/index.html
```

## Testes de Performance

### Lighthouse CI
```typescript
// tests/performance/lighthouse.test.ts
import { test, expect } from '@playwright/test'

test('should have good performance metrics', async ({ page }) => {
  await page.goto('/')
  
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        resolve(entries)
      }).observe({ entryTypes: ['navigation', 'paint'] })
    })
  })
  
  expect(metrics).toBeDefined()
})
```

## Testes de Acessibilidade

### Axe Tests
```typescript
// tests/accessibility/a11y.test.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/')
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
  
  expect(accessibilityScanResults.violations).toEqual([])
})
```

## CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
      
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## Boas Práticas

### 1. Nomenclatura
- Use nomes descritivos para testes
- Agrupe testes relacionados com `describe`
- Use `it` para casos de teste específicos

### 2. Estrutura AAA
- **Arrange**: Configure o estado inicial
- **Act**: Execute a ação sendo testada
- **Assert**: Verifique o resultado esperado

### 3. Mocks e Stubs
- Mock dependências externas
- Use stubs para componentes complexos
- Mantenha mocks simples e focados

### 4. Testes Isolados
- Cada teste deve ser independente
- Limpe estado entre testes
- Use `beforeEach` e `afterEach` quando necessário

### 5. Cobertura
- Mantenha cobertura acima de 80%
- Foque em código crítico
- Teste casos de erro e edge cases

## Debugging

### Vitest Debug
```bash
# Executar testes em modo debug
npm run test -- --inspect-brk

# Executar teste específico
npm run test -- useAvailability.test.ts
```

### Playwright Debug
```bash
# Executar E2E em modo debug
npm run test:e2e:debug

# Executar teste específico
npx playwright test tour-detail.spec.ts --debug
```

## Relatórios

### HTML Reports
```bash
# Relatório de testes unitários
npm run test:ui

# Relatório de E2E
npm run test:e2e:ui
```

### Coverage Reports
```bash
# Relatório de cobertura
npm run test:coverage
open coverage/index.html
```

## Troubleshooting

### Problemas Comuns

1. **Testes falhando no CI**: Verificar configuração de ambiente
2. **Mocks não funcionando**: Verificar ordem de imports
3. **E2E instável**: Adicionar waits e timeouts apropriados
4. **Cobertura baixa**: Revisar exclusões no config

### Soluções

1. **Timeout issues**: Aumentar timeout nos testes
2. **Race conditions**: Usar `waitFor` em E2E
3. **Memory leaks**: Limpar mocks e stubs
4. **Flaky tests**: Tornar testes mais determinísticos
