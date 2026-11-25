
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './ProjectManager.css'

const BUCKET = 'project-images'
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  short_description: '',
  image_url: '',
  technologies: '',
  live_url: '',
  github_url: '',
  featured: false,
  published: false,
  sort_order: 0,
}

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function formatError(error) {
  return error?.message || 'Something went wrong.'
}

export default function ProjectManager() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadProjects = useCallback(async () => {
    setLoading(true)

    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(formatError(fetchError))
    } else {
      setProjects(data || [])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  function updateField(event) {
    const { name, type, value, checked } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function resetForm() {
    setForm({ ...emptyForm })
    setEditingId(null)
    setImageFile(null)
    setShowForm(false)
  }

  function startCreating() {
    resetForm()
    setError('')
    setSuccess('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startEditing(project) {
    setForm({
      title: project.title || '',
      slug: project.slug || '',
      description: project.description || '',
      short_description: project.short_description || '',
      image_url: project.image_url || '',
      technologies: (project.technologies || []).join(', '),
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      featured: !!project.featured,
      published: !!project.published,
      sort_order: project.sort_order ?? 0,
    })

    setEditingId(project.id)
    setImageFile(null)
    setShowForm(true)
    setError('')
    setSuccess('')

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      setImageFile(null)
      return
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please select a JPG, PNG, or WebP image.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError('Images must be 5 MB or smaller.')
      event.target.value = ''
      return
    }

    setImageFile(file)
    setError('')
  }

  async function uploadImage(file) {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('Please sign in again.')
    }

    const extension = file.type === 'image/jpeg'
      ? 'jpg'
      : file.type === 'image/png'
        ? 'png'
        : 'webp'

    const path = `${user.id}/${crypto.randomUUID()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path)

    return { url: data.publicUrl, path }
  }

  async function saveProject(published) {
    if (saving) return

    setError('')
    setSuccess('')

    const title = form.title.trim()
    const description = form.description.trim()
    const slug = makeSlug(form.slug || title)

    if (!title || !description || !slug) {
      setError('Please enter a valid title and description.')
      return
    }

    if (
      projects.some(
        (project) =>
          project.slug === slug && project.id !== editingId
      )
    ) {
      setError('A project with this URL slug already exists.')
      return
    }

    setSaving(true)
    let newImagePath = null

    try {
      let imageUrl = form.image_url.trim() || null

      if (imageFile) {
        const uploaded = await uploadImage(imageFile)
        imageUrl = uploaded.url
        newImagePath = uploaded.path
      }

      const technologies = form.technologies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)

      const payload = {
        title,
        slug,
        description,
        short_description:
          form.short_description.trim() || null,
        image_url: imageUrl,
        technologies,
        live_url: form.live_url.trim() || null,
        github_url: form.github_url.trim() || null,
        featured: form.featured,
        published,
        sort_order: Number(form.sort_order) || 0,
      }

      let result

      if (editingId) {
        result = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingId)
          .select()
          .single()
      } else {
        result = await supabase
          .from('projects')
          .insert(payload)
          .select()
          .single()
      }

      if (result.error) throw result.error

      setSuccess(
        editingId
          ? 'Project updated successfully!'
          : published
            ? 'Project published successfully!'
            : 'Project saved as a draft!'
      )

      resetForm()
      await loadProjects()
    } catch (err) {
      // Remove a newly uploaded image if saving the
      // corresponding database record failed.
      if (newImagePath) {
        await supabase.storage
          .from(BUCKET)
          .remove([newImagePath])
      }

      setError(formatError(err))
    } finally {
      setSaving(false)
    }
  }

  async function togglePublished(project) {
    setError('')
    setSuccess('')
    setBusyId(project.id)

    const { error: updateError } = await supabase
      .from('projects')
      .update({ published: !project.published })
      .eq('id', project.id)

    if (updateError) {
      setError(formatError(updateError))
    } else {
      setSuccess(
        project.published
          ? 'Project moved to drafts.'
          : 'Project published!'
      )
      await loadProjects()
    }

    setBusyId(null)
  }

  async function deleteProject(project) {
    setError('')
    setSuccess('')
    setBusyId(project.id)

    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id)

    if (deleteError) {
      setError(formatError(deleteError))
    } else {
      setSuccess('Project deleted successfully.')
      setDeletingId(null)

      if (editingId === project.id) resetForm()

      await loadProjects()
    }

    setBusyId(null)
  }

  const publishedCount = projects.filter(
    (project) => project.published
  ).length

  return (
    <section className="pm-wrapper">
      <div className="pm-heading">
        <div>
          <p className="admin-eyebrow">
            CONTENT MANAGEMENT
          </p>
          <h2>Manage your projects.</h2>
          <p>
            Your personal workspace for everything
            you've built.
          </p>
        </div>

        <button
          className="pm-add-button"
          type="button"
          onClick={startCreating}
        >
          + New project
        </button>
      </div>

      <div className="pm-stats">
        <div className="pm-stat">
          <span>TOTAL PROJECTS</span>
          <strong>{projects.length}</strong>
        </div>

        <div className="pm-stat">
          <span>PUBLISHED</span>
          <strong>{publishedCount}</strong>
        </div>

        <div className="pm-stat">
          <span>DRAFTS</span>
          <strong>{projects.length - publishedCount}</strong>
        </div>
      </div>

      {error && (
        <p className="pm-error" role="alert">{error}</p>
      )}

      {success && (
        <p className="pm-success" role="status">
          {success}
        </p>
      )}

      {showForm && (
        <div className="pm-form-panel">
          <div className="pm-form-heading">
            <p className="admin-eyebrow">
              {editingId ? 'EDIT PROJECT' : 'NEW PROJECT'}
            </p>

            <h3>
              {editingId
                ? 'Make it even better.'
                : "Show what you've built."}
            </h3>
          </div>

          <form
            className="pm-form"
            onSubmit={(event) => {
              event.preventDefault()
              saveProject(form.published)
            }}
          >
            <div className="pm-field">
              <label htmlFor="pm-title">Project title *</label>
              <input
                id="pm-title"
                name="title"
                value={form.title}
                onChange={updateField}
                required
                placeholder="My amazing project"
              />
            </div>

            <div className="pm-field">
              <label htmlFor="pm-slug">URL slug</label>
              <input
                id="pm-slug"
                name="slug"
                value={form.slug}
                onChange={updateField}
                placeholder="Generated from title if empty"
              />
            </div>

            <div className="pm-field">
              <label htmlFor="pm-description">
                Description *
              </label>
              <textarea
                id="pm-description"
                name="description"
                value={form.description}
                onChange={updateField}
                rows={5}
                required
              />
            </div>

            <div className="pm-field">
              <label htmlFor="pm-short">
                Short description
              </label>
              <textarea
                id="pm-short"
                name="short_description"
                value={form.short_description}
                onChange={updateField}
                rows={2}
              />
            </div>

            <div className="pm-field">
              <label htmlFor="pm-tech">
                Technologies
              </label>
              <input
                id="pm-tech"
                name="technologies"
                value={form.technologies}
                onChange={updateField}
                placeholder="React, Node.js, MongoDB"
              />
              <small>Separate with commas.</small>
            </div>

            <div className="pm-field">
              <label htmlFor="pm-image">
                Upload project screenshot
              </label>
              <input
                id="pm-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
              />
              <small>
                JPG, PNG or WebP. Maximum size: 5 MB.
              </small>
            </div>

            <div className="pm-field">
              <label htmlFor="pm-image-url">
                Or use an image URL
              </label>
              <input
                id="pm-image-url"
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={updateField}
                placeholder="https://example.com/image.png"
              />
            </div>

            {(imageFile || form.image_url) && (
              <div className="pm-image-preview">
                {imageFile ? (
                  <p>
                    New image selected: {imageFile.name}
                  </p>
                ) : (
                  <img
                    src={form.image_url}
                    alt="Current project preview"
                  />
                )}
              </div>
            )}

            <div className="pm-form-row">
              <div className="pm-field">
                <label htmlFor="pm-live">
                  Live demo URL
                </label>
                <input
                  id="pm-live"
                  type="url"
                  name="live_url"
                  value={form.live_url}
                  onChange={updateField}
                />
              </div>

              <div className="pm-field">
                <label htmlFor="pm-github">
                  GitHub URL
                </label>
                <input
                  id="pm-github"
                  type="url"
                  name="github_url"
                  value={form.github_url}
                  onChange={updateField}
                />
              </div>
            </div>

            <div className="pm-field">
              <label htmlFor="pm-order">
                Display order
              </label>
              <input
                id="pm-order"
                type="number"
                name="sort_order"
                value={form.sort_order}
                onChange={updateField}
              />
              <small>
                Lower numbers appear first.
              </small>
            </div>

            <label className="pm-checkbox">
              <input
                name="featured"
                type="checkbox"
                checked={form.featured}
                onChange={updateField}
              />
              Feature this project
            </label>

            <div className="pm-form-actions">
              <button
                type="button"
                className="pm-draft-button"
                disabled={saving}
                onClick={() => saveProject(false)}
              >
                Save as draft
              </button>

              <button
                type="button"
                className="pm-publish-button"
                disabled={saving}
                onClick={() => saveProject(true)}
              >
                {saving
                  ? 'Saving...'
                  : 'Save & publish →'}
              </button>

              <button
                type="button"
                className="pm-cancel-button"
                disabled={saving}
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="pm-list-heading">
        <h3>All projects</h3>
        <span>{projects.length} projects</span>
      </div>

      {loading ? (
        <p className="pm-empty">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="pm-empty">
          <h3>No projects yet.</h3>
          <p>Create your first project to get started.</p>
        </div>
      ) : (
        <div className="pm-project-list">
          {projects.map((project) => (
            <article
              key={project.id}
              className="pm-project-item"
            >
              {project.image_url ? (
                <img
                  className="pm-project-image"
                  src={project.image_url}
                  alt={project.title}
                />
              ) : (
                <div className="pm-image-placeholder">
                  ✦
                </div>
              )}

              <div className="pm-project-info">
                <h4>{project.title}</h4>

                <p>
                  {project.short_description ||
                    project.description}
                </p>

                <div className="pm-project-tags">
                  {(project.technologies || []).map(
                    (technology) => (
                      <span key={technology}>
                        {technology}
                      </span>
                    )
                  )}
                </div>

                <div className="pm-item-actions">
                  <button
                    type="button"
                    disabled={busyId === project.id}
                    onClick={() => startEditing(project)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={busyId === project.id}
                    onClick={() => togglePublished(project)}
                  >
                    {project.published
                      ? 'Unpublish'
                      : 'Publish'}
                  </button>

                  <button
                    type="button"
                    className="pm-delete-action"
                    disabled={busyId === project.id}
                    onClick={() => setDeletingId(project.id)}
                  >
                    Delete
                  </button>
                </div>

                {deletingId === project.id && (
                  <div className="pm-delete-confirm">
                    <p>
                      Permanently delete "{project.title}"?
                    </p>

                    <button
                      type="button"
                      disabled={busyId === project.id}
                      onClick={() => deleteProject(project)}
                    >
                      Yes, delete
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <span
                className={
                  project.published
                    ? 'pm-status published'
                    : 'pm-status draft'
                }
              >
                {project.published
                  ? 'Published'
                  : 'Draft'}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
