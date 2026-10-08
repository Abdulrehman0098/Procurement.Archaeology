# Procurement Archaeology

> Reconstructing the hidden supply chains, dependencies, costs, and failures behind public projects.

**Who really built this, who supplied what, how much did it actually cost, and what went wrong?**

---

## Overview

Procurement Archaeology is a deep-search intelligence platform that mines government procurement records, court filings, customs data, corporate registries, patents, and technical standards to reconstruct the full story behind public projects — roads, hospitals, border scanners, IT platforms, schools, water plants, and more.

**Differentiation:** Most procurement sites are raw databases. Most investigative journalism sites are story-based. Procurement Archaeology combines both into structured, source-linked dossiers that anyone can search deeply.

## Region & Scope (V1)

- **Region:** European Union + United Kingdom + United States
- **Sector:** Public infrastructure and public IT
- **Years:** 2015–present
- **Initial output:** 5 fully researched dossiers

## Repository Structure

```
procurement-archaeology/
  apps/
    web/          # Next.js 14 frontend
    api/          # FastAPI backend
    admin/        # Admin dashboard
  packages/
    ui/           # Shared UI components
    db/           # SQLAlchemy models + Alembic migrations
    graph/        # Neo4j models and Cypher queries
    search/       # Elasticsearch/OpenSearch mappings
    ingest/       # Scrapers, parsers, OCR pipelines
    resolve/      # Entity resolution
    verify/       # Verification workflows
    shared/       # Types, utilities, schemas
  data/
    raw/          # Original PDFs, HTML, JSON
    processed/    # Cleaned, normalized data
    archive/      # Hashed source archive (immutable)
    sources.json  # Registry of data sources
  dossiers/       # Markdown + JSON dossiers
  docs/
    methodology/  # How we investigate
    api/          # OpenAPI 3.1 specification
    schema/       # Database, graph, and search schemas
    legal/        # Legal & ethics guide
    reports/      # Phase reports
  infra/          # Docker, Kubernetes, CI/CD
  scripts/        # Automation scripts
```

## Quick Start

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker and Docker Compose
- Python 3.11+ (for ingestion pipelines)
- uv (Python package manager)

### Installation

```bash
# Clone
git clone https://github.com/procurement-archaeology/procurement-archaeology.git
cd procurement-archaeology

# Install dependencies
cp .env.example .env.local  # Edit with real values
pnpm install

# Start databases (Docker Compose)
pnpm docker:up

# Run migrations
pnpm --filter @pa/db run migrate

# Start services in development
pnpm dev
```

### Services

| Service       | Port | Description                        |
|---------------|------|------------------------------------|
| Web           | 3000 | Next.js frontend                   |
| API           | 8000 | FastAPI backend                    |
| Admin         | 3001 | Admin dashboard                    |
| PostgreSQL    | 5435 | Relational data                    |
| Neo4j         | 7474 | Graph database (UI) / 7687 (Bolt)  |
| Elasticsearch | 9200 | Search engine                      |
| Redis         | 6380 | Caching and queues                 |
| MinIO         | 9000 | S3-compatible object storage       |

## Data Sources

See `data/sources.json` for the complete source registry. Key portals:

- **EU:** [TED](https://ted.europa.eu) (Tenders Electronic Daily)
- **UK:** [Contracts Finder](https://www.contractsfinder.service.gov.uk), [Find a Tender](https://www.find-tender.service.gov.uk)
- **US:** [SAM.gov](https://sam.gov), [USAspending.gov](https://www.usaspending.gov)
- **Corporate:** [OpenCorporates](https://opencorporates.com), [GLEIF](https://www.gleif.org)
- **Trade:** [UN Comtrade](https://comtrade.un.org)
- **Patents:** [EPO OPS](https://www.epo.org/searching/api), [USPTO Bulk Data](https://bulkdata.uspto.gov)
- **Courts:** [EUR-Lex](https://eur-lex.europa.eu)

## License

- **Code:** MIT
- **Content (dossiers, reports):** CC BY-NC-SA 4.0
- **Data:** As specified by individual source licenses

## Contact

- **Website:** [procurement-archaeology.dev](https://procurement-archaeology.dev)
- **Methodology:** [docs/methodology](docs/methodology)
- **Legal:** [docs/legal](docs/legal)
