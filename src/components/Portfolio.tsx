import { useTheme } from "./ThemeProvider";
import { useState } from "react";
import { Reveal } from "./motion/Reveal";
import { TestimonialsCarousel } from "./TestimonialsCarousel";
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
  Moon,
  Lightbulb,
  Camera,
  FolderKanban,
  Sparkles,
  Lock,
  Menu
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
// import data from "@/data"; // If your data file uses default export
// Helper to safely wrap arrays (generic, but always returns T[])
function A<T>(x: T[] | undefined | null): T[] {
  return Array.isArray(x) ? x : [];
}
// If your data file uses named exports, use:
// import { projects, experiences, competitions, events } from "@/data";

export function Portfolio() {
  const { theme, setTheme } = useTheme();
  
  const experiences = [
    {
      title: "Operations (Data Science) Intern",
      company: "Superbank",
      period: "May 2025 - Aug 2025",
      location: "Jakarta, Indonesia",
      description: `Scope: Fraud analytics and detection pipeline engineering for a digital bank serving 10M+ users.\n\n\u2022 Built Snowflake SQL pipelines and Python workflows to flag suspicious account activity, reducing potential fraud exposure by 20%.\n\u2022 Engineered 200+ detection features (device mismatch, high-frequency bursts, OS anomalies) fed into the production anomaly model.\n\u2022 Optimised queries on 50M+ record datasets by modularising complex scripts, improving processing efficiency by ~40%.\n\u2022 Collaborated directly with risk analysts and business stakeholders to align pipeline outputs with operational decision-making.`,
      technologies: ["Python", "SQL", "Snowflake"],
      logo: "/superbank-logo.webp",
      link: "https://www.linkedin.com/posts/bernardino-lintang_datascience-snowflake-sql-activity-7361775942270087169-1ZpQ?utm_source=share&utm_medium=member_desktop&rcm=ACoAADoCz-YBehyqcK0bh8mFQ1k3aFoNU9k0BSg"
    },
    {
      title: "AI Engineer Intern",
      company: "Crayon Data",
      period: "Dec 2025 - Jan 2026",
      location: "Chennai, India",
      description: `Scope: End-to-end LLM-powered data ingestion system for a global merchant offer repository.\n\n\u2022 Designed and shipped an LLM ingestion pipeline converting unstructured offer data into structured, production-ready datasets — reducing manual processing effort by 70%+.\n\u2022 Built validation and regeneration layers enforcing schema consistency, mandatory fields, and safe re-generation for business users.\n\u2022 Implemented deduplication, deterministic ID assignment, and referential integrity logic to support scalable ingestion across markets.`,
      technologies: ["Python", "LLM", "Agentic AI", "Production Integration"],
      logo: "/crayon-data-logo.jpg",
      link: "https://www.crayondata.com/"
    },
    {
      title: "GenAI Product Development Intern",
      company: "CPF Board",
      period: "Jan 2026 - May 2026",
      location: "Singapore, Singapore",
      description: `Scope: GenAI systems for Singapore's national pension fund customer contact centre.\n\n\u2022 Designed and deployed LLM-assisted workflows that improved response quality, consistency, and operational efficiency across the CPF Contact Centre.\n\u2022 Built and optimised RAG pipelines integrated with CPF's internal knowledge bases, applying prompt engineering and evaluation techniques to ensure policy-aligned, accurate responses.\n\u2022 Established evaluation frameworks to measure model accuracy, retrieval precision, and alignment with business requirements.`,
      technologies: ["Python", "FastAPI", "OpenAI", "RAG", "Node.js", "Next.js", "PostgreSQL", "MongoDB"],
      logo: "/cpf-logo.png",
      link: "https://www.cpf.gov.sg"
    },
    {
      title: "Data Engineer Intern (Incoming)",
      company: "Home Team Science and Technology Agency (HTX)",
      period: "May 2026 - Aug 2026",
      location: "Singapore, Singapore",
      description: `Scope: Data platform engineering supporting AI/ML teams in Singapore's national security technology agency.\n\n\u2022 Gathering pipeline requirements from data scientists and AI engineers, translating them into transform-and-load scripts for the centralised data platform.\n\u2022 Maintaining IaC workflows for CI/CD and data pipelines; building monitoring tools for pipeline health and data quality.\n\u2022 Collaborating on frontend/backend integration to connect deployed AI models with training data sources.`,
      technologies: ["Python", "SQL", "IaC", "CI/CD", "Docker"],
      logo: "/htx-logo.png",
      link: "https://www.htx.gov.sg"
    }
  ];

  const competitions = [
   
    {
  title: "NUS Datathon 2026 (Company Intelligence & AI Analytics), 1st Place Winner",
  date: "Feb 2026",
  description: "Problem: Corporate benchmarking platforms rely on static industry codes and global averages, making it difficult to contextualize firm performance or detect early operational risk.\n\nApproach: Built an end-to-end company intelligence system using feature engineering and mixed-type clustering (K-Prototypes) to segment 8,559 companies across 3 countries. Engineered 20+ operational and IT-related features (e.g., revenue per employee, IT intensity, device density) and validated cluster quality using silhouette score, PCA visualization, and statistical profiling. Developed a constrained AI Analyst using Llama 3.3 70B (Groq) with structured retrieval-augmented prompting and strict guardrails to deliver grounded, non-hallucinatory explanations through a full-stack React + FastAPI dashboard.\n\nResult: 1st Place Winner. Delivered interpretable, data-grounded company benchmarking that transforms raw firmographic data into defensible strategic insights for decision-makers.",
  technologies: [
    "Python",
    "Pandas",
    "scikit-learn",
    "K-Prototypes",
    "Silhouette Score",
    "PCA",
    "FastAPI",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Groq API",
    "Llama 3.3 70B",
    "Retrieval-Augmented Prompting",
    "Docker"
  ],
  image: "/nus-datathon-2026.jpg"
    },
    {
      title: "SDS Hackathon 2025 (Medical Insurance Cost Prediction) - Top 3 Finalists",
      date: "Nov 2025",
      description: `Problem: Predict medical insurance costs accurately while understanding feature impact and ensuring fairness across demographic subgroups.\n\nApproach: Engineered interaction features (smoker × BMI, smoker × age), benchmarked Ridge/Lasso/Elastic Net/Random Forest/XGBoost via cross-validation and grid search. Used AIC and SHAP for interpretability; ran Equalized Odds fairness analysis across sex, region, and smoker groups.\n\nResult: R² > 0.85. Top 3 Finalist out of 40 teams. Identified smoking status and BMI as dominant cost predictors with stable residuals and interpretable SHAP patterns.`,
      technologies: ["Python", "scikit-learn", "XGBoost", "SHAP", "Random Forest", "Ridge Regression", "Lasso", "Elastic Net", "Fairness Analysis", "Machine Learning"],
      image: "/nus-hackathon-2025.jpg"
    },
    
    {
      title: "NUS Datathon 2025 (Financial Advisory Matching, Category A), Top 5 Finalists",
      date: "Feb 2025",
      description: "Problem: An insurance company's advisor-client matching was manual and suboptimal, leading to poor conversion and engagement.\n\nApproach: Built a hybrid recommendation model combining SVD-based Collaborative Filtering with Content-Based Filtering (cosine similarity), trained on historical policy success rates, client profiles, and advisor expertise.\n\nResult: Top 5 Finalist. Demonstrated measurable lift in match quality vs. baseline, improving personalization and projected policy conversion.",
      technologies: ["Python", "Pandas", "scikit-learn", "SVD", "Collaborative Filtering", "Content-Based Filtering", "Cosine Similarity"],
      image: "/nus-datathon.jpg"
    },
    // {
    //   title: "Changi Airport Group Case Challenge 2025",
    //   date: "Aug 2025",
    //   description: `Problem: Changi Airport needed a new large-scale attraction that is safe, inclusive, and culturally authentic to sustain its global leadership positioning.\n\nApproach: Designed a gesture-activated AI installation using vision AI, Unity 3D, and depth cameras — immersing travellers in iconic Singapore scenes to generate personalised, shareable digital souvenirs. Built with privacy-by-design, accessibility, and low-maintenance ops.\n\nResult: Projected to drive organic media reach, increase dwell time, and open partnership/IP revenue streams. Aligned with Changi\'s vision for innovation and cultural diplomacy.`,
    //   technologies: ["AI", "Unity 3D", "Computer Vision", "Experience Design", "Cultural Diplomacy"],
    //   image: "/cag-case-challenge.png"
    // },
    // {
    //   title: "NUS Tiger Brokers Case Competition",
    //   date: "Mar 2025",
    //   description: `Our team developed Tiger Learn, an educational app that empowers tertiary students to learn investing in an engaging and accessible way. We:\n\n- Identified the gap: Students are keen to invest but lack knowledge, confidence, and capital.\n- Designed the solution: A gamified learning app with quizzes, progress tracking, paper trading, and interactive modules covering stocks, REITs, crypto, and more.\n- Created differentiation: Added community features, mentorships, and webinars to build loyalty and position Tiger Learn as the go-to platform for student investors.\n- Planned execution: Outlined a launch timeline, marketing strategies, security measures, and a scalable revenue model.\n- Measured impact: Set KPIs for adoption, engagement, conversion to trading, and retention to show Tiger Learn's value to both users and Tiger Brokers.`,
    //   technologies: ["Product Design", "Gamification", "App Development", "EdTech", "User Interface", "Business Strategy"],
    //   image: "/tiger-brokers.png"
    // },
    // {
    //   title: "PINUS Hackathon 2026 (AI for Community, Social Trust & Engagement)",
    //   date: "Jan 2026",
    //   description: `Problem: Digital art platforms prioritize popularity and market speculation over cultural trust, making it difficult for collectors to understand why an artwork is meaningful or credible within a community context.\n\nApproach: Designed and implemented Atelier — an AI-powered art community platform built on taste-based social graphs rather than follower counts. Modelled users and artworks in a shared semantic embedding space using text critiques and interaction history. Developed a reputation engine combining LLM-evaluated critique depth, peer validation, curatorial consistency, and integrity signals. Built layered endorsement maps and explainable recommendation pipelines grounded in cultural relevance instead of financial metrics.\n\nResult: Delivered a functional prototype demonstrating computational modelling of community-driven trust without reliance on price signals. Successfully showcased explainable AI recommendations, transparent reputation scoring, and ethical moderation mechanisms that strengthen peer learning and cultural validation.`,
    //   technologies: ["Python", "LLMs", "Text Embeddings", "Graph Modelling", "Reputation Systems", "Explainable AI", "Semantic Clustering", "Community Graphs", "AI Moderation"],
    //   image: "/atelier-cover.png",
    //   link: "https://github.com/bernardinolintang/pinus-hackathon-team-oreo-ai-for-arts-community"
    // }

  ];

  const projects = [
    {
      title: "Multi-Model Approach for DNA-Binding Protein Classification",
      date: "Aug 2024 - Nov 2024",
      description: `Built and benchmarked Logistic Regression, Naive Bayes, Random Forest, and CNN classifiers for DNA-binding protein prediction. Engineered features from k-mer frequencies, amino acid composition, and sequence embeddings. Addressed class imbalance with weighted loss functions and hyperparameter tuning. The CNN model outperformed all baselines on sequence-based feature capture — demonstrating production-viable accuracy for biological data classification pipelines.`,
      technologies: ["Python", "scikit-learn", "TensorFlow", "CNN", "Bioinformatics"],
      image: "/it1244.png"
    },
    {
      title: "Analyzing Emotional Characteristics of Taylor Swift’s Albums and Their Impact on Reception",
      date: "Oct 2024 - Nov 2024",
      description: `Analysed Taylor Swift’s full discography using R to quantify how emotional attributes (valence, key, mode) correlate with critical and fan reception. Built reproducible EDA pipelines on Metacritic scores and audio features, identifying statistically significant patterns between musical positivity and album performance. Delivered clear data-driven storytelling with publication-ready visualisations.`,
      technologies: ["R", "Data Science", "Music Analysis", "Metacritic API"],
      image: "/dsa2101.png",
    },
    {
      title: "DSA3101: Question Bank System",
      date: "Aug 2025 - Nov 2025",
      description: `Our team developed a Question Bank System for ST1131 using Flask (Python) for the backend and Streamlit for the frontend, with a PostgreSQL database for storing and managing questions. The system supports efficient question search, filtering, and question assembly creation based on various criteria such as difficulty and course type.\n\nWe implemented a modular architecture for question ingestion, using libraries like pdfplumber and python-docx for parsing uploaded files. Additionally, we created a version tracking system for questions and integrated AI-assisted question recommendations to suggest the most relevant questions based on past usage.\n\nKey Contributions:\n• Built a Flask REST API to handle question ingestion, search, and assembly creation.\n• Integrated Streamlit frontend for intuitive question assembly and export.\n• Implemented PostgreSQL database with support for full-text search and question metadata tracking.\n• Developed version control for questions, enabling instructors to track changes over time.\n• Applied AI-assisted recommendations to suggest relevant questions based on historical data.`,
      technologies: ["Python", "Flask", "PostgreSQL", "Streamlit", "pdfplumber", "python-docx", "AI Recommendations", "Version Control"],
      image: "/dsa3101-group.png",
    },
    {
      title: "IS460 Machine Learning Project: Hybrid CNN + RAG Framework for Dermatology Decision Support",
      date: "Aug 2024 - Nov 2024",
      description: `Built a Hybrid Retrieval-Augmented Generation (RAG) framework integrating Convolutional Neural Networks (CNN) for skin disease diagnosis. The model leverages image classification for visual analysis and retrieval-augmented generation for detailed medical advice based on dermatology research documents. Tackled class imbalance using regularization and applied pre-trained ResNet-50 and EfficientNetV2 models for faster and more accurate predictions. Integrated an advanced embedding model to capture complex dermatology-specific features.\n\nKey Achievements:\n• CNN + RAG framework outperformed baseline models in accuracy.\n• Implemented Agentic Chunking for dynamic information retrieval.\n• Real-time decision support with disease-specific recommendations.`,
      technologies: ["Python", "TensorFlow", "HuggingFace", "EfficientNetV2M", "ResNet-50", "PubMedBERT", "EmbeddingGemma"],
      image: "/IS460-machine-learning-presentation.png",
    }
  ];

  const skills = {
    "Core Stack": ["Python", "SQL", "TypeScript", "FastAPI", "Node.js", "React", "Next.js"],
    "Applied ML & AI": ["OpenAI API", "LangChain", "RAG", "Prompt Engineering", "scikit-learn", "TensorFlow", "XGBoost", "SHAP"],
    "Data Engineering & Infrastructure": ["Snowflake", "PostgreSQL", "MongoDB", "Docker", "AWS", "IaC", "CI/CD"],
    "Analysis & Visualization": ["Pandas", "NumPy", "R", "Tableau", "Power BI"]
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
    // Publicity / Creative Portfolio as an event-like entry so it appears in Events & Community filters
    {
      title: "Publicity & Creative Portfolio",
      type: ["Portfolio"],
      event: "Photography & Videography — events, clubs, campaigns",
      date: "Ongoing",
      location: "Singapore, Singapore",
      description: "I have experience in publicity, photography, and videography for events, clubs, and campaigns. Explore my creative portfolio.",
      topics: ["Photography", "Videography", "Portfolio", "Canva"],
      categories: ["Publicity", "Photography", "Videography", "Media"],
      icon: Camera,
      image: "/Home page.png",
      link: "https://www.canva.com/design/DAGP3qLlhuY/L8drQBMy-80nV-wVlQbNZg/edit"
    },
    {
      title: "Marketing Head for Science Club Welfare",
      type: ["Activity"],
      date: "October 2024 - August 2025",
      location: "Singapore, Singapore",
      description: "Led branding and marketing efforts for the annual Sponsorship Booklet, overseeing design consistency, partner engagement, and promotional strategy.",
      tags: ["Leadership", "Marketing", "Sponsorship", "Strategy"],
      image: "/science-welfare-picture.jpg",
      icon: Briefcase,
      // ensure minimal arrays exist so consumers of categories/topics won't crash
      categories: ["Marketing", "Publicity", "Leadership"],
      topics: ["Branding", "Sponsorship", "Strategy"],
    },
    {
      title: "Curriculum Executive",
      type: ["Activity"],
      event: "NUS Product Club",
      date: "Aug 2025 - May 2026",
      location: "Singapore, Singapore",
      description: "Presented an internal A/B Testing analysis session at Product Club, showcasing statistical testing and product insights for feature rollout evaluation.",
      tags: ["Product Management", "A/B Testing", "Data Analytics", "Public Speaking"],
      image: "/me-presenting.jpg",
      icon: Lightbulb,
      categories: ["Publicity", "Education", "Workshops"],
      topics: ["A/B Testing", "Product Management", "Public Speaking"],
    }
  ];

  // --- Testimonials Data ---
  const testimonials = [
    {
      name: "Deyi Secondary School",
      title: "Student",
      date: "2015 - 2020",
      image: "deyi-logo.png",
      text: `Bernardino possessed a gentle disposition and had a smile for everyone. In his interactions with others, he showed sincerity and warmth. He was forthcoming in helping others and was well-liked by his peers, unassuming in his words and actions. He enjoyed the process of learning and was open to different perspectives. A diligent student, Bernardino displayed a positive learning attitude and determination to excel in his academic performance. He loved to challenge himself constantly and displayed the ability to carry out tasks with minimal supervision. He could be relied upon to do his best in whatever he embarked on.`,
    },
    {
      name: "Catholic Junior College",
      title: "Student",
      date: "2019 - 2020",
      image: "cj-logo.jpg",
      text: `Bernardino consistently carried himself as a diligent and self-directed student. Bernardino often seeks new opportunities to grow. Bernardino acknowledged the importance of being a good listener as well as getting everyone in the team to feel included. He strove to influence his team positively so that, collectively, the team was consistently up to tasks. A bright and respectful individual, Bernardino has a pleasant disposition and gets along well with his peers. His analytical mind and openness to experiences enables him to push his limits and to achieve his intended goals.`,
    },
    {
      name: "11C4I",
      title: "Army Reconnaissance Trooper",
      date: "2021 - 2023",
      image: "11c4i-logo.png",
      text: `His friendly character allowed him to overcome the cultural differences with his foreign counterparts. CFC Bernardino always takes the initiative to seek his Commanders and peers for advice to improve himself. His cheerful and welcoming personality enabled him to build strong working rapport with his superiors and peers. CFC Bernardino would certainly be a valuable member to any team that he may find himself part of in the future.`,
    },
    {
      name: "Superbank",
      title: "Operations (Data Science) Intern",
      date: "2025",
      image: "superbank-logo.webp",
      text: `Bernard has made great strides in technical skills, diving deeper into Python, SQL, and
machine learning workflows. He’s now much more comfortable exploring complex codebases and applying
advanced techniques to analyze and manipulate data. He’s getting much better at connecting technical findings to business insights. His
recent presentations have shown a clearer understanding of the “why” behind the numbers, helping stakeholders
see the business value of his work.
`,
    },
    {
      name: "Crayon Data",
      title: "AI Engineer Intern",
      date: "2025",
      image: "crayondata_logo.jpg",
      text: `He did a very strong job across the internship. He took on one of Crayon Data’s most complex and high-impact problem spaces — the Agentic Offer Management Portal — and handled it with depth, seriousness, and real ownership. He was methodical, thoughtful, and comfortable navigating messy, real-world complexity.

He stood out as a builder who genuinely wants to understand the problem deeply before jumping to solutions. His curiosity, approachability, and ability to grasp new concepts quickly were evident, and each iteration of his work showed meaningful progress driven by deeper understanding rather than surface-level changes.

His thinking consistently reflected strong systems awareness. He treated AI as a constrained tool that needs checks, auditability, and human-in-the-loop design — not as magic. His work on offer ingestion and unstructured data was grounded in real workflows and operational reality, which made his ideas feel credible and deployable.

The main opportunity for growth is moving from depth to decisiveness. He identified risks, edge cases, and unknowns thoroughly, but sometimes hesitated to clearly state which ones matter most right now and which are acceptable to defer. The next level is confidently saying, “This is the risk I care about most — and this is the one I’m willing to accept.”

Overall, he was a thoughtful, serious contributor who took ownership and pushed through ambiguity without freezing. With more explicit prioritisation and decision-making, he has strong potential to grow into roles that require systems thinking, operational leadership, and building at scale.`,
    },
  ];

  // Safe arrays (guard possibly-undefined data at usage sites)
  const eventsSafe = A(events);
  const projectsSafe = A(projects);
  const experiencesSafe = A(experiences);
  const competitionsSafe = A(competitions);
  const testimonialsSafe = A(testimonials);

  // Dynamically generate filter categories from all event categories (guarded)
  const filterCategories = Array.from(
    new Set(eventsSafe.flatMap(event => A<string>(event.categories)))
  ).filter((cat): cat is string => typeof cat === "string" && !!cat);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [expandedCompetitions, setExpandedCompetitions] = useState<Record<number, boolean>>({});

  // Date filter state
  const [selectedDate, setSelectedDate] = useState<string>("");
  // Sort order state
  const [dateSortOrder, setDateSortOrder] = useState<'asc' | 'desc'>('desc');

  // Get unique dates from events for dropdown (guarded)
  const eventDates = Array.from(new Set(eventsSafe.map(e => e?.date).filter(Boolean)));

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

  // Filter and sort events by category, date, and sort order (guarded)
  const filteredEvents = eventsSafe
    .filter(event => {
      const categoryMatch =
        selectedFilters.length === 0 ||
        selectedFilters.some(filter => A<string>(event.categories).includes(filter));
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Combine all searchable content into a single array for demonstration (guarded)
  const allContent = [
    ...experiencesSafe.map(e => ({ ...e, type: "experience" })),
    ...competitionsSafe.map(c => ({ ...c, type: "competition" })),
    ...projectsSafe.map(p => ({ ...p, type: "project" })),
    ...eventsSafe.map(ev => ({ ...ev, type: "event" })),
  ];

  const searchResults = searchQuery
    ? allContent.filter(item =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  }

  // replace your nav arrays (desktop and mobile) so "Skills" points to "#about"
  const NAV_LINKS = [
    { href: "#about", label: "About" },
    // point Skills to the About section
    { href: "#about", label: "Skills" },
    { href: "#experience", label: "Work Experience" },
    { href: "#competitions", label: "Competitions" },
    { href: "#projects", label: "Projects" },
    { href: "#events", label: "Events & Community" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
  ];

  // Helper to safely wrap arrays
  // export const A = <T,>(x: T[] | undefined | null): T[] => (Array.isArray(x) ? x : []);

  return (
    <div className="min-h-[60vh] pt-16 bg-gradient-to-b from-slate-900 to-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 lg:py-5">
          <div className="flex items-center justify-center flex-nowrap gap-6">
            <a
              href="#top"
              className="text-lg sm:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary flex-shrink-0"
              onClick={e => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Bernardino Lintang
            </a>
            {/* Desktop Nav — hidden below md */}
            <div className="hidden md:flex items-center gap-4 xl:gap-6 flex-nowrap">
              {NAV_LINKS.map(link => (
                <a key={`${link.href}-${link.label}`} href={link.href} className="nav-link whitespace-nowrap text-sm">
                  {link.label}
                </a>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hover:bg-accent flex-shrink-0"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Reveal>
        <section
          id="hero"
          className="relative flex items-center justify-center min-h-screen px-4 bg-background"
        >
          <div className="container mx-auto max-w-4xl flex flex-col items-center justify-center text-center text-foreground">
            <div className="mb-8 flex flex-col items-center">
              <ImageWithFallback
                src="/formal-picture.JPG"
                alt="Professional headshot"
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-primary/10"
                style={{ objectPosition: "center 10%" }}
              />
              <h1 className="text-3xl sm:text-4xl md:text-6xl mb-4">
                <span className="text-primary">Bernardino Lintang</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto px-2">
                AI Engineer building production GenAI systems, RAG pipelines, and data infrastructure. I ship LLM-powered products that actually work — with validation layers, schema enforcement, and measurable impact.
              </p>
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
                <MapPin className="w-4 h-4" />
                <span>Singapore, Singapore</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 hero-actions">
                {/* match left-toolbar style: icon + text, same spacing & intensity */}
                <a
                  href="mailto:lintangbernardino@gmail.com"
                  className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded-md hover:bg-primary/10 text-muted-foreground"
                  aria-label="Get in touch"
                >
                  <Mail className="w-4 h-4" />
                  <span>Get In Touch</span>
                </a>

                <a
                  href="https://github.com/bernardinolintang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded-md hover:bg-primary/10 text-muted-foreground"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/bernardino-lintang/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded-md hover:bg-primary/10 text-muted-foreground"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <ChevronDown className="w-6 h-6 text-muted-foreground animate-bounce" />
            </div>
          </div>
        </section>
      </Reveal>

      {/* About Section */}
      <Reveal>
        <section id="about" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Reveal variant="text" delay={0.1}>
            <h2 className="text-3xl mb-8 text-center">About Me</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              {/* About Text */}
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Engineer & Systems Builder
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    I build production AI systems — from LLM-powered ingestion pipelines that replace manual workflows, to RAG architectures serving policy-aligned responses at scale. My work sits at the intersection of applied ML, data engineering, and GenAI product development.
                  </p>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  I care about systems that are reliable, measurable, and actually deployed — not just prototyped. Every pipeline I build includes validation layers, observability, and a clear path to production. I think in terms of data contracts, schema enforcement, and failure modes before writing the first line of inference code.
                </p>
              </div>

              {/* Statistics Section */}
              <div className="mb-8 p-4 md:p-6 bg-card border rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-row gap-2 md:gap-4 items-center justify-between">
                  <div className="text-center group flex-1">
                    <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                      <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                      <div className="text-xl md:text-3xl font-bold text-primary group-hover:scale-105 transition-transform duration-200">{experiencesSafe.length}</div>
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">Internships</div>
                  </div>
                  <div className="text-center group flex-1">
                    <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                      <FolderKanban className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                      <div className="text-xl md:text-3xl font-bold text-primary group-hover:scale-105 transition-transform duration-200">{projectsSafe.length + competitionsSafe.length}</div>
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">Projects & Competitions</div>
                  </div>
                  <div className="text-center group flex-1">
                    <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                      <Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                      <div className="text-xl md:text-3xl font-bold text-primary group-hover:scale-105 transition-transform duration-200">{competitionsSafe.length}</div>
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">Competitions</div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="outline" asChild>
                  <a href="#contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Let's Connect
                  </a>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-xl mb-4">Skills & Technologies</h3>
              <div className="space-y-4">
                {Object.entries(skills ?? {}).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="mb-2 text-sm text-muted-foreground">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {A(items).map((skill) => (
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
      </Reveal>

      {/* Experience Section */}
      <Reveal>
        <section id="experience" className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <Reveal variant="text" delay={0.1}>
              <h2 className="text-3xl mb-8 text-center">Work Experience</h2>
            </Reveal>
            <div className="relative mt-8">
              {/* Vertical Timeline Line — hidden on mobile, visible on md+ */}
              <div className="hidden md:block absolute left-16 top-0 bottom-0 w-0.5 bg-border" />
              
              {/* Timeline Items */}
              <div className="space-y-8 md:space-y-12">
                {experiencesSafe.map((exp, index) => (
                  <Reveal key={exp.title} delay={0.03 * index}>
                    <div className="relative flex flex-col md:flex-row gap-2 md:gap-8">
                      {/* Timeline Date — above card on mobile, left side on md+ */}
                      <div className="flex-shrink-0 md:w-28 md:text-right pr-0 md:pr-4 pl-2 md:pl-0">
                        <div className="text-xs sm:text-sm font-medium text-muted-foreground mt-0 md:mt-1">
                          {exp.period}
                        </div>
                      </div>
                      
                      {/* Timeline Dot — hidden on mobile */}
                      <div className="hidden md:block absolute left-16 transform -translate-x-1/2 z-10">
                        <div className="w-4 h-4 rounded-full bg-primary border-4 border-background timeline-dot-glow" />
                      </div>
                      
                      {/* Experience Card */}
                      <div className="flex-1 min-w-0">
                        <Card className="ml-0 md:ml-8">
                          <CardHeader>
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <ImageWithFallback
                                  src={exp.logo}
                                  alt={`${exp.company} logo`}
                                  className="w-12 h-12 rounded-lg object-cover border border-border"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                  <Briefcase className="w-5 h-5 flex-shrink-0" />
                                  <span>{exp.title}</span>
                                </CardTitle>
                                <CardDescription className="text-base mt-1.5">
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
                                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                  <MapPin className="w-4 h-4" />
                                  <span>{exp.location}</span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                <p key={i} className="text-muted-foreground">{line}</p>
                              ))}
                            </div>
                            <div className="mt-6">
                              <div className="flex flex-wrap gap-2">
                                {A(exp.technologies).map((tech) => (
                                  <Badge key={tech} variant="outline">{tech}</Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>


      {/* Competitions Section */}
      <Reveal>
        <section id="competitions" className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <Reveal variant="text" delay={0.1}>
              <h2 className="text-3xl mb-8 text-center">Competitions</h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
              {competitionsSafe.map((competition, index) => {
                const isExpanded = expandedCompetitions[index] ?? false;
                return (
                <Reveal key={competition.title} delay={0.04 * index}>
                  <Card className={`overflow-hidden flex flex-col transition-all duration-300 ${isExpanded ? '' : 'h-[600px]'}`}>
                    <div className="aspect-video bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={competition.image}
                        alt={competition.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className={`pb-2 ${isExpanded ? '' : 'flex-1 overflow-hidden'}`}>
                      <CardTitle className="flex items-center gap-2 whitespace-pre-line leading-snug">
                        <Trophy className="w-5 h-5 flex-shrink-0" />
                        {competition.title}
                      </CardTitle>
                      {competition.date && (
                        <div className="text-sm text-muted-foreground mb-2">{competition.date}</div>
                      )}
                      <div
                        className="text-sm text-muted-foreground overflow-hidden"
                        style={isExpanded ? {} : { display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical' as const }}
                      >
                        {competition.description.split('\n\n').map((paragraph, idx) => {
                          const boldMatch = paragraph.match(/^(Problem|Approach|Result):(.*)/);
                          if (boldMatch) {
                            return (
                              <p key={idx} className={idx > 0 ? 'mt-3' : ''}>
                                <span className="font-bold text-foreground">{boldMatch[1]}:</span>{boldMatch[2]}
                              </p>
                            );
                          }
                          return <p key={idx} className={idx > 0 ? 'mt-3' : ''}>{paragraph}</p>;
                        })}
                      </div>
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline mt-2 self-start cursor-pointer"
                        onClick={() => setExpandedCompetitions(prev => ({ ...prev, [index]: !isExpanded }))}
                      >
                        {isExpanded ? 'Show less' : 'Show more...'}
                      </button>
                    </CardHeader>
                    <CardContent className="flex-shrink-0 pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {A(competition.technologies).map((tech) => (
                          <Badge key={tech} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Projects Section */}
      <Reveal>
        <section id="projects" className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <Reveal variant="text" delay={0.1}>
              <h2 className="text-3xl mb-8 text-center">Featured Projects</h2>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-6 justify-center">
              {/* Center the grid and its children */}
              {projectsSafe.map((project, index) => (
                <Reveal key={project.title} delay={0.04 * index}>
          <Card className="overflow-hidden">
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
              {/* Add GitHub link for IT1244 and Taylor Swift projects */}
              {project.title.includes("DNA-Binding Protein") && (
                <Button size="sm" variant="outline" asChild className="inline-block mt-2 w-full max-w-xs">
                  <a
                    href="https://github.com/bernardinolintang/IT1244-Project-DNA-Binding-Protein"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-start w-full gap-2 py-2 px-3 cursor-pointer"
                  >
                    <span className="flex-1 text-left">GitHub Repo</span>
                  </a>
                </Button>
              )}

              {project.title.includes("Taylor Swift") && (
                <Button size="sm" variant="outline" asChild className="inline-block mt-2 w-full max-w-xs">
                  <a
                    href="https://github.com/bernardinolintang/DSA2101-Taylor-Swift-Music-Analysis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-start w-full gap-2 py-2 px-3 cursor-pointer"
                  >
                    <span className="flex-1 text-left">GitHub Repo</span>
                  </a>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {A(project.technologies).map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
                </Reveal>
              ))}
            </div>
            <div className="text-center mt-8">
              <Reveal>
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
              </Reveal>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Events Section */}
        <section id="events" className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Reveal variant="text" delay={0.1}>
              <h2 className="text-3xl mb-8 text-center">Events & Community</h2>
            </Reveal>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Beyond my professional work, I actively grow within the developer and data community by attending talks, workshops, and industry events to expand my knowledge and stay ahead of emerging technologies.
          </p>
          
          {/* Filter Controls */}
          <Reveal delay={0.05}>
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter by Category</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="date-filter" className="text-sm text-muted-foreground">Date:</label>
                  <select
                    id="date-filter"
                    className="border rounded px-2 py-1.5 text-sm bg-background min-h-[36px]"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                  >
                    <option value="">All Dates</option>
                    {eventDates.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                  <label htmlFor="date-sort" className="text-sm text-muted-foreground ml-2 sm:ml-4">Sort:</label>
                  <select
                    id="date-sort"
                    className="border rounded px-2 py-1.5 text-sm bg-background min-h-[36px]"
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
                    className={`transition-all filter-pill ${selectedFilters.includes(category) ? "active" : ""}`}
                    aria-pressed={selectedFilters.includes(category)}
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
          </Reveal>

          <div className="flex flex-col gap-6">
            {filteredEvents.length === 0 ? (
              <Reveal>
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
              </Reveal>
            ) : (
              filteredEvents.map((event, index) => {
                 return (
                  <Reveal key={`${event.title}-${index}`} delay={0.03 * index}>
                   <Card
                     className="rounded-2xl border bg-card/60 backdrop-blur hover:border-primary/20 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 max-w-2xl mx-auto"
                   >
                    {/* Event Image */}
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl object-cover object-center shadow-sm flex-shrink-0"
                    />
                    {/* Event Content */}
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg md:text-xl font-semibold leading-snug">
                            {event.title}
                          </h3>
                           {event.link && (
                             <a
                               href={event.link}
                               target="_blank"
                               rel="noopener noreferrer"
                               aria-label={`Open ${event.title}`}
                               className="ml-2 text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                             >
                               <ExternalLink className="w-4 h-4" />
                             </a>
                           )}
                        </div>
                        <div className="text-muted-foreground text-sm mb-1">{event.event}</div>
                        <div className="flex flex-wrap gap-2 mb-1">
                          <Badge variant="secondary" className="w-fit text-xs">
                            {event.type}
                          </Badge>
                          {A<string>(event.categories).map((category) => (
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
                          {A<string>(event.topics).map((topic) => (
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
                  </Reveal>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsCarousel testimonials={testimonialsSafe} />

      {/* Contact Section */}
      <Reveal>
        <section id="contact" className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Reveal variant="text" delay={0.1}>
              <h2 className="text-3xl mb-8 text-center">Contact Me</h2>
            </Reveal>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Actively seeking AI Engineer, GenAI Engineer, ML Engineer, and Data Engineer roles for 2026. If you’re building production AI systems and need someone who ships, let’s talk.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="mx-auto md:mx-0"
            >
              <a
                href="mailto:lintangbernardino@gmail.com"
              >
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
      </Reveal>

      {/* Publicity moved into Events & Community as an event entry (see events array) */}

      {/* Footer */}
      <footer className="py-8 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-sm text-muted-foreground mb-2">
            &copy; 2026 Bernardino Lintang. All rights reserved.
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

      {/* Resume Access Modal */}
      <Dialog open={showResumeModal} onOpenChange={setShowResumeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Lock className="w-5 h-5 text-primary" />
              Resume Access
            </DialogTitle>
          </DialogHeader>

          <p className="text-muted-foreground text-sm leading-relaxed">
            If you'd like a copy of my resume, feel free to contact me on{" "}
            <a
              href="https://www.linkedin.com/messaging/compose/?recipient=bernardino-lintang&subject=Resume%20Request&body=Hi%20Bernardino%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20request%20a%20copy%20of%20your%20resume.%0A%0AThank%20you!"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              LinkedIn
            </a>
            {" "}or email me at{" "}
            <a
              href="mailto:lintangbernardino@gmail.com?subject=Resume%20Request&body=Hi%20Bernardino%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20request%20a%20copy%20of%20your%20resume.%0A%0AThank%20you!"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              lintangbernardino@gmail.com
            </a>.
          </p>

          {/* Contact buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button className="flex-1" asChild>
              <a
                href="mailto:lintangbernardino@gmail.com?subject=Resume%20Request&body=Hi%20Bernardino%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20request%20a%20copy%20of%20your%20resume.%0A%0AThank%20you!"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Me
              </a>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a
                href="https://www.linkedin.com/messaging/compose/?recipient=bernardino-lintang&subject=Resume%20Request&body=Hi%20Bernardino%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20request%20a%20copy%20of%20your%20resume.%0A%0AThank%20you!"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                Message on LinkedIn
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Portfolio;