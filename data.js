window.PORTFOLIO_DATA = {
  profile: {
    name: "Kursat Kilic",
    role: "PhD Student | AI Researcher | TBM Enthusiast",
    affiliation: "Akita University",
    location: "Japan",
    tagline: "Bridging geotechnical engineering and artificial intelligence for smarter, safer tunnelling.",
    refreshed: "2026-06-12",
    links: [
      {
        label: "Google Scholar",
        detail: "Publications and citations",
        url: "https://scholar.google.com/citations?user=sNB5IQsAAAAJ&hl=en"
      },
      {
        label: "GitHub",
        detail: "Research code and prototypes",
        url: "https://github.com/kilickursat"
      },
      {
        label: "ORCID",
        detail: "0000-0003-4362-0704",
        url: "https://orcid.org/0000-0003-4362-0704"
      },
      {
        label: "Owlstown",
        detail: "Academic profile",
        url: "https://kursat-kilic.owlstown.net/publications"
      },
      {
        label: "LinkedIn",
        detail: "Professional network",
        url: "https://www.linkedin.com/in/kursat-kilic-395b5855"
      },
      {
        label: "Email",
        detail: "Collaboration contact",
        url: "mailto:kilic_kursat@hotmail.com"
      }
    ]
  },
  stats: [
    {
      value: "119+",
      label: "Google Scholar citations indexed"
    },
    {
      value: "91",
      label: "public GitHub repositories"
    },
    {
      value: "AI + TBM",
      label: "research identity"
    }
  ],
  researchAreas: [
    {
      icon: "TBM",
      title: "TBM operational intelligence",
      text: "Turning machine logs into engineering insight for performance, stability, and risk control.",
      tags: ["EPB TBM", "Machine logs", "Performance"]
    },
    {
      icon: "GEO",
      title: "Soft-ground lithology classification",
      text: "Using data-driven models to infer geological classes from tunnel boring machine operation.",
      tags: ["LightGBM", "Clustering", "Lithology"]
    },
    {
      icon: "CNN",
      title: "Cutter wear prediction",
      text: "Predicting wear behavior with deep learning and synchronized machine-parameter datasets.",
      tags: ["1D CNN", "Cutter wear", "Maintenance"]
    },
    {
      icon: "LLM",
      title: "Tunnel domain AI",
      text: "Building domain-aware models and knowledge tools for tunnelling and underground construction.",
      tags: ["LLM", "Knowledge systems", "Decision support"]
    }
  ],
  publications: [
    {
      title: "Soft ground tunnel lithology classification using clustering-guided light gradient boosting machine",
      type: "Journal article",
      year: "2023",
      venue: "Journal of Rock Mechanics and Geotechnical Engineering",
      authors: "Kursat Kilic, H. Ikeda, Tsuyoshi Adachi, Y. Kawamura",
      summary: "A clustering-guided LightGBM workflow for soft-ground tunnel lithology classification, positioned at the interface of TBM operational data and geotechnical interpretation.",
      tags: ["LightGBM", "Lithology", "Soft ground", "Clustering"],
      doi: "10.1016/j.jrmge.2023.02.013",
      url: "https://doi.org/10.1016/j.jrmge.2023.02.013",
      cite: "Kilic, K., Ikeda, H., Adachi, T., and Kawamura, Y. (2023). Soft ground tunnel lithology classification using clustering-guided light gradient boosting machine. Journal of Rock Mechanics and Geotechnical Engineering."
    },
    {
      title: "One-Dimensional Convolutional Neural Network for Pipe Jacking EPB TBM Cutter Wear Prediction",
      type: "Journal article",
      year: "2022",
      venue: "Applied Sciences",
      authors: "Kursat Kilic, H. Toriya, Yoshino Kosugi, Tsuyoshi Adachi, Y. Kawamura",
      summary: "A 1D CNN approach for machine-parameter-based cutter wear prediction using EPB TBM operational data from soft-ground tunnelling conditions.",
      tags: ["1D CNN", "Cutter wear", "EPB TBM", "Deep learning"],
      doi: "10.3390/app12052410",
      url: "https://doi.org/10.3390/app12052410",
      cite: "Kilic, K., Toriya, H., Kosugi, Y., Adachi, T., and Kawamura, Y. (2022). One-Dimensional Convolutional Neural Network for Pipe Jacking EPB TBM Cutter Wear Prediction. Applied Sciences."
    },
    {
      title: "Performance analysis of cutting tools from ILCM tests through computer-aided modeling methods",
      type: "Thesis",
      year: "2020",
      venue: "Master Degree Thesis, Mining Engineering",
      authors: "M. Cardu, Kursat Kilic",
      summary: "A mining engineering thesis focused on cutting tool performance analysis using ILCM tests and computer-aided modeling methods.",
      tags: ["Cutting tools", "ILCM", "Mining engineering", "Modeling"],
      doi: "",
      url: "https://kursat-kilic.owlstown.net/publications/20655-master-degree-of-mining-engineering-master-degree-thesis-performance-analysis-of-cutting-tools-from-ilcm-tests-through-computer-aided-modeling-methods",
      cite: "Cardu, M. and Kilic, K. (2020). Performance analysis of cutting tools from ILCM tests through computer-aided modeling methods. Master Degree Thesis."
    }
  ],
  projects: [
    {
      name: "Clustering-guided-LightGBM",
      category: "Publication code",
      description: "Repository aligned with soft-ground tunnel lithology classification using clustering-guided LightGBM.",
      url: "https://github.com/kilickursat/Clustering-guided-LightGBM",
      tags: ["LightGBM", "Lithology", "Notebook"]
    },
    {
      name: "lithology-classifier",
      category: "Geotechnical ML",
      description: "A compact repository name for lithology classification workflows and future deployment-facing research demos.",
      url: "https://github.com/kilickursat/lithology-classifier",
      tags: ["Classifier", "Geology", "Python"]
    },
    {
      name: "TBM-EDA",
      category: "Exploratory analytics",
      description: "Streamlit-based exploratory data analysis app for tunnel boring machine datasets.",
      url: "https://github.com/kilickursat/TBM-EDA",
      tags: ["Streamlit", "EDA", "TBM"]
    },
    {
      name: "TBM-LLM",
      category: "Domain AI",
      description: "Tunnel boring machine knowledge generator concept using an LLM trained on tunnelling literature.",
      url: "https://github.com/kilickursat/TBM-LLM",
      tags: ["LLM", "TBM", "Research assistant"]
    },
    {
      name: "tbm-advance-rate-calculator",
      category: "Engineering app",
      description: "Professional-grade web application for calculating tunnel boring machine advance rates across geotechnical and machine conditions.",
      url: "https://github.com/kilickursat/tbm-advance-rate-calculator",
      tags: ["FastAPI", "Prediction", "Engineering"]
    },
    {
      name: "specificenergy",
      category: "Performance modeling",
      description: "EPB TBM specific energy prediction using operational parameters.",
      url: "https://github.com/kilickursat/specificenergy",
      tags: ["Specific energy", "EPB", "Prediction"]
    }
  ],
  timeline: [
    {
      year: "2020",
      title: "Mining engineering thesis foundation",
      text: "Cutting tool performance analysis through ILCM tests and computer-aided modeling methods."
    },
    {
      year: "2022",
      title: "Deep learning for cutter wear",
      text: "1D CNN publication on EPB TBM cutter wear prediction using machine parameters."
    },
    {
      year: "2023",
      title: "Lithology classification from TBM data",
      text: "Clustering-guided LightGBM work for soft-ground tunnel lithology classification."
    },
    {
      year: "Now",
      title: "Autonomous TBM and tunnel-domain AI",
      text: "Expanding toward data-driven geomechanics, LLM-enabled tunnelling knowledge, and engineering decision support."
    }
  ]
};
