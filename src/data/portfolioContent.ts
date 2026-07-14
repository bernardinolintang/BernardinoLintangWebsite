/* ==========================================================================
   SINGLE SOURCE OF TRUTH for portfolio content.
   Portfolio.tsx renders this data, and the "Ask about Bernard" chatbot
   answers from it — edit here and both stay in sync automatically.
   ========================================================================== */

export type CompetitionCard = {
  title: string; badge: string; date: string; description: string; tags: string[];
  image?: string; images?: string[]; imagePositions?: string[];
  subtitle?: string; pmTags?: string[]; angle?: string; liveDemo?: string;
  article?: string; articleLabel?: string;
  imgPos?: string;
  caseStudy?: {
    problem: string; users: string; role: string; productDecision: string;
    aiWorkflow: string; impact: string; learned: string;
  };
};

export type Experience = {
  title: string; company: string; period: string; logo?: string;
  bullets: string[]; angle?: string; tags: string[];
  links?: { href: string; label: string }[];
};

export type Project = {
  title: string; date: string; description: string; tags: string[]; image?: string; images?: string[];
  imagePositions?: string[];
  liveDemo?: string; github?: string; problem?: string; productDecision?: string; pmTags?: string[];
};

export type CommunityEvent = {
  title: string; date: string; description: string; tags: string[];
  image?: string; link?: string;
};

export type Testimonial = {
  name: string; title: string; image: string; text: string;
};

/* ---------- Profile (used by hero, contact, and the chatbot) ---------- */

export const profile = {
  name: "Bernardino Lintang",
  headline: "AI Product Builder",
  tagline: "I build AI products that survive real users.",
  intro:
    "I turn messy workflows into tested, deployable AI products, from product strategy and UX through to data and engineering.",
  about: [
    "I build production AI systems, from LLM-powered ingestion pipelines that replace manual workflows to RAG architectures serving policy-aligned responses at scale.",
    "My work sits at the intersection of applied ML, data engineering, and GenAI product development. I treat every model as a constrained tool that needs schema enforcement, evaluation, and failure modes designed before the first line of inference code.",
  ],
  education:
    "Undergraduate at the National University of Singapore (NUS), graduating mid-2027.",
  availability:
    "Graduating mid-2027. Open to AI, ML, and Data Engineering internships now and graduate roles for 2027.",
  email: "lintangbernardino@gmail.com",
  github: "https://github.com/bernardinolintang",
  linkedin: "https://www.linkedin.com/in/bernardino-lintang",
  stats: [
    { value: "1st / 76", label: "NUS Datathon 2026" },
    { value: "2nd / 87", label: "SCDF × Dell Challenge" },
    { value: "4+", label: "AI products shipped" },
    { value: "70%+", label: "Manual workflow reduced" },
  ],
};

/* ---------- Experience ---------- */

export const experiences: Experience[] = [
  {
    title: "Data Engineer Intern",
    company: "Home Team Science and Technology Agency (HTX)",
    period: "May 2026 to Aug 2026 · Singapore",
    logo: "/htx-logo.png",
    bullets: [
      "Built an enterprise RAG pipeline for NGINE/AIDATAPLATFORM, covering document/image ingestion, recursive chunking, embedding generation, Milvus vector retrieval, and reranking across text and image models.",
      "Validated BGE-M3, MXBAI, Qwen3, SigLIP, and reranker services; identified gateway reliability, vector schema, MLflow integration, and re-ingestion blockers affecting retrieval quality.",
    ],
    angle: "Translated data scientist and AI engineer needs into reliable pipelines they can build on, not just scripts.",
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
    angle: "Designed LLM workflows around what contact centre agents actually struggle with, balancing accuracy, trust, and policy alignment.",
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
    angle: "Turned a manual operational bottleneck into a tool business users can trust, with validation and safe regeneration built in.",
    tags: ["Python", "LLM", "Agentic AI", "Production Integration"],
    links: [
      { href: "https://chs.nus.edu.sg/2026/05/04/from-jakarta-to-chennai/", label: "NUS feature" },
    ],
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
    angle: "Built fraud signals around what risk analysts actually need to act on, not just model metrics.",
    tags: ["Python", "SQL", "Snowflake"],
    links: [
      { href: "https://www.linkedin.com/feed/update/urn:li:activity:7369261981427511296/", label: "LinkedIn post" },
      { href: "https://chs.nus.edu.sg/2026/05/04/from-jakarta-to-chennai/", label: "NUS feature" },
    ],
  },
];

/* ---------- Competitions ---------- */

export const competitions: CompetitionCard[] = [
  {
    title: "BlazeReport: SCDF × Dell Lifesavers Innovation Challenge",
    badge: "1st Runner-Up · 87 teams",
    date: "Jul 2026",
    subtitle: "AI fire investigation reporting system for SCDF officers.",
    description:
      "Built with Team Komodo Tech, BlazeReport helps officers turn voice notes, witness statements, scene photos, floor plans, and supporting documents into a structured fire investigation report. MERaLiON handles multilingual transcription (including Cantonese in the live demo), an LLM drafts the structured report, and fire pattern analysis runs on cluster, deployed on OpenShift.",
    tags: ["MERaLiON", "LLM", "OpenShift", "Agentic AI", "Speech-to-Text"],
    pmTags: ["AI PM", "Workflow Design", "Human in the loop", "GovTech", "User Testing"],
    images: [
      "/scdf%20(2).png",
      "/scdf%20(1).jpg",
      "/scdf%20(1).png",
      "/scdf%20(11).jpg",
      "/scdf%20(15).jpg",
      "/scdf%20(16).jpg",
      "/scdf%20(17).jpg",
      "/scdf%20(18).jpg",
      "/SCDF%20Hackathon%20Slides%20Start.jpg",
      "/SCDF%20Hackathon%20Slides%20End.jpg",
    ],
    imagePositions: [
      "center center",  // scdf (2) — main group photo
      "center 38%",     // scdf (1).jpg — portrait stage shot
      "center 45%",     // scdf (1).png — wide group on stage
      "center center",  // scdf (11) — presentation
      "center 75%",     // scdf (15) — portrait stage shot
      "center center",  // scdf (16) — team with awards
      "center 40%",     // scdf (17) — portrait stage shot
      "center center",  // scdf (18) — demo scene
      "center center",  // slides start
      "center center",  // slides end
    ],
    caseStudy: {
      problem:
        "Fire investigators capture evidence across many formats, from voice notes and photos to floor plans and burn charts. Then they spend hours rewriting and reconnecting everything into a final report.",
      users:
        "Tested with 20+ SCDF officers across frontline commanders, staff officers, and fire investigators.",
      role: "Team lead · Product strategy · Workflow design · AI integration · Pitch",
      productDecision:
        "Designed a human in the loop workflow where AI drafts, but officers review, correct, and approve before export. That way the tool speeds officers up without replacing their judgement.",
      aiWorkflow:
        "Local speech transcription (MERaLiON), field extraction, photo intelligence, and report QA, all chosen around secure on cluster deployment constraints rather than raw model capability.",
      impact:
        "Turned scattered field evidence into a connected report workflow, from scene capture through to commander review.",
      learned:
        "In GovTech, trust and reviewability matter more than automation. Officers adopt AI faster when it stays a draft they control.",
    },
  },
  {
    title: "NUS Datathon 2026: Company Intelligence & AI Analytics",
    badge: "1st Place · 76 teams",
    date: "Feb 2026",
    subtitle: "Company intelligence that turns raw firmographic data into decisions.",
    description:
      "Problem: Corporate benchmarking platforms rely on static industry codes and global averages, making it difficult to contextualise firm performance or detect early operational risk.\n\nApproach: Built an end-to-end company intelligence system using feature engineering and mixed-type clustering (K-Prototypes) to segment 8,559 companies across 3 countries. Engineered 20+ operational and IT-related features and validated cluster quality using silhouette score, PCA, and statistical profiling. Developed a constrained AI Analyst using Llama 3.3 70B (Groq) with retrieval-augmented prompting and strict guardrails for grounded, non-hallucinatory explanations through a React + FastAPI dashboard.\n\nResult: 1st of 76 teams. Interpretable, data-grounded benchmarking that turns raw firmographic data into defensible strategic insight.",
    tags: ["K-Prototypes", "Llama 3.3 70B", "scikit-learn", "PCA", "FastAPI", "React", "Docker"],
    pmTags: ["Product Strategy", "AI Evaluation", "Data Modelling", "Decision Support"],
    image: "/nus-datathon-2026.jpg",
    liveDemo: "https://nus-datathon-2026.vercel.app/",
    caseStudy: {
      problem:
        "Analysts benchmark firms against static industry codes and global averages, which hides real operational differences and early risk signals.",
      users: "Strategy and analyst teams who need defensible, explainable comparisons they can stand behind, not a black box.",
      role: "Data modelling · AI evaluation · Product framing · Dashboard UX",
      productDecision:
        "Constrained the AI Analyst with retrieval-augmented prompting and guardrails so every explanation is grounded in the data, prioritising trustworthy answers over impressive-sounding ones.",
      aiWorkflow:
        "Mixed-type clustering to segment 8,559 companies, validated with silhouette score, PCA, and statistical profiling; a guarded Llama 3.3 70B layer for grounded, non-hallucinatory narratives.",
      impact:
        "1st of 76 teams. Interpretable, data-grounded benchmarking that turns firmographic data into strategy people can defend.",
      learned:
        "For decision-support AI, interpretability is the product. Users trust an answer they can trace back to the data.",
    },
  },
  {
    title: "Micron × AISG National AI Student Challenge: SmartLogParser",
    badge: "1st Runner-Up · 17 teams",
    date: "May 2026",
    description:
      "Problem: Semiconductor fabs run hundreds of machines, each producing logs in different formats (JSON, XML, CSV, syslog, key-value, plain text, binary) with no shared schema. Engineers manually interpret each vendor's syntax to diagnose faults, which is slow and brittle.\n\nApproach: Built SmartLogParser, an end-to-end pipeline that ingests, normalises, and structures tool logs across all major formats, with an LLM fallback layer (Groq + Ollama) for novel or malformed inputs. Implemented SHA-256 deduplication, a dead-letter queue, stability scoring, and golden-run baseline comparison for automatic drift detection. FastAPI + SQLAlchemy backend, React 18 + TypeScript frontend, Supabase PostgreSQL in production.\n\nResult: 1st Runner-Up of 17 teams. Turns hours of manual triage into an automated intelligence layer ready for anomaly detection and yield analysis.",
    tags: ["FastAPI", "SQLAlchemy", "React", "Supabase", "Groq API", "Ollama", "ETL"],
    angle: "Designed around engineers drowning in mismatched log formats by automating triage instead of adding another dashboard.",
    image: "/national%20ai%20challenge%202nd%20place.jpg",
    liveDemo: "https://smart-log-parser.vercel.app/",
  },
  {
    title: "MeDo Vibe Coding Hackathon: BTO Lens",
    badge: "2nd Runner-Up · 40 teams",
    date: "Apr 2026",
    description:
      "Problem: BTO applicants make one of the largest financial decisions of their lives using static PDFs, flat floor plans, and forum threads, with no way to visualise what living in an unbuilt site will actually feel like.\n\nApproach: Built BTO Lens, an AI decision-support platform. Engineered a procedural 3D building-massing engine in Three.js that auto-generates block geometry from HDB storey count and site footprint, hour-by-hour sunlight/shadow simulation via SunCalc.js, a toggleable amenity layer via OneMap API, and a rules-based liveability scoring engine (0 to 100) re-weighted from natural-language input parsed by Claude API. Added a two-project side-by-side comparison with AI-generated trade-off narrative.\n\nResult: 2nd Runner-Up of 40 teams. Turns a $500,000 housing decision from guesswork into a grounded, interactive experience.",
    tags: ["React", "Three.js", "SunCalc.js", "OneMap API", "Claude API", "Node.js"],
    angle: "Designed around a real user decision: helping BTO applicants feel an unbuilt home before committing $500k.",
    image: "/MeDO%20Hackathon%20Group%20Photo.jpg",
    liveDemo: "https://app-b1iajvpvw0zl.appmedo.com/",
  },
  {
    title: "SDS Hackathon 2025: Medical Insurance Cost Prediction",
    badge: "2nd Runner-Up · 40 teams",
    date: "Nov 2025",
    description:
      "Problem: Predict medical insurance costs accurately while understanding feature impact and ensuring fairness across demographic subgroups.\n\nApproach: Engineered interaction features (smoker × BMI, smoker × age); benchmarked Ridge / Lasso / Elastic Net / Random Forest / XGBoost via cross-validation and grid search. Used AIC and SHAP for interpretability, and ran Equalised Odds fairness analysis across sex, region, and smoker groups.\n\nResult: R² > 0.85, 2nd Runner-Up of 40 teams. Identified smoking status and BMI as dominant cost predictors with stable residuals and interpretable SHAP patterns.",
    tags: ["scikit-learn", "XGBoost", "SHAP", "Random Forest", "Fairness Analysis"],
    angle: "Prioritised interpretability and fairness, so predictions could actually be trusted and acted on, not just scored.",
    image: "/nus-hackathon-2025.jpg",
    imgPos: "center 20%",
  },
  {
    title: "Careerlingo: Duolingo-style AI Career Coach",
    badge: "Top 5 Finalists · 14 teams",
    date: "June 2026",
    subtitle: "LinkedIn Career Trailblazer Camp - AI Hackathon",
    description:
      "Bite-size daily lessons that coach job-seekers through their career search, instead of one-off resume reviews. Built with team LingoLabs (Jovan, Ray, Kyle).",
    angle:
      "Chose bite size daily coaching over one off resume reviews to build a habit instead of a one time fix.",
    tags: ["AI", "LLM", "Product", "EdTech"],
    pmTags: ["Behaviour Design", "Career Tech"],
    images: [
      "/linkedin%206.jpg",
      "/linkedin%201.jpg",
      "/linkedin%202.jpg",
      "/linkedin%203.jpg",
      "/linkedin%204.jpg",
      "/linkedin%205.jpg",
      "/linkedin%207.jpg",
    ],
    imagePositions: [
      "center 38%",
      "center 55%",
      "center 26%",
      "center 54%",
      "center 30%",
      "",
      "",
    ],
    liveDemo: "https://careerlingo-mvp-web-1781622317264.chatand.build/",
    article: "https://www.linkedin.com/pulse/linkedin-career-trailblazer-camp-chatandbuild-helps-students-hxjuc",
    articleLabel: "LinkedIn article",
  },
  {
    title: "NUS Datathon 2025: Financial Advisory Matching",
    badge: "Top 5 Finalists · 40 teams",
    date: "Feb 2025",
    description:
      "Problem: An insurance company's advisor-client matching was manual and suboptimal, leading to poor conversion and engagement.\n\nApproach: Built a hybrid recommendation model combining SVD-based collaborative filtering with content-based filtering (cosine similarity), trained on historical policy success rates, client profiles, and advisor expertise.\n\nResult: Top 5 Finalists of 40 teams. Measurable lift in match quality vs. baseline, improving personalisation and projected policy conversion.",
    tags: ["scikit-learn", "SVD", "Collaborative Filtering", "Cosine Similarity"],
    angle: "Framed around a business outcome where better advisor client fit drives conversion, not just a higher model score.",
    image: "/nus-datathon.jpg",
  },
];

/* ---------- Projects ---------- */

export const projects: Project[] = [
  {
    title: "CoverCraft: AI Cover Letter Generator",
    date: "Mar 2026",
    description:
      "AI tool that writes personalised cover letters in seconds. Upload your resume to auto-fill your profile, paste a job description, and it generates a tailored letter for you.",
    productDecision:
      "Auto fill from a resume upload removes the blank page problem before users even start typing.",
    tags: ["LLM", "Groq", "TypeScript", "AI Agent"],
    pmTags: ["Workflow Fit", "Human Review"],
    image: "/Cover Letter Maker Image.jpg",
    liveDemo: "https://cover-letter-maker-one.vercel.app/",
    github: "https://github.com/bernardinolintang/Cover-Letter-Maker",
  },
  {
    title: "AF Tracker SG",
    date: "Apr 2026",
    description:
      "Full-stack gym-visit tracker for every Anytime Fitness outlet in Singapore. Browse all AF locations on an interactive Google Map, mark gyms as visited, and track progress across regions with real-time stats, regional breakdowns, and a shareable branded progress card. Deployed on Cloudflare Pages with Supabase for auth and data.",
    productDecision:
      "Made progress shareable and region based, turning a simple tracker into something motivating enough to keep using.",
    tags: ["React", "TypeScript", "Supabase", "Google Maps", "Cloudflare"],
    image: "/AF Tracker Image.jpg",
    liveDemo: "https://af-journey-map.vercel.app/",
    github: "https://github.com/bernardinolintang/af-journey-map",
  },
  {
    title: "Eksplorasi",
    date: "Jul 2026",
    description:
      "Personal outdoor-exploration tracker for 100+ parks, trails, reservoirs, wetlands, islands, and heritage spots across Singapore. Browse every location on an interactive map, mark places as visited or want-to-go, jot per-spot notes, and follow your progress with category and regional breakdowns, synced filters across map and list views, and a wishlist-first “suggest next place” picker. Built with Next.js and local-first persistence — no account or backend required.",
    productDecision:
      "Added visited / want-to-go / notes on each place, turning a location checklist into a personal exploration journal rather than a static directory.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Google Maps", "Leaflet"],
    image: "/Eksplorasi%20Cover%20Page.png",
    liveDemo: "https://eksplorasi.vercel.app/",
    github: "https://github.com/bernardinolintang?tab=repositories",
  },
  {
    title: "Hybrid CNN + RAG Framework for Dermatology Decision Support",
    date: "IS460 Machine Learning · Aug to Nov 2024",
    description:
      "Hybrid Retrieval-Augmented Generation framework integrating CNNs for skin-disease diagnosis. Image classification for visual analysis, retrieval-augmented generation for detailed medical advice from dermatology research. Tackled class imbalance with regularisation, used pre-trained ResNet-50 and EfficientNetV2, and integrated an advanced embedding model. Implemented Agentic Chunking for dynamic retrieval; outperformed baseline models in accuracy.",
    productDecision:
      "Paired image classification with retrieval so advice is grounded in dermatology literature, not model guesswork.",
    tags: ["TensorFlow", "HuggingFace", "EfficientNetV2M", "ResNet-50", "PubMedBERT"],
    pmTags: ["Retrieval Quality", "Human Review", "Evaluation"],
    image: "/IS460-machine-learning-presentation.jpg",
  },
  {
    title: "Multi-Model Approach for DNA-Binding Protein Classification",
    date: "IT1244 · Aug to Nov 2024",
    description:
      "Built and benchmarked Logistic Regression, Naive Bayes, Random Forest, and CNN classifiers for DNA-binding protein prediction. Engineered features from k-mer frequencies, amino acid composition, and sequence embeddings; addressed class imbalance with weighted loss and hyperparameter tuning. The CNN outperformed all baselines on sequence-based feature capture.",
    productDecision:
      "Benchmarked simple baselines before deep models, so the added complexity of a CNN was justified by real gains.",
    tags: ["scikit-learn", "TensorFlow", "CNN", "Bioinformatics"],
    image: "/it1244.png",
    github: "https://github.com/bernardinolintang/IT1244-Project-DNA-Binding-Protein",
  },
  {
    title: "Academic Question Bank & Assessment Platform",
    date: "DSA3101 · Aug to Nov 2025",
    description:
      "Question Bank System for ST1131: Flask backend, Streamlit frontend, PostgreSQL database, supporting efficient search, filtering, and assembly creation by difficulty and course type. Modular ingestion using pdfplumber and python-docx, a version-tracking system for questions, and AI-assisted recommendations based on past usage. Built a Flask REST API for ingestion, search, and assembly, with full-text search and metadata tracking.",
    problem: "Assessment questions were scattered across modules and formats, making them hard to reuse.",
    productDecision:
      "Built a searchable, filterable, difficulty-aware workflow so instructors can assemble assessments faster.",
    tags: ["Flask", "PostgreSQL", "Streamlit", "pdfplumber", "AI Recommendations"],
    pmTags: ["Admin Workflow", "Search UX", "Education Tools"],
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

/* ---------- Skills ---------- */

export const skills: Record<string, string[]> = {
  "Core Stack": ["Python", "SQL", "TypeScript", "FastAPI", "Node.js", "React", "Next.js"],
  "Applied ML & AI": ["OpenAI API", "LangChain", "RAG", "Prompt Engineering", "scikit-learn", "TensorFlow", "XGBoost", "SHAP"],
  "Data Engineering & Infra": ["Snowflake", "PostgreSQL", "MongoDB", "Docker", "AWS", "IaC", "CI/CD"],
  "Analysis & Visualisation": ["Pandas", "NumPy", "R", "Tableau", "Power BI"],
};

/* ---------- Community ---------- */

export const events: CommunityEvent[] = [
  {
    title: "Curriculum Executive at NUS Product Club",
    date: "Aug 2025 to May 2026",
    description:
      "Presented an internal A/B testing analysis session at Product Club, showcasing statistical testing and product insights for feature-rollout evaluation.",
    tags: ["Product Management", "A/B Testing", "Data Analytics", "Public Speaking"],
    image: "/me-presenting.jpg",
  },
  /* Hidden for now. To restore, uncomment this card.
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

/* ---------- Testimonials ---------- */

export const testimonials: Testimonial[] = [
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
