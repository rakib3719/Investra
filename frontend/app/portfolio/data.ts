export interface PortfolioItem {
  id: number;
  type: "startup" | "investor" | "consultant";
  name: string;
  subtitle: string;
  avatar: string;
  image: string;
  description: string;
  tags: string[];
  metrics: {
    label1: string;
    value1: string;
    label2: string;
    value2: string;
    label3: string;
    value3: string;
  };
  details: {
    story: string;
    focusArea: string;
    achievements: string[];
    certifications: string[];
    timeline: string;
    milestones: {
      year: string;
      title: string;
      description: string;
    }[];
    gallery: string[];
  };
}

export const portfolioData: PortfolioItem[] = [
  {
    id: 1,
    type: "startup",
    name: "Apex FinTech Core Banking API",
    subtitle: "Led by Tariqul Islam • SaaS & FinTech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    description: "Deploying secure, API-driven billing engines and transaction layers for underserved micro-merchants in emerging markets.",
    tags: ["Seed Round", "FinTech API", "Traction Verified"],
    metrics: {
      label1: "Funding Goal",
      value1: "$1.2M",
      label2: "Raised So Far",
      value2: "$780K",
      label3: "Equity Offered",
      value3: "12%"
    },
    details: {
      story: "Apex FinTech builds low-latency transactional integrations that allow small businesses to receive digital payments instantly. Within 6 months, we processed 1.2M micro-transactions with zero downtime.",
      focusArea: "API infrastructure, security compliance, banking webhooks, and local merchants.",
      achievements: [
        "Completed PCI-DSS certification",
        "Onboarded 40,000 active merchant nodes",
        "Integrated with 14 local microfinance banks"
      ],
      certifications: [
        "ISO/IEC 27001 Information Security Certified",
        "PCI-DSS Level 1 Compliance Stamp",
        "Bangladesh Bank FinTech Sandbox Clearance License"
      ],
      timeline: "Founding Year: 2024 • Currently: Raising Seed Series A",
      milestones: [
        {
          year: "Q1 2024",
          title: "Prototype Testing",
          description: "Completed sandboxed API trial with 150 local micro-merchants."
        },
        {
          year: "Q3 2024",
          title: "Sandbox Clearance",
          description: "Acquired formal sandbox clearance license from Central Bank regulators."
        },
        {
          year: "Q1 2025",
          title: "Seed Matching Open",
          description: "Opened our official matchmaking pipeline to raise Series A capital."
        }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80"
      ]
    }
  },
  {
    id: 2,
    type: "startup",
    name: "ProDocs SaaS HR Platform",
    subtitle: "Led by Mominul Haque • B2B SaaS",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    description: "Centralizing payroll pipelines, compliance checks, and healthcare benefits for modern remote-first operations.",
    tags: ["Pre-Series A", "B2B SaaS", "ARR Flowing"],
    metrics: {
      label1: "Target Target",
      value1: "$800K",
      label2: "Raised So Far",
      value2: "$500K",
      label3: "Equity Offered",
      value3: "15%"
    },
    details: {
      story: "ProDocs simplifies remote company management by creating localized compliance protocols and automated payroll triggers that bypass standard manual banking procedures.",
      focusArea: "Automated tax filings, localized employee contract validation, Stripe payout routing.",
      achievements: [
        "Reached $320K in Annual Recurring Revenue (ARR)",
        "Less than 1.8% annual user churn",
        "Partnered with remote contractor hubs in South Asia"
      ],
      certifications: [
        "GDPR Privacy Vetting Clearance Audit",
        "SOC 2 Type II System Security Clearance",
        "Verified SaaS Operations Compliance"
      ],
      timeline: "Founding Year: 2023 • Currently: Raising Pre-Series A",
      milestones: [
        {
          year: "2023",
          title: "SaaS Launch",
          description: "Released initial remote management modules, supporting localized contracts."
        },
        {
          year: "2024",
          title: "SOC 2 Clearance",
          description: "Successfully audited for SOC 2 Type II data encryption compliance."
        },
        {
          year: "2025",
          title: "Active Expansion",
          description: "Integrated automated international bank payroll payouts for 12 countries."
        }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1556761175-4973dc0f32e7?auto=format&fit=crop&w=600&q=80"
      ]
    }
  },
  {
    id: 3,
    type: "investor",
    name: "Tahmid Chowdhury",
    subtitle: "Active Angel Investor • Dhaka Portfolio",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
    description: "Focusing on early-stage B2B SaaS, developer APIs, and AgriTech supply-chain optimization networks in South Asia.",
    tags: ["Angel Investor", "SaaS Specialist", "8 Active Deals"],
    metrics: {
      label1: "Portfolio Size",
      value1: "$2.4M",
      label2: "Backed Startups",
      value2: "8",
      label3: "Average IRR",
      value3: "22.4%"
    },
    details: {
      story: "Tahmid is a former software engineer who exited his own startup in 2021. He now backs high-conviction teams building developer tooling and operational infrastructure.",
      focusArea: "Software-as-a-Service, database systems, developer tools, transaction routing.",
      achievements: [
        "Backed 3 startups that secured institutional Series A funding",
        "Average response time under 24 hours to portfolio founders",
        "Provides hands-on growth engineering coaching"
      ],
      certifications: [
        "Chartered Financial Analyst (CFA) Charterholder",
        "Bangladesh Business Angel Network Active Member",
        "Registered Private Asset Investor License"
      ],
      timeline: "Member Since 2022 • Seeking: 2 new investments this quarter",
      milestones: [
        {
          year: "2021",
          title: "Software Firm Exit",
          description: "Sold SaaS platform to international enterprise group, transitioning to angel investments."
        },
        {
          year: "2023",
          title: "AgriTech Match",
          description: "Backed first agricultural logistics supply chain deal through our sandbox."
        },
        {
          year: "2025",
          title: "Venture Expansion",
          description: "Expanded total active seed portfolio size to 8 registered tech firms."
        }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
      ]
    }
  },
  {
    id: 4,
    type: "consultant",
    name: "Labonno",
    subtitle: "Lead AgriTech Consultant • Dhaka, BD",
    avatar: "/advisor_labonno.png",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    description: "Tailoring agricultural logistics structures, seed distribution channels, and organic business models for maximum scale.",
    tags: ["Verified Advisor", "38 Cohorts Led", "Agri Specialist"],
    metrics: {
      label1: "Advisory Hours",
      value1: "420 hrs",
      label2: "Cohorts Hosted",
      value2: "38",
      label3: "Revenue Share",
      value3: "80%"
    },
    details: {
      story: "Labonno brings over a decade of domain expertise in managing supply chains and organic production guidelines. She hosts structured cohorts on Investra to help AgriTech founders secure regulatory compliance.",
      focusArea: "Cold-storage logistics networks, organic certification, rural farmer coordination, inventory optimization.",
      achievements: [
        "Mentored 12 AgriTech startups now actively raising seed capital",
        "Co-authored the Bangladesh Sustainable Agriculture Guide",
        "Maintains a 98% client satisfaction rating"
      ],
      certifications: [
        "Certified Agritech Logistics Supply Chain Strategist",
        "Verified Advisor credentials on Investra advisory panels",
        "Dhaka Agriculture Council Regulatory Expert"
      ],
      timeline: "Verified Advisor • Hourly rates: Stripe-integrated checkout",
      milestones: [
        {
          year: "2018",
          title: "Agriculture Board",
          description: "Led cold-chain supply modeling for rural dairy cooperatives."
        },
        {
          year: "2022",
          title: "Advisory Registration",
          description: "Joined Investra advisory panels to host private cohort classes."
        },
        {
          year: "2024",
          title: "Milestone Mentorship",
          description: "Assisted 3 AgriTech startups in raising seed capital from VC firms."
        }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80"
      ]
    }
  },
  {
    id: 5,
    type: "consultant",
    name: "Marco Jansen",
    subtitle: "SaaS & Scaleup Strategist • Amsterdam",
    avatar: "/advisor_marco.png",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    description: "Specializing in B2B subscription metrics, unit economics modeling, international expansion, and Stripe structures.",
    tags: ["Elite Advisor", "54 Cohorts Led", "FinTech Specialist"],
    metrics: {
      label1: "Advisory Hours",
      value1: "680 hrs",
      label2: "Cohorts Hosted",
      value2: "54",
      label3: "Revenue Share",
      value3: "80%"
    },
    details: {
      story: "Marco Jansen has spent 12 years helping European startups scale recurring revenues and model customer acquisition costs. He advises entrepreneurs on how to prepare pitch decks that grab global venture fund attention.",
      focusArea: "SaaS economics, CAC/LTV modeling, recurring billing strategies, Series A pitch deck layouts.",
      achievements: [
        "Advised 18 SaaS startups that raised over $30M combined",
        "Developed unit economics frameworks used by leading incubators",
        "Top-rated subscription strategy advisor on Investra"
      ],
      certifications: [
        "MBA, Rotterdam School of Management",
        "SaaS Operations Certified Advisor",
        "Verified Elite Mentor badge on Investra platforms"
      ],
      timeline: "Verified Advisor • Active consultation sessions available weekly",
      milestones: [
        {
          year: "2015",
          title: "Incubator Principal",
          description: "Led SaaS growth strategies for 25 early stage companies in the EU."
        },
        {
          year: "2021",
          title: "Scaleup Advisory Launch",
          description: "Registered advisory presence to focus exclusively on remote matching."
        },
        {
          year: "2025",
          title: "Investra Elite Status",
          description: "Received Elite mentor clearance badge representing 50+ successful cohorts."
        }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"
      ]
    }
  },
  {
    id: 6,
    type: "investor",
    name: "Zenith Venture Partners",
    subtitle: "Venture Capital Firm • Regional Fund",
    avatar: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
    description: "Providing Series A and seed-stage funding checks to high-growth logistics, FinTech, and regional AgriTech innovators.",
    tags: ["Venture Capital", "24 Backed Deals", "Institutional"],
    metrics: {
      label1: "Under Management",
      value1: "$15M",
      label2: "Active Investments",
      value2: "24",
      label3: "Target Check",
      value3: "$500K+"
    },
    details: {
      story: "Zenith Venture Partners backs ambitious tech founders building scalable platforms across South Asia. We provide not just seed checks but operational support via our network of verified advisors.",
      focusArea: "Cold-chain logistics, regional payment infrastructure, software automation, seed investments.",
      achievements: [
        "Successfully exited 4 portfolio investments",
        "Maintains a dedicated operational support team",
        "Directly integrated with the Investra co-investment pipeline"
      ],
      certifications: [
        "Registered Venture Capital Fund Manager Certificate",
        "Securities & Exchange Commission Compliance Clear",
        "Institutional Co-Investment Fund License"
      ],
      timeline: "Registered Institutional Fund • Contact for dealflow reviews",
      milestones: [
        {
          year: "2019",
          title: "Fund Incorporation",
          description: "Established $15M regional fund to invest in early stage seed projects."
        },
        {
          year: "2022",
          title: "Strategic Matchmaking",
          description: "Partnered with Investra platform to secure clean, auditable dealflow."
        },
        {
          year: "2025",
          title: "Active Portfolio",
          description: "Reached 24 active startup investments with 4 successful exits."
        }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80"
      ]
    }
  }
];
