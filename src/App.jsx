import { useEffect, useState } from 'react'
import './App.css'

import heroPortrait from './assets/hero-portrait.png'
import engineeringAiDss   from './assets/engineering-ai-dss.png'
import newGeneration from './assets/new-generation.png'
import nodeclassProject from './assets/nodeclass-project.png'

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

            <p className="eyebrow">
              SOFTWARE DEVELOPER
            </p>

            <h1>
              I build web
              <br />
              applications that
              <br />
              make <span>an impact.</span>
            </h1>

            <p className="hero-text">
              I'm Joy Jegbefume, a Computer Science student
              and full-stack developer. I enjoy turning ideas
              into real products using JavaScript, React,
              Node.js and MongoDB.
            </p>

            <div className="hero-buttons">

              <a
                href="#projects"
                className="primary-button"
              >
                View My Projects →
              </a>

              <a
                href="/Jegbefume_Joy_Ndidi_CV.pdf"
                download
                className="secondary-button"
              >
                Download CV ↓
              </a>

            </div>

            <div className="social-links">

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

          </div>


          <div className="hero-image">

            <img
              src={heroPortrait}
              alt="Joy Jegbefume, Software Developer"
            />

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

            <p className="eyebrow">
              ABOUT
            </p>

            <h2>
              More about me
            </h2>

          </div>


          <div className="about-content">

            <div className="about-text">

              <p>
                I'm a Computer Science undergraduate at the
                Federal University of Petroleum Resources,
                Effurun, with hands-on experience in frontend
                and backend web development.
              </p>

              <p>
                I enjoy building responsive web applications,
                working with APIs and databases, and turning
                ideas into practical software. I'm particularly
                interested in creating products that are simple
                to use and solve real problems.
              </p>

              <p>
                Through my software development training at
                HiiT Plc and my personal projects, I've gained
                practical experience working across both
                frontend and backend development.
              </p>

              <a
                href="#contact"
                className="primary-button"
              >
                Get in touch →
              </a>

            </div>


            <div className="about-highlights">

              <div className="highlight">

                <span>01</span>

                <div>
                  <h3>Frontend</h3>

                  <p>
                    Building responsive and user-friendly
                    interfaces.
                  </p>
                </div>

              </div>


              <div className="highlight">

                <span>02</span>

                <div>
                  <h3>Backend</h3>

                  <p>
                    Developing APIs, server-side logic and
                    authentication.
                  </p>
                </div>

              </div>


              <div className="highlight">

                <span>03</span>

                <div>
                  <h3>Database</h3>

                  <p>
                    Working with MongoDB and application data.
                  </p>
                </div>

              </div>


              <div className="highlight">

                <span>04</span>

                <div>
                  <h3>Always Learning</h3>

                  <p>
                    Continuously improving my development
                    skills.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==========================================
            SKILLS
        ========================================== */}

        <section className="skills-section">

          <div className="skills-header">

            <div>

              <p className="eyebrow">
                SKILLS
              </p>

              <h2>
                Technologies I work with
              </h2>

            </div>

            <p className="skills-note">
              Always learning more →
            </p>

          </div>


          <div className="skills-grid">

            <div className="skill-group">

              <h3>Frontend</h3>

              <div className="skill-list">

                <span>HTML</span>
                <span>CSS</span>
                <span>JavaScript</span>
                <span>React</span>
                <span>Bootstrap</span>

              </div>

            </div>


            <div className="skill-group">

              <h3>Backend</h3>

              <div className="skill-list">

                <span>Node.js</span>
                <span>Express.js</span>
                <span>REST APIs</span>

              </div>

            </div>


            <div className="skill-group">

              <h3>Database</h3>

              <div className="skill-list">

                <span>MongoDB</span>

              </div>

            </div>


            <div className="skill-group">

              <h3>Tools</h3>

              <div className="skill-list">

                <span>Git</span>
                <span>GitHub</span>
                <span>VS Code</span>

              </div>

            </div>

          </div>

        </section>


        {/* ==========================================
            PROJECTS
        ========================================== */}

        <section id="projects" className="projects-section">
  <div className="section-heading reveal">
    <span className="section-label">MY WORK</span>
    <h2>Projects I've built.</h2>
    <p>
      A selection of projects where I've applied my frontend and backend
      development skills to build practical web applications.
    </p>
  </div>

  <div className="projects-grid">

    {/* Engineering AI DSS */}
    <article className="project-card reveal">
      <div className="project-image">
        <img
          src={engineeringAiDss}
          alt="Engineering AI Decision Support System"
        />
      </div>

      <div className="project-content">
        <span className="project-number">01</span>

        <h3>Engineering AI Decision Support System</h3>

        <p>
          An AI-powered decision support system designed to assist engineers
          in evaluating business opportunities in Nigeria's oil and gas
          sector using AHP and TOPSIS decision-making methods.
        </p>

        <div className="project-tech">
          <span>JavaScript</span>
          <span>Node.js</span>
          <span>Express.js</span>
          <span>REST API</span>
        </div>

        <div className="project-links">
  <a
    href="https://engineer-ai-dss-we9h.vercel.app/"
    target="_blank"
    rel="noopener noreferrer"
  >
    Live Demo ↗
  </a>

  <a
    href="https://github.com/justndidi/EngineerAI-DSS"
    target="_blank"
    rel="noopener noreferrer"
  >
    GitHub ↗
  </a>
</div>
      </div>
    </article>


    {/* New Generation */}
    <article className="project-card reveal">
      <div className="project-image">
        <img
          src={newGeneration}
          alt="New Generation website"
        />
      </div>

      <div className="project-content">
        <span className="project-number">02</span>

        <h3>New Generation</h3>

        <p>
          A full-stack web application built with a separate frontend and
          backend architecture, featuring authentication, CRUD operations,
          REST APIs, database integration, and administrative functionality.
        </p>

        <div className="project-tech">
          <span>JavaScript</span>
          <span>Node.js</span>
          <span>Express.js</span>
          <span>MongoDB</span>
          <span>Bootstrap</span>
        </div>

        <div className="project-links">
          <a
            href="https://new-generation-ashen.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Live Demo ↗
          </a>

          <a
            href="https://github.com/justndidi/new-generation"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </article>


    {/* Nodeclass */}
    <article className="project-card reveal">
      <div className="project-image">
        <img
          src={nodeclassProject}
          alt="Nodeclass full-stack project"
        />
      </div>

      <div className="project-content">
        <span className="project-number">03</span>

        <h3>Nodeclass Project</h3>

        <p>
          A full-stack application demonstrating user authentication,
          token handling, REST APIs, CRUD operations, database integration,
          validation, middleware, and structured backend architecture.
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
    Live Demo ↗
  </a>

  <a
    href="https://github.com/justndidi/Nodeclass-project"
    target="_blank"
    rel="noopener noreferrer"
  >
    GitHub ↗
  </a>
</div>
      </div>
    </article>

  </div>
</section>


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
              May 2026 — Present
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