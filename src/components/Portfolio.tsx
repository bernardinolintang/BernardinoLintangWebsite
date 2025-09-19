import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTheme } from "./ThemeProvider";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  MapPin, 
  Calendar,
  Code,
  Briefcase,
  GraduationCap,
  Award,
  ChevronDown,
  Download,
  Phone,
  Users,
  Mic,
  Trophy,
  Heart,
  Filter,
  X,
  Sun,
  Moon
} from "lucide-react";
import { useState } from "react";

export function Portfolio() {
  const { theme, toggleTheme } = useTheme();

  const experiences = [
    {
      title: "Operations (Data Science) Intern",
      company: "Superbank",
      period: "May 2025 - Aug 2025",
      location: "Jakarta, Indonesia",
      description: `
• Engineered 200+ fraud detection features in Python and Snowflake SQL, enhancing the anomaly detection model’s ability to flag suspicious account behaviour.
• Designed and standardised feature documentation templates in Excel, cataloguing 200+ features with definitions to ensure clarity, reproducibility, and audit readiness.
• Optimised SQL queries on datasets exceeding 50M records by breaking complex scripts into modular components, improving processing efficiency by ~40%.
• Created snapshot views of payment data in Snowflake, enabling more efficient transactional analysis and model training.
• Created and maintained data pipelines in Snowflake, enabling real-time visibility into anomalies such as mismatched devices, OS versions, and high-frequency transaction bursts.
`,
      technologies: ["Python", "SQL", "Snowflake"],
      logo: "/superbank-logo.webp",
      link: "https://www.linkedin.com/posts/bernardino-lintang_datascience-snowflake-sql-activity-7361775942270087169-1ZpQ?utm_source=share&utm_medium=member_desktop&rcm=ACoAADoCz-YBehyqcK0bh8mFQ1k3aFoNU9k0BSg"
    },
    {
      title: "GenAI Product Development Intern (Incoming)",
      company: "CPF Board",
      period: "Jan 2026 - May 2026",
      location: "Singapore, Singapore",
      description: `
• I will design and develop Generative AI solutions to enhance customer service operations and solve real-life problems at the CPF Customer Contact Centre.
• I will build and optimise Retrieval-Augmented Generation (RAG) systems by incorporating CPF’s internal knowledge base and documentation to improve AI responses.
• I will maintain and enhance existing LLM technologies, with a focus on prompt engineering, functionality improvements, and user experience.
• I will develop and implement testing frameworks to evaluate model performance, accuracy, and alignment with business requirements.
• I will collaborate with cross-functional teams to explore innovative applications of AI/ML and contribute to CPF’s mission of improving the member experience.
`,
      technologies: ["FastAPI", "Node.js", "Next.js", "Mongodb", "Postgresql", "mySQL", "Python","OpenAI"],
      logo: "/cpf-logo.png",
      link: "https://www.cpf.gov.sg"
    }
  ];

  const competitions = [
    {
      title: "NUS Tiger Brokers Case Competition",
      date: "Mar 2025",
      description: `Our team developed Tiger Learn, an educational app that empowers tertiary students to learn investing in an engaging and accessible way. We:\n\n- Identified the gap: Students are keen to invest but lack knowledge, confidence, and capital.\n- Designed the solution: A gamified learning app with quizzes, progress tracking, paper trading, and interactive modules covering stocks, REITs, crypto, and more.\n- Created differentiation: Added community features, mentorships, and webinars to build loyalty and position Tiger Learn as the go-to platform for student investors.\n- Planned execution: Outlined a launch timeline, marketing strategies, security measures, and a scalable revenue model.\n- Measured impact: Set KPIs for adoption, engagement, conversion to trading, and retention to show Tiger Learn’s value to both users and Tiger Brokers.`,
      technologies: ["Product Design", "Gamification", "App Development", "EdTech", "User Interface", "Business Strategy"],
      image: "/tiger-brokers.png"
    },
    {
      title: "NUS Datathon (Financial Advisory Matching, Category A), Top 5 Finalists",
      date: "Feb 2025",
      description: "Developed a hybrid recommendation model to optimize financial advisor-client matching using Singular Value Decomposition (SVD) with Collaborative Filtering and Content-Based Filtering (cosine similarity). Our model analyzed historical policy success rates, client profiles, and advisor expertise to recommend the most suitable advisors for clients, improving personalization and engagement.",
      technologies: ["Python", "Pandas", "scikit-learn", "SVD", "Collaborative Filtering", "Content-Based Filtering", "Cosine Similarity"],
      image: "/nus-datathon.jpg"
    },
    {
      title: "Changi Airport Group Case Challenge 2025",
      date: "Aug 2025",
      description: `Our team designed Singapore Spotlight, an AI-powered, interactive cultural experience to reimagine Changi Airport as a destination in itself. We:\n\n- Framed the problem: Changi needs a new large-scale attraction that is safe, inclusive, and culturally authentic to sustain its “wow” factor and global leadership.\n- Developed the concept: A gesture-activated installation where travellers are immersed into iconic Singapore scenes (hawker centres, SAF bases, landmarks), creating personalised, highly shareable digital souvenirs.\n- Ensured feasibility: Built on mature technologies (vision AI, Unity 3D, depth cameras) with privacy-by-design, inclusivity, low-maintenance operations, and scalable rollout across terminals.\n- Created impact: Drives organic media, increases dwell time, strengthens Singapore’s cultural diplomacy, and opens revenue streams through partnerships, advertising, and IP collaborations.\n- Aligned with Changi’s vision: Showcasing innovation, world-class excellence, and community connection while reinforcing brand leadership in safe, sustainable, and vibrant airport experiences.`,
      technologies: ["AI", "Unity 3D", "Computer Vision", "Experience Design", "Cultural Diplomacy"],
      image: "/cag-case-challenge.png"
    }
  ];

  const projects = [
    {
      title: "Multi-Model Approach for DNA-Binding Protein Classification",
      date: "Aug 2024 - Nov 2024",
      description: `In this IT1244 Group Project, we developed and evaluated various machine learning models, including Logistic Regression, Naive Bayes, Random Forest, and Convolutional Neural Network (CNN), to classify DNA-binding proteins. Each model leveraged k-mer frequencies, amino acid composition, and embeddings for feature extraction, aiming to improve accuracy and reduce processing time. Hyperparameter tuning and class-weighted loss functions were used to address class imbalance, enhancing model performance. The CNN ultimately excelled in capturing sequence-based features, demonstrating the highest potential for complex biological data classification.`,
      technologies: ["Python", "scikit-learn", "TensorFlow", "CNN", "Bioinformatics"],
      image: "/it1244.png"
    },
    {
      title: "Analyzing Emotional Characteristics of Taylor Swift’s Albums and Their Impact on Reception",
      date: "Oct 2024 - Nov 2024",
      description: `For this DSA2101 group project, we conducted a detailed analysis of Taylor Swift’s discography, examining how emotional elements within her music may influence critical and fan reception. Leveraging data science tools in R, I analyzed song attributes such as valence (positivity of music), key, and mode (major or minor) and explored how these emotional aspects correlate with Metacritic scores (critic reviews) and user scores (fan reception) for each album.`,
      technologies: ["R", "Data Science", "Music Analysis", "Metacritic API"],
      image: "/dsa2101.png",
    }
  ];

  const skills = {
    "Frontend": ["React", "Vue.js", "TypeScript", "Next.js", "Tailwind CSS"],
    "Backend": ["Node.js", "Python", "Express", "FastAPI", "Java", "Flask"],
    "Database": ["Snowflake SQL", "PostgreSQL", "MongoDB", "Firebase Firestore"],
    "DevOps": ["Docker", "AWS"],
    "Tools": ["Git", "Figma", "Excel"],
    "Data Science/Analytics": ["Pandas", "NumPy", "scikit-learn", "TensorFlow", "R", "ggplot2", "Tableau", "Power BI"]
  };

  const events = [
    {
      title: "Participant",
      type: ["Workshop"],
      event: "NUS SME X AWS Workshop: An Introduction to Generative AI on Cloud",
      date: "March 2025",
      location: "Singapore, Singapore",
      description: "Built a financial insights AI agent on AWS Bedrock by setting up an S3 knowledge base with the Fannie Mae Selling Guide, enabling foundation models, configuring action groups (loan calculator, MLS lookup), and testing retrieval-augmented generation for mortgage-related queries.",
      topics: ["AWS Bedrock", "AI Agent", "Retrieval-Augmented Generation", "S3", "Foundation Models", "Action Groups", "Cloud", "Financial Services"],
      categories: ["AI/ML", "Cloud", "Workshop", "Finance"],
      icon: Award,
      image: "/aws-workshop-group.jpg",
    },
    {
      title: "Participant",
      type: ["Tour"],
      event: "Google Office Tour",
      date: "April 2025",
      location: "Singapore, Singapore",
      description: "Visited Google’s Singapore office for an exclusive tour, gaining insights into Google’s workplace culture, innovation practices, and cutting-edge technologies.",
      topics: ["Workplace Culture", "Innovation", "Tech Industry", "Office Tour", "Networking"],
      categories: ["Corporate", "Technology", "Networking"],
      icon: Users,
      image: "/google-office-tour-portrait.jpg",
    },
    {
      title: "Participant",
      type: ["Case Study"],
      event: "PwC Career Compass Day",
      date: "September 2025",
      location: "Singapore, Singapore",
      description: "Participated in PwC Career Compass Day, working with a team on a case study simulating a client engagement. Contributed to analysis, structured recommendations, and co-presented to a panel, showcasing collaboration, critical thinking, and communication skills under time pressure.",
      topics: ["Teamwork", "Case Study", "Communication", "Critical Thinking", "Collaboration"],
      categories: ["Corporate", "Case Study", "Teamwork"],
      icon: Mic,
      image: "/pwc-career-compass-day.jpg",
      //link: "https://reactconf.com/2024/speakers"
    },
  ];

  // Dynamically generate filter categories from all event categories
  const filterCategories = Array.from(
    new Set(events.flatMap(event => event.categories))
  );

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);



  // Date filter state
  const [selectedDate, setSelectedDate] = useState<string>("");
  // Sort order state
  const [dateSortOrder, setDateSortOrder] = useState<'asc' | 'desc'>('desc');

  // Get unique dates from events for dropdown
  const eventDates = Array.from(new Set(events.map(e => e.date)));

  // Helper to parse month-year or month format
  function parseEventDate(dateStr: string): Date {
    // Try to parse as 'Month YYYY' or 'Month YYYY' or 'YYYY-MM-DD'
    const tryDate = Date.parse(dateStr);
    if (!isNaN(tryDate)) return new Date(tryDate);
    // Try custom parsing for 'Month YYYY'
    const [month, year] = dateStr.split(' ');
    if (month && year) {
      return new Date(`${month} 1, ${year}`);
    }
    return new Date(dateStr);
  }

  // Filter and sort events by category, date, and sort order
  const filteredEvents = events
    .filter(event => {
      const categoryMatch = selectedFilters.length === 0 || selectedFilters.some(filter => event.categories.includes(filter));
      const dateMatch = !selectedDate || event.date === selectedDate;
      return categoryMatch && dateMatch;
    })
    .sort((a, b) => {
      const dateA = parseEventDate(a.date);
      const dateB = parseEventDate(b.date);
      return dateSortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

  const toggleFilter = (category: string) => {
    setSelectedFilters(prev => 
      prev.includes(category)
        ? prev.filter(f => f !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  // --- Search Bar State and Logic ---
  const [searchQuery, setSearchQuery] = useState("");
  // Combine all searchable content into a single array for demonstration
  const allContent = [
    ...experiences.map(e => ({ ...e, type: "experience" })),
    ...competitions.map(c => ({ ...c, type: "competition" })),
    ...projects.map(p => ({ ...p, type: "project" })),
    ...events.map(ev => ({ ...ev, type: "event" })),
  ];
  const searchResults = searchQuery
    ? allContent.filter(item =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  // --- Testimonials Data ---
  const testimonials = [
    {
      name: "Deyi Secondary School",
      title: "Student",
      date: "2015 - 2020",
      image: "deyi-logo.png", // Make sure this image exists in your public/assets folder
      text: `Bernardino possessed a gentle disposition and had a smile for everyone. In his interactions with others, he showed sincerity and warmth. He was forthcoming in helping others and was well-liked by his peers, unassuming in his words and actions. He enjoyed the process of learning and was open to different perspectives. A diligent student, Bernardino displayed a positive learning attitude and determination to excel in his academic performance. He loved to challenge himself constantly and displayed the ability to carry out tasks with minimal supervision. He could be relied upon to do his best in whatever he embarked on.`,
    },
    {
      name: "Catholic Junior College",
      title: "Student",
      date: "2019 - 2020",
      image: "cj-logo.jpg", // Make sure this image exists in your public/assets folder
      text: `Bernardino consistently carried himself as a diligent and self-directed student. Bernardino often seeks new opportunities to grow. Bernardino acknowledged the importance of being a good listener as well as getting everyone in the team to feel included. He strove to influence his team positively so that, collectively, the team was consistently up to tasks. A bright and respectful individual, Bernardino has a pleasant disposition and gets along well with his peers. His analytical mind and openness to experiences enables him to push his limits and to achieve his intended goals.`,
    },
    {
      name: "11C4I",
      title: "Army Reconnaissance Trooper",
      date: "2021 - 2023",
      image: "11c4i-logo.png", // Make sure this image exists in your public/assets folder
      text: `His friendly character allowed him to overcome the cultural differences with his foreign counterparts. CFC Bernardino always takes the initiative to seek his Commanders and peers for advice to improve himself. His cheerful and welcoming personality enabled him to build strong working rapport with his superiors and peers. CFC Bernardino would certainly be a valuable member to any team that he may find himself part of in the future.`,
    },
  ];

  return (
    <div className="min-h-[60vh] pt-16 bg-gradient-to-b from-slate-900 to-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a
              href="#top"
              className="text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={e => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Bernardino Lintang
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#experience" className="hover:text-primary transition-colors">Experience</a>
              <a href="#competitions" className="hover:text-primary transition-colors">Competitions</a>
              <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
              <a href="#events" className="hover:text-primary transition-colors">Events</a>
              <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hover:bg-accent"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Resume
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
<section
  id="hero"
  className="relative flex items-center justify-center min-h-screen px-4 bg-background"
>
  <div className="container mx-auto max-w-4xl flex flex-col items-center justify-center text-center relative z-10">
    <div className="mb-8 flex flex-col items-center">
      <ImageWithFallback
        src="/formal-picture.JPG"
        alt="Professional headshot"
        className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-primary/10"
        style={{ objectPosition: 'center 10%' }}
      />
      <h1 className="text-4xl md:text-6xl mb-4">
        Hi, I'm <span className="text-primary">Bernardino Lintang</span>
      </h1>
      <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
        Aspiring Data Scientist passionate about building data-driven products.
        I specialize in analytics, machine learning, and GenAI development, with a focus on solving problems that improve people’s everyday experiences.
      </p>
      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
        <MapPin className="w-4 h-4" />
        <span>Singapore, Singapore</span>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button size="lg" asChild>
          <a href="mailto:lintangbernardino@gmail.com">
            <Mail className="w-4 h-4 mr-2" />
            Get In Touch
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="https://github.com/bernardinolintang" target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="https://www.linkedin.com/in/bernardino-lintang/" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-4 h-4 mr-2" />
            LinkedIn
          </a>
        </Button>
      </div>
    </div>
    <div className="flex justify-center">
      <ChevronDown className="w-6 h-6 text-muted-foreground animate-bounce" />
    </div>
  </div>
</section>

      {/* About Section */}
  <section id="about" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl mb-8 text-center">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg leading-relaxed mb-6">
                I’m a passionate data scientist and analyst with hands-on experience in building machine learning models, AI solutions, and data-driven dashboards. 
                I enjoy working with modern data technologies and am always eager to learn new skills, explore emerging tools, and tackle complex real-world problems with data.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                When I'm not coding, you can find me exploring new technologies, contributing to 
                open-source projects, or enjoying outdoor activities like hiking and photography.
              </p>
                <div className="flex gap-4 justify-center w-full">
                  <div className="text-center">
                    <div className="text-2xl mb-2">1+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">2+</div>
                    <div className="text-sm text-muted-foreground">Projects Completed</div>
                  </div>
                </div>
            </div>
            <div>
              <h3 className="text-xl mb-4">Skills & Technologies</h3>
              <div className="space-y-4">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="mb-2 text-sm text-muted-foreground">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl mb-8 text-center">Work Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <ImageWithFallback
                          src={exp.logo}
                          alt={`${exp.company} logo`}
                          className="w-10 h-10 rounded-lg object-cover border border-border"
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5" />
                          {exp.title}
                        </CardTitle>
                        <CardDescription className="text-lg mt-1">
                          {exp.link ? (
                            <a 
                              href={exp.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors inline-flex items-center gap-1"
                            >
                              {exp.company}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            exp.company
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exp.period}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {exp.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  <div className="mt-4" />
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Competitions Section */}
  <section id="competitions" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl mb-8 text-center">Competitions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <ImageWithFallback
                    src={competition.image}
                    alt={competition.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 whitespace-pre-line leading-snug">
                    <Trophy className="w-5 h-5" />
                    {competition.title}
                  </CardTitle>
                  {competition.date && (
                    <div className="text-sm text-muted-foreground mb-2">{competition.date}</div>
                  )}
                  {competition.title === "NUS Tiger Brokers Case Competition" ? (
                    <ul className="list-disc pl-6 mb-2 text-muted-foreground">
                      {competition.description
                        .split('\n')
                        .filter(line => line.trim().startsWith('-'))
                        .map((line, idx) => (
                          <li key={idx}>{line.replace(/^\s*-\s*/, '')}</li>
                        ))}
                    </ul>
                  ) : (
                    <CardDescription>{competition.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {competition.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  {competition.title === "NUS Tiger Brokers Case Competition" && (
                    <a
                      href="https://www.canva.com/design/DAGiX06BesA/El16LNoqmvHzcgLiJd9hzA/view?mode=prototype"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2"
                    >
                      <Button size="sm" variant="outline">
                        UI Work (Prototype)
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
  <section id="projects" className="py-16 px-4 bg-muted/30">
    <div className="container mx-auto max-w-6xl">
      <h2 className="text-3xl mb-8 text-center">Featured Projects</h2>
      <div className="grid md:grid-cols-2 gap-6 justify-center">
        {/* Center the grid and its children */}
        {projects.map((project, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-video bg-muted">
              <ImageWithFallback
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 whitespace-pre-line leading-snug">
                <Code className="w-5 h-5" />
                {project.title}
              </CardTitle>
              <div className="text-sm text-muted-foreground mb-2">{project.date}</div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center mt-8">
        <Button
          variant="outline"
          size="lg"
          asChild
        >
          <a
            href="https://github.com/bernardinolintang"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4 mr-2" />
            View More Projects
          </a>
        </Button>
      </div>
    </div>
  </section>

      {/* Events Section */}
  <section id="events" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl mb-8 text-center">Events & Community</h2>
          <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Beyond my professional work, I actively grow within the developer and data community by attending talks, workshops, and industry events to expand my knowledge and stay ahead of emerging technologies.
          </p>
          
          {/* Filter Controls */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter by Category</span>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="date-filter" className="text-sm text-muted-foreground">Filter by Date:</label>
                  <select
                    id="date-filter"
                    className="border rounded px-2 py-1 text-sm bg-background"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                  >
                    <option value="">All Dates</option>
                    {eventDates.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                  <label htmlFor="date-sort" className="text-sm text-muted-foreground ml-4">Sort:</label>
                  <select
                    id="date-sort"
                    className="border rounded px-2 py-1 text-sm bg-background"
                    value={dateSortOrder}
                    onChange={e => setDateSortOrder(e.target.value as 'asc' | 'desc')}
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
                {selectedFilters.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {filterCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedFilters.includes(category) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter(category)}
                    className="transition-all"
                  >
                    {category}
                    {selectedFilters.includes(category) && (
                      <X className="w-3 h-3 ml-2" />
                    )}
                  </Button>
                ))}
              </div>
              {(selectedFilters.length > 0 || selectedDate) && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {selectedFilters.length > 0 && <><span>Active filters:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedFilters.map((filter) => (
                        <Badge key={filter} variant="secondary" className="text-xs">
                          {filter}
                        </Badge>
                      ))}
                    </div></>}
                    {selectedDate && <span>Date: {selectedDate}</span>}
                    <span>• {filteredEvents.length} events found</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            {filteredEvents.length === 0 ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No events found matching the selected filters.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAllFilters}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredEvents.map((event, index) => {
                const IconComponent = event.icon;
                return (
                  <Card
                    key={index}
                    className="rounded-2xl border bg-card/60 backdrop-blur hover:border-primary/20 p-4 flex flex-row items-center gap-6 max-w-2xl mx-auto"
                  >
                    {/* Event Image */}
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-12 h-12 md:w-20 md:h-20 rounded-2xl object-cover object-center shadow-sm flex-shrink-0"
                    />
                    {/* Event Content */}
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <IconComponent className="w-5 h-5" />
                          <h3 className="text-lg md:text-xl font-semibold">{event.title}</h3>
                        </div>
                        <div className="text-muted-foreground text-sm mb-1">{event.event}</div>
                        <div className="flex flex-wrap gap-2 mb-1">
                          <Badge variant="secondary" className="w-fit text-xs">
                            {event.type}
                          </Badge>
                          {event.categories.map((category) => (
                            <Badge
                              key={category}
                              variant="outline"
                              className={`text-xs ${
                                selectedFilters.includes(category)
                                  ? "bg-primary/10 border-primary/20"
                                  : ""
                              }`}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-prose mb-1">
                          {event.description}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-1">
                          {event.topics.map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground pt-3 border-t mt-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-muted/30">
  <div className="container mx-auto max-w-4xl">
    <h2 className="text-3xl mb-8 text-center">Testimonials</h2>
    <div className="grid md:grid-cols-2 gap-8">
      {testimonials.map((testimonial, idx) => (
        <Card key={idx} className="w-full max-w-xl mx-auto flex flex-col items-center text-center mb-8 px-8 py-10">
          <ImageWithFallback
            src={testimonial.image}
            alt={testimonial.name}
            className="w-32 h-32 object-contain mx-auto mb-4 bg-white rounded-full border-2 border-primary/20 mt-2"
            style={{ objectPosition: "center" }}
          />
          <div className="text-2xl font-semibold mb-1">{testimonial.name}</div>
          <div className="text-muted-foreground text-sm mb-1">{testimonial.title}</div>
          <div className="text-xs text-muted-foreground mb-2">{testimonial.date}</div>
          <p className="text-sm leading-relaxed text-muted-foreground/90 m-0">
            {testimonial.text}
          </p>
        </Card>
      ))}
    </div>
  </div>
</section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl mb-8 text-center">Contact Me</h2>
          <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            I’m always open to discussing new projects, innovative ideas, or opportunities to be part of your vision. 
            Whether you have a question or just want to say hi, feel free to reach out!
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              size="lg"
              asChild
              className="mx-auto md:mx-0"
            >
              <a href="mailto:lintangbernardino@gmail.com">
                <Mail className="w-5 h-5 mr-2" />
                Email Me
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="mx-auto md:mx-0"
            >
              <a
                href="https://github.com/bernardinolintang"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="mx-auto md:mx-0"
            >
              <a
                href="https://www.linkedin.com/in/bernardino-lintang/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-sm text-muted-foreground mb-2">
            &copy; 2025 Bernardino Lintang. All rights reserved.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/bernardinolintang"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/bernardino-lintang/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:lintangbernardino@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}