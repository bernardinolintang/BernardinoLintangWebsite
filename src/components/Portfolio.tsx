import { useEffect, useState } from "react";
import "../apple.css";

/* Small reveal-on-scroll hook (no dependencies) */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("al-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".al-rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* Expandable long description */
function Desc({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 260;
  return (
    <>
      <p className={"al-desc" + (long && !open ? " clamped" : "")}>{text}</p>
      {long && (
        <button className="al-link al-more" onClick={() => setOpen(!open)}>
          {open ? "Show less" : "Show more"}
        </button>
      )}
    </>
  );
}

export default function Portfolio() {
  useReveal();
  const [menu, setMenu] = useState(false);
  const [showResume, setShowResume] = useState(false);

  /* Scroll-progress bar: write scroll fraction into a CSS var */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      doc.style.setProperty("--al-scroll", max > 0 ? String(doc.scrollTop / max) : "0");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Close the resume modal on Escape, and lock body scroll while open */
  useEffect(() => {
    if (!showResume) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowResume(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [showResume]);

  /* ======================= DATA ======================= */

  const experiences = [
    {
      title: "Data Engineer Intern",
      company: "Home Team Science and Technology Agency (HTX)",
      period: "May 2026 to Aug 2026 · Singapore",
      logo: "/htx-logo.png",
      bullets: [
        "Gathering pipeline requirements from data scientists and AI engineers, translating them into transform-and-load scripts for the centralised data platform.",
        "Maintaining IaC workflows for CI/CD and data pipelines; building monitoring tools for pipeline health and data quality.",
        "Collaborating on frontend/backend integration to connect deployed AI models with training data sources.",
      ],
      tags: ["Python", "SQL", "IaC", "CI/CD", "Docker"],
    },
    {
      title: "GenAI Product Development Intern",
      company: "CPF Board",
      period: "Jan 2026 to May 2026 · Singapore",
      logo: "/cpf-logo.png",
      bullets: [
        "Designed and deployed LLM-assisted workflows that improved response quality, consistency, and operational efficiency across the CPF Contact Centre.",
        "Built and optimised RAG pipelines integrated with CPF's internal knowledge bases, applying prompt engineering and evaluation techniques to ensure policy-aligned, accurate responses.",
        "Established evaluation frameworks to measure model accuracy, retrieval precision, and alignment with business requirements.",
      ],
      tags: ["Python", "FastAPI", "OpenAI", "RAG", "Next.js", "PostgreSQL", "MongoDB"],
    },
    {
      title: "AI Engineer Intern",
      company: "Crayon Data",
      period: "Dec 2025 to Jan 2026 · Chennai, India",
      logo: "/crayon-data-logo.jpg",
      bullets: [
        "Designed and shipped an LLM ingestion pipeline converting unstructured offer data into structured, production-ready datasets, cutting manual processing effort by 70%+.",
        "Built validation and regeneration layers enforcing schema consistency, mandatory fields, and safe re-generation for business users.",
        "Implemented deduplication, deterministic ID assignment, and referential integrity logic to support scalable ingestion across markets.",
      ],
      tags: ["Python", "LLM", "Agentic AI", "Production Integration"],
    },
    {
      title: "Operations (Data Science) Intern",
      company: "Superbank",
      period: "May 2025 to Aug 2025 · Jakarta, Indonesia",
      logo: "/superbank-logo.webp",
      bullets: [
        "Built Snowflake SQL pipelines and Python workflows to flag suspicious account activity, reducing potential fraud exposure by 20%.",
        "Engineered 200+ detection features (device mismatch, high-frequency bursts, OS anomalies) fed into the production anomaly model.",
        "Optimised queries on 50M+ record datasets by modularising complex scripts, improving processing efficiency by ~40%.",
        "Collaborated directly with risk analysts and business stakeholders to align pipeline outputs with operational decision-making.",
      ],
      tags: ["Python", "SQL", "Snowflake"],
    },
  ];

  const competitions = [
    {
      title: "BlazeReport: SCDF × Dell Lifesavers Innovation Challenge",
      badge: "1st Runner-Up · 87 teams",
      date: "Jul 2026",
      description:
        "Agentic fire-investigation report generator for SCDF. Built MERaLiON multilingual speech transcription for investigator interviews, LLM-drafted structured incident reports, and automated fire-pattern analysis, deployed on OpenShift clusters. Developed through direct iteration with SCDF fire investigators, with the live demo transcribing multilingual (including Cantonese) testimony in real time.",
      tags: ["MERaLiON", "LLM", "OpenShift", "Agentic AI", "Speech-to-Text"],
      image: "/blazereport-scdf.jpg",
    },
    {
      title: "NUS Datathon 2026: Company Intelligence & AI Analytics",
      badge: "1st Place · 76 teams",
      date: "Feb 2026",
      description:
        "Problem: Corporate benchmarking platforms rely on static industry codes and global averages, making it difficult to contextualise firm performance or detect early operational risk.\n\nApproach: Built an end-to-end company intelligence system using feature engineering and mixed-type clustering (K-Prototypes) to segment 8,559 companies across 3 countries. Engineered 20+ operational and IT-related features and validated cluster quality using silhouette score, PCA, and statistical profiling. Developed a constrained AI Analyst using Llama 3.3 70B (Groq) with retrieval-augmented prompting and strict guardrails for grounded, non-hallucinatory explanations through a React + FastAPI dashboard.\n\nResult: 1st of 76 teams. Interpretable, data-grounded benchmarking that turns raw firmographic data into defensible strategic insight.",
      tags: ["K-Prototypes", "Llama 3.3 70B", "scikit-learn", "PCA", "FastAPI", "React", "Docker"],
      image: "/nus-datathon-2026.jpg",
    },
    {
      title: "Micron × AISG National AI Student Challenge: SmartLogParser",
      badge: "2nd Place · 17 teams",
      date: "May 2026",
      description:
        "Problem: Semiconductor fabs run hundreds of machines, each producing logs in different formats (JSON, XML, CSV, syslog, key-value, plain text, binary) with no shared schema. Engineers manually interpret each vendor's syntax to diagnose faults, which is slow and brittle.\n\nApproach: Built SmartLogParser, an end-to-end pipeline that ingests, normalises, and structures tool logs across all major formats, with an LLM fallback layer (Groq + Ollama) for novel or malformed inputs. Implemented SHA-256 deduplication, a dead-letter queue, stability scoring, and golden-run baseline comparison for automatic drift detection. FastAPI + SQLAlchemy backend, React 18 + TypeScript frontend, Supabase PostgreSQL in production.\n\nResult: 2nd of 17 teams. Turns hours of manual triage into an automated intelligence layer ready for anomaly detection and yield analysis.",
      tags: ["FastAPI", "SQLAlchemy", "React", "Supabase", "Groq API", "Ollama", "ETL"],
      image: "/national%20ai%20challenge%202nd%20place.jpg",
      liveDemo: "https://smart-log-parser.vercel.app/",
    },
    {
      title: "MeDo Vibe Coding Hackathon: BTO Lens",
      badge: "Top 3 · 40 teams",
      date: "Apr 2026",
      description:
        "Problem: BTO applicants make one of the largest financial decisions of their lives using static PDFs, flat floor plans, and forum threads, with no way to visualise what living in an unbuilt site will actually feel like.\n\nApproach: Built BTO Lens, an AI decision-support platform. Engineered a procedural 3D building-massing engine in Three.js that auto-generates block geometry from HDB storey count and site footprint, hour-by-hour sunlight/shadow simulation via SunCalc.js, a toggleable amenity layer via OneMap API, and a rules-based liveability scoring engine (0 to 100) re-weighted from natural-language input parsed by Claude API. Added a two-project side-by-side comparison with AI-generated trade-off narrative.\n\nResult: Top 3 of 40 teams. Turns a $500,000 housing decision from guesswork into a grounded, interactive experience.",
      tags: ["React", "Three.js", "SunCalc.js", "OneMap API", "Claude API", "Node.js"],
      image: "/MeDO%20Hackathon%20Group%20Photo.jpg",
      liveDemo: "https://app-b1iajvpvw0zl.appmedo.com/",
    },
    {
      title: "SDS Hackathon 2025: Medical Insurance Cost Prediction",
      badge: "Top 3 · 40 teams",
      date: "Nov 2025",
      description:
        "Problem: Predict medical insurance costs accurately while understanding feature impact and ensuring fairness across demographic subgroups.\n\nApproach: Engineered interaction features (smoker × BMI, smoker × age); benchmarked Ridge / Lasso / Elastic Net / Random Forest / XGBoost via cross-validation and grid search. Used AIC and SHAP for interpretability, and ran Equalised Odds fairness analysis across sex, region, and smoker groups.\n\nResult: R² > 0.85, Top 3 of 40 teams. Identified smoking status and BMI as dominant cost predictors with stable residuals and interpretable SHAP patterns.",
      tags: ["scikit-learn", "XGBoost", "SHAP", "Random Forest", "Fairness Analysis"],
      image: "/nus-hackathon-2025.jpg",
      imgPos: "center 20%",
    },
    {
      title: "NUS Datathon 2025: Financial Advisory Matching",
      badge: "Top 5 · 40 teams",
      date: "Feb 2025",
      description:
        "Problem: An insurance company's advisor-client matching was manual and suboptimal, leading to poor conversion and engagement.\n\nApproach: Built a hybrid recommendation model combining SVD-based collaborative filtering with content-based filtering (cosine similarity), trained on historical policy success rates, client profiles, and advisor expertise.\n\nResult: Top 5 of 40 teams. Measurable lift in match quality vs. baseline, improving personalisation and projected policy conversion.",
      tags: ["scikit-learn", "SVD", "Collaborative Filtering", "Cosine Similarity"],
      image: "/nus-datathon.jpg",
    },
  ];

  const projects = [
    {
      title: "Careerlingo: Duolingo-style AI Career Coach",
      date: "LinkedIn Career Trailblazer Camp · Top 5 Finalist",
      description:
        "Bite-size daily lessons that coach job-seekers through their career search, instead of one-off resume reviews. Built with team LingoLabs (Jovan, Ray, Kyle).",
      tags: ["AI", "LLM", "Product", "EdTech"],
      image: "/careerlingo.jpg",
      liveDemo: "https://careerlingo-mvp-web-1781622317264.chatand.build/",
    },
    {
      title: "CoverCraft: AI Cover Letter Generator",
      date: "Mar 2026",
      description:
        "AI tool that writes personalised cover letters in seconds. Upload your resume to auto-fill your profile, paste a job description, and it generates a tailored letter for you.",
      tags: ["LLM", "Groq", "TypeScript", "AI Agent"],
      image: "/Cover Letter Maker Image.jpg",
      liveDemo: "https://cover-letter-maker-one.vercel.app/",
      github: "https://github.com/bernardinolintang/Cover-Letter-Maker",
    },
    {
      title: "AF Tracker SG",
      date: "Apr 2026",
      description:
        "Full-stack gym-visit tracker for every Anytime Fitness outlet in Singapore. Browse all AF locations on an interactive Google Map, mark gyms as visited, and track progress across regions with real-time stats, regional breakdowns, and a shareable branded progress card. Deployed on Cloudflare Pages with Supabase for auth and data.",
      tags: ["React", "TypeScript", "Supabase", "Google Maps", "Cloudflare"],
      image: "/AF Tracker Image.jpg",
      liveDemo: "https://af-journey-map.vercel.app/",
      github: "https://github.com/bernardinolintang/af-journey-map",
    },
    {
      title: "Hybrid CNN + RAG Framework for Dermatology Decision Support",
      date: "IS460 Machine Learning · Aug to Nov 2024",
      description:
        "Hybrid Retrieval-Augmented Generation framework integrating CNNs for skin-disease diagnosis. Image classification for visual analysis, retrieval-augmented generation for detailed medical advice from dermatology research. Tackled class imbalance with regularisation, used pre-trained ResNet-50 and EfficientNetV2, and integrated an advanced embedding model. Implemented Agentic Chunking for dynamic retrieval; outperformed baseline models in accuracy.",
      tags: ["TensorFlow", "HuggingFace", "EfficientNetV2M", "ResNet-50", "PubMedBERT"],
      image: "/IS460-machine-learning-presentation.jpg",
    },
    {
      title: "Multi-Model Approach for DNA-Binding Protein Classification",
      date: "IT1244 · Aug to Nov 2024",
      description:
        "Built and benchmarked Logistic Regression, Naive Bayes, Random Forest, and CNN classifiers for DNA-binding protein prediction. Engineered features from k-mer frequencies, amino acid composition, and sequence embeddings; addressed class imbalance with weighted loss and hyperparameter tuning. The CNN outperformed all baselines on sequence-based feature capture.",
      tags: ["scikit-learn", "TensorFlow", "CNN", "Bioinformatics"],
      image: "/it1244.png",
      github: "https://github.com/bernardinolintang/IT1244-Project-DNA-Binding-Protein",
    },
    {
      title: "Academic Question Bank & Assessment Platform",
      date: "DSA3101 · Aug to Nov 2025",
      description:
        "Question Bank System for ST1131: Flask backend, Streamlit frontend, PostgreSQL database, supporting efficient search, filtering, and assembly creation by difficulty and course type. Modular ingestion using pdfplumber and python-docx, a version-tracking system for questions, and AI-assisted recommendations based on past usage. Built a Flask REST API for ingestion, search, and assembly, with full-text search and metadata tracking.",
      tags: ["Flask", "PostgreSQL", "Streamlit", "pdfplumber", "AI Recommendations"],
      image: "/dsa3101-group.jpg",
    },
    {
      title: "Emotional Characteristics of Taylor Swift's Albums & Their Reception",
      date: "DSA2101 · Oct to Nov 2024",
      description:
        "Analysed Taylor Swift's full discography in R to quantify how emotional attributes (valence, key, mode) correlate with critical and fan reception. Built reproducible EDA pipelines on Metacritic scores and audio features, identifying statistically significant patterns between musical positivity and album performance, with publication-ready visualisations.",
      tags: ["R", "Data Science", "Music Analysis", "Metacritic API"],
      image: "/dsa2101.jpg",
      github: "https://github.com/bernardinolintang/DSA2101-Taylor-Swift-Music-Analysis",
    },
  ];

  const skills: Record<string, string[]> = {
    "Core Stack": ["Python", "SQL", "TypeScript", "FastAPI", "Node.js", "React", "Next.js"],
    "Applied ML & AI": ["OpenAI API", "LangChain", "RAG", "Prompt Engineering", "scikit-learn", "TensorFlow", "XGBoost", "SHAP"],
    "Data Engineering & Infra": ["Snowflake", "PostgreSQL", "MongoDB", "Docker", "AWS", "IaC", "CI/CD"],
    "Analysis & Visualisation": ["Pandas", "NumPy", "R", "Tableau", "Power BI"],
  };

  const events = [
    {
      title: "Curriculum Executive at NUS Product Club",
      date: "Aug 2025 to May 2026",
      description:
        "Presented an internal A/B testing analysis session at Product Club, showcasing statistical testing and product insights for feature-rollout evaluation.",
      tags: ["Product Management", "A/B Testing", "Data Analytics", "Public Speaking"],
      image: "/me-presenting.jpg",
    },
    /* Hidden for now — to restore, uncomment this card.
    {
      title: "Marketing Head for Science Club Welfare",
      date: "Oct 2024 to Aug 2025",
      description:
        "Led branding and marketing for the annual Sponsorship Booklet, overseeing design consistency, partner engagement, and promotional strategy.",
      tags: ["Leadership", "Marketing", "Sponsorship", "Strategy"],
      image: "/science-welfare-picture.jpg",
    },
    */
    {
      title: "Publicity & Creative Portfolio",
      date: "Ongoing",
      description:
        "Photography and videography for events, clubs, and campaigns. Explore the creative portfolio.",
      tags: ["Photography", "Videography", "Canva"],
      image: "/Home page.jpg",
      link: "https://www.canva.com/design/DAGP3qLlhuY/L8drQBMy-80nV-wVlQbNZg/edit",
    },
  ];

  const testimonials = [
    {
      name: "Crayon Data",
      title: "AI Engineer Intern · 2025",
      image: "/crayondata_logo.jpg",
      text: "He took on one of Crayon Data's most complex and high-impact problem spaces — the Agentic Offer Management Portal — and handled it with depth, seriousness, and real ownership. He stood out as a builder who genuinely wants to understand the problem deeply before jumping to solutions. His thinking consistently reflected strong systems awareness: he treated AI as a constrained tool that needs checks, auditability, and human-in-the-loop design — not as magic.",
    },
    {
      name: "Superbank",
      title: "Operations (Data Science) Intern · 2025",
      image: "/superbank-logo.webp",
      text: "Bernard has made great strides in technical skills, diving deeper into Python, SQL, and machine learning workflows. He's getting much better at connecting technical findings to business insights. His recent presentations have shown a clearer understanding of the 'why' behind the numbers, helping stakeholders see the business value of his work.",
    },
    {
      name: "11C4I",
      title: "Army Reconnaissance Trooper · 2021–2023",
      image: "/11c4i-logo.png",
      text: "His friendly character allowed him to overcome cultural differences with his foreign counterparts. CFC Bernardino always takes the initiative to seek his commanders and peers for advice to improve himself. He would certainly be a valuable member to any team that he may find himself part of in the future.",
    },
    {
      name: "Catholic Junior College",
      title: "Student · 2019–2020",
      image: "/cj-logo.jpg",
      text: "Bernardino consistently carried himself as a diligent and self-directed student who often seeks new opportunities to grow. His analytical mind and openness to experiences enable him to push his limits and achieve his intended goals.",
    },
  ];

  const NAV = [
    ["About", "about"],
    ["Experience", "experience"],
    ["Competitions", "competitions"],
    ["Projects", "projects"],
    ["Community", "community"],
    ["Contact", "contact"],
  ];

  /* ======================= RENDER ======================= */
  return (
    <div className="al">
      {/* SCROLL PROGRESS */}
      <div className="al-progress" aria-hidden="true" />

      {/* NAV */}
      <nav className="al-nav">
        <a className="al-brand" href="#top">
          <img src="/Logo.png" alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
          Bernardino Lintang
        </a>
        <div className={"al-nav-links" + (menu ? " open" : "")}>
          {NAV.map(([label, id]) => (
            <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </div>
        <button className="al-nav-toggle" aria-label="Menu" onClick={() => setMenu(!menu)}>
          ☰
        </button>
      </nav>

      {/* HERO */}
      <header className="al-hero al-wrap" id="top">
        <img className="al-avatar al-rv" src="/formal-picture.JPG" alt="Bernardino Lintang" />
        <div className="al-eyebrow al-rv">BERNARDINO LINTANG · AI &amp; DATA ENGINEER</div>
        <h1 className="al-rv">
          I ship AI systems that <span className="al-grad-text">survive real users.</span>
        </h1>
        <p className="al-rv">
          RAG and agentic systems deployed inside CPF's Contact Centre, a fintech fraud pipeline, and
          national AI competitions. Four internships across government, fintech, and enterprise AI.
        </p>
        <div className="al-cta-row al-rv">
          <a className="al-btn" href="#contact">Get in touch</a>
          <button type="button" className="al-link" onClick={() => setShowResume(true)}>View resume</button>
        </div>

        <div className="al-stats">
          <div className="al-stat al-rv"><b>1st / 76</b><span>NUS Datathon 2026</span></div>
          <div className="al-stat al-rv"><b>2nd / 87</b><span>SCDF × Dell Lifesavers Challenge</span></div>
          <div className="al-stat al-rv"><b>70%+</b><span>manual processing reduced,<br />production LLM pipeline</span></div>
          <div className="al-stat al-rv"><b>~20%</b><span>fraud exposure reduced,<br />fintech detection pipeline</span></div>
        </div>
      </header>

      {/* ABOUT */}
      <section className="al-section al-alt" id="about">
        <div className="al-wrap">
          <h2 className="al-rv">About. <small>Constrained AI, built to deploy.</small></h2>
          <div className="al-about-grid">
            <div className="al-about-text al-rv">
              <p>
                I build production AI systems, from LLM-powered ingestion pipelines that replace manual
                workflows to RAG architectures serving policy-aligned responses at scale.
              </p>
              <p>
                My work sits at the intersection of applied ML, data engineering, and GenAI product
                development. I treat every model as a constrained tool that needs schema enforcement,
                evaluation, and failure modes designed before the first line of inference code.
              </p>
            </div>
            <div className="al-rv">
              {Object.entries(skills).map(([group, items]) => (
                <div className="al-skill-group" key={group}>
                  <h4>{group}</h4>
                  <div className="al-tags">
                    {items.map((s) => (
                      <span className="al-tag" key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="al-section" id="experience">
        <div className="al-wrap">
          <h2 className="al-rv">Experience. <small>Production, not prototypes.</small></h2>
          <div className="al-stack">
            {experiences.map((x) => (
              <div className="al-card al-rv" key={x.title + x.company}>
                <div className="al-meta">
                  <div className="al-meta-main">
                    {x.logo && (
                      <img
                        className="al-exp-logo"
                        src={x.logo}
                        alt={x.company + " logo"}
                        loading="lazy"
                        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                      />
                    )}
                    <div>
                      <h3>{x.title}</h3>
                      <div className="al-org">{x.company}</div>
                    </div>
                  </div>
                  <div className="al-period">{x.period}</div>
                </div>
                <ul className="al-bullets">
                  {x.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <div className="al-tags">
                  {x.tags.map((t) => <span className="al-tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPETITIONS */}
      <section className="al-section al-alt" id="competitions">
        <div className="al-wrap">
          <h2 className="al-rv">Competitions. <small>Built to win.</small></h2>
          <div className="al-grid-2">
            {competitions.map((c) => (
              <div className="al-card al-media-card al-rv" key={c.title}>
                {c.image && <img src={c.image} alt={c.title} loading="lazy" style={(c as any).imgPos ? { objectPosition: (c as any).imgPos } : undefined} />}
                <div className="al-media-body">
                  <span className="al-badge">{c.badge}</span>
                  <h3>{c.title}</h3>
                  <div className="al-date">{c.date}</div>
                  <Desc text={c.description} />
                  <div className="al-tags">
                    {c.tags.map((t) => <span className="al-tag" key={t}>{t}</span>)}
                  </div>
                  {c.liveDemo && (
                    <div className="al-links-row">
                      <a className="al-link" href={c.liveDemo} target="_blank" rel="noreferrer">Live demo</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="al-section" id="projects">
        <div className="al-wrap">
          <h2 className="al-rv">Projects. <small>Shipped and live.</small></h2>
          <div className="al-grid-2">
            {projects.map((p) => (
              <div className="al-card al-media-card al-rv" key={p.title}>
                {p.image && <img src={p.image} alt={p.title} loading="lazy" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />}
                <div className="al-media-body">
                  <h3>{p.title}</h3>
                  <div className="al-date">{p.date}</div>
                  <Desc text={p.description} />
                  <div className="al-tags">
                    {p.tags.map((t) => <span className="al-tag" key={t}>{t}</span>)}
                  </div>
                  {(p.liveDemo || p.github) && (
                    <div className="al-links-row">
                      {p.liveDemo && <a className="al-link" href={p.liveDemo} target="_blank" rel="noreferrer">Live demo</a>}
                      {p.github && <a className="al-link" href={p.github} target="_blank" rel="noreferrer">GitHub</a>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="al-section al-alt" id="community">
        <div className="al-wrap">
          <h2 className="al-rv">Community. <small>Beyond the code.</small></h2>
          <div className="al-grid-2">
            {events.map((ev) => (
              <div className="al-card al-media-card al-rv" key={ev.title}>
                {ev.image && <img src={ev.image} alt={ev.title} loading="lazy" />}
                <div className="al-media-body">
                  <h3>{ev.title}</h3>
                  <div className="al-date">{ev.date}</div>
                  <Desc text={ev.description} />
                  <div className="al-tags">
                    {ev.tags.map((t) => <span className="al-tag" key={t}>{t}</span>)}
                  </div>
                  {ev.link && (
                    <div className="al-links-row">
                      <a className="al-link" href={ev.link} target="_blank" rel="noreferrer">View portfolio</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="al-section" id="testimonials">
        <div className="al-wrap">
          <h2 className="al-rv">What people say.</h2>
          <div className="al-testis al-rv">
            {testimonials.map((t) => (
              <div className="al-card al-testi" key={t.name}>
                <div className="al-testi-head">
                  <img src={t.image} alt={t.name} loading="lazy" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                  <div>
                    <b>{t.name}</b>
                    <span>{t.title}</span>
                  </div>
                </div>
                <p className="al-desc">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="al-section al-contact" id="contact">
        <div className="al-wrap">
          <h2 className="al-rv">Let's talk.</h2>
          <p className="al-rv">
            Graduating mid-2027. Open to AI, ML, and Data Engineering internships now and graduate roles
            for 2027. If you're building production AI systems and need someone who ships, reach out.
          </p>
          <div className="al-cta-row al-rv">
            <a className="al-btn" href="mailto:lintangbernardino@gmail.com">Email me</a>
            <a className="al-link" href="https://github.com/bernardinolintang" target="_blank" rel="noreferrer">GitHub</a>
            <a className="al-link" href="https://www.linkedin.com/in/bernardino-lintang" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </section>

      {/* RESUME ACCESS MODAL */}
      {showResume && (
        <>
          <div className="al-modal-overlay" onClick={() => setShowResume(false)} />
          <div className="al-modal" role="dialog" aria-modal="true" aria-labelledby="al-resume-title">
            <button className="al-modal-close" aria-label="Close" onClick={() => setShowResume(false)}>×</button>
            <div className="al-modal-eyebrow">🔒 Resume access</div>
            <h3 id="al-resume-title">Let's connect first</h3>
            <p>
              I share my resume by request. Drop me an email or a LinkedIn message and I'll
              send it right over. Both buttons below open with a message already drafted for you.
            </p>
            <div className="al-modal-actions">
              <a
                className="al-btn"
                href="mailto:lintangbernardino@gmail.com?subject=Resume%20Request&body=Hi%20Bernardino%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20request%20a%20copy%20of%20your%20resume.%0A%0AThank%20you!"
              >
                ✉️ Email me
              </a>
              <a
                className="al-btn-outline"
                href="https://www.linkedin.com/messaging/compose/?recipient=bernardino-lintang&subject=Resume%20Request&body=Hi%20Bernardino%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20request%20a%20copy%20of%20your%20resume.%0A%0AThank%20you!"
                target="_blank"
                rel="noopener noreferrer"
              >
                Message on LinkedIn
              </a>
            </div>
          </div>
        </>
      )}

      <footer className="al-footer">© {new Date().getFullYear()} Bernardino Lintang</footer>
    </div>
  );
}
