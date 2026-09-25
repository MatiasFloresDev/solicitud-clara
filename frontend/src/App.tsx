import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronRight, ClipboardList, FileText, Inbox, LayoutGrid, Plus, Search, Send, X } from 'lucide-react'
import './App.css'

type Status = 'RECIBIDA' | 'EN_ANALISIS' | 'LISTA_PARA_DESARROLLO'
type Role = 'analyst' | 'client'
type Page = 'inbox' | 'new' | 'detail' | 'guide'

interface ServiceRequest {
  id: number
  clientName: string
  company: string
  email: string
  serviceType: string
  title: string
  description: string
  status: Status
  requirements: string
  acceptanceCriteria: string
  createdAt: string
  updatedAt: string
}

type NewRequest = Pick<ServiceRequest, 'clientName' | 'company' | 'email' | 'serviceType' | 'title' | 'description'>

const API = import.meta.env.VITE_API_URL || ''
const statusLabel: Record<Status, string> = {
  RECIBIDA: 'Recibida',
  EN_ANALISIS: 'En análisis',
  LISTA_PARA_DESARROLLO: 'Lista para desarrollo',
}
const serviceTypes = ['Sitio web', 'Comercio digital', 'Sistema interno', 'Automatización', 'Otro']
const emptyForm: NewRequest = { clientName: '', company: '', email: '', serviceType: '', title: '', description: '' }

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message || body?.detail || `Error ${response.status}. Revisa los datos e inténtalo de nuevo.`)
  }
  return response.json()
}

function formattedDate(value: string) {
  return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

function StatusTag({ status }: { status: Status }) {
  return <span className={`status status--${status.toLowerCase()}`}><span className="status__dot" />{statusLabel[status]}</span>
}

function App() {
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ServiceRequest | null>(null)
  const [page, setPage] = useState<Page>('inbox')
  const [role, setRole] = useState<Role>('analyst')
  const [filter, setFilter] = useState<Status | 'ALL'>('ALL')
  const [query, setQuery] = useState('')
  const [form, setForm] = useState<NewRequest>(emptyForm)
  const [requirements, setRequirements] = useState('')
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    api<ServiceRequest[]>('/api/requests')
      .then((data) => { if (active) { setRequests(data); setLoading(false) } })
      .catch(() => { if (active) { setError('No se pudo conectar con la API. Inicia el backend en el puerto 8080 y recarga la página.'); setLoading(false) } })
    return () => { active = false }
  }, [])

  const visible = useMemo(() => requests.filter((item) => {
    const matchesRole = role === 'analyst' || item.clientName === 'Lucía Torres' || selected?.id === item.id
    const matchesStatus = filter === 'ALL' || item.status === filter
    const text = `${item.title} ${item.company} ${item.serviceType} ${item.clientName}`.toLowerCase()
    return matchesRole && matchesStatus && text.includes(query.toLowerCase())
  }), [requests, role, filter, query, selected])

  const counts = useMemo(() => ({
    received: requests.filter((item) => item.status === 'RECIBIDA').length,
    analysis: requests.filter((item) => item.status === 'EN_ANALISIS').length,
    ready: requests.filter((item) => item.status === 'LISTA_PARA_DESARROLLO').length,
  }), [requests])

  function openRequest(item: ServiceRequest) {
    setSelected(item)
    setRequirements(item.requirements)
    setAcceptanceCriteria(item.acceptanceCriteria)
    setPage('detail')
    setError('')
    setNotice('')
  }

  async function mutate(path: string, options: RequestInit, message: string) {
    if (!selected || busy) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const updated = await api<ServiceRequest>(path, options)
      setSelected(updated)
      setRequirements(updated.requirements)
      setAcceptanceCriteria(updated.acceptanceCriteria)
      setRequests((items) => [updated, ...items.filter((item) => item.id !== updated.id)])
      setNotice(message)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo guardar el cambio.')
    } finally {
      setBusy(false)
    }
  }

  async function createRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const created = await api<ServiceRequest>('/api/requests', { method: 'POST', body: JSON.stringify(form) })
      setRequests((items) => [created, ...items])
      setForm(emptyForm)
      openRequest(created)
      setNotice('La solicitud se registró correctamente.')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo registrar la solicitud.')
    } finally {
      setBusy(false)
    }
  }

  function navigate(next: Page) {
    if (next === 'new' && role === 'client' && !form.clientName) {
      setForm({ ...emptyForm, clientName: 'Lucía Torres', company: 'Café del Parque', email: 'lucia@ejemplo.com' })
    }
    setPage(next)
    setError('')
    setNotice('')
  }

  function changeRole(next: Role) {
    setRole(next)
    setSelected(null)
    setFilter('ALL')
    navigate('inbox')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate('inbox')} aria-label="Ir a solicitudes">
          <span className="brand__mark"><ClipboardList size={21} strokeWidth={2.2} /></span>
          <span>Solicitud<span className="brand__light">Clara</span><small>Portal de requerimientos</small></span>
        </button>
        <div className="sidebar__divider" />
        <nav className="navigation" aria-label="Navegación principal">
          <button className={page === 'inbox' || page === 'detail' ? 'navigation__item active' : 'navigation__item'} onClick={() => navigate('inbox')}><Inbox size={18} /> Solicitudes <span>{role === 'analyst' ? requests.length : requests.filter((item) => item.clientName === 'Lucía Torres').length}</span></button>
          <button className={page === 'new' ? 'navigation__item active' : 'navigation__item'} onClick={() => navigate('new')}><Plus size={18} /> Nueva solicitud</button>
          <button className={page === 'guide' ? 'navigation__item active' : 'navigation__item'} onClick={() => navigate('guide')}><FileText size={18} /> Guía del proyecto</button>
        </nav>
        <div className="sidebar__bottom">
          <div className="demo-note"><span className="demo-note__icon"><LayoutGrid size={18} /></span><strong>Proyecto de demostración</strong><p>Flujo de requisitos para servicios digitales.</p></div>
          <span className="sidebar__foot">Desarrollado por Matías Flores</span>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <span className="topbar__location">{page === 'detail' ? 'Solicitudes / Detalle' : page === 'new' ? 'Solicitudes / Nueva' : page === 'guide' ? 'Proyecto / Guía' : 'Solicitudes / Bandeja'}</span>
          <div className="topbar__right"><span className="demo-label">Modo demo</span><div className="role-switch" role="group" aria-label="Vista de demostración"><button className={role === 'analyst' ? 'selected' : ''} onClick={() => changeRole('analyst')}>Analista</button><button className={role === 'client' ? 'selected' : ''} onClick={() => changeRole('client')}>Cliente</button></div></div>
        </header>

        <main className="main-content">
          {error && <div className="message message--error" role="alert"><span>{error}</span><button aria-label="Cerrar error" onClick={() => setError('')}><X size={16} /></button></div>}
          {notice && <div className="message message--success" role="status"><Check size={17} /><span>{notice}</span><button aria-label="Cerrar aviso" onClick={() => setNotice('')}><X size={16} /></button></div>}

          {page === 'inbox' && <section className="page-content">
            <div className="page-heading"><div><p className="overline">{role === 'analyst' ? 'Panel de análisis' : 'Vista de Lucía Torres'}</p><h1>{role === 'analyst' ? 'Solicitudes' : 'Estado de mis solicitudes'}</h1><p className="page-intro">{role === 'analyst' ? 'Una vista clara de lo que pidió cada cliente y de lo que falta definir.' : 'Consulta el avance de las solicitudes de Café del Parque.'}</p></div><button className="button button--primary" onClick={() => navigate('new')}><Plus size={18} /> Nueva solicitud</button></div>
            {role === 'analyst' && !loading && <div className="summary-strip"><div><span>Recibidas</span><strong>{counts.received}</strong></div><div><span>En análisis</span><strong>{counts.analysis}</strong></div><div><span>Listas para desarrollo</span><strong>{counts.ready}</strong></div></div>}
            <div className="list-toolbar"><div className="filters" role="group" aria-label="Filtrar por estado">{([['ALL', 'Todas'], ['RECIBIDA', 'Recibidas'], ['EN_ANALISIS', 'En análisis'], ['LISTA_PARA_DESARROLLO', 'Listas']] as const).map(([value, label]) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div><label className="search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar solicitud" aria-label="Buscar solicitud" /></label></div>
            <div className="request-list"><div className="request-list__header"><span>Solicitud</span><span>Servicio</span><span>Actualización</span><span>Estado</span><span /></div>{loading ? <div className="empty-state"><h3>Cargando solicitudes…</h3></div> : visible.length === 0 ? <div className="empty-state"><h3>No hay solicitudes en esta vista</h3><p>Prueba otro filtro o registra una solicitud nueva.</p></div> : visible.map((item) => <button className="request-row" key={item.id} onClick={() => openRequest(item)}><span className="request-row__main"><strong>{item.title}</strong><small>{item.company} · #{String(item.id).padStart(3, '0')}</small></span><span>{item.serviceType}</span><span>{formattedDate(item.updatedAt)}</span><StatusTag status={item.status} /><ChevronRight size={18} /></button>)}</div>
          </section>}

          {page === 'new' && <section className="page-content page-content--narrow"><button className="back-link" onClick={() => navigate('inbox')}><ArrowLeft size={17} /> Volver a solicitudes</button><p className="overline">Paso 1 de 3 · Registro</p><h1>Nueva solicitud</h1><p className="page-intro">Cuéntanos qué necesita tu negocio. Un analista organizará los requisitos antes de iniciar el desarrollo.</p><form className="request-form" onSubmit={createRequest}><div className="form-section"><h2>Datos de contacto</h2><p>Para identificar la solicitud y poder responderte.</p><div className="form-grid"><label>Nombre y apellido<input required maxLength={100} value={form.clientName} onChange={(event) => setForm({ ...form, clientName: event.target.value })} placeholder="Ej. Ana Pérez" /></label><label>Negocio u organización<input required maxLength={100} value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} placeholder="Ej. Café Central" /></label><label className="form-grid__wide">Correo electrónico<input required type="email" maxLength={160} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="nombre@empresa.com" /></label></div></div><div className="form-section"><h2>Tu necesidad</h2><p>Describe el problema y lo que esperas conseguir.</p><div className="form-grid"><label>Tipo de servicio<select required value={form.serviceType} onChange={(event) => setForm({ ...form, serviceType: event.target.value })}><option value="">Selecciona una opción</option>{serviceTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label>Título de la solicitud<input required maxLength={140} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ej. Reservas en línea para mi negocio" /></label><label className="form-grid__wide">¿Qué necesitas resolver?<textarea required maxLength={4000} rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Explica cómo trabajas hoy, qué dificultad tienes y qué debería permitirte hacer la solución." /></label></div></div><div className="form-actions"><button className="button button--ghost" type="button" onClick={() => navigate('inbox')}>Cancelar</button><button className="button button--primary" disabled={busy} type="submit"><Send size={17} /> {busy ? 'Registrando…' : 'Registrar solicitud'}</button></div></form></section>}

          {page === 'detail' && selected && <section className="page-content detail-page"><button className="back-link" onClick={() => navigate('inbox')}><ArrowLeft size={17} /> Volver a solicitudes</button><div className="detail-heading"><div><p className="overline">Solicitud #{String(selected.id).padStart(3, '0')} · {selected.serviceType}</p><h1>{selected.title}</h1><p className="page-intro">{selected.company} · Enviada por {selected.clientName} el {formattedDate(selected.createdAt)}</p></div><StatusTag status={selected.status} /></div>
            <div className="progress-track" aria-label="Progreso de solicitud">{([['RECIBIDA', 'Solicitud recibida'], ['EN_ANALISIS', 'Análisis de requisitos'], ['LISTA_PARA_DESARROLLO', 'Lista para desarrollo']] as const).map(([step, label], index) => { const activeIndex = ['RECIBIDA', 'EN_ANALISIS', 'LISTA_PARA_DESARROLLO'].indexOf(selected.status); return <div className={index <= activeIndex ? 'progress-step complete' : 'progress-step'} key={step}><span>{index < activeIndex ? <Check size={16} /> : index + 1}</span><strong>{label}</strong></div> })}</div>
            <div className="detail-grid"><div className="detail-primary"><article className="content-section"><div className="section-heading"><span className="section-heading__icon"><Inbox size={19} /></span><div><h2>Necesidad del cliente</h2><p>Descripción original de la solicitud</p></div></div><p className="request-description">{selected.description}</p><div className="client-meta"><div><span>Contacto</span><strong>{selected.clientName}</strong><a href={`mailto:${selected.email}`}>{selected.email}</a></div><div><span>Organización</span><strong>{selected.company}</strong></div></div></article>
            <article className="content-section"><div className="section-heading"><span className="section-heading__icon"><ClipboardList size={19} /></span><div><h2>Requisitos funcionales</h2><p>Qué debe permitir hacer la solución</p></div></div>{role === 'analyst' && selected.status === 'EN_ANALISIS' ? <label className="editor-label">Escribe un requisito por línea<textarea rows={7} value={requirements} onChange={(event) => setRequirements(event.target.value)} placeholder="El usuario puede registrar...&#10;El sistema muestra..." /></label> : selected.requirements ? <ul className="requirement-list">{selected.requirements.split('\n').filter(Boolean).map((line, index) => <li key={index}><span>{String(index + 1).padStart(2, '0')}</span>{line}</li>)}</ul> : <p className="muted">Los requisitos se definirán durante el análisis.</p>}</article></div>
            <div className="detail-secondary"><article className="content-section"><div className="section-heading"><span className="section-heading__icon"><Check size={19} /></span><div><h2>Criterios de aceptación</h2><p>Cómo sabremos que funciona</p></div></div>{role === 'analyst' && selected.status === 'EN_ANALISIS' ? <label className="editor-label">Escribe un criterio por línea<textarea rows={9} value={acceptanceCriteria} onChange={(event) => setAcceptanceCriteria(event.target.value)} placeholder="Dado... cuando... entonces..." /></label> : selected.acceptanceCriteria ? <ul className="criteria-list">{selected.acceptanceCriteria.split('\n').filter(Boolean).map((line, index) => <li key={index}><Check size={16} />{line}</li>)}</ul> : <p className="muted">Se añadirán antes de pasar a desarrollo.</p>}</article>
              {role === 'analyst' && <div className="action-panel"><h3>Próximo paso</h3>{selected.status === 'RECIBIDA' ? <><p>Revisa la necesidad y abre el análisis para documentar los requisitos.</p><button className="button button--primary button--wide" disabled={busy} onClick={() => void mutate(`/api/requests/${selected.id}/analysis`, { method: 'POST' }, 'El análisis comenzó.')}>Iniciar análisis <ArrowRight size={17} /></button></> : selected.status === 'EN_ANALISIS' ? <><p>Guarda los requisitos y criterios antes de marcar la solicitud como lista.</p><button className="button button--secondary button--wide" disabled={busy} onClick={() => void mutate(`/api/requests/${selected.id}/analysis`, { method: 'PUT', body: JSON.stringify({ requirements, acceptanceCriteria }) }, 'El análisis se guardó.')}>Guardar análisis</button><button className="button button--primary button--wide" disabled={busy || !selected.requirements || !selected.acceptanceCriteria || requirements !== selected.requirements || acceptanceCriteria !== selected.acceptanceCriteria} onClick={() => void mutate(`/api/requests/${selected.id}/ready`, { method: 'POST' }, 'La solicitud está lista para desarrollo.')}>Marcar lista <ArrowRight size={17} /></button></> : <p className="action-panel__done"><Check size={17} /> Análisis completado y listo para desarrollo.</p>}</div>}
            </div></div>
          </section>}

          {page === 'guide' && <section className="page-content page-content--narrow guide-page"><p className="overline">Presentación del proyecto</p><h1>De una necesidad a requisitos claros</h1><p className="page-intro">Solicitud Clara organiza el trabajo previo al desarrollo de soluciones digitales. El proyecto está pensado como demostración de análisis funcional y desarrollo web.</p><div className="guide-section"><h2>Problema</h2><p>Un pedido informal suele mezclar problemas, ideas y soluciones. Sin una descripción estructurada ni criterios de aceptación, el equipo puede interpretar de forma distinta lo que el cliente espera.</p></div><div className="guide-section"><h2>Flujo principal</h2><ol><li>El cliente registra su necesidad.</li><li>El analista revisa y redacta requisitos funcionales.</li><li>El analista define criterios de aceptación verificables.</li><li>La solicitud pasa a lista para desarrollo.</li></ol></div><div className="guide-section"><h2>Alcance de esta demo</h2><p>Las vistas de cliente y analista sirven para mostrar el flujo. No hay autenticación ni autorización de producción. Los datos se guardan en una base local H2 y el repositorio incluye historias de usuario, caso de uso y contrato de API.</p></div><button className="button button--primary" onClick={() => navigate('inbox')}>Ver solicitudes <ArrowRight size={17} /></button></section>}
        </main>
      </div>
    </div>
  )
}

export default App
