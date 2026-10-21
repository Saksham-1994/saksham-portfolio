// All content below is sourced directly from Saksham's resume.
// Nothing here is invented — only reorganized and lightly rewritten for tone.

export const profile = {
  name: 'Saksham Srivastava',
  roles: ['Cyber Security Engineer', 'AI Developer', 'Backend Engineer'],
  email: 'sakshamsrivastava1118@gmail.com',
  phone: '+91-9369643880',
  linkedin: 'linkedin.com/in/saksham-srivastava2005',
  linkedinUrl: 'https://linkedin.com/in/saksham-srivastava2005',
  github: 'github.com/Saksham-1994',
  githubUrl: 'https://github.com/Saksham-1994',
  location: 'Dehradun, India',
  summary:
    "Cyber Security-focused B.Tech Computer Science student who builds real-time threat detection systems, security automation, and REST APIs with Python and FastAPI. Comfortable across the stack — from ML-based anomaly detection and SIEM-style monitoring to SQL database hardening and cloud security operations — with hands-on tools including Wireshark, Nmap, Metasploit, and Kali Linux. Uses AI coding assistants and prompt engineering to move fast without cutting corners.",
}

export const education = {
  school: 'University of Petroleum and Energy Studies (UPES), Dehradun',
  degree: 'B.Tech, Computer Science — Cyber Security',
  period: 'Jul 2023 – Jun 2027',
  gpa: 'CGPA 7.53 / 10',
  coursework: [
    'Database Management Systems',
    'Data Structures & Algorithms',
    'Computer Networks',
    'Operating Systems',
  ],
}

export type Experience = {
  id: string
  company: string
  role: string
  period: string
  location: string
  bullets: string[]
  stack: string[]
}

export const experience: Experience[] = [
  {
    id: 'ibm',
    company: 'IBM',
    role: 'Project Intern',
    period: 'Jul 2026 — Present',
    location: 'Remote',
    bullets: [
      'Developing a Ransomware Early Detection System in Python, using machine learning to flag malicious behavior before encryption attacks execute.',
      'Processing system and file-activity telemetry to engineer features for anomaly detection and ransomware classification.',
      'Testing detection models and analyzing performance metrics, documenting results in line with secure development practices.',
    ],
    stack: ['Python', 'Machine Learning', 'Anomaly Detection'],
  },
  {
    id: 'morepen',
    company: 'Dr. Morepen Home',
    role: 'Product Intern',
    period: 'Apr 2026 — Jun 2026',
    location: 'Remote',
    bullets: [
      'Supported product development and IT operations across concurrent engineering and product workstreams.',
      'Ran functional testing and debugging cycles, documenting defects and resolutions to improve release quality.',
      'Collaborated with cross-functional teams to translate business requirements into structured technical tasks.',
    ],
    stack: ['Product Ops', 'QA & Debugging', 'Documentation'],
  },
  {
    id: 'addroit',
    company: 'Addroit Nexus',
    role: 'Summer Intern',
    period: 'Jun 2025 — Jul 2025',
    location: 'On-site',
    bullets: [
      'Implemented SQL database security controls and hardened cloud server configurations to improve security posture.',
      'Configured secure automated backups and replication workflows, cutting data-loss risk across environments.',
      'Built Python monitoring scripts and automation to track system health, reducing manual verification effort.',
    ],
    stack: ['SQL Security', 'Cloud Hardening', 'Python Automation'],
  },
  {
    id: 'gramyjan',
    company: 'Gramyjan Sewa Trust',
    role: 'Summer Intern',
    period: 'Jun 2024 — Jul 2024',
    location: 'On-site',
    bullets: [
      'Coordinated technical development initiatives for community-focused projects, improving operational workflows.',
      'Supervised and organized volunteer teams, strengthening collaboration and task tracking.',
    ],
    stack: ['Coordination', 'Team Leadership'],
  },
]

export type Project = {
  id: string
  title: string
  tagline: string
  stack: string[]
  bullets: string[]
  images: { src: string; alt: string }[]
  links?: { label: string; url: string }[]
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 'ransomware',
    title: 'Ransomware Early Detection System',
    tagline: 'Catching the attack before the encryption starts.',
    stack: ['Python', 'Machine Learning', 'Real-Time Monitoring'],
    bullets: [
      'AI-powered system built to identify malicious file encryption and suspicious processes in real time.',
      'ML-based anomaly detection generates automated security alerts and reduces potential data loss.',
      'Real-time monitoring and automated alerting pipelines enable rapid detection and response to incidents.',
    ],
    images: [
      {
        src: '/projects/ransomware-dashboard.png',
        alt: 'Ransomware detection dashboard showing monitored endpoints and live alert feed',
      },
    ],
    featured: true,
  },
  {
    id: 'credential-harvesting',
    title: 'Real-Time Credential Harvesting Detection System',
    tagline: 'Spotting phishing and credential theft as it happens.',
    stack: ['Python', 'FastAPI', 'Machine Learning'],
    bullets: [
      'Real-time phishing and credential-theft detection using browser telemetry, ML models, and threat intelligence feeds.',
      'Behavioral anomaly detection and URL risk-scoring pipelines flag credential-theft attempts with low latency.',
      'Scalable alerting and analytics modules support continuous monitoring of live traffic streams.',
    ],
    images: [
      {
        src: '/projects/credential-detection-demo.png',
        alt: 'Detection engine flagging a fake domain and extracting page features in real time',
      },
      {
        src: '/projects/credential-dashboard-top.png',
        alt: 'Credential harvesting threat dashboard with live alert totals and trend chart',
      },
      {
        src: '/projects/credential-dashboard-bottom.png',
        alt: 'Risk distribution and top attacked domains on the credential harvesting dashboard',
      },
    ],
    featured: true,
  },
  {
    id: 'nutrient-platform',
    title: 'Cloud-Based Practice & Nutrient Analysis Platform',
    tagline: 'A secure practice platform for Ayurvedic dietitians.',
    stack: ['Python', 'Cloud', 'MySQL'],
    bullets: [
      'Secure cloud-hosted platform for Ayurvedic dietitians featuring authentication, analytics, and session management.',
      'JWT-based login, encrypted data storage, and secure session handling to protect user data.',
      'SQL-injection-safe REST APIs powering a responsive UI for reliable, secure data access.',
    ],
    images: [],
    featured: false,
  },
  {
    id: 'car-rental',
    title: 'Car Rental Management System',
    tagline: 'End-to-end booking, billing, and tracking.',
    stack: ['Java', 'MySQL / Oracle'],
    bullets: [
      'End-to-end data management flow covering booking, billing, and tracking using SQL databases.',
      'Optimized relational schema designed to support accurate reporting and inventory tracking.',
    ],
    images: [],
    featured: false,
  },
]

export const skills = {
  Languages: ['Python', 'Java', 'C', 'JavaScript', 'SQL', 'HTML', 'CSS'],
  Security: [
    'Network Security',
    'Vulnerability Assessment',
    'SIEM',
    'Threat Detection',
    'Cloud Security',
    'Wireshark',
    'Nmap',
    'Metasploit',
  ],
  Backend: ['REST API Design', 'OOP', 'Data Structures & Algorithms', 'Git', 'GitHub'],
  Databases: ['MySQL', 'Oracle', 'MongoDB', 'DBMS'],
  Tooling: ['Postman', 'VMware', 'VirtualBox', 'Cloud Deployment', 'Kali Linux'],
  'AI & Automation': [
    'GitHub Copilot',
    'ChatGPT',
    'Prompt Engineering',
    'AI-Assisted Development',
    'Security Automation',
    'AI-Powered Excel',
  ],
  Professional: ['Leadership', 'Cross-Functional Collaboration', 'Technical Documentation', 'Problem Solving'],
}

export type Certification = {
  name: string
  issuer: string
}

export const certifications: Certification[] = [
  { name: 'Network Defense', issuer: 'Cisco Networking Academy & UPES' },
  { name: 'Product Management Simulation', issuer: 'Electronic Arts (Forage)' },
  { name: 'Drone Tech Bootcamp', issuer: 'NIT Kurukshetra & UPES' },
  { name: 'AI-Powered Excel Workshop', issuer: 'Advanced Excel & Data Handling' },
  { name: 'C & Python Programming', issuer: 'VikTech' },
  { name: 'Project Management', issuer: 'LearnTube' },
]

export const achievements = [
  { role: 'Operations Head', org: 'UPES Hypervision', period: '2025 – 2026' },
  { role: 'Associate Operations Head', org: 'UPES Hypervision', period: '2024 – 2025' },
  { role: 'Media & News Representative', org: 'UPES', period: '2022 – 2023' },
]
