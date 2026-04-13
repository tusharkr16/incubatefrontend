/**
 * Hardcoded grant knowledge base for GrantsGPT.
 * Each entry has keyword patterns and a detailed response.
 * The matcher picks the best-fitting entry for the user's question.
 */

export interface KBEntry {
  keywords: string[];
  response: string;
}

export const KNOWLEDGE_BASE: KBEntry[] = [
  // ── SISFS ────────────────────────────────────────────────────────────────
  {
    keywords: ['sisfs', 'startup india seed fund', 'seed fund scheme', 'dpiit seed'],
    response: `**Startup India Seed Fund Scheme (SISFS)** — managed by DPIIT, Ministry of Commerce.

**What it offers:**
- Up to ₹20L as grants for proof-of-concept, prototype development, and trials
- Up to ₹50L as loans/convertible debentures for market entry and commercialisation

**Eligibility:**
- DPIIT-recognised startup (not more than 2 years old at the time of application)
- Startup must be incubated at an AIM/DST/DPIIT-approved incubator
- Not received more than ₹10L under any other Central/State government grant scheme for same purpose
- Business plan must have clear social impact potential

**How to apply:**
1. Get DPIIT recognition at **startupindia.gov.in**
2. Join a SISFS-approved incubator (your incubator may already be approved!)
3. Submit application through the incubator's selection committee
4. Incubator forwards shortlisted applications to DPIIT

**Official portal:** startupindia.gov.in/content/sih/en/sisfs.html

💡 **Tip:** Many founders miss that the application goes *through the incubator*, not directly to DPIIT. Speak to your incubator programme manager first.`,
  },

  // ── BIRAC BIG ────────────────────────────────────────────────────────────
  {
    keywords: ['birac', 'big grant', 'biotechnology', 'birac big', 'biotech grant'],
    response: `**BIRAC BIG (Biotechnology Ignition Grant)** — Biotechnology Industry Research Assistance Council.

**What it offers:**
- Up to ₹50 Lakhs
- For early-stage biotech, medtech, or life sciences innovation
- Non-dilutive grant (no equity taken)

**Eligibility:**
- Indian biotech startups or academic spin-offs
- Strong scientific and technical merit
- Must demonstrate proof-of-concept or pre-commercial stage
- Sole proprietors, companies, LLPs, or institutions can apply

**Supported areas:**
Healthcare, diagnostics, agri-biotech, industrial biotech, bioinformatics, vaccines, medical devices

**Application Process:**
1. Create account on **birac.nic.in**
2. Submit Letter of Intent (LOI) during open call window
3. Shortlisted applicants invited for full proposal
4. Expert panel review and site visit
5. Grant agreement signed with BIRAC

**Key documents:** Project proposal, budget justification, team CVs, proof of IP (if any), incorporation certificate

**Official portal:** birac.nic.in/scheme_det.php?id=53

💡 Calls open 2–3 times per year. Watch for announcement emails on the BIRAC newsletter.`,
  },

  // ── NIDHI-PRAYAS ─────────────────────────────────────────────────────────
  {
    keywords: ['nidhi', 'prayas', 'nidhi prayas', 'dst prayas', 'prototype grant', 'dst grant'],
    response: `**NIDHI-PRAYAS (Promoting and Accelerating Young and Aspiring Innovators & Startups)** — DST, Government of India.

**What it offers:**
- Up to ₹10 Lakhs per startup
- Focused on early prototype development
- Access to fabrication labs and maker spaces at host institutions

**Eligibility:**
- Innovative idea at concept/prototype stage
- Individuals, teams, or early startups (Indian nationals)
- Must be associated with a NIDHI host institution (IITs, NITs, IIMs, NSTEDB centres)
- Age of principal applicant: 18–45 years preferred

**What it funds:**
- Raw materials and components
- Equipment usage/access
- IP filing fees
- Travel for market validation

**Apply through:** Your nearest NIDHI-PRAYAS host centre (check DST website for list)

**Timeline:** Typically 3–6 months from application to disbursement

**Official portal:** dst.gov.in/nidhi

💡 This is one of the best grants for hardware/deep-tech startups at the idea stage. You don't need to be a registered company — even a student team can apply.`,
  },

  // ── AIM / Atal Innovation ─────────────────────────────────────────────────
  {
    keywords: ['aim', 'atal innovation', 'atal incubation', 'niti aayog grant', 'aic'],
    response: `**Atal Innovation Mission (AIM)** — NITI Aayog, Government of India.

**Key programmes:**

**1. Atal Incubation Centres (AIC)**
- Up to ₹10 Crores over 5 years to set up/scale incubators
- For universities, R&D institutions, and industry bodies

**2. Atal New India Challenges (ANIC)**
- ₹30L–₹1Cr for startups solving specific national problems
- Theme-based: healthcare, agriculture, water, clean energy
- Winners get grant + mentoring + procurement linkages

**3. Atal Community Innovation Centres (ACIC)**
- For tier 2/3 cities and rural innovation

**Startup Eligibility for ANIC:**
- DPIIT-recognised startup
- Product/service must address the specific challenge theme
- Prototype must exist (POC stage or higher)
- Prefer startups with some market validation

**How to track open challenges:**
- Visit **aim.gov.in** → Challenges section
- Subscribe to AIM newsletter for new challenge announcements

**Official portal:** aim.gov.in

💡 ANIC challenges are competitive but prestigious — winning gives strong credibility for follow-on fundraising.`,
  },

  // ── TIDE 2.0 ──────────────────────────────────────────────────────────────
  {
    keywords: ['tide', 'tide 2.0', 'meity', 'ict grant', 'ai grant', 'iot grant', 'technology incubation'],
    response: `**TIDE 2.0 (Technology Incubation and Development of Entrepreneurs)** — MeitY, Government of India.

**What it offers:**
- Up to ₹75 Lakhs per startup in equity-free funding
- Hosted through selected Technology Business Incubators (TBIs) under MeitY

**Eligible sectors:**
- Artificial Intelligence & Machine Learning
- Internet of Things (IoT)
- Blockchain
- Cybersecurity
- Accessibility technologies for differently-abled
- Any ICT-enabled product/service

**Funding structure:**
- Seed support: ₹5L–₹25L (equity-free)
- Scale-up support: up to ₹50L (as convertible debt or equity)

**Eligibility:**
- Early-stage tech startup (ideally pre-Series A)
- Must be incubated at a MeitY-empanelled TBI
- Strong technology differentiation
- Indian-registered entity

**Process:**
1. Apply to a MeitY-empanelled TBI near you
2. TBI evaluates and forwards to MeitY review committee
3. Phased disbursement based on milestone achievement

**Official portal:** meity.gov.in/tide

💡 If you're building AI, IoT, or cybersecurity products, TIDE 2.0 is one of the most relevant government grants available.`,
  },

  // ── Stand-Up India ────────────────────────────────────────────────────────
  {
    keywords: ['stand up india', 'standup india', 'sc st', 'women entrepreneur', 'sidbi loan'],
    response: `**Stand-Up India Scheme** — SIDBI / Ministry of Finance.

**What it offers:**
- Loans from ₹10 Lakhs to ₹1 Crore
- For setting up greenfield enterprises
- Covers manufacturing, services, or trading sector

**Who can apply:**
- SC or ST entrepreneurs, OR
- Women entrepreneurs
- First-generation entrepreneurs preferred

**Key features:**
- Composite loan (working capital + term loan)
- 7-year repayment period
- Moratorium of up to 18 months
- Loan guarantee through CGTMSE available

**Documents required:**
- Identity & address proof
- Business plan / project report
- Community certificate (for SC/ST applicants)
- Last 6 months bank statements
- Income tax returns (if applicable)
- Shop & Establishment / trade licence

**Apply through:**
- Any scheduled commercial bank branch
- Online: **standupmitra.in**

**Official portal:** standupmitra.in

💡 This is a *loan*, not a grant — but the terms are very favorable. Combine it with a MUDRA loan for smaller working capital needs.`,
  },

  // ── MSME ──────────────────────────────────────────────────────────────────
  {
    keywords: ['msme', 'msme scheme', 'msme grant', 'ministry of msme', 'udyam', 'msme registration'],
    response: `**MSME Schemes** — Ministry of Micro, Small & Medium Enterprises.

**1. Udyam Registration** (formerly Udyog Aadhaar)
- Free online registration: **udyamregistration.gov.in**
- Gives access to all MSME benefits including priority lending, subsidies, and tenders

**2. CLCSS (Credit Linked Capital Subsidy Scheme)**
- 15% subsidy on capital investment in plant & machinery (up to ₹15L)
- For technology upgradation in manufacturing

**3. MSME Champions Scheme**
- Combines lean manufacturing, quality management, ZED certification
- Grants for cluster development and technology centres

**4. PSB Loans in 59 Minutes**
- Quick loan approvals up to ₹5Cr
- Apply at **psbloansin59minutes.com**

**5. GeM (Government e-Marketplace)**
- Sell directly to government buyers
- Reservation policies favour MSMEs

**6. Technology Centres (MSME-TCs)**
- Subsidised machining, testing, and training

**Key tip — Udyam Registration is the gateway:**
Register on udyamregistration.gov.in first. This single step qualifies you for 95% of MSME schemes.

**Official portal:** msme.gov.in`,
  },

  // ── MUDRA ─────────────────────────────────────────────────────────────────
  {
    keywords: ['mudra', 'pmmy', 'pradhan mantri mudra', 'mudra loan', 'shishu', 'kishore', 'tarun'],
    response: `**PMMY — Pradhan Mantri MUDRA Yojana**

**Three loan tiers:**

| Category | Amount | Stage |
|----------|--------|-------|
| Shishu | Up to ₹50,000 | Early startup/micro business |
| Kishore | ₹50,001 – ₹5L | Established micro business |
| Tarun | ₹5L – ₹20L | Scaling business |

**No collateral required** for Shishu and Kishore categories.

**Who can apply:**
- Non-corporate, non-farm micro/small enterprises
- Artisans, shopkeepers, vendors, small manufacturers
- Self-help groups

**Eligible activities:**
Food processing, textile, transport, community services, salons, repairs, trading, agriculture-allied

**How to apply:**
1. Visit any bank/MFI/NBFC branch or Micro Finance Institution
2. Online: **mudra.org.in**
3. Jan Samarth portal: **jansamarth.in**

**Documents:** Business plan, identity proof, address proof, 6 months bank statement

**Official portal:** mudra.org.in

💡 MUDRA is best for micro-entrepreneurs. For tech startups, combine MUDRA with SISFS or TIDE 2.0 for a larger funding base.`,
  },

  // ── DPIIT Recognition ────────────────────────────────────────────────────
  {
    keywords: ['dpiit', 'dpiit recognition', 'startup recognition', 'recognized startup', 'startup india recognition'],
    response: `**DPIIT Startup Recognition** — the foundational step for accessing most government startup schemes.

**Why you need it:**
- Mandatory for SISFS, TIDE 2.0, and many state grants
- 80IC tax exemption (3 out of 7 years, subject to conditions)
- Self-certification under labour and environment laws
- Fast-tracking of patent applications (80% fee rebate)
- Access to Fund of Funds (SIDBI-managed)

**Eligibility:**
- Incorporated as Pvt Ltd, LLP, or Partnership in India
- Less than 10 years old from date of incorporation
- Annual turnover ≤ ₹100 Crore in any financial year
- Working towards innovation, development, or improvement of products/services

**How to apply:**
1. Go to **startupindia.gov.in/content/sih/en/startupgov/startup-recognition.html**
2. Login / register with Startup India account
3. Fill application: Company details, founders, business description, innovation aspect
4. Upload: Certificate of Incorporation, PAN, pitch deck or product description
5. DPIIT reviews and issues recognition certificate (usually 2–5 working days)

**It's free and fast — most founders get it within a week.**

💡 Apply the moment you incorporate. There is no downside and the benefits compound over time.`,
  },

  // ── Eligibility general ───────────────────────────────────────────────────
  {
    keywords: ['eligibility', 'am i eligible', 'qualify', 'can i apply', 'who can apply'],
    response: `Great question! Eligibility varies by scheme, but here's a quick guide:

**Common eligibility checkers:**

✅ **Age of startup** — Most grants target startups under 2–5 years old. Check your incorporation date.

✅ **DPIIT Recognition** — Required for SISFS, TIDE 2.0, and national-level grants. Apply free at startupindia.gov.in.

✅ **Udyam Registration** — Required for MSME schemes. Register free at udyamregistration.gov.in.

✅ **Sector fit** — BIRAC (biotech), TIDE 2.0 (ICT/AI/IoT), AIM (cross-sector), NIDHI-PRAYAS (early-stage tech).

✅ **Stage** — NIDHI-PRAYAS (idea/POC), SISFS (prototype to market entry), TIDE 2.0 (early product), AIC (scaling).

✅ **Revenue cap** — Most grants require turnover under ₹25L–₹100Cr.

✅ **Prior grant history** — Some schemes restrict duplicate funding. Declare any grants already received.

**Ask me about a specific scheme** (e.g. "Am I eligible for SISFS?") and I'll give you the detailed criteria for that grant.`,
  },

  // ── Documents ─────────────────────────────────────────────────────────────
  {
    keywords: ['documents', 'documentation', 'what documents', 'required documents', 'paperwork'],
    response: `**Common documents required across most grant applications:**

**Company documents:**
- Certificate of Incorporation (from MCA)
- MoA / AoA or LLP Agreement
- PAN card of the company
- GST certificate (if applicable)
- Udyam registration certificate

**Founder documents:**
- Aadhaar + PAN of all directors/partners
- LinkedIn profiles or CVs
- Shareholding structure / cap table

**Financial documents:**
- Last 2 years audited financials (if incorporated > 1 year)
- Bank statements (6–12 months)
- Projected financials for 3 years

**Business documents:**
- Detailed project/business plan
- Pitch deck (10–15 slides)
- Product demo video or prototype photos
- IP details (patents filed/granted, if any)
- Customer letters of intent or MoUs (if available)

**Scheme-specific:**
- SISFS: Incubator recommendation letter
- BIRAC BIG: Scientific merit review, ethical approval (for clinical)
- DPIIT Recognition: Innovation description

💡 **Pro tip:** Prepare a "grant folder" with all these documents ready. Most applications re-use the same core docs — having them ready means you can apply quickly when a call opens.`,
  },

  // ── Application process ───────────────────────────────────────────────────
  {
    keywords: ['how to apply', 'application process', 'apply for grant', 'grant application', 'steps to apply'],
    response: `**General grant application process in India:**

**Step 1: Get your registrations done**
- DPIIT Recognition (startupindia.gov.in) — free, 2–5 days
- Udyam Registration (udyamregistration.gov.in) — free, instant
- GST registration if turnover > ₹20L

**Step 2: Choose the right grant**
- Match your sector, stage, and funding need to the right scheme
- Check if the application window is open (many grants have periodic calls)

**Step 3: Prepare your application package**
- Business plan / project proposal (structured as per scheme template)
- Financial projections
- Team bios
- Product/prototype evidence

**Step 4: Submit through the right channel**
- Some grants go directly to the ministry portal
- SISFS and TIDE 2.0 go *through your incubator* — the incubator shortlists and forwards
- State grants typically go through the state's startup cell

**Step 5: Review and due diligence**
- Screening / LOI stage (2–4 weeks)
- Full proposal review (4–8 weeks)
- Expert committee / site visit
- Approval and grant agreement

**Step 6: Milestone-based disbursement**
- Most grants release funds in 2–3 tranches tied to milestones
- Maintain receipts and utilisation certificates

💡 **Talk to your incubator programme manager early** — they know which grants are currently open and can strengthen your application.`,
  },

  // ── AgriTech ──────────────────────────────────────────────────────────────
  {
    keywords: ['agritech', 'agriculture', 'agri startup', 'farm', 'agri grant'],
    response: `**Top grants for AgriTech startups in India:**

**1. RKVY-RAFTAAR (Rashtriya Krishi Vikas Yojana)**
- ₹5L–₹25L for agri-business incubation
- Hosted through RKVY-RAFTAAR incubators across India
- Portal: rkvy.nic.in

**2. BIRAC BIG** (if biotech-agri)
- Up to ₹50L for agri-biotech innovations
- Covers biopesticides, biofertilisers, precision farming tech

**3. NABARD — Agricultural Technology Fund**
- Loans and grants for rural/agri-tech startups
- Through NABARD's FLAP (Farmers' Livelihood & Agri Promotion)

**4. SFAC (Small Farmers' Agribusiness Consortium)**
- Venture capital for agri-business
- Equity participation model up to ₹10Cr

**5. AIM ANIC — AgriTech challenges**
- Grant-based challenges from AIM (NITI Aayog)
- Themes include supply chain, post-harvest loss, and farmer income

**6. State AgriTech schemes**
- Maharashtra, Gujarat, Telangana, and Karnataka have dedicated agritech funds
- Ask your state startup cell for local schemes

💡 Many AgriTech startups combine RKVY-RAFTAAR with DPIIT SISFS for a strong funding stack.`,
  },

  // ── HealthTech / MedTech ──────────────────────────────────────────────────
  {
    keywords: ['healthtech', 'medtech', 'healthcare startup', 'medical device', 'health grant', 'medical innovation'],
    response: `**Top grants for HealthTech / MedTech startups:**

**1. BIRAC BIG** (best fit)
- Up to ₹50L for biotech, diagnostics, medical devices, digital health
- birac.nic.in

**2. BIRAC LEAP (Launching Entrepreneurship in Academia for Products)**
- For academics commercialising health innovations

**3. iCreate / C-CAMP (for life sciences)**
- Centre for Cellular and Molecular Platforms — wet lab access + funding

**4. Ayushman Bharat Digital Mission (ABDM) Sandbox**
- Not a grant, but gives health startups access to national health data stack and credibility

**5. DST NMitLi (National Mission on Interdisciplinary Cyber-Physical Systems)**
- For AI-in-healthcare and medical imaging startups

**6. MedTech Innovation Fund — FICCI FLO**
- Women-led MedTech startups

**Regulatory note for medical devices:**
- Devices must be registered with CDSCO (Central Drugs Standard Control Organisation)
- Class A/B devices: self-certification; Class C/D: third-party audit required
- Software-as-a-Medical-Device (SaMD) guidelines apply for AI-diagnostic apps

💡 Start with DPIIT recognition → BIRAC BIG → scale to Series A with private HealthTech funds (Healthquad, Chiratae, etc.)`,
  },

  // ── EdTech ────────────────────────────────────────────────────────────────
  {
    keywords: ['edtech', 'education technology', 'edutech', 'e-learning', 'education startup'],
    response: `**Grants and support for EdTech startups:**

**1. TIDE 2.0 (MeitY)** — best fit for ICT-based learning platforms
- Up to ₹75L; covers AI-based education tools, VR/AR classrooms, LMS platforms

**2. National Digital Education Architecture (NDEAR)**
- DIKSHA/NEAT ecosystem — integration with national platforms can unlock pilots

**3. CBSE/NEP Innovation Fund**
- For startups building for K-12 outcomes aligned to NEP 2020

**4. Startup India Seed Fund (SISFS)**
- Up to ₹20L for early-stage EdTech (sector-agnostic)

**5. Social Alpha / Villgro**
- Impact-focused EdTech (rural/vernacular learning)
- Non-dilutive grants of ₹5L–₹50L

**6. YourStory EdTech 50 / NASSCOM Ed programmes**
- Cohort-based acceleration with grant components

**State schemes:**
- Telangana T-IDEA, Kerala KSUM, Gujarat iHub all support EdTech

💡 EdTech adoption spiked post-COVID. Government procurement (DigiSchool, PM eVidya) is a huge revenue opportunity alongside grants — pursue both simultaneously.`,
  },

  // ── Budget tracker ────────────────────────────────────────────────────────
  {
    keywords: ['budget', 'budget tracker', 'spent', 'expense', 'capax', 'recurring', 'training cost'],
    response: `**Using the Budget Tracker in IncubatX:**

The Budget Tracker helps you plan and track grant fund utilisation across pre-defined categories:

**Categories:**
- 📢 **Recurring** — Digital marketing, networking events (Years 1–3)
- 🎓 **Training Costs** — Entrepreneur programmes, mentor honorariums, growth events (Years 1–3)
- 📋 **Administrative** — Lab consumables, publications, stationery, misc (Years 1–3)
- ✈️ **Travel (Domestic)** — Domestic travel costs (Years 1–3)
- 🏗️ **CAPAX** — Capital expenditure (equipment, infrastructure) — add custom items

**For each line item you can:**
- Enter the **Total Budget** allocated
- Enter the **Amount Spent** to date
- Add a **Note/Comment** for justification
- **Upload an invoice** (PDF or image) — stored securely

**Why it matters for grants:**
Most government grants (SISFS, BIRAC, TIDE 2.0) require a **Utilisation Certificate (UC)** showing how funds were spent. Keeping this tracker updated makes UC preparation easy and reduces audit risk.

**Tip:** Match your budget categories to the grant's approved budget heads. Spending outside approved heads can require amendment approval from the funding agency.`,
  },

  // ── State grants ──────────────────────────────────────────────────────────
  {
    keywords: ['state grant', 'state scheme', 'maharashtra', 'gujarat', 'rajasthan', 'karnataka', 'telangana', 'kerala', 'up startup', 'delhi startup'],
    response: `**State-level startup grants and schemes:**

**Maharashtra — MSInS (Maharashtra State Innovation Society)**
- Seed grants up to ₹15L; portal: msins.in

**Karnataka — KBITS / ELEVATE**
- ELEVATE 100 programme: top 100 startups get ₹50L grants
- kbits.karnataka.gov.in

**Gujarat — iCreate (International Centre for Entrepreneurship & Technology)**
- Up to ₹30L + incubation; icreate.res.in

**Telangana — T-IDEA / TSIC**
- ₹10L–₹25L seed fund; tsic.telangana.gov.in

**Kerala — KSUM (Kerala Startup Mission)**
- Equity-free grants, soft loans, campus programme; startupmission.in

**Rajasthan — iStart Rajasthan**
- Seed funding, mentoring, procurement linkages; istart.rajasthan.gov.in

**Delhi — DITT**
- Delhi Innovation & Technology Transfer programme; ditt.delhi.gov.in

**Uttar Pradesh — Startup UP**
- ₹5L–₹10L seed support; startup.up.gov.in

💡 **Stack state + central grants**: SISFS (central) + ELEVATE (Karnataka) is a common and powerful combination. There's generally no restriction on stacking different grants as long as the funding is for different cost heads.`,
  },

  // ── Tax benefits ──────────────────────────────────────────────────────────
  {
    keywords: ['tax', 'tax exemption', 'section 80ic', '80 iac', 'tax benefit', 'income tax startup'],
    response: `**Tax benefits for DPIIT-recognised startups:**

**Section 80-IAC — Profit deduction**
- 100% tax deduction on profits for 3 consecutive years out of first 10 years
- Must obtain inter-ministerial board certification
- Apply through DPIIT portal after getting recognition

**Section 54GB — Capital Gains**
- Individuals selling residential property can invest gains into eligible startups and claim exemption

**Angel Tax Exemption (Section 56(2)(viib))**
- DPIIT-recognised startups exempt from angel tax on investments
- No more worries about fair market value dispute on seed rounds

**ESOP Tax Deferral**
- Employees of DPIIT startups can defer tax on ESOPs until exercise or sale (whichever is earlier)
- Huge benefit for attracting talent with equity

**Carry Forward of Losses**
- Startups can carry forward losses even if shareholding changes (relaxation from normal 51% continuity rule)

**R&D Deduction (Section 35)**
- 150% weighted deduction on in-house R&D expenditure

💡 Consult a CA specialising in startup taxation to file correctly. Tax benefits are only available after proper certification — don't assume automatic eligibility.`,
  },

  // ── IP / Patents ──────────────────────────────────────────────────────────
  {
    keywords: ['patent', 'ip', 'intellectual property', 'trademark', 'copyright', 'ip protection'],
    response: `**Intellectual Property for Startups in India:**

**Patent filing benefits for DPIIT-recognised startups:**
- 80% rebate on official patent filing fees
- Fast-track examination (results in ~6 months vs 3–5 years normally)
- Free IP facilitation through DPIIT's NIPAM (National Intellectual Property Awareness Mission)

**How to file a patent:**
1. Check patentability (novel, non-obvious, industrial application)
2. Conduct prior art search (free at ipindiaonline.gov.in)
3. Draft patent specification (provisional or complete)
4. File at Indian Patent Office: ipindia.gov.in
5. Publication → Examination request → Grant

**Design & Trademark:**
- Trademark filing: ₹4,500 (individual) at ipindiaonline.gov.in
- Design registration: protects product appearance for 10–15 years

**Copyright:**
- Software is automatically copyrighted on creation
- Register at copyright.gov.in for stronger legal standing

**Key advice:**
- File a provisional patent before any public disclosure (conference, demo day, investor pitch)
- International protection: file PCT (Patent Cooperation Treaty) within 12 months of Indian filing

💡 IP assets significantly increase your startup's valuation and improve grant eligibility for innovation-focused schemes like BIRAC and NIDHI-PRAYAS.`,
  },

  // ── Incubation / Joining ─────────────────────────────────────────────────
  {
    keywords: ['incubation', 'join incubator', 'incubator', 'incubatx', 'cohort', 'programme'],
    response: `**Making the most of incubation at IncubatX:**

**What incubation gives you:**
- Access to office space, labs, and shared infrastructure
- Mentorship from domain experts and successful founders
- Grant facilitation (SISFS, TIDE 2.0, state schemes)
- Investor connect and demo day access
- Legal, accounting, and compliance support
- Peer network of co-incubated startups

**Grant access through the incubator:**
- SISFS requires incubator recommendation — once you're in, you're eligible to apply
- TIDE 2.0 similarly works through empanelled TBIs

**How to maximise your cohort:**
1. Attend all workshops and expert sessions (mentors bring real grant + business intel)
2. Update your milestones regularly — active startups get priority for grant nominations
3. Use the budget tracker to document fund utilisation
4. Share progress updates with your account manager monthly

**Graduation criteria (typical):**
- Product launched and revenue generating
- Team of 3+ full-time members
- External funding secured or strong pipeline

💡 Ask your programme manager about the next SISFS application window. We batch applications, so timing matters.`,
  },

  // ── Funding stages ────────────────────────────────────────────────────────
  {
    keywords: ['funding stage', 'seed funding', 'angel', 'series a', 'venture capital', 'vc', 'fundraise', 'investor'],
    response: `**Startup funding stages in India:**

**Pre-seed (₹10L–₹50L)**
- Sources: Bootstrapping, FFF (Friends, Family, Fools), government grants
- Best grants: NIDHI-PRAYAS, SISFS (up to ₹20L grant portion)
- Goal: Prove concept, build MVP

**Seed (₹50L–₹5Cr)**
- Sources: Angel investors, angel networks (Indian Angel Network, Chennai Angels, Mumbai Angels)
- Grants: SISFS (up to ₹50L convertible), TIDE 2.0, BIRAC BIG
- Goal: Product-market fit, first 10–50 customers

**Series A (₹5Cr–₹50Cr)**
- Sources: VC funds (Sequoia Surge, Accel, Nexus, Blume, Kalaari)
- Goal: Scale team and distribution

**Series B+ (₹50Cr+)**
- Sources: Growth equity, crossover funds, PE

**Non-dilutive vs dilutive:**
- Government grants = non-dilutive (you keep equity) ✅
- Convertible notes / SAFE = dilutive eventually
- VC = equity dilution

💡 **Best strategy for early-stage:** Max out non-dilutive grants before raising angel/VC. Every rupee from grants = no equity given away. Target ₹50L–₹1Cr in grants before your first angel round.`,
  },

  // ── Revenue model ─────────────────────────────────────────────────────────
  {
    keywords: ['revenue model', 'business model', 'monetise', 'monetize', 'saas', 'subscription', 'b2b', 'b2c'],
    response: `**Revenue models for Indian startups — and grant implications:**

**SaaS / Subscription**
- Recurring revenue = strong for grants that need revenue projections
- Best grants: TIDE 2.0 (for software), SISFS

**B2B Enterprise**
- Government procurement possible via GeM portal (MSMEs get preference)
- Longer sales cycles but higher ACV — factor into cash flow

**B2C / Consumer**
- Higher burn, needs scale to show unit economics
- Government grants less common for pure B2C — lean more on angel/VC

**Marketplace / Platform**
- Network effects are IP — document them for BIRAC/AIM applications

**Deep Tech / IP Licensing**
- Very grant-friendly — technology transfers and royalties accepted

**Social Enterprise / Impact**
- CSR funds, Social Alpha, Villgro, NABARD (agri/rural)
- SEBI's Social Stock Exchange (SSE) for regulated fundraising

**For grant applications:**
- Project 3-year revenue model clearly
- Show unit economics: CAC, LTV, payback period
- Grant committees want to see viability post-grant period

💡 Grants are not a substitute for a revenue model — they fund the *path to* revenue. Have a clear plan for what happens after the grant period.`,
  },

  // ── Utilisation Certificate ───────────────────────────────────────────────
  {
    keywords: ['utilisation certificate', 'uc', 'fund utilisation', 'grant report', 'grant compliance', 'audit'],
    response: `**Grant Utilisation Certificate (UC) — what you need to know:**

**What is a UC?**
A Utilisation Certificate is a formal document (countersigned by a CA) proving that grant funds were used for approved purposes. Required to receive subsequent tranches and for grant closure.

**Typical UC format includes:**
- Grant amount received
- Amount utilised (head-wise breakdown matching approved budget)
- Unspent balance explanation
- CA certificate with UDIN number
- Supporting schedules with voucher references

**Common approved heads:**
- Manpower costs (salaries)
- Equipment / capital expenditure (CAPAX)
- Travel and accommodation
- Consumables and materials
- IP filing fees
- Marketing / events (per approved budget)

**Penalties for misutilisation:**
- Recovery of grant amount with interest
- Blacklisting from future government grants
- Legal action in serious cases

**Best practices:**
1. Open a **separate bank account** for each grant (strongly recommended)
2. Never mix grant funds with regular business funds
3. Get CA-signed invoices for every expenditure
4. Update the **IncubatX Budget Tracker** in real time — it will massively simplify UC preparation
5. Take photos of equipment purchased with grant funds

💡 The Budget Tracker in this platform maps exactly to typical UC heads. Fill it consistently and your UC preparation will take hours, not weeks.`,
  },

  // ── CleanTech / GreenTech ─────────────────────────────────────────────────
  {
    keywords: ['cleantech', 'greentech', 'clean energy', 'solar', 'ev', 'electric vehicle', 'sustainability', 'climate'],
    response: `**Grants for CleanTech / GreenTech / Climate startups:**

**1. MNRE (Ministry of New & Renewable Energy)**
- Solar, wind, green hydrogen initiatives
- Technology Innovation Grant under MNRE
- mnre.gov.in

**2. DBT — Biotechnology for Climate**
- Biofuels, biodegradable plastics, carbon capture (biotech angle)

**3. SIDBI — Green Finance**
- Low-interest green loans for energy-efficient tech

**4. GIZ (Indo-German)**
- Grants for solar, EV charging, rural clean energy
- India Smart Grids Forum partnerships

**5. Villgro / Upaya**
- Impact grants for climate social enterprises (up to ₹50L)

**6. AIM ANIC — Clean Energy Challenges**
- Periodic challenges on EV, energy storage, clean cooking

**7. ISGF — India Smart Grid Forum**
- For grid-connected renewable tech

**International:**
- USAID LEAP, Rockefeller Foundation, Good Energies Foundation
- Climate Finance partnerships with World Bank / ADB

**Carbon Credits:**
- Register with Gold Standard / VCS for carbon credits as revenue stream alongside grants

💡 CleanTech has the most international grant opportunities in 2026. Apply for India grants AND explore international climate funds simultaneously.`,
  },

  // ── Compliance ───────────────────────────────────────────────────────────
  {
    keywords: ['compliance', 'legal', 'roc', 'mca', 'annual return', 'gst filing', 'company law'],
    response: `**Startup compliance basics in India:**

**MCA / RoC (Registrar of Companies):**
- Annual Return (MGT-7): File within 60 days of AGM
- Financial Statements (AOC-4): File within 30 days of AGM
- DIR-3 KYC: Annual director KYC (September deadline)
- BEN-2: Beneficial ownership declaration

**GST:**
- Monthly/Quarterly GSTR-1 (outward supplies)
- Monthly GSTR-3B (summary return)
- Annual GSTR-9 (for turnover > ₹2Cr)
- GST audit (GSTR-9C) for turnover > ₹5Cr

**Income Tax:**
- ITR-6 for companies: File by 31st October (with audit) or 31st July (without)
- Advance tax payments: quarterly if tax liability > ₹10,000/year
- TDS returns (26Q, 24Q) if you have employees or pay vendors

**Labour laws (relaxed for DPIIT startups):**
- Self-certification under 9 labour laws for first 5 years
- No inspections without permission during this period

**Startup-specific:**
- RBI FEMA compliance if receiving foreign investment (FC-GPR filing)
- ESOP scheme approval by shareholders
- Statutory audit mandatory if turnover > ₹1Cr

💡 Non-compliance = disqualification from most government grants. Keep your ROC filings updated before applying for any scheme.`,
  },

  // ── Mentorship ────────────────────────────────────────────────────────────
  {
    keywords: ['mentor', 'mentorship', 'advisor', 'expert', 'guidance', 'help startup'],
    response: `**Finding mentors and advisors for your startup:**

**Through IncubatX:**
- Domain expert sessions (check your cohort calendar)
- Account manager introductions to relevant mentors
- Industry-specific workshops throughout the programme

**Government mentorship programmes:**
- **DPIIT Mentor India Campaign**: mentors.startupindia.gov.in — register to be matched with experienced entrepreneurs
- **SINE (Society for Innovation & Entrepreneurship)**: IIT Bombay, tech-focused mentors
- **TiE (The Indus Entrepreneurs)**: Network of 15,000+ mentors globally, strong India chapter

**Sector-specific:**
- iSPIRT (SaaS/B2B software): volunteer mentors, PlaybookRT workshops
- NEN (National Entrepreneurship Network): campus-connected mentors
- WEHub (Telangana): for women entrepreneurs

**Equity vs non-equity advisors:**
- Advisor equity: typically 0.1%–0.5% vested over 2 years
- Keep an advisor pool of 4–6 domain specialists
- Set clear expectations: 2–4 hours/month minimum

**What to ask a mentor:**
- Customer introductions (most valuable)
- Fundraising strategy and warm intros to investors
- Product feedback and market positioning
- Government grant application reviews

💡 The best mentors come through warm introductions. Ask your account manager — we often know who's best for your sector.`,
  },

  // ── Pitch deck ────────────────────────────────────────────────────────────
  {
    keywords: ['pitch deck', 'pitch', 'investor presentation', 'deck', 'slides'],
    response: `**Grant/Investor pitch deck structure — Indian context:**

**Standard 12-slide structure:**

1. **Cover** — Name, tagline, contact
2. **Problem** — Data-backed pain point; Indian market context
3. **Solution** — Your product, unique approach
4. **Market Size** — TAM / SAM / SOM with India-specific numbers
5. **Product** — Screenshots, demo, key features
6. **Business Model** — How you make money; unit economics
7. **Traction** — Revenue, users, growth rate, key customers
8. **Go-to-Market** — Customer acquisition strategy
9. **Competition** — Honest 2×2 or table; why you win
10. **Team** — Founders + key hires; relevant experience
11. **Financials** — 3-year projection, key assumptions, burn rate
12. **Ask** — Amount raising, use of funds, milestones it unlocks

**For grant applications (adjust slide 12):**
- Budget breakdown by approved heads
- Milestones and deliverables timeline
- Expected impact (jobs created, revenue, IP filed)
- Exit / scale strategy post-grant

**Common mistakes:**
- No India-specific market data
- Team slide with no relevant experience
- No traction data (even early) 
- Vague "use of funds"

💡 For grants, the committee values **social/economic impact** highly. Add a slide or section specifically addressing: jobs created, communities served, or national priority alignment.`,
  },

  // ── Fallback ─────────────────────────────────────────────────────────────
  {
    keywords: [],
    response: `I'm GrantsGPT, your AI grant consultant for Indian government schemes and startup funding.

Here are some topics I can help with:

**Government Grants:**
- SISFS (Startup India Seed Fund)
- BIRAC BIG (biotech/medtech)
- NIDHI-PRAYAS (prototype stage)
- TIDE 2.0 (ICT/AI/IoT)
- AIM — Atal Innovation Mission
- Stand-Up India, MUDRA, MSME schemes
- State-level grants (Karnataka ELEVATE, Gujarat iCreate, etc.)

**Startup Essentials:**
- DPIIT recognition process
- Eligibility for specific schemes
- Documents required
- Step-by-step application process
- Tax benefits for startups
- IP/Patent guidance

**IncubatX Platform:**
- Budget tracker and grant utilisation
- Utilisation Certificates (UC)
- Cohort programme and milestone tracking

Try one of the suggested questions, or type your own!`,
  },
];

/**
 * Find the best matching knowledge base entry for a given user message.
 * Returns the response string.
 */
export function matchResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  // Score each entry by number of keyword matches
  let bestScore = 0;
  let bestEntry = KNOWLEDGE_BASE[KNOWLEDGE_BASE.length - 1]; // fallback

  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.length === 0) continue; // skip fallback in scoring
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) score += 2; // exact match
      else if (kw.split(' ').some((word) => word.length > 3 && lower.includes(word))) score += 1; // partial word
    }
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return bestEntry.response;
}
