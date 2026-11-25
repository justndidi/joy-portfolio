
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function PortfolioProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function fetchProjects() {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          slug,
          description,
          short_description,
          image_url,
          technologies,
          live_url,
          github_url,
          featured,
          sort_order
        `)
        .eq('published', true)
        .order('featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (!active) return

      if (fetchError) {
        setError('Unable to load projects right now.')
      } else {
        setProjects(data || [])
      }

      setLoading(false)
    }

    fetchProjects()

    return () => {
      active = false
    }
  }, [])

  return (
    <section id="projects" className="projects-section">
      <div className="projects-heading">
        <div className="section-heading">
          <p className="eyebrow">SELECTED WORK</p>

          <h2>
            Ideas turned into <span>real things.</span>
          </h2>

          <p>
            A selection of things I've designed,
            developed, and brought to life.
          </p>
        </div>

        <span className="projects-side-note">
          DESIGNING · BUILDING · LEARNING
        </span>
      </div>

      {loading ? (
        <p className="projects-feedback" role="status">
          Loading projects...
        </p>
      ) : error ? (
        <p className="projects-feedback" role="alert">
          {error}
        </p>
      ) : projects.length === 0 ? (
        <p className="projects-feedback">
          New projects coming soon.
        </p>
      ) : (
        <div className="projects-grid">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className={`project-card ${
                project.featured
                  ? 'project-card-featured'
                  : ''
              }`}
            >
              <div className="project-image">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={`${project.title} screenshot`}
                    loading="lazy"
                  />
                ) : (
                  <div className="portfolio-project-placeholder">
                    <span>JOY.DEV / PROJECT</span>
                    <strong>{project.title}</strong>
                  </div>
                )}

                {project.featured && (
                  <span className="project-image-label">
                    FEATURED PROJECT
                  </span>
                )}
              </div>

              <div className="project-content">
                <div className="project-meta">
                  <span className="project-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="project-category">
                    {project.featured
                      ? 'FEATURED WORK'
                      : 'SELECTED PROJECT'}
                  </span>
                </div>

                <h3>{project.title}</h3>

                <p>
                  {project.short_description ||
                    project.description}
                </p>

                <div className="project-tech">
                  {(project.technologies || []).map(
                    (technology) => (
                      <span key={technology}>
                        {technology}
                      </span>
                    )
                  )}
                </div>

                <div className="project-links">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live demo
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source code
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
