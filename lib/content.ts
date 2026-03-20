export interface ArticleEntry {
  slug: string
  category: "guides" | "equipment" | "agrivoltaics" | "solar-grazing"
  title: string
  description: string
  intro: string
  sections: Array<{ heading: string; content: string }>
  affiliateItems?: string[]
}

export const articles: ArticleEntry[] = [
  {
    slug: "solar-grazing-income-europe",
    category: "guides",
    title: "How much can you earn with solar grazing in Europe?",
    description: "Income ranges, cost factors, and contract terms that influence returns from solar grazing in Europe.",
    intro: "This guide covers the main income drivers for sheep grazing under solar panels. Use it as a planning baseline before signing contracts.",
    sections: [
      { heading: "What affects income", content: "Income depends on site size, grazing season length, access conditions, and who pays for fencing and water." },
      { heading: "Typical deal structures", content: "Most arrangements use annual per-hectare pricing, fixed service contracts, or hybrid models with performance clauses." },
      { heading: "How to improve margins", content: "Focus on travel efficiency, reliable handling systems, and clear service scopes to reduce operational waste." },
    ],
  },
  {
    slug: "best-fencing-for-sheep-under-solar-panels",
    category: "equipment",
    title: "Best fencing for sheep under solar panels",
    description: "Compare temporary and permanent fencing options for safer sheep grazing in solar parks.",
    intro: "Fencing is one of the first equipment decisions for solar grazing. This overview compares options by cost, safety, and setup speed.",
    sections: [
      { heading: "Temporary electric netting", content: "Useful for rotational areas and rapid setup, but requires regular checks and battery planning." },
      { heading: "Permanent perimeter systems", content: "Higher upfront cost but stronger long-term control for high-value sites and complex access zones." },
      { heading: "Panel-safe setup tips", content: "Keep fence lines clear from inverter access routes and maintain safe distances from exposed site hardware." },
    ],
    affiliateItems: ["Portable electric net fencing kits", "Solar-powered fence energizers", "Mobile gate and reel sets"],
  },
  {
    slug: "solar-grazing-contracts-explained",
    category: "solar-grazing",
    title: "Solar grazing contracts explained",
    description: "Understand scope, liability, and payment terms in solar grazing agreements.",
    intro: "A clear contract protects both the site operator and the grazing partner. This template guide lists the clauses that matter most.",
    sections: [
      { heading: "Scope and responsibilities", content: "Define grazing zones, seasonal windows, excluded areas, and minimum service obligations." },
      { heading: "Risk and liability", content: "Document livestock responsibility, site incident handling, and insurance requirements in plain language." },
      { heading: "Payment and review cycles", content: "Set invoice timing, performance checks, and escalation paths to avoid disputes later." },
    ],
  },
  {
    slug: "agrivoltaics-income-per-hectare",
    category: "agrivoltaics",
    title: "Agrivoltaics income per hectare",
    description: "How to estimate per-hectare income potential for agrivoltaic projects.",
    intro: "Agrivoltaics can combine power revenue and agricultural use. This page outlines a practical income estimate workflow.",
    sections: [
      { heading: "Revenue inputs", content: "Start with project capacity, expected yield, land lease assumptions, and agricultural output scenarios." },
      { heading: "Cost adjustments", content: "Include grid connection, maintenance, fencing, water access, and compliance costs before deciding." },
      { heading: "Decision checkpoints", content: "Compare conservative, expected, and upside cases to test if the project is resilient." },
    ],
  },
  {
    slug: "how-to-start-solar-grazing-as-farmer",
    category: "guides",
    title: "How to start solar grazing as a farmer",
    description: "A step-by-step plan for farmers entering solar grazing.",
    intro: "If you are a farmer exploring grazing under solar panels, this guide covers first steps from equipment to partnership outreach.",
    sections: [
      { heading: "Prepare your operation", content: "Assess flock size, transport capacity, handling equipment, and labor availability." },
      { heading: "Target suitable sites", content: "Prioritize nearby sites with practical access, water options, and clear service expectations." },
      { heading: "Win and retain contracts", content: "Use clear pricing, response times, and reporting to build long-term operator trust." },
    ],
  },
]

export function getArticle(category: ArticleEntry["category"], slug: string) {
  return articles.find((article) => article.category === category && article.slug === slug)
}

export function getCategoryArticles(category: ArticleEntry["category"]) {
  return articles.filter((article) => article.category === category)
}
