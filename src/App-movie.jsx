import { useEffect, useMemo, useRef, useState } from 'react'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import './App.css'

const MAP_WIDTH = 960
const MAP_HEIGHT = 500
const MIN_ZOOM = 1
const MAX_ZOOM = 8

const STORAGE_KEYS = {
  records: 'movie-wandering.records.v1',
  mode: 'movie-wandering.mode.v1',
  theme: 'movie-wandering.theme.v1'
}

const THEME_PRESETS = {
  cyan: { label: 'Cyan', accent: '#60ecff', accentStrong: '#25c8f5', accentFaint: '#c8f5ff' },
  blue: { label: 'Blue', accent: '#7eb8ff', accentStrong: '#3f8fff', accentFaint: '#d8e8ff' },
  emerald: { label: 'Emerald', accent: '#6ef0cb', accentStrong: '#2ec79b', accentFaint: '#d8fff1' },
  rose: { label: 'Rose', accent: '#ff93c8', accentStrong: '#f55ca8', accentFaint: '#ffe0ef' }
}

const INITIAL_RECORDS = [
  {
    id: 'seed-1',
    movie: 'Inception',
    country: 'United States of America',
    rating: 5,
    watchDate: '2026-01-10',
    comment: 'Great soundtrack and layered storytelling.',
    lon: -118.2437,
    lat: 34.0522
  },
  {
    id: 'seed-2',
    movie: 'Parasite',
    country: 'South Korea',
    rating: 5,
    watchDate: '2026-02-01',
    comment: 'Excellent pacing and social metaphor.',
    lon: 126.978,
    lat: 37.5665
  }
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const stripHtml = (text = '') => text.replace(/<[^>]*>/g, '').trim()

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const svgRef = useRef(null)
  const panRef = useRef({ active: false, pointerId: null, lastX: 0, lastY: 0, moved: false })

  const [records, setRecords] = useState(() => readStorage(STORAGE_KEYS.records, INITIAL_RECORDS))
  const [mode, setMode] = useState(() => readStorage(STORAGE_KEYS.mode, 'dark'))
  const [themeKey, setThemeKey] = useState(() => readStorage(STORAGE_KEYS.theme, 'cyan'))
  const [countries, setCountries] = useState([])
  const [error, setError] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [view, setView] = useState({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    animated: true
  })
  const [posterResults, setPosterResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [selectedPosterId, setSelectedPosterId] = useState('')
  const [form, setForm] = useState({
    movie: '',
    rating: '4',
    watchDate: '',
    comment: '',
    country: '',
    lon: null,
    lat: null
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records))
  }, [records])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.mode, JSON.stringify(mode))
    document.documentElement.dataset.theme = mode
  }, [mode])

  useEffect(() => {
    const validTheme = THEME_PRESETS[themeKey] ? themeKey : 'cyan'
    const palette = THEME_PRESETS[validTheme]
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(validTheme))
    document.documentElement.style.setProperty('--accent', palette.accent)
    document.documentElement.style.setProperty('--accent-strong', palette.accentStrong)
    document.documentElement.style.setProperty('--accent-faint', palette.accentFaint)
  }, [themeKey])

  useEffect(() => {
    let ignore = false

    const loadMap = async () => {
      try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        if (!response.ok) throw new Error('Map data request failed')
        const topo = await response.json()
        const fc = feature(topo, topo.objects.countries)
        if (!ignore) {
          setCountries(fc.features)
          setError('')
        }
      } catch {
        if (!ignore) {
          setError('World map failed to load. Please check your network and retry.')
        }
      }
    }

    loadMap()
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    const query = form.movie.trim()
    if (query.length < 2) {
      setPosterResults([])
      setSearchError('')
      setIsSearching(false)
      return
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      setSearchError('')
      try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=movie&limit=6`
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) throw new Error('Movie search failed')
        const data = await response.json()
        const results = (data.results || []).map((item) => ({
          id: `${item.trackId ?? item.collectionId ?? Math.random()}`,
          title: item.trackName || query,
          year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : '',
          poster: (item.artworkUrl100 || '').replace('100x100bb', '440x440bb'),
          comment:
            stripHtml(item.longDescription || item.shortDescription) ||
            `Genre: ${item.primaryGenreName || 'Unknown'}, Rating: ${item.contentAdvisoryRating || 'N/A'}`
        }))
        setPosterResults(results)
        if (results.length > 0) {
          setSelectedPosterId((current) => current || results[0].id)
        }
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setSearchError('Failed to fetch movie posters and related comments.')
          setPosterResults([])
        }
      } finally {
        setIsSearching(false)
      }
    }, 380)

    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [form.movie])

  const projection = useMemo(() => {
    if (!countries.length) return null
    return geoNaturalEarth1().fitSize([MAP_WIDTH, MAP_HEIGHT], {
      type: 'FeatureCollection',
      features: countries
    })
  }, [countries])

  const mapPath = useMemo(() => {
    if (!projection) return null
    return geoPath(projection)
  }, [projection])

  const stats = useMemo(() => {
    const visited = new Set(records.map((item) => item.country)).size
    const avg = records.length
      ? (records.reduce((sum, item) => sum + item.rating, 0) / records.length).toFixed(1)
      : '0.0'
    return { visited, avg }
  }, [records])

  const relatedComments = useMemo(() => {
    return posterResults
      .map((item) => ({ id: item.id, text: item.comment, title: item.title }))
      .filter((item) => item.text)
      .slice(0, 4)
  }, [posterResults])

  const clampOffset = (zoom, offsetX, offsetY) => {
    const minX = MAP_WIDTH - MAP_WIDTH * zoom
    const minY = MAP_HEIGHT - MAP_HEIGHT * zoom
    return {
      offsetX: clamp(offsetX, minX, 0),
      offsetY: clamp(offsetY, minY, 0)
    }
  }

  const toSvgPoint = (clientX, clientY) => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * MAP_WIDTH,
      y: ((clientY - rect.top) / rect.height) * MAP_HEIGHT,
      scaleX: MAP_WIDTH / rect.width,
      scaleY: MAP_HEIGHT / rect.height
    }
  }

  const zoomToMapPoint = (mapX, mapY, targetZoom, animated = true) => {
    const nextZoom = clamp(targetZoom, MIN_ZOOM, MAX_ZOOM)
    const nextOffsetX = MAP_WIDTH / 2 - mapX * nextZoom
    const nextOffsetY = MAP_HEIGHT / 2 - mapY * nextZoom
    const clamped = clampOffset(nextZoom, nextOffsetX, nextOffsetY)
    setView({
      zoom: nextZoom,
      offsetX: clamped.offsetX,
      offsetY: clamped.offsetY,
      animated
    })
  }

  const jumpToCoordinates = (lon, lat, targetZoom = 3) => {
    if (!projection) return
    const point = projection([lon, lat])
    if (!point) return
    zoomToMapPoint(point[0], point[1], targetZoom, true)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const applyPosterToForm = (poster) => {
    setSelectedPosterId(poster.id)
    setForm((prev) => ({
      ...prev,
      movie: poster.title,
      comment: prev.comment || poster.comment.slice(0, 220)
    }))
  }

  const handleCountryClick = (countryName, countryFeature) => {
    setForm((prev) => ({ ...prev, country: countryName }))
    if (!mapPath || !projection) return
    const [cx, cy] = mapPath.centroid(countryFeature)
    const coords = projection.invert([cx, cy])
    if (coords) {
      setForm((prev) => ({
        ...prev,
        country: countryName,
        lon: Number(coords[0].toFixed(4)),
        lat: Number(coords[1].toFixed(4))
      }))
    }
    zoomToMapPoint(cx, cy, 2.8, true)
  }

  const handleMapClick = (event) => {
    if (!projection) return
    if (panRef.current.moved) {
      panRef.current.moved = false
      return
    }

    const p = toSvgPoint(event.clientX, event.clientY)
    if (!p) return
    const mapX = (p.x - view.offsetX) / view.zoom
    const mapY = (p.y - view.offsetY) / view.zoom
    const coords = projection.invert([mapX, mapY])
    if (!coords) return

    setForm((prev) => ({
      ...prev,
      lon: Number(coords[0].toFixed(4)),
      lat: Number(coords[1].toFixed(4))
    }))
    zoomToMapPoint(mapX, mapY, Math.max(2.6, view.zoom), true)
  }

  const handleWheel = (event) => {
    event.preventDefault()
    const p = toSvgPoint(event.clientX, event.clientY)
    if (!p) return

    const nextZoom = clamp(view.zoom * (event.deltaY < 0 ? 1.15 : 0.87), MIN_ZOOM, MAX_ZOOM)
    const mapX = (p.x - view.offsetX) / view.zoom
    const mapY = (p.y - view.offsetY) / view.zoom
    const nextOffsetX = p.x - mapX * nextZoom
    const nextOffsetY = p.y - mapY * nextZoom
    const clamped = clampOffset(nextZoom, nextOffsetX, nextOffsetY)

    setView({
      zoom: nextZoom,
      offsetX: clamped.offsetX,
      offsetY: clamped.offsetY,
      animated: false
    })
  }

  const handlePointerDown = (event) => {
    const svg = svgRef.current
    if (!svg) return
    panRef.current.active = true
    panRef.current.pointerId = event.pointerId
    panRef.current.lastX = event.clientX
    panRef.current.lastY = event.clientY
    panRef.current.moved = false
    svg.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!panRef.current.active || panRef.current.pointerId !== event.pointerId) return
    const p = toSvgPoint(event.clientX, event.clientY)
    const prev = toSvgPoint(panRef.current.lastX, panRef.current.lastY)
    if (!p || !prev) return

    const deltaX = (event.clientX - panRef.current.lastX) * p.scaleX
    const deltaY = (event.clientY - panRef.current.lastY) * p.scaleY
    if (Math.abs(deltaX) + Math.abs(deltaY) > 1.5) {
      panRef.current.moved = true
    }

    const clamped = clampOffset(view.zoom, view.offsetX + deltaX, view.offsetY + deltaY)
    setView((current) => ({
      ...current,
      offsetX: clamped.offsetX,
      offsetY: clamped.offsetY,
      animated: false
    }))

    panRef.current.lastX = event.clientX
    panRef.current.lastY = event.clientY
  }

  const stopPan = (event) => {
    const svg = svgRef.current
    if (!svg) return
    if (panRef.current.pointerId !== null) {
      try {
        svg.releasePointerCapture(event.pointerId)
      } catch {
        // ignore pointer release errors
      }
    }
    panRef.current.active = false
    panRef.current.pointerId = null
  }

  const zoomByButton = (factor) => {
    const mapX = MAP_WIDTH / 2
    const mapY = MAP_HEIGHT / 2
    const worldX = (mapX - view.offsetX) / view.zoom
    const worldY = (mapY - view.offsetY) / view.zoom
    zoomToMapPoint(worldX, worldY, view.zoom * factor, true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const movie = form.movie.trim()
    const comment = form.comment.trim()
    if (!movie || form.lon === null || form.lat === null) return

    const newRecord = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
      movie,
      rating: Number(form.rating),
      watchDate: form.watchDate || new Date().toISOString().slice(0, 10),
      comment,
      country: form.country || 'Unknown',
      lon: form.lon,
      lat: form.lat
    }

    setRecords((prev) => [newRecord, ...prev])
    jumpToCoordinates(form.lon, form.lat, 3.2)
    setForm((prev) => ({
      ...prev,
      movie: '',
      comment: '',
      country: '',
      lon: null,
      lat: null
    }))
  }

  const handleDelete = (id) => {
    setRecords((prev) => prev.filter((item) => item.id !== id))
  }

  const resetView = () => {
    setView({ zoom: 1, offsetX: 0, offsetY: 0, animated: true })
  }

  const panelClass = isDrawerOpen ? 'panel panel-open' : 'panel panel-closed'
  const mapTransformClass = view.animated ? 'map-transform animated' : 'map-transform'
  const selectedPoster = posterResults.find((item) => item.id === selectedPosterId)

  return (
    <main className="app-shell">
      <section className="map-panel">
        <svg
          ref={svgRef}
          className="world-map-svg"
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          onClick={handleMapClick}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopPan}
          onPointerCancel={stopPan}
          role="img"
          aria-label="Interactive world map for movie records"
        >
          <defs>
            <linearGradient id="ocean-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#071528" />
              <stop offset="50%" stopColor="#0b2545" />
              <stop offset="100%" stopColor="#0f3d6b" />
            </linearGradient>
          </defs>
          {/* <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} className="ocean" /> */}
          {/* <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#ocean-gradient)" opacity="0.94" /> */}

          <g className={mapTransformClass} transform={`translate(${view.offsetX} ${view.offsetY}) scale(${view.zoom})`}>
            {countries.map((country) => {
              const countryName = country.properties?.name || 'Unknown'
              return (
                <path
                  key={country.id}
                  d={mapPath?.(country) ?? ''}
                  className="country-shape"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleCountryClick(countryName, country)
                  }}
                />
              )
            })}

            {records.map((item) => {
              if (!projection) return null
              const point = projection([item.lon, item.lat])
              if (!point) return null
              return (
                <g key={item.id}>
                  <circle cx={point[0]} cy={point[1]} r="6.6" className="pin-dot" />
                  <text x={point[0]} y={point[1] + 3} className="pin-label">
                    {item.rating}
                  </text>
                </g>
              )
            })}

            {form.lon !== null && form.lat !== null && projection ? (
              <circle
                cx={projection([form.lon, form.lat])[0]}
                cy={projection([form.lon, form.lat])[1]}
                r="8.1"
                className="draft-dot"
              />
            ) : null}
          </g>
        </svg>

        <div className="map-hud glass-card">
          <h1>Movie Wandering</h1>
          <p>Click to mark, wheel to zoom, drag to pan, and jump instantly to points.</p>
          {error ? <span className="hud-error">{error}</span> : null}
        </div>

        <div className="map-controls glass-card">
          <button type="button" onClick={() => zoomByButton(1.2)} aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={() => zoomByButton(0.83)} aria-label="Zoom out">
            -
          </button>
          <button type="button" onClick={resetView} aria-label="Reset zoom">
            Reset
          </button>
        </div>
      </section>

      <aside className={panelClass}>
        <button
          type="button"
          className="drawer-handle"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          aria-label={isDrawerOpen ? 'Collapse side panel' : 'Expand side panel'}
        >
          <span />
        </button>

        <div className="panel-scroll">
          <header className="panel-header">
            <h2>Liquid Console</h2>
            <p>Save records and jump to any location in one tap.</p>
          </header>

          <section className="theme-tools glass-card">
            <button type="button" className="mode-toggle" onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}>
              Mode: {mode === 'dark' ? 'Dark' : 'Light'}
            </button>
            <div className="theme-swatches">
              {Object.entries(THEME_PRESETS).map(([key, palette]) => (
                <button
                  key={key}
                  type="button"
                  className={key === themeKey ? 'theme-dot active' : 'theme-dot'}
                  style={{ background: palette.accent }}
                  onClick={() => setThemeKey(key)}
                  aria-label={`Set theme ${palette.label}`}
                  title={palette.label}
                />
              ))}
            </div>
          </section>

          <section className="stat-row">
            <article className="stat-card glass-card">
              <span>Records</span>
              <strong>{records.length}</strong>
            </article>
            <article className="stat-card glass-card">
              <span>Countries</span>
              <strong>{stats.visited}</strong>
            </article>
            <article className="stat-card glass-card">
              <span>Avg Score</span>
              <strong>{stats.avg}</strong>
            </article>
          </section>

          <form className="editor" onSubmit={handleSubmit}>
            <h3>New Record</h3>

            <label>
              Movie
              <input
                name="movie"
                value={form.movie}
                onChange={handleFormChange}
                placeholder="Interstellar"
                required
              />
            </label>

            <label>
              Rating
              <select name="rating" value={form.rating} onChange={handleFormChange}>
                <option value="5">5 - Masterpiece</option>
                <option value="4">4 - Recommend</option>
                <option value="3">3 - Fine</option>
                <option value="2">2 - Average</option>
                <option value="1">1 - Weak</option>
              </select>
            </label>

            <label>
              Date
              <input name="watchDate" type="date" value={form.watchDate} onChange={handleFormChange} />
            </label>

            <label>
              Country
              <input
                name="country"
                value={form.country}
                onChange={handleFormChange}
                placeholder="Auto from map click"
              />
            </label>

            <label>
              Coordinates
              <input
                value={
                  form.lon === null || form.lat === null
                    ? 'No coordinate selected'
                    : `Lon ${form.lon}, Lat ${form.lat}`
                }
                readOnly
              />
            </label>

            <label>
              Comment
              <textarea
                name="comment"
                rows="3"
                value={form.comment}
                onChange={handleFormChange}
                placeholder="Write your note..."
              />
            </label>

            <div className="button-row">
              <button type="submit">Save Record</button>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setForm((prev) => ({ ...prev, lon: null, lat: null, country: '' }))}
              >
                Clear Point
              </button>
            </div>
          </form>

          <section className="discover-section glass-card">
            <h3>Movie Posters</h3>
            {isSearching ? <p className="subtle-text">Searching posters...</p> : null}
            {searchError ? <p className="subtle-text">{searchError}</p> : null}
            {!isSearching && !searchError && posterResults.length === 0 && form.movie.trim().length > 1 ? (
              <p className="subtle-text">No poster results found.</p>
            ) : null}
            <div className="poster-grid">
              {posterResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === selectedPosterId ? 'poster-card active' : 'poster-card'}
                  onClick={() => applyPosterToForm(item)}
                >
                  {item.poster ? <img src={item.poster} alt={`${item.title} poster`} loading="lazy" /> : <div>No image</div>}
                  <span>{item.title}</span>
                  {item.year ? <small>{item.year}</small> : null}
                </button>
              ))}
            </div>
            {selectedPoster ? (
              <p className="selected-poster-note">
                Selected: {selectedPoster.title}
              </p>
            ) : null}
          </section>

          <section className="comments-section glass-card">
            <h3>Related Comments</h3>
            {relatedComments.length === 0 ? (
              <p className="subtle-text">Type movie name to fetch comments.</p>
            ) : (
              <ul>
                {relatedComments.map((item) => (
                  <li key={item.id}>
                    <strong>{item.title}: </strong>
                    {item.text.slice(0, 180)}
                    {item.text.length > 180 ? '...' : ''}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="record-list">
            {records.map((item) => (
              <article key={item.id} className="record-item glass-card">
                <div className="record-head">
                  <h4>{item.movie}</h4>
                  <div className="record-actions">
                    <button type="button" className="jump-btn" onClick={() => jumpToCoordinates(item.lon, item.lat, 3.4)}>
                      Jump
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <p>
                  {item.country} | {item.watchDate} | {item.rating}/5
                </p>
                <p className="coords">
                  ({item.lon}, {item.lat})
                </p>
                {item.comment ? <p className="comment">{item.comment}</p> : null}
              </article>
            ))}
          </section>
        </div>
      </aside>
    </main>
  )
}

export default App
