import {
  useState, useLayoutEffect, useRef, useEffect,
  type ComponentType, type CSSProperties, type ElementType, type FormEvent, type MouseEvent,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Database, Cloud, Anchor, Plane, Briefcase,
  Code, BookOpen, Calculator, FlaskConical, Dna,
  Download, Check, Info,
} from 'lucide-react'
import { FaGithub as GithubIcon, FaAws as AwsIcon, FaMicrosoft as MicrosoftIcon } from 'react-icons/fa'
import {
  SiPython, SiTypescript, SiJavascript, SiDocker, SiGit, SiGithub,
  SiReact, SiPytorch, SiPostgresql, SiElasticsearch, SiApachespark,
  SiPalantir, SiMlflow, SiDatabricks, SiCloudera, SiAnthropic,
  SiOpenjdk, SiDotnet, SiApachehadoop, SiKubernetes, SiTerraform,
  SiLangchain, SiOpenai, SiNodedotjs,
  SiRedis, SiMongodb, SiMysql, SiSqlite, SiClickhouse, SiDuckdb,
  SiSnowflake, SiOpensearch, SiPrometheus, SiGrafana,
  SiApacheairflow, SiDbt, SiPolars, SiPandas, SiNumpy, SiScipy,
  SiJupyter, SiFastapi, SiFlask, SiDjango, SiRust, SiScala,
  SiApachekafka, SiRabbitmq, SiNginx, SiLinux, SiUbuntu,
  SiVuedotjs, SiAngular, SiSvelte, SiAstro,
  SiTailwindcss, SiWebpack, SiVite, SiVitest, SiFigma, SiFramer,
  SiVercel, SiNetlify, SiHeroku, SiCloudflare, SiFirebase, SiSupabase,
  SiPrisma, SiStreamlit, SiGradio, SiOllama, SiHuggingface,
  SiMistralai, SiPydantic, SiSentry, SiDatadog, SiJira, SiNotion, SiSlack,
  SiGooglecloud, SiPytest, SiGraphql, SiOkta,
} from 'react-icons/si'
import GitGraph from '../components/GitGraph'
import { useGlobeCtx, type CityClickAnchor } from '../context/GlobeContext'
import { useTheme } from '../context/ThemeContext'

type IconComponent = ComponentType<{ size?: number; style?: CSSProperties }>

const DESKTOP_GLOBE_WIDTH = '44vw'
const FONT = {
  eyebrow: '0.68rem',
  micro: '0.72rem',
  meta: '0.78rem',
  body: '0.84rem',
  bodyLg: '0.96rem',
  title: '0.95rem',
} as const

const SECTION_LABEL_STYLE: CSSProperties = {
  fontSize: FONT.eyebrow,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  margin: 0,
}

const CARD_STYLE: CSSProperties = {
  padding: '0.95rem 1rem',
  border: '1px solid var(--border)',
  borderRadius: 8,
  background: 'var(--card-bg)',
}

function AwsCdkIcon({ size = 16 }: { size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="16,1 29,8.5 29,23.5 16,31 3,23.5 3,8.5" fill="currentColor" />
      <text x="16" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="monospace" fill="var(--bg)">CDK</text>
    </svg>
  )
}

const TECH_ICON_MAP: Record<string, IconComponent> = {
  python: SiPython,
  ts: SiTypescript,
  typescript: SiTypescript,
  js: SiJavascript,
  javascript: SiJavascript,
  docker: SiDocker,
  git: SiGit,
  github: SiGithub,
  react: SiReact,
  pytorch: SiPytorch,
  postgresql: SiPostgresql,
  psql: SiPostgresql,
  elasticsearch: SiElasticsearch,
  pyspark: SiApachespark,
  spark: SiApachespark,
  'apache spark': SiApachespark,
  'palantir foundry': SiPalantir,
  palantir: SiPalantir,
  mlflow: SiMlflow,
  databricks: SiDatabricks,
  cloudera: SiCloudera,
  'cloudera hadoop': SiCloudera,
  hadoop: SiApachehadoop,
  'claude api': SiAnthropic,
  anthropic: SiAnthropic,
  java: SiOpenjdk,
  openjdk: SiOpenjdk,
  'c# asp.net': SiDotnet,
  'asp.net': SiDotnet,
  dotnet: SiDotnet,
  kubernetes: SiKubernetes,
  terraform: SiTerraform,
  cdk: AwsCdkIcon,
  'aws cdk': AwsCdkIcon,
  langchain: SiLangchain,
  openai: SiOpenai,
  codex: SiOpenai,
  node: SiNodedotjs,
  nodejs: SiNodedotjs,
  redis: SiRedis,
  mongodb: SiMongodb,
  mongo: SiMongodb,
  mysql: SiMysql,
  sqlite: SiSqlite,
  clickhouse: SiClickhouse,
  duckdb: SiDuckdb,
  snowflake: SiSnowflake,
  opensearch: SiOpensearch,
  airflow: SiApacheairflow,
  'apache airflow': SiApacheairflow,
  dbt: SiDbt,
  polars: SiPolars,
  pandas: SiPandas,
  numpy: SiNumpy,
  scipy: SiScipy,
  jupyter: SiJupyter,
  prometheus: SiPrometheus,
  grafana: SiGrafana,
  streamlit: SiStreamlit,
  gradio: SiGradio,
  ollama: SiOllama,
  huggingface: SiHuggingface,
  'hugging face': SiHuggingface,
  mistral: SiMistralai,
  mistralai: SiMistralai,
  pydantic: SiPydantic,
  pytest: SiPytest,
  fastapi: SiFastapi,
  flask: SiFlask,
  django: SiDjango,
  rust: SiRust,
  scala: SiScala,
  kafka: SiApachekafka,
  rabbitmq: SiRabbitmq,
  nginx: SiNginx,
  linux: SiLinux,
  ubuntu: SiUbuntu,
  prisma: SiPrisma,
  supabase: SiSupabase,
  firebase: SiFirebase,
  vue: SiVuedotjs,
  angular: SiAngular,
  svelte: SiSvelte,
  astro: SiAstro,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  webpack: SiWebpack,
  vite: SiVite,
  vitest: SiVitest,
  figma: SiFigma,
  framer: SiFramer,
  gcp: SiGooglecloud,
  'google cloud': SiGooglecloud,
  vercel: SiVercel,
  netlify: SiNetlify,
  heroku: SiHeroku,
  cloudflare: SiCloudflare,
  graphql: SiGraphql,
  azure: MicrosoftIcon,
  aci: MicrosoftIcon,
  entraid: MicrosoftIcon,
  okta: SiOkta,
  sentry: SiSentry,
  datadog: SiDatadog,
  jira: SiJira,
  notion: SiNotion,
  slack: SiSlack,
  aws: AwsIcon,
}

const TECH_LINK_MAP: Record<string, string> = {
  python: 'https://www.python.org',
  ts: 'https://www.typescriptlang.org',
  typescript: 'https://www.typescriptlang.org',
  js: 'https://developer.mozilla.org/docs/Web/JavaScript',
  javascript: 'https://developer.mozilla.org/docs/Web/JavaScript',
  docker: 'https://www.docker.com',
  git: 'https://git-scm.com',
  github: 'https://github.com',
  react: 'https://react.dev',
  pytorch: 'https://pytorch.org',
  postgresql: 'https://www.postgresql.org',
  psql: 'https://www.postgresql.org',
  elasticsearch: 'https://www.elastic.co/elasticsearch',
  pyspark: 'https://spark.apache.org',
  spark: 'https://spark.apache.org',
  'apache spark': 'https://spark.apache.org',
  'palantir foundry': 'https://www.palantir.com/platforms/foundry',
  palantir: 'https://www.palantir.com',
  mlflow: 'https://mlflow.org',
  databricks: 'https://www.databricks.com',
  cloudera: 'https://www.cloudera.com',
  'cloudera hadoop': 'https://hadoop.apache.org',
  hadoop: 'https://hadoop.apache.org',
  'claude api': 'https://www.anthropic.com/api',
  anthropic: 'https://www.anthropic.com',
  java: 'https://openjdk.org',
  openjdk: 'https://openjdk.org',
  'c# asp.net': 'https://dotnet.microsoft.com/apps/aspnet',
  'asp.net': 'https://dotnet.microsoft.com/apps/aspnet',
  dotnet: 'https://dotnet.microsoft.com',
  kubernetes: 'https://kubernetes.io',
  terraform: 'https://developer.hashicorp.com/terraform',
  cdk: 'https://docs.aws.amazon.com/cdk',
  'aws cdk': 'https://docs.aws.amazon.com/cdk',
  langchain: 'https://www.langchain.com',
  openai: 'https://openai.com',
  codex: 'https://openai.com/codex',
  node: 'https://nodejs.org',
  nodejs: 'https://nodejs.org',
  redis: 'https://redis.io',
  mongodb: 'https://www.mongodb.com',
  mongo: 'https://www.mongodb.com',
  mysql: 'https://www.mysql.com',
  sqlite: 'https://www.sqlite.org',
  clickhouse: 'https://clickhouse.com',
  duckdb: 'https://duckdb.org',
  snowflake: 'https://www.snowflake.com',
  opensearch: 'https://opensearch.org',
  airflow: 'https://airflow.apache.org',
  'apache airflow': 'https://airflow.apache.org',
  dbt: 'https://www.getdbt.com',
  polars: 'https://pola.rs',
  pandas: 'https://pandas.pydata.org',
  numpy: 'https://numpy.org',
  scipy: 'https://scipy.org',
  jupyter: 'https://jupyter.org',
  prometheus: 'https://prometheus.io',
  grafana: 'https://grafana.com',
  streamlit: 'https://streamlit.io',
  gradio: 'https://www.gradio.app',
  ollama: 'https://ollama.com',
  huggingface: 'https://huggingface.co',
  'hugging face': 'https://huggingface.co',
  mistral: 'https://mistral.ai',
  mistralai: 'https://mistral.ai',
  pydantic: 'https://docs.pydantic.dev',
  pytest: 'https://pytest.org',
  fastapi: 'https://fastapi.tiangolo.com',
  flask: 'https://flask.palletsprojects.com',
  django: 'https://www.djangoproject.com',
  rust: 'https://www.rust-lang.org',
  scala: 'https://scala-lang.org',
  kafka: 'https://kafka.apache.org',
  rabbitmq: 'https://www.rabbitmq.com',
  nginx: 'https://nginx.org',
  linux: 'https://www.kernel.org',
  ubuntu: 'https://ubuntu.com',
  prisma: 'https://www.prisma.io',
  supabase: 'https://supabase.com',
  firebase: 'https://firebase.google.com',
  vue: 'https://vuejs.org',
  angular: 'https://angular.dev',
  svelte: 'https://svelte.dev',
  astro: 'https://astro.build',
  tailwind: 'https://tailwindcss.com',
  tailwindcss: 'https://tailwindcss.com',
  webpack: 'https://webpack.js.org',
  vite: 'https://vite.dev',
  vitest: 'https://vitest.dev',
  figma: 'https://www.figma.com',
  framer: 'https://www.framer.com',
  gcp: 'https://cloud.google.com',
  'google cloud': 'https://cloud.google.com',
  vercel: 'https://vercel.com',
  netlify: 'https://www.netlify.com',
  heroku: 'https://www.heroku.com',
  cloudflare: 'https://www.cloudflare.com',
  graphql: 'https://graphql.org',
  azure: 'https://azure.microsoft.com',
  aci: 'https://learn.microsoft.com/azure/container-instances',
  entraid: 'https://www.microsoft.com/security/business/microsoft-entra',
  okta: 'https://www.okta.com',
  sentry: 'https://sentry.io',
  datadog: 'https://www.datadoghq.com',
  jira: 'https://www.atlassian.com/software/jira',
  notion: 'https://www.notion.so',
  slack: 'https://slack.com',
  aws: 'https://aws.amazon.com',
  alembic: 'https://alembic.sqlalchemy.org',
  langfuse: 'https://langfuse.com',
}

type CapturePhase = 'idle' | 'open' | 'done'
type LocationKey = 'lisbon' | 'toulouse' | 'copenhagen' | 'london'
type ArcId =
  | 'lisbon-toulouse'
  | 'toulouse-copenhagen'
  | 'copenhagen-london'
  | 'lisbon-copenhagen-edu'
  | null

interface Tag {
  icon: ElementType
  label: string
}

interface ClosedSourceProject {
  name: string
  description: string
  tags: string[]
  status: 'shipped' | 'internal' | 'deprecated' | 'ongoing'
  source?: 'closed' | 'inner'
  url?: string
}

interface TimelineEntry {
  id: string
  type: 'industry' | 'education'
  title: string
  organization: string
  organizationUrl?: string
  location: LocationKey
  locationLabel: string
  period: string
  startYear: number
  startTs: number
  endTs: number | null
  team?: string
  teamUrl?: string
  description?: string
  tags?: string
  tags2?: Tag[]
  note?: string
  thesis?: string
  arcId: ArcId
  closedSource?: ClosedSourceProject[]
}

interface CityPickerState {
  locationKey: LocationKey
  entryIndices: number[]
  anchor?: CityClickAnchor
}

const LOCATION_LABELS: Record<LocationKey, string> = {
  lisbon: 'Lisbon',
  toulouse: 'Toulouse',
  copenhagen: 'Copenhagen',
  london: 'London',
}

function ts(year: number, month = 1, day = 1) {
  return Date.UTC(year, month - 1, day)
}

function normaliseTech(tag: string) {
  return tag.trim().toLowerCase()
}

function useCompactLayout(breakpoint = 1100) {
  const [compact, setCompact] = useState(() => (
    typeof window !== 'undefined'
      ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches
      : false
  ))

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const onChange = () => setCompact(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [breakpoint])

  return compact
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getPickerPosition() {
  if (typeof window === 'undefined') {
    return { top: 132, left: 24 }
  }

  const popupWidth = 250
  const popupHeight = 260
  const compact = window.innerWidth <= 1100

  if (compact) {
    return {
      top: clamp((window.innerHeight - popupHeight) / 2, 88, window.innerHeight - popupHeight - 24),
      left: clamp((window.innerWidth - popupWidth) / 2, 24, window.innerWidth - popupWidth - 24),
    }
  }

  const rightPaneWidth = window.innerWidth * 0.44
  const mainListWidth = window.innerWidth - rightPaneWidth

  return {
    top: clamp((window.innerHeight - popupHeight) / 2, 88, window.innerHeight - popupHeight - 24),
    left: clamp(mainListWidth + (rightPaneWidth - popupWidth) / 2, 24, window.innerWidth - popupWidth - 24),
  }
}

function branchLabel(entry: { type: 'industry' | 'education'; title: string }) {
  const prefix = entry.type === 'industry' ? 'industry' : 'education'
  const slug = entry.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${prefix}/${slug}`
}

const ORG_LOGO: Record<string, { src: string; height?: number }> = {
  roche: { src: '/logos/roche.svg', height: 18 },
  'nn-lead': { src: '/logos/novo-nordisk.svg' },
  'nn-platform': { src: '/logos/novo-nordisk.svg' },
  'nn-senior': { src: '/logos/novo-nordisk.svg' },
  maersk: { src: '/logos/maersk.svg' },
  airbus: { src: '/logos/airbus.svg' },
  'accenture-se': { src: '/logos/accenture.svg', height: 18 },
  'accenture-fsd': { src: '/logos/accenture.svg', height: 18 },
  ku: { src: '/logos/ku.svg' },
  'fcul-cs': { src: '/logos/ulisboa.svg' },
  'fcul-math': { src: '/logos/ulisboa.svg' },
  'flul-phil': { src: '/logos/ulisboa.svg' },
}

const PROJECTS = [
  {
    name: 'TopGun',
    org: 'diogobaltazar',
    url: 'https://github.com/diogobaltazar/TopGun',
    description: 'Harness Engineering for high-performance teams.',
    tags: ['python', 'typescript', 'react', 'anthropic', 'langchain', 'fastapi', 'pydantic', 'docker', 'javascript', 'git', 'github', 'mlflow', 'grafana', 'kubernetes', 'aws'],
  },
  {
    name: 'Move37',
    org: 'Genentech',
    url: 'https://github.com/Genentech/Move37',
    description: 'AI-powered drug-target interaction and molecular movement analysis.',
    tags: ['python', 'fastapi', 'docker', 'java', 'javascript', 'react', 'git', 'github', 'mlflow', 'grafana', 'kubernetes', 'aws'],
  },
] as const

const TIMELINE: TimelineEntry[] = [
  {
    id: 'roche', type: 'industry',
    title: 'Principal AI Engineer',
    organization: 'Roche', organizationUrl: 'https://www.roche.com',
    location: 'london', locationLabel: 'London · UK',
    period: 'Jan 2026 – Present', startYear: 2026,
    startTs: ts(2026, 1), endTs: null,
    team: 'gRED Computational Sciences',
    description: 'Lab-in-the-loop systems for accelerated drug discovery.',
    tags2: [{ icon: Brain, label: 'AI / ML' }, { icon: FlaskConical, label: 'Target Discovery' }, { icon: Dna, label: 'Computational Biology' }],
    arcId: 'copenhagen-london',
    closedSource: [
      {
        name: 'EpicShelter',
        description: 'Unveiling Roche systems dependencies to form a knowledge base for refactoring priorities, decommissions, and platform opportunities.',
        tags: ['python', 'huggingface', 'typescript', 'react', 'claude api', 'langchain', 'fastapi', 'pydantic', 'docker', 'kubernetes', 'git', 'github', 'postgresql', 'aws cdk', 'mlflow', 'alembic', 'langfuse', 'grafana'],
        status: 'ongoing',
        source: 'inner',
      },
      {
        name: 'AutoLab',
        description: 'Autonomous experimental-design loop for oligonucleotide workflows, connecting planning, execution, and learning.',
        tags: ['python', 'claude api', 'langchain', 'fastapi', 'pydantic', 'react', 'typescript', 'docker', 'aws', 'postgresql', 'mlflow', 'alembic', 'langfuse', 'grafana'],
        status: 'ongoing',
        source: 'inner',
      },
    ],
  },
  {
    id: 'nn-lead', type: 'industry',
    title: 'Lead Software Engineer',
    organization: 'Novo Nordisk', organizationUrl: 'https://www.novonordisk.com',
    location: 'london', locationLabel: 'Oxford and London · UK',
    period: 'Oct 2023 – Dec 2025', startYear: 2023,
    startTs: ts(2023, 10), endTs: ts(2025, 12),
    team: 'R&ED – Target Discovery',
    description: 'Cloud-based GenAI products blending ML, computational biology, and software engineering.',
    tags2: [{ icon: Brain, label: 'AI / ML' }, { icon: FlaskConical, label: 'Target Discovery' }, { icon: Dna, label: 'Computational Biology' }],
    arcId: 'copenhagen-london',
    closedSource: [
      {
        name: 'Gennyx',
        description: 'Scientific committee assistant for streamlining review workflows and decision support.',
        tags: ['python', 'typescript', 'react', 'codex', 'langchain', 'fastapi', 'pydantic', 'docker', 'aci', 'azure', 'terraform', 'postgresql', 'mlflow', 'alembic', 'langfuse', 'grafana', 'okta', 'entraid'],
        status: 'shipped',
        source: 'inner',
      },
      {
        name: 'Bio Reasoning FM Training',
        description: 'Infrastructure for foundation-model training on OMICS data with scalable biological sequence pipelines.',
        tags: ['python', 'mlflow', 'docker', 'kubernetes', 'aws', 'graphql', 'aws cdk'],
        status: 'ongoing',
        source: 'inner',
      },
    ],
  },
  {
    id: 'nn-platform', type: 'industry',
    title: 'Senior Platform Engineer',
    organization: 'Novo Nordisk', organizationUrl: 'https://www.novonordisk.com',
    location: 'copenhagen', locationLabel: 'Copenhagen · Denmark',
    period: 'Jan 2023 – Oct 2023', startYear: 2023,
    startTs: ts(2023, 1), endTs: ts(2023, 10),
    tags2: [{ icon: Cloud, label: 'Cloud & Platform' }, { icon: Database, label: 'Data Engineering' }],
    arcId: 'toulouse-copenhagen',
    closedSource: [
      {
        name: 'DataHub',
        description: 'Enterprise data mesh platform adapted from DataAll for regulated and event-driven product teams.',
        tags: ['python', 'typescript', 'react', 'cdk', 'docker', 'postgresql', 'elasticsearch', 'aws', 'github'],
        status: 'internal',
        source: 'inner',
        url: 'https://github.com/awslabs/aws-dataall',
      },
    ],
  },
  {
    id: 'ku', type: 'education',
    title: 'MSc, Computer Science',
    organization: 'University of Copenhagen',
    organizationUrl: 'https://kurser.ku.dk/course/ndaa09027u',
    location: 'copenhagen', locationLabel: 'Copenhagen · Denmark',
    description: 'Signal and image processing with Fourier analysis, wavelets, and deep learning.',
    period: '2021 – 2021', startYear: 2021,
    startTs: ts(2021, 1), endTs: ts(2021, 8),
    tags2: [{ icon: Code, label: 'Computer Science' }, { icon: Brain, label: 'AI / ML' }],
    arcId: 'lisbon-copenhagen-edu',
  },
  {
    id: 'nn-senior', type: 'industry',
    title: 'Senior Software Engineer',
    organization: 'Novo Nordisk', organizationUrl: 'https://www.novonordisk.com',
    location: 'copenhagen', locationLabel: 'Copenhagen · Denmark',
    period: 'Sep 2020 – Jan 2023', startYear: 2020,
    startTs: ts(2020, 9), endTs: ts(2023, 1),
    team: 'Chemistry, Manufacturing and Controls (CMC) – Lab Automation',
    tags2: [{ icon: Database, label: 'Data Engineering' }, { icon: Code, label: 'Software Engineering' }, { icon: FlaskConical, label: 'Pharma' }],
    arcId: 'toulouse-copenhagen',
    closedSource: [
      {
        name: 'CMC Campaign Cockpit',
        description: 'Real-time visualisation and anomaly alerts for toxicity and critical quality attributes in API campaigns.',
        tags: ['typescript', 'python', 'react', 'fastapi', 'postgresql', 'grafana', 'docker', 'aws'],
        status: 'shipped',
        source: 'inner',
      },
      {
        name: 'HPLC Performance',
        description: 'Predictive models for chromatography-column degradation, maintenance scheduling, and idle-time reduction.',
        tags: ['python', 'fastapi', 'docker', 'aws', 'aws cdk', 'github'],
        status: 'shipped',
        source: 'inner',
      },
    ],
  },
  {
    id: 'maersk', type: 'industry',
    title: 'Software Engineer',
    organization: 'A.P. Moller – Maersk', organizationUrl: 'https://www.maersk.com',
    location: 'copenhagen', locationLabel: 'Copenhagen · Denmark',
    period: 'Oct 2019 – Sep 2020', startYear: 2019,
    startTs: ts(2019, 10), endTs: ts(2020, 9),
    tags2: [{ icon: Anchor, label: 'Shipping & Logistics' }, { icon: Database, label: 'Data Engineering' }],
    arcId: 'toulouse-copenhagen',
    closedSource: [
      {
        name: 'InRoute',
        description: 'Inland container routing and capacity forecasting across intermodal logistics networks.',
        tags: ['python', 'pyspark', 'databricks', 'docker', 'git'],
        status: 'internal',
        source: 'closed',
      },
      {
        name: 'Emma',
        description: 'Booking insurance backend managing policy creation, validation, and claims workflows.',
        tags: ['python', 'fastapi', 'postgresql', 'docker', 'git', 'alembic'],
        status: 'internal',
        source: 'closed',
      },
    ],
  },
  {
    id: 'airbus', type: 'industry',
    title: 'Software Engineer',
    organization: 'Airbus', organizationUrl: 'https://www.airbus.com',
    location: 'toulouse', locationLabel: 'Toulouse · France',
    period: 'Sep 2018 – Sep 2019', startYear: 2018,
    startTs: ts(2018, 9), endTs: ts(2019, 9),
    description: 'Skywise Core',
    teamUrl: 'https://www.airbus.com/en/products-services/digital-services/skywise',
    tags2: [{ icon: Plane, label: 'Aerospace' }, { icon: Database, label: 'Data Engineering' }],
    note: 'contractor',
    arcId: 'lisbon-toulouse',
    closedSource: [
      {
        name: 'Skywise / Fleet Reliability',
        description: 'Analytical pipelines benchmarking aircraft reliability KPIs across global fleets.',
        tags: ['python', 'pyspark', 'javascript', 'palantir foundry', 'postgresql', 'elasticsearch', 'docker', 'git'],
        status: 'shipped',
        source: 'closed',
      },
      {
        name: 'A350 Quality',
        description: 'Migration of the A350 quality platform to Palantir Foundry for final-assembly quality assurance.',
        tags: ['python', 'pyspark', 'palantir foundry', 'postgresql', 'docker', 'git'],
        status: 'shipped',
        source: 'closed',
      },
    ],
  },
  {
    id: 'accenture-se', type: 'industry',
    title: 'Software Engineer',
    organization: 'Accenture', organizationUrl: 'https://www.accenture.com',
    location: 'lisbon', locationLabel: 'Lisbon Area · Portugal',
    period: 'Sep 2017 – Aug 2018', startYear: 2018,
    startTs: ts(2018, 3), endTs: ts(2018, 8),
    tags2: [{ icon: Briefcase, label: 'Consulting' }, { icon: Database, label: 'Data Engineering' }],
    arcId: null,
    closedSource: [
      {
        name: 'Client360',
        description: 'Unified customer analytics layer on Cloudera Hadoop for CRM, billing, and telco usage data.',
        tags: ['python', 'pyspark', 'java', 'cloudera hadoop', 'postgresql', 'git'],
        status: 'internal',
        source: 'closed',
      },
      {
        name: 'In-Premises Cloudera Hadoop Datalake',
        description: 'Petabyte-scale ingestion, governance, and serving layers for structured and semi-structured telco data.',
        tags: ['python', 'pyspark', 'java', 'cloudera hadoop', 'kafka', 'docker', 'git'],
        status: 'deprecated',
        source: 'closed',
      },
      {
        name: 'ClinFlow',
        description: 'Clinical workflow automation platform for patient orchestration, bed management, and inter-department handoffs.',
        tags: ['C# ASP.NET', 'js', 'mysql', 'docker', 'git'],
        status: 'shipped',
        source: 'closed',
      },
    ],
  },
  {
    id: 'fcul-cs', type: 'education',
    title: 'BSc, Computer Software Engineering',
    organization: 'University of Lisbon',
    organizationUrl: 'https://ciencias.ulisboa.pt',
    location: 'lisbon', locationLabel: 'Lisbon · Portugal',
    period: '2015 – 2017', startYear: 2015,
    startTs: ts(2015, 9), endTs: ts(2017, 6),
    description: 'Computer architecture, networks, operating systems, distributed systems, algorithms, and machine learning.',
    tags2: [{ icon: Code, label: 'Computer Science' }, { icon: Brain, label: 'AI / ML' }],
    arcId: null,
  },
  {
    id: 'fcul-math', type: 'education',
    title: 'BSc, Mathematics',
    organization: 'University of Lisbon',
    organizationUrl: 'https://ciencias.ulisboa.pt',
    location: 'lisbon', locationLabel: 'Lisbon · Portugal',
    period: '2014 – 2015', startYear: 2014,
    startTs: ts(2014, 9), endTs: ts(2015, 6),
    description: 'Calculus, algebra, discrete mathematics, and logic.',
    tags2: [{ icon: Calculator, label: 'Mathematics' }],
    arcId: null,
  },
  {
    id: 'flul-phil', type: 'education',
    title: 'BPhil, Philosophy',
    organization: 'University of Lisbon',
    organizationUrl: 'https://letras.ulisboa.pt',
    location: 'lisbon', locationLabel: 'Lisbon · Portugal',
    period: '2011 – 2014', startYear: 2011,
    startTs: ts(2011, 9), endTs: ts(2014, 6),
    description: 'Logic, philosophy of mathematics, mathematical logic, and philosophy of language.',
    thesis: 'The Logicist Program of Arithmetic: Frege and Russell',
    tags2: [{ icon: BookOpen, label: 'Philosophy' }, { icon: Calculator, label: 'Mathematics' }, { icon: Calculator, label: 'Logic' }],
    arcId: null,
  },
]

function TechPill({ tag, size = 15 }: { tag: string; size?: number }) {
  const key = normaliseTech(tag)
  const Icon = TECH_ICON_MAP[key]
  const href = TECH_LINK_MAP[key]

  const content = Icon ? (
    <span className="tech-icon tech-chip" data-label={tag} style={{ minWidth: 28, paddingInline: '0.35rem', color: 'var(--fg)' }}>
      <Icon size={size} />
    </span>
  ) : (
    <span className="tech-chip">{tag}</span>
  )

  if (!href) return content

  return (
    <a
      key={tag}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="tech-link"
      aria-label={`${tag} homepage`}
      title={`${tag} homepage`}
    >
      {content}
    </a>
  )
}

function TechWall({ tags, size = 15 }: { tags: string[]; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
      {tags.map(tag => (
        <TechPill key={tag} tag={tag} size={size} />
      ))}
    </div>
  )
}

function TechTags({ tags }: { tags: string }) {
  const items = tags.split(',').map(t => t.trim()).filter(Boolean)
  return <TechWall tags={items} />
}

function InfoToggleButton({ open, onClick }: { open: boolean; onClick: (event: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button
      onClick={onClick}
      title={open ? 'Hide details' : 'Show details'}
      aria-label={open ? 'Hide details' : 'Show details'}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        color: open ? 'var(--accent)' : 'var(--muted)',
        transition: 'color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        opacity: 0.9,
      }}
    >
      <Info size={13} strokeWidth={1.7} />
    </button>
  )
}

function EmailCapture() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        disabled
        aria-label="Download CV unavailable"
        title="Download CV unavailable"
        style={{
          background: 'none',
          border: 'none',
          padding: '0.2rem',
          cursor: 'not-allowed',
          color: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.38,
          flexShrink: 0,
        }}
      >
        <Download size={15} strokeWidth={1.5} />
      </button>
    </div>
  )
}

function ThesisDownload({ title }: { title: string }) {
  const [phase, setPhase] = useState<CapturePhase>('idle')
  const [email, setEmail] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!email) return
    setPhase('done')
    setTimeout(() => {
      setPhase('idle')
      setEmail('')
    }, 2200)
  }

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '0.85rem 0.95rem',
        border: '1px solid var(--border)',
        borderRadius: 8,
        background: 'var(--card-bg)',
      }}
      onClick={event => event.stopPropagation()}
    >
      <span style={SECTION_LABEL_STYLE}>Thesis</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.35rem' }}>
        <span style={{ fontSize: FONT.meta, fontStyle: 'italic', color: 'var(--desc)' }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={() => phase === 'idle' && setPhase('open')}
            aria-label={phase === 'done' ? 'Sent' : 'Download thesis'}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.15rem',
              cursor: phase === 'done' ? 'default' : 'pointer',
              color: phase === 'done' ? 'var(--accent)' : 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={event => { if (phase === 'idle') event.currentTarget.style.color = 'var(--fg)' }}
            onMouseLeave={event => { if (phase === 'idle') event.currentTarget.style.color = 'var(--muted)' }}
          >
            {phase === 'done' ? <Check size={13} strokeWidth={1.5} /> : <Download size={13} strokeWidth={1.5} />}
          </button>

          <AnimatePresence>
            {phase === 'open' && (
              <motion.form
                key="thesis-email"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                onSubmit={handleSubmit}
                style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <input
                  autoFocus
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  onKeyDown={event => event.key === 'Escape' && setPhase('idle')}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--fg)',
                    fontSize: FONT.micro,
                    padding: '0.1rem 0.2rem',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                    width: 140,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    fontSize: FONT.meta,
                    padding: '0.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  →
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function sectionLabel(projects: ClosedSourceProject[]) {
  const inner = projects.some(project => project.source === 'inner')
  const closed = projects.some(project => project.source !== 'inner')
  if (inner && !closed) return 'Inner Source'
  if (closed && !inner) return 'Closed Source'
  return 'Projects'
}

function ClosedSourceCard({ project, statusColor }: { project: ClosedSourceProject; statusColor: Record<string, string> }) {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(value => !value)

  return (
    <div style={CARD_STYLE}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div
          style={{ minWidth: 0, cursor: 'pointer', flex: 1 }}
          onClick={toggleOpen}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              toggleOpen()
            }
          }}
        >
          {project.url
            ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: FONT.meta, fontWeight: 600, color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'var(--border)' }}
                onClick={event => event.stopPropagation()}
              >
                {project.name}
              </a>
            )
            : <span style={{ fontSize: FONT.meta, fontWeight: 600, color: 'var(--fg)' }}>{project.name}</span>
          }
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
            <span style={{ fontSize: FONT.micro, color: 'var(--muted)' }}>{project.source === 'inner' ? 'Inner source' : 'Closed source'}</span>
            <span style={{ fontSize: FONT.micro, color: statusColor[project.status] ?? 'var(--muted)' }}>{project.status}</span>
          </div>
        </div>

        <InfoToggleButton
          open={open}
          onClick={event => {
            event.stopPropagation()
            toggleOpen()
          }}
        />
      </div>

      <p style={{ margin: '0.65rem 0 0', fontSize: FONT.body, color: 'var(--desc)', lineHeight: 1.7 }}>{project.description}</p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ ...SECTION_LABEL_STYLE, marginBottom: '0.65rem' }}>Technologies Used</p>
              <TechWall tags={project.tags} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function OpenSourceCard({ project, description }: { project: typeof PROJECTS[number]; description: string }) {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(value => !value)

  return (
    <div
      style={{ ...CARD_STYLE, background: 'transparent', transition: 'border-color 0.2s ease, background 0.2s ease' }}
      onMouseEnter={event => { event.currentTarget.style.background = 'var(--card-bg-hover)' }}
      onMouseLeave={event => { event.currentTarget.style.background = 'transparent' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div
          style={{ minWidth: 0, cursor: 'pointer', flex: 1 }}
          onClick={toggleOpen}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              toggleOpen()
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <GithubIcon size={13} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: FONT.meta, fontWeight: 600, color: 'var(--fg)', textDecoration: 'none' }}
              onClick={event => event.stopPropagation()}
            >
              {project.name}
            </a>
            <span style={{ fontSize: FONT.micro, color: 'var(--muted)' }}>{project.org}</span>
          </div>
          <p style={{ margin: '0.6rem 0 0', fontSize: FONT.body, color: 'var(--desc)', lineHeight: 1.7 }}>{description}</p>
        </div>

        <InfoToggleButton
          open={open}
          onClick={event => {
            event.preventDefault()
            event.stopPropagation()
            toggleOpen()
          }}
        />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ ...SECTION_LABEL_STYLE, marginBottom: '0.65rem' }}>Technologies Used</p>
              <TechWall tags={[...project.tags]} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Entry({
  entry,
  isActive,
  isPreviewed,
  entryRef,
  onClick,
}: {
  entry: TimelineEntry
  isActive: boolean
  isPreviewed: boolean
  entryRef: (element: HTMLDivElement | null) => void
  onClick: () => void
}) {
  const orgLogo = ORG_LOGO[entry.id]
  const logoHeight = orgLogo?.height ?? 24
  const { theme } = useTheme()
  const isDay = theme === 'day'
  const typeColor = entry.type === 'industry' ? 'var(--industry-accent)' : 'var(--education-accent)'

  const statusColor: Record<string, string> = {
    shipped: 'rgba(74,215,192,0.82)',
    ongoing: 'rgba(95,205,110,0.8)',
    internal: 'rgba(170,176,188,0.8)',
    deprecated: 'rgba(170,176,188,0.55)',
  }

  const background = isActive
    ? 'var(--card-bg-hover)'
    : isPreviewed
      ? 'var(--card-bg)'
      : 'transparent'

  return (
    <motion.div
      layout
      ref={entryRef}
      transition={{ layout: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } }}
      style={{
        padding: '1.35rem 1rem',
        borderTop: '1px solid var(--border)',
        background,
        transition: 'background 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        borderRadius: 8,
        boxShadow: isPreviewed && !isActive ? 'inset 0 0 0 1px var(--border)' : 'none',
      }}
      onMouseEnter={event => {
        if (!isActive && !isPreviewed) event.currentTarget.style.background = 'var(--card-bg)'
      }}
      onMouseLeave={event => {
        if (!isActive && !isPreviewed) event.currentTarget.style.background = 'transparent'
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: typeColor, flexShrink: 0, display: 'inline-block' }} />
        <span style={{ fontSize: FONT.eyebrow, letterSpacing: '0.1em', textTransform: 'uppercase', color: typeColor, opacity: 0.9 }}>
          {entry.type}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: FONT.title, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4 }}>
              {entry.title}
            </span>
            {orgLogo && (
              <img
                src={orgLogo.src}
                alt={entry.organization}
                title={entry.organization}
                style={{
                  height: logoHeight,
                  width: 'auto',
                  maxWidth: 96,
                  objectFit: 'contain',
                  opacity: isDay ? 0.76 : 0.62,
                  filter: isDay ? 'invert(1)' : 'none',
                  display: 'block',
                }}
              />
            )}
          </div>

          <div style={{ marginTop: '0.35rem' }}>
            {entry.organizationUrl
              ? (
                <a
                  href={entry.organizationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: FONT.meta, color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'var(--border)' }}
                >
                  {entry.organization}
                </a>
              )
              : <span style={{ fontSize: FONT.meta, color: 'var(--muted)' }}>{entry.organization}</span>
            }
          </div>
        </div>

        <span style={{ fontSize: FONT.micro, color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {entry.period}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key={`${entry.id}-details`}
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: FONT.meta, color: 'var(--muted)' }}>{entry.locationLabel}</span>
              {entry.note && <span style={{ fontSize: FONT.meta, color: 'var(--muted)', fontStyle: 'italic' }}>· {entry.note}</span>}
            </div>

            {entry.team && (
              <div style={{ marginTop: '0.35rem' }}>
                {entry.teamUrl
                  ? (
                    <a
                      href={entry.teamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: FONT.body, color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'var(--border)' }}
                    >
                      {entry.team}
                    </a>
                  )
                  : <span style={{ fontSize: FONT.body, color: 'var(--muted)' }}>{entry.team}</span>
                }
              </div>
            )}

            {entry.description && (
              <p style={{ margin: '0.75rem 0 0', fontSize: FONT.body, lineHeight: 1.72, color: 'var(--desc)' }}>
                {entry.description}
              </p>
            )}

            {entry.thesis && <ThesisDownload title={entry.thesis} />}

            {entry.tags && (
              <div style={{ marginTop: '0.85rem' }}>
                <TechTags tags={entry.tags} />
              </div>
            )}

            {entry.tags2 && (
              <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
                {entry.tags2.map(({ icon: Icon, label }) => (
                  <span key={label} title={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: FONT.micro, color: 'var(--muted)' }}>
                    <Icon size={11} strokeWidth={1.5} />
                    {label}
                  </span>
                ))}
              </div>
            )}

            {entry.closedSource && entry.closedSource.length > 0 && (
              <div style={{ marginTop: '1.2rem' }} onClick={event => event.stopPropagation()}>
                <p style={{ ...SECTION_LABEL_STYLE, marginBottom: '0.8rem' }}>
                  {sectionLabel(entry.closedSource)}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.7rem' }}>
                  {entry.closedSource.map(project => (
                    <ClosedSourceCard key={project.name} project={project} statusColor={statusColor} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function About() {
  const compact = useCompactLayout()
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const [entryHeights, setEntryHeights] = useState<number[]>([])
  const [githubDescriptions, setGithubDescriptions] = useState<Record<string, string>>({})
  const [cityPicker, setCityPicker] = useState<CityPickerState | null>(null)
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const pickerRef = useRef<HTMLDivElement | null>(null)

  const showGitGraph = false
  const activeIndexKey = [...activeIndices].sort().join(',')

  useLayoutEffect(() => {
    const measure = () => setEntryHeights(refs.current.map(element => element?.offsetHeight ?? 0))
    measure()
    const observer = new ResizeObserver(measure)
    refs.current.forEach(element => {
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    PROJECTS.forEach(async project => {
      try {
        const match = project.url.match(/github\.com\/([^/]+)\/([^/]+)/)
        if (!match) return
        const [, owner, repo] = match
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
        if (!response.ok) return
        const data = await response.json() as { description?: string }
        if (data.description) {
          setGithubDescriptions(previous => ({ ...previous, [project.name]: data.description! }))
        }
      } catch {
        // Ignore and fall back to the local description.
      }
    })
  }, [])

  useEffect(() => {
    if (!cityPicker) return

    const handlePointerDown = (event: PointerEvent) => {
      if (pickerRef.current?.contains(event.target as Node)) return
      setCityPicker(null)
      setPreviewIndex(null)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [cityPicker])

  const primaryActiveEntry = activeIndices.size === 1 ? TIMELINE[[...activeIndices][0]] : null
  const focusedEntry = previewIndex !== null ? TIMELINE[previewIndex] : primaryActiveEntry
  const activeLocations = new Set([...activeIndices].map(index => TIMELINE[index].location))
  const activeGlobeLocation = focusedEntry?.location ?? (activeLocations.size === 1 ? [...activeLocations][0] : null)

  function scrollToEntry(index: number) {
    setTimeout(() => refs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  function selectEntry(index: number) {
    setActiveIndices(new Set([index]))
    setPreviewIndex(null)
    setCityPicker(null)
    scrollToEntry(index)
  }

  function toggleEntry(index: number) {
    setPreviewIndex(null)
    setCityPicker(null)
    setActiveIndices(previous => {
      if (previous.size === 1 && previous.has(index)) return new Set()
      return new Set([index])
    })
  }

  function handleCityClick(locationKey: string, anchor?: CityClickAnchor) {
    const matching = TIMELINE
      .map((entry, index) => ({ entry, index }))
      .filter(({ entry }) => entry.location === locationKey)
      .map(({ index }) => index)

    if (matching.length === 0) return
    if (matching.length === 1) {
      selectEntry(matching[0])
      return
    }

    setPreviewIndex(null)
    setCityPicker(previous => (
      previous?.locationKey === locationKey
        ? null
        : { locationKey: locationKey as LocationKey, entryIndices: matching, anchor }
    ))
    scrollToEntry(matching[0])
  }

  const { _setOnCityClick, _setGlobeState } = useGlobeCtx()
  const cityClickRef = useRef(handleCityClick)

  useEffect(() => {
    cityClickRef.current = handleCityClick
  })

  useEffect(() => {
    _setOnCityClick((key, anchor) => cityClickRef.current(key, anchor))
    return () => _setOnCityClick(() => {})
  }, [_setOnCityClick])

  useEffect(() => {
    _setGlobeState({
      activeArc: focusedEntry?.arcId ?? null,
      activeLocation: activeGlobeLocation,
      activeType: focusedEntry?.type ?? null,
    })
  }, [activeGlobeLocation, activeIndexKey, focusedEntry, _setGlobeState])

  const pickerPosition = cityPicker ? getPickerPosition() : null
  const contentMaxWidth = compact ? '100%' : 'min(54rem, calc(100vw - 48vw))'
  const pagePadding = compact ? '1.5rem' : 'clamp(2rem, 3vw, 3.5rem)'

  return (
    <>
      {cityPicker && pickerPosition && (
        <div
          ref={pickerRef}
          style={{
            position: 'fixed',
            top: pickerPosition.top,
            left: pickerPosition.left,
            width: 250,
            padding: '0.7rem',
            border: '1px solid var(--border)',
            borderRadius: 10,
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(14px)',
            pointerEvents: 'auto',
            zIndex: 30,
            boxShadow: '0 18px 44px rgba(0, 0, 0, 0.18)',
          }}
        >
          <p style={{ ...SECTION_LABEL_STYLE, marginBottom: '0.55rem' }}>
            {LOCATION_LABELS[cityPicker.locationKey]}
          </p>
          <div style={{ display: 'grid', gap: '0.3rem' }}>
            {cityPicker.entryIndices.map(index => {
              const entry = TIMELINE[index]
              const hovered = previewIndex === index

              return (
                <button
                  key={entry.id}
                  type="button"
                  onMouseEnter={() => setPreviewIndex(index)}
                  onMouseLeave={() => setPreviewIndex(current => (current === index ? null : current))}
                  onClick={() => selectEntry(index)}
                  style={{
                    background: hovered ? 'var(--card-bg)' : 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '0.6rem 0.7rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.18s ease, border-color 0.18s ease',
                  }}
                >
                  <span style={{ display: 'block', fontSize: FONT.meta, fontWeight: 600, color: 'var(--fg)' }}>
                    {entry.title}
                  </span>
                  <span style={{ display: 'block', marginTop: '0.18rem', fontSize: FONT.micro, color: 'var(--muted)' }}>
                    {entry.organization} · {entry.period}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          marginRight: compact ? 0 : DESKTOP_GLOBE_WIDTH,
          position: 'relative',
          zIndex: 2,
          width: compact ? '100%' : `calc(100% - ${DESKTOP_GLOBE_WIDTH})`,
          pointerEvents: 'auto',
        }}
      >
        <div style={{ maxWidth: contentMaxWidth }}>
          <div style={{ padding: `4.5rem ${pagePadding} 2.25rem` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '0.55rem' }}>
              <h1
                className="text-4xl font-semibold tracking-tight"
                style={{
                  margin: 0,
                  background: 'var(--hero-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Diogo Pereira-Marques
              </h1>
              <EmailCapture />
            </div>

            <p style={{ fontSize: FONT.meta, color: 'var(--muted)', margin: 0 }}>Principal AI Engineer · London, UK</p>
            <p style={{ margin: '1.25rem 0 0', fontSize: FONT.bodyLg, lineHeight: 1.82, color: 'var(--desc)', maxWidth: 720 }}>
              I build AI systems at the boundary of software engineering and science, currently at Roche,
              designing agentic loops for autonomous drug discovery. Beyond helping our brilliant scientists move faster,
              my main endeavour goes towards understanding how to create high performing teams of humans, empowered by
              sound harness engineering: the guardrails, feedback controls, and observability
              that make agents dependable rather than merely impressive.
            </p>
          </div>

          <div style={{ padding: `0 ${pagePadding} 8rem` }}>
            <p style={{ ...SECTION_LABEL_STYLE, marginBottom: '1rem' }}>Open Source</p>
            <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: '0.9rem', marginBottom: '3.25rem' }}>
              {PROJECTS.map(project => (
                <OpenSourceCard key={project.name} project={project} description={githubDescriptions[project.name] ?? project.description} />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <p style={SECTION_LABEL_STYLE}>Industry & Education</p>
            </div>
            <p style={{ fontSize: FONT.micro, color: 'var(--hint)', margin: '0 0 0.75rem' }}>
              scroll to explore · select to expand
            </p>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
              <div style={{ maxWidth: showGitGraph ? 200 : 0, opacity: showGitGraph ? 1 : 0, overflow: 'hidden', transition: 'max-width 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease', flexShrink: 0, background: 'rgba(0,0,0,0.18)', borderRadius: 8 }}>
                <GitGraph
                  entries={TIMELINE.map(entry => ({
                    type: entry.type,
                    branchLabel: branchLabel(entry),
                    startTs: entry.startTs,
                    endTs: entry.endTs,
                  }))}
                  activeIndices={activeIndices}
                  entryHeights={entryHeights}
                  onNodeClick={index => {
                    toggleEntry(index)
                    scrollToEntry(index)
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                {TIMELINE.map((entry, index) => (
                  <Entry
                    key={entry.id}
                    entry={entry}
                    isActive={activeIndices.has(index)}
                    isPreviewed={previewIndex === index}
                    entryRef={element => { refs.current[index] = element }}
                    onClick={() => toggleEntry(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
