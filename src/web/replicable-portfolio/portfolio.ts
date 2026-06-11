export interface CvEntry {
  title: string;
  organization: string;
  location: string;
  period: string;
  summary: string;
  technologies?: string[];
}

export interface WritingSeries {
  slug: string;
  label: string;
  description: string;
}

export const PROFILE = {
  name: "Diogo Pereira-Marques",
  eyebrow: "PERSONAL PORTFOLIO",
  title: "The Office of Diogo Pereira-Marques",
  description:
    "Builder of AI systems at the boundary of software engineering and science, shaping products across drug discovery, platform engineering, and computational research.",
  currentRole:
    "Principal AI Engineer at Roche, working where software engineering, scientific infrastructure, and machine intelligence meet.",
};

export const WRITING_SERIES: WritingSeries[] = [
  {
    slug: "founders-dillemma",
    label: "Founders Dillemma",
    description:
      "Notes on building, deciding, and staying intellectually honest while speed, conviction, and survival pull in different directions.",
  },
];

export const CV_HIGHLIGHTS = [
  "AI systems for scientific and software workflows",
  "Platform and product engineering in regulated environments",
  "Leadership across research, cloud, and computational biology teams",
];

export const EXPERIENCE: CvEntry[] = [
  {
    title: "Principal AI Engineer",
    organization: "Roche",
    location: "London, United Kingdom",
    period: "Jan 2026 – Present",
    summary:
      "Building lab-in-the-loop AI systems for accelerated drug discovery and platform thinking inside computational sciences.",
    technologies: ["Python", "FastAPI", "React", "TypeScript", "Docker", "PostgreSQL", "AWS"],
  },
  {
    title: "Lead Software Engineer",
    organization: "Novo Nordisk",
    location: "Oxford and London, United Kingdom",
    period: "Oct 2023 – Dec 2025",
    summary:
      "Led cloud-based GenAI products at the intersection of machine learning, computational biology, and software engineering.",
    technologies: ["Python", "TypeScript", "React", "Terraform", "Azure", "PostgreSQL", "MLflow"],
  },
  {
    title: "Senior Platform Engineer",
    organization: "Novo Nordisk",
    location: "Copenhagen, Denmark",
    period: "Jan 2023 – Oct 2023",
    summary:
      "Worked on enterprise data and platform engineering for internal product teams, with a strong focus on cloud infrastructure and operating models.",
    technologies: ["Python", "TypeScript", "CDK", "Docker", "AWS", "Elasticsearch"],
  },
  {
    title: "Senior Software Engineer",
    organization: "Novo Nordisk",
    location: "Copenhagen, Denmark",
    period: "Sep 2020 – Jan 2023",
    summary:
      "Built data-intensive systems for laboratory automation, analytics, and pharmaceutical manufacturing workflows.",
    technologies: ["Python", "FastAPI", "React", "PostgreSQL", "Grafana", "AWS"],
  },
  {
    title: "Software Engineer",
    organization: "A.P. Moller – Maersk",
    location: "Copenhagen, Denmark",
    period: "Oct 2019 – Sep 2020",
    summary:
      "Worked on logistics platforms and forecasting systems for routing, insurance, and operations at shipping scale.",
    technologies: ["Python", "PySpark", "Databricks", "Docker"],
  },
  {
    title: "Software Engineer",
    organization: "Airbus",
    location: "Toulouse, France",
    period: "Sep 2018 – Sep 2019",
    summary:
      "Built analytical pipelines and productized data flows inside the Skywise ecosystem for fleet reliability and quality.",
    technologies: ["Python", "PySpark", "Palantir Foundry", "PostgreSQL", "Docker"],
  },
  {
    title: "Software Engineer",
    organization: "Accenture",
    location: "Lisbon, Portugal",
    period: "Sep 2017 – Aug 2018",
    summary:
      "Worked across consulting engagements spanning healthcare, telco, and large-scale data engineering systems.",
    technologies: ["Python", "Java", "PySpark", "Cloudera", "C# ASP.NET", "MySQL"],
  },
];

export const EDUCATION: CvEntry[] = [
  {
    title: "MSc, Computer Science",
    organization: "University of Copenhagen",
    location: "Copenhagen, Denmark",
    period: "2021",
    summary:
      "Signal and image processing, Fourier analysis, wavelets, and deep learning.",
  },
  {
    title: "BSc, Computer Software Engineering",
    organization: "University of Lisbon",
    location: "Lisbon, Portugal",
    period: "2015 – 2017",
    summary:
      "Computer architecture, networks, distributed systems, algorithms, and machine learning.",
  },
  {
    title: "BSc, Mathematics",
    organization: "University of Lisbon",
    location: "Lisbon, Portugal",
    period: "2014 – 2015",
    summary: "Calculus, algebra, discrete mathematics, and logic.",
  },
  {
    title: "BPhil, Philosophy",
    organization: "University of Lisbon",
    location: "Lisbon, Portugal",
    period: "2011 – 2014",
    summary:
      "Logic, philosophy of mathematics, mathematical logic, and philosophy of language.",
  },
];

export const OPEN_SOURCE = [
  {
    name: "TopGun",
    description: "Harness engineering for high-performance teams.",
    url: "https://github.com/diogobaltazar/TopGun",
  },
  {
    name: "Move37",
    description: "AI-powered drug-target interaction and molecular movement analysis.",
    url: "https://github.com/Genentech/Move37",
  },
];
