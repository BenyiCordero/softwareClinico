import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const source = async (file) => readFile(new URL(`../src/${file}`, import.meta.url), 'utf8')

test('dashboard remains protected and has a not-found fallback', async () => {
  const routes = await source('routes/AppRoutes.tsx')
  assert.match(routes, /ProtectedRoute><DashboardLayout \/><\/ProtectedRoute>/)
  assert.match(routes, /path: '\*', element: <NotFoundPage \/>/)
})

test('canonical dashboard modules remain registered', async () => {
  const routes = await source('routes/dashboard.routes.tsx')
  for (const path of ['appointments', 'patients', 'consultations', 'prescriptions', 'billing', 'activity', 'settings']) {
    assert.match(routes, new RegExp(`path: '${path}'`), `Missing dashboard route: ${path}`)
  }
})

test('legacy Spanish URLs keep their redirects', async () => {
  const routes = await source('routes/dashboard.routes.tsx')
  for (const alias of ['citas', 'pacientes', 'recetas', 'facturacion', 'actividad', 'configuracion']) {
    assert.match(routes, new RegExp(`from: '${alias}'`), `Missing legacy alias: ${alias}`)
  }
})

test('active pages do not depend on the placeholder component', async () => {
  const files = [
    'pages/DashboardPage.tsx',
    'pages/activity/ActivityPage.tsx',
    'pages/billing/BillingPage.tsx',
    'pages/settings/SettingsPage.tsx',
  ]
  for (const file of files) assert.doesNotMatch(await source(file), /PagePlaceholder/)
})

test('shared filter and searchable select primitives expose the common contract', async () => {
  const filter = await source('components/ui/FilterBar.tsx')
  const searchable = await source('components/ui/SearchableSelect.tsx')
  assert.match(filter, /role="search"/)
  assert.match(searchable, /role="combobox"/)
  assert.match(searchable, /aria-controls/)
  assert.match(searchable, /role="listbox"/)
})

test('modal primitives expose dialog accessibility and focus handling', async () => {
  const modal = await source('components/ui/Modal.tsx')
  assert.match(modal, /role="dialog"/)
  assert.match(modal, /aria-modal="true"/)
  assert.match(modal, /aria-labelledby/)
  assert.match(modal, /event\.key !== 'Tab'/)
  assert.match(modal, /event\.key === 'Escape'/)
  assert.match(modal, /previousFocus\.current\?\.focus/)
})

test('domain routes use permission guards', async () => {
  const routes = await source('routes/dashboard.routes.tsx')
  assert.match(routes, /const guarded = \(permission/)
  assert.match(routes, /guarded\('appointments\.read'/)
  assert.match(routes, /guarded\('patients\.read'/)
  assert.match(routes, /guarded\('consultations\.read'/)
  assert.match(routes, /guarded\(\['orders\.read', 'payments\.read'\]/)
  assert.match(routes, /guarded\('consultations\.create', <NewVisitPage \/>\)/)
  assert.match(routes, /guarded\('consultations\.read', <VisitHistoryPage \/>\)/)
  assert.match(routes, /path: 'settings', element: <SettingsPage \/>/)
})

test('permission loading is fail-closed and detail mutations require write access', async () => {
  const provider = await source('app/providers/BranchProvider.tsx')
  const guard = await source('routes/PermissionGuard.tsx')
  const consultation = await source('pages/clinical/ConsultationDetailPage.tsx')
  const order = await source('pages/billing/OrderDetailPage.tsx')
  const prescription = await source('pages/prescriptions/PrescriptionItemsPage.tsx')
  assert.match(provider, /if \(permissionsQuery\.isPending\) return false/)
  assert.match(guard, /permissionsLoading/)
  assert.match(consultation, /permission="consultations\.update"/)
  assert.match(order, /useCan\('orders\.update'\)/)
  assert.match(order, /useCan\('payments\.create'\)/)
  assert.match(prescription, /useCan\('prescriptions\.update'\)/)
})

test('production configuration keeps the API URL environment-driven', async () => {
  const env = await source('config/env.ts')
  const client = await source('infrastructure/http/api-client.ts')
  const example = await readFile(new URL('../.env.example', import.meta.url), 'utf8')
  assert.match(env, /VITE_API_URL/)
  assert.match(env, /\/api\/v1/)
  assert.match(client, /baseURL: appEnv\.apiUrl/)
  assert.match(example, /^VITE_API_URL=/m)
})

test('shared shell and action primitives remain available', async () => {
  const sidebar = await source('components/Sidebar.tsx')
  const topBar = await source('components/TopBar.tsx')
  const actions = await source('components/ui/RowActionsMenu.tsx')
  assert.match(sidebar, /aria-expanded/)
  assert.match(sidebar, /aria-controls/)
  assert.match(topBar, /aria-label/)
  assert.match(actions, /DropdownMenu/)
})

test('sidebar groups related domains and omits contextual or duplicate entries', async () => {
  const sidebar = await source('config/sidebar.ts')
  const shell = await source('components/Sidebar.tsx')
  for (const group of ['home', 'clinical-care', 'staff-services', 'organization', 'billing-pricing', 'administration', 'audit']) {
    assert.match(sidebar, new RegExp(`group\\('${group}'`), `Missing sidebar group: ${group}`)
  }
  assert.doesNotMatch(sidebar, /id: 'doctors'/)
  assert.doesNotMatch(sidebar, /id: 'visits'/)
  assert.doesNotMatch(sidebar, /Laboratorio|Farmacia|pharmacy|lab-studies/)
  assert.doesNotMatch(sidebar, /patients:\/id/)
  assert.match(sidebar, /export const sidebarConfig: SidebarGroup\[\] = \[\s+group\('home'/)
  assert.match(shell, /renderItem\(child, depth \+ 1\)/)
  assert.match(shell, /aria-label="Navegación principal"/)
})

test('every canonical module is represented inside the grouped sidebar', async () => {
  const sidebar = await source('config/sidebar.ts')
  const groupedModules = [
    'appointments', 'schedules', 'availability', 'records', 'patients',
    'consultations', 'prescriptions', 'billing', 'activity', 'settings', 'branches',
    'people', 'areas', 'consulting-rooms', 'positions', 'specialties',
    'patient-categories', 'payment-methods', 'employees', 'health-professionals',
    'services', 'service-categories', 'price-lists', 'special-prices',
  ]
  for (const modulePath of groupedModules) {
    assert.match(sidebar, new RegExp(`path: '/dashboard/${modulePath.replace('/', '\\/')}'`), `Un grouped module: ${modulePath}`)
  }
  assert.match(sidebar, /sidebarConfig: SidebarGroup\[\]/)
  assert.match(sidebar, /interface SidebarGroup extends Omit<SidebarItem, 'path'/)
})

test('package scripts expose the release validation commands', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  assert.equal(packageJson.scripts.test, 'node --test scripts/*.test.mjs')
  assert.match(packageJson.scripts.build, /tsc -b/)
  assert.equal(packageJson.scripts.lint, 'eslint .')
})
