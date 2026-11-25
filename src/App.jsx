import { useEffect, useState } from 'react'
import './App.css'

// import heroPortrait from './assets/hero-portrait.png'

import Avatar3D from './components/Avatar3D'
import PortfolioProjects from './components/PortfolioProjects'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    // ==========================================
    // SCROLL REVEAL
    // ==========================================

    const revealElements = document.querySelectorAll(
      '.about-section, .skills-section, .projects-section, .experience-section, .contact-section'
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
      }
    )

    revealElements.forEach((element) => {
      element.classList.add('reveal')
      observer.observe(element)
    })

    // ==========================================
    // SHOW / HIDE SCROLL-TO-TOP BUTTON
    // ==========================================

    const handlePageScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handlePageScroll)

    // ==========================================
    // PROJECT CARD 3D TILT
    // ==========================================

    const cards = document.querySelectorAll('.project-card')

    const handleMouseMove = (event) => {
      const card = event.currentTarget
      const rect = card.getBoundingClientRect()

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = ((y - centerY) / centerY) * -3
      const rotateY = ((x - centerX) / centerX) * 3

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
      `
    }

    const handleMouseLeave = (event) => {
      event.currentTarget.style.transform = ''
    }

    cards.forEach((card) => {
      card.addEventListener('mousemove', handleMouseMove)
      card.addEventListener('mouseleave', handleMouseLeave)
    })

    // ==========================================
    // HERO IMAGE MOUSE PARALLAX
    // ==========================================

    const heroImage = document.querySelector('.hero-image')

    const handleHeroMouseMove = (event) => {
      if (!heroImage) return

      const rect = heroImage.getBoundingClientRect()

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const moveX = (x / rect.width - 0.5) * 10
      const moveY = (y / rect.height - 0.5) * 10

      heroImage.style.transform = `
        translate(${moveX}px, ${moveY}px)
      `
    }

    const handleHeroMouseLeave = () => {
      if (!heroImage) return

      heroImage.style.transform = ''
    }

    if (heroImage) {
      heroImage.addEventListener('mousemove', handleHeroMouseMove)
      heroImage.addEventListener('mouseleave', handleHeroMouseLeave)
    }

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      observer.disconnect()

      window.removeEventListener('scroll', handlePageScroll)

      cards.forEach((card) => {
        card.removeEventListener('mousemove', handleMouseMove)
        card.removeEventListener('mouseleave', handleMouseLeave)
      })

      if (heroImage) {
        heroImage.removeEventListener(
          'mousemove',
          handleHeroMouseMove
        )

        heroImage.removeEventListener(
          'mouseleave',
          handleHeroMouseLeave
        )
      }
    }
  }, [])

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMenu = () => {
    setMenuOpen(false)
  }

  // ==========================================
  // SCROLL TO TOP
  // ==========================================

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="portfolio">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <header className="navbar">

        <a
          href="#home"
          className="logo"
          onClick={closeMenu}
        >
          Joy Jegbefume
        </a>

        <nav className="desktop-nav">

          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>

        </nav>

        <a
          href="#contact"
          className="nav-button desktop-nav-button"
        >
          Let's Talk →
        </a>

        <button
          className={`menu-toggle ${
            menuOpen ? 'menu-open' : ''
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={
            menuOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          aria-expanded={menuOpen}
        >

          <span></span>
          <span></span>
          <span></span>

        </button>

      </header>


      {/* ==========================================
          MOBILE NAVIGATION
      ========================================== */}

      <nav
        className={`mobile-nav ${
          menuOpen ? 'mobile-nav-open' : ''
        }`}
      >

        <a href="#home" onClick={closeMenu}>
          Home
        </a>

        <a href="#about" onClick={closeMenu}>
          About
        </a>

        <a href="#skills" onClick={closeMenu}>
          Skills
        </a>

        <a href="#projects" onClick={closeMenu}>
          Projects
        </a>

        <a href="#experience" onClick={closeMenu}>
          Experience
        </a>

        <a href="#contact" onClick={closeMenu}>
          Contact
        </a>

        <a
          href="#contact"
          className="mobile-talk-button"
          onClick={closeMenu}
        >
          Let's Talk →
        </a>

      </nav>


      <main>

        {/* ==========================================
            HERO
        ========================================== */}

        <section id="home" className="hero-section">

          <div className="hero-content">

            <div className="hero-status">
              <span className="hero-status-dot" />
              OPEN TO REMOTE OPPORTUNITIES
            </div>

            <p className="eyebrow">
              SOFTWARE DEVELOPER <span className="eyebrow-divider">/</span> CREATIVE BUILDER
            </p>

            <h1>
              I build digital
              <br />
              experiences with
              <br />
              <span>purpose.</span>
            </h1>

            <p className="hero-text">
              I'm Joy Jegbefume, a Computer Science student and
              full-stack developer who enjoys turning thoughtful
              ideas into useful, well-crafted web experiences.
            </p>

            <div className="hero-buttons">

              <a
                href="#projects"
                className="primary-button"
              >
                Explore my work <span aria-hidden="true">↗</span>
              </a>

              <a
                href="/Jegbefume_Joy_Ndidi_CV.pdf"
                download
                className="secondary-button"
              >
                Download CV <span aria-hidden="true">↓</span>
              </a>

            </div>

            <div className="hero-social-row">
              <span className="hero-social-label">FIND ME ON</span>

              <div className="social-links">

                <a
                  href="https://github.com/justndidi"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/joy-jegbefume-96ba89391"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>

                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=jegbefumejoy0@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Email <span aria-hidden="true">↗</span>
                </a>

              </div>
            </div>

          </div>


          <div className="hero-image hero-visual" aria-label="Portrait area reserved for Joy's interactive 3D avatar">

            <div className="hero-visual-glow" />
            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />

          <div className="hero-avatar-canvas">
  <Avatar3D />
</div>

<p className="avatar-interaction-hint">
  <span className="avatar-interaction-dot"></span>
  CLICK OR TAP ME TO SAY HELLO
</p>

            <div className="hero-visual-label hero-visual-label-top">
              <span className="hero-label-dot" />
              DIGITAL CREATOR / 001
            </div>

            <div className="hero-visual-label hero-visual-label-bottom">
              <span>CURIOUS BY DESIGN</span>
              <strong>JOY J.</strong>
            </div>

            <span className="hero-visual-index">01 — 04</span>

          </div>

        </section>


        {/* ==========================================
            ABOUT
        ========================================== */}

        <section
          id="about"
          className="about-section"
        >
          <div className="section-heading">
            <p className="eyebrow">A LITTLE ABOUT ME</p>
            <h2>Curious mind. <span>Practical builder.</span></h2>
            <p>
              I enjoy bringing thoughtful ideas to life through technology,
              design, and a little bit of experimentation.
            </p>
          </div>

          <div className="about-content">
            <div className="about-text">
              <p>
                I'm a Computer Science student at the Federal University of
                Petroleum Resources, Effurun, with hands-on experience building
                responsive web interfaces and backend services.
              </p>

              <p>
                During my industrial training at HiiT PLC, I gained practical
                experience in frontend development, backend development,
                databases, and software development workflows. I've continued
                applying those skills through personal and collaborative projects.
              </p>

              <p>
                I enjoy working across the stack, learning new tools, and
                creating digital products that are useful, intuitive, and
                thoughtfully put together.
              </p>

              <a href="#contact" className="primary-button">
                Let's work together <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="about-highlights">
              <div className="highlight">
                <span>01</span>
                <div>
                  <h3>Frontend development</h3>
                  <p>Responsive interfaces, reusable components, and thoughtful user experiences.</p>
                </div>
              </div>

              <div className="highlight">
                <span>02</span>
                <div>
                  <h3>Backend development</h3>
                  <p>REST APIs, server-side logic, authentication, and application workflows.</p>
                </div>
              </div>

              <div className="highlight">
                <span>03</span>
                <div>
                  <h3>Working with data</h3>
                  <p>Connecting applications to databases and managing application data.</p>
                </div>
              </div>

              <div className="highlight">
                <span>04</span>
                <div>
                  <h3>Always experimenting</h3>
                  <p>Exploring new technologies and finding better ways to build.</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ==========================================
            SKILLS
        ========================================== */}

        <section className="skills-section" id="skills">
          <div className="skills-header">
            <div>
              <p className="eyebrow">MY TOOLKIT</p>
              <h2>Tools I use to bring ideas to life.</h2>
            </div>
            <p className="skills-note">Learning, building, improving <span aria-hidden="true">↗</span></p>
          </div>

          <div className="skills-grid">
            <div className="skill-group">
              <span className="skill-group-index">01 / INTERFACES</span>
              <h3>Frontend</h3>
              <div className="skill-list">
                <span>HTML</span>
                <span>CSS</span>
                <span>JavaScript</span>
                <span>React</span>
                <span>TypeScript</span>
                <span>Bootstrap</span>
              </div>
            </div>

            <div className="skill-group">
              <span className="skill-group-index">02 / APPLICATIONS</span>
              <h3>Backend</h3>
              <div className="skill-list">
                <span>Node.js</span>
                <span>Express.js</span>
                <span>Python</span>
                <span>Django</span>
                <span>REST APIs</span>
              </div>
            </div>

            <div className="skill-group">
              <span className="skill-group-index">03 / DATA</span>
              <h3>Databases</h3>
              <div className="skill-list">
                <span>MongoDB</span>
                <span>PostgreSQL</span>
              </div>
            </div>

            <div className="skill-group">
              <span className="skill-group-index">04 / WORKFLOW</span>
              <h3>Tools</h3>
              <div className="skill-list">
                <span>Git</span>
                <span>GitHub</span>
                <span>VS Code</span>
                <span>Vercel</span>
                <span>Render</span>
              </div>
            </div>

            <div className="skill-group">
              <span className="skill-group-index">05 / EXPRESSION</span>
              <h3>Motion & design</h3>
              <div className="skill-list">
                <span>GSAP</span>
                <span>CSS Animation</span>
                <span>Photoshop</span>
                <span>Illustrator</span>
              </div>
            </div>
          </div>
        </section>


        {/* ==========================================
            PROJECTS
        ========================================== */}

        <PortfolioProjects />
        {/* <section id="projects" className="projects-section">
          <div className="projects-heading">
            <div className="section-heading">
              <p className="eyebrow">SELECTED WORK / 03 PROJECTS</p>
              <h2>Ideas turned into <span>real things.</span></h2>
              <p>
                A selection of projects I've worked on while exploring ideas,
                solving practical problems, and growing as a developer.
              </p>
            </div>
            <span className="projects-side-note">DESIGNING · BUILDING · LEARNING</span>
          </div>

          <div className="projects-grid">
            <article className="project-card project-card-featured reveal">
              <div className="project-image">
                <img
                  src={engineeringAiDss}
                  alt="Engineering AI Decision Support System dashboard"
                />
                <span className="project-image-label">FEATURED PROJECT</span>
              </div>

              <div className="project-content">
                <div className="project-meta">
                  <span className="project-number">01</span>
                  <span className="project-category">DECISION SUPPORT · FULL-STACK</span>
                </div>

                <h3>Engineering AI Decision Support System</h3>

                <p>
                  A decision-support platform for evaluating chemical engineering
                  service-firm opportunities in Nigeria's oil and gas sector.
                  It uses AHP to calculate criteria weights and TOPSIS to rank
                  the available alternatives.
                </p>

                <div className="project-tech">
                  <span>JavaScript</span>
                  <span>Node.js</span>
                  <span>Express.js</span>
                  <span>AHP</span>
                  <span>TOPSIS</span>
                </div>

                <div className="project-links">
                  <a
                    href="https://engineer-ai-dss-we9h.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore project <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href="https://github.com/justndidi/EngineerAI-DSS"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source code <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>

            <article className="project-card reveal">
              <div className="project-image">
                <img
                  src={newGeneration}
                  alt="New Generation music discovery website"
                />
              </div>

              <div className="project-content">
                <div className="project-meta">
                  <span className="project-number">02</span>
                  <span className="project-category">MUSIC DISCOVERY · FRONTEND</span>
                </div>

                <h3>New Generation</h3>

                <p>
                  A music-discovery website designed to help visitors explore
                  music genres and artists through an engaging, responsive
                  interface with interactive artist details.
                </p>

                <div className="project-tech">
                  <span>HTML</span>
                  <span>CSS</span>
                  <span>JavaScript</span>
                  <span>Bootstrap</span>
                </div>

                <div className="project-links">
                  <a
                    href="https://new-generation-ashen.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore project <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href="https://github.com/justndidi/new-generation"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source code <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>

            <article className="project-card reveal">
              <div className="project-image">
                <img
                  src={nodeclassProject}
                  alt="Nodeclass full-stack web application"
                />
              </div>

              <div className="project-content">
                <div className="project-meta">
                  <span className="project-number">03</span>
                  <span className="project-category">WEB APPLICATION · FULL-STACK</span>
                </div>

                <h3>Nodeclass Project</h3>

                <p>
                  A full-stack application demonstrating authentication,
                  REST API development, CRUD operations, validation,
                  middleware, and database integration.
                </p>

                <div className="project-tech">
                  <span>JavaScript</span>
                  <span>Node.js</span>
                  <span>Express.js</span>
                  <span>MongoDB</span>
                  <span>REST API</span>
                </div>

                <div className="project-links">
                  <a
                    href="https://nodeclass-project.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore project <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href="https://github.com/justndidi/Nodeclass-project"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source code <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section> */}


        {/* ==========================================
            EXPERIENCE
        ========================================== */}

        <section
          id="experience"
          className="experience-section"
        >

          <div className="experience-header">

            <div>

              <p className="eyebrow">
                EXPERIENCE
              </p>

              <h2>
                Where I've worked
              </h2>

            </div>

            <p className="experience-intro">
              Practical experience building frontend and
              backend applications during my software
              development training.
            </p>

          </div>


          <div className="experience-item">

            <div className="experience-date">
              May 11, 2026 — October 20, 2026
            </div>


            <div className="experience-main">

              <div className="experience-title">

                <div>

                  <h3>
                    HiiT Plc
                  </h3>

                  <p>
                    Software Engineer Intern · On-site
                  </p>

                </div>

                <span className="experience-location">
                  Lagos, Nigeria
                </span>

              </div>


              <ul>

                <li>
                  Developed practical frontend projects
                  using HTML, CSS, and JavaScript, focusing
                  on responsive and user-friendly interfaces.
                </li>

                <li>
                  Developed backend functionality using
                  Node.js and Express.js, including API
                  development and server-side application logic.
                </li>

                <li>
                  Worked with MongoDB for database integration
                  and CRUD operations.
                </li>

                <li>
                  Built and tested REST APIs and connected
                  frontend applications to backend services.
                </li>

                <li>
                  Used Git and GitHub for version control and
                  software development workflows.
                </li>

              </ul>


              <div className="experience-skills">

                <span>JavaScript</span>
                <span>Node.js</span>
                <span>Express.js</span>
                <span>MongoDB</span>
                <span>Git</span>
                <span>REST APIs</span>

              </div>

            </div>

          </div>

        </section>


        {/* ==========================================
            CONTACT
        ========================================== */}

        <section
  id="contact"
  className="contact-section"
>
  <div className="contact-inner reveal">

    <div className="contact-content">

      <p className="eyebrow">
        LET'S CONNECT
      </p>

      <h2>
        Have a project in mind?
      </h2>

      <p className="contact-text">
        I'm open to remote opportunities,
        collaborations, and interesting software
        projects. Let's build something meaningful
        together.
      </p>

      <div className="contact-details">

        <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=jegbefumejoy0@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  className="contact-detail"
>
          <span className="contact-icon">✉</span>

          <span>
            <small>Email</small>
            jegbefumejoy0@gmail.com
          </span>
        </a>


        <a
          href="https://github.com/justndidi"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-detail"
        >
          <span className="contact-icon">GH</span>

          <span>
            <small>GitHub</small>
            github.com/justndidi
          </span>
        </a>


        <a
          href="https://www.linkedin.com/in/joy-jegbefume-96ba89391"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-detail"
        >
          <span className="contact-icon">in</span>

          <span>
            <small>LinkedIn</small>
            linkedin.com/in/joy-jegbefume-96ba89391
          </span>
        </a>

      </div>

    </div>


    <div className="contact-action">

      <p>
        Have an idea?
      </p>

      <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=jegbefumejoy0@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  className="contact-button"
>
  Send Me a Message →
</a>

    </div>

  </div>
</section>


        {/* ==========================================
            FOOTER
        ========================================== */}

        <footer className="footer">

          <div className="footer-name">
            Joy Jegbefume
          </div>


          <div className="footer-links">

            <a
              href="https://github.com/justndidi"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/joy-jegbefume-96ba89391"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>

            <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=jegbefumejoy0@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  
>
              Email
            </a>

          </div>


          <p className="footer-copy">
            © 2026 Joy Jegbefume. Built with React.
          </p>

        </footer>

      </main>


      {/* ==========================================
          SCROLL TO TOP BUTTON
      ========================================== */}

      <button
        className={`scroll-top-button ${
          showScrollTop ? 'scroll-top-visible' : ''
        }`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>

    </div>
  )
}

export default App