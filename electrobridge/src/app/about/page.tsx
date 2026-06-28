import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — ElectroBridge | Electronics & Semiconductor Opportunities",
  description: "Learn about ElectroBridge — a free platform aggregating JRF, PhD, government, and private sector opportunities in electronics and semiconductor research across India and internationally.",
  alternates: { canonical: "https://electrobridge.vercel.app/about" },
  openGraph: {
    title: "About ElectroBridge",
    description: "Free platform for JRF, PhD, DRDO, ISRO, CSIR opportunities in electronics & semiconductor.",
    url: "https://electrobridge.vercel.app/about",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ElectroBridge",
    url: "https://electrobridge.vercel.app",
    description: "Electronics and semiconductor opportunity aggregator for Indian researchers",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://electrobridge.vercel.app/opportunities?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="font-display text-3xl font-bold text-text-primary mb-8">About ElectroBridge</h1>

      <section className="space-y-8 text-text-muted text-sm leading-relaxed">
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-3">What is ElectroBridge?</h2>
          <p>ElectroBridge is a free, comprehensive platform that aggregates electronics and semiconductor research opportunities from across India and internationally. We bring together JRF (Junior Research Fellowship), SRF (Senior Research Fellowship), PhD positions, government research jobs, and private sector opportunities in one searchable platform.</p>
          <p className="mt-3">Our mission is to make it easy for electronics researchers, engineers, and students to discover and apply for opportunities that match their qualifications and interests.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-3">What types of opportunities does ElectroBridge list?</h2>
          <p>We list a wide range of opportunities including JRF/SRF positions at DRDO, ISRO, CSIR labs, and IITs; fully-funded PhD programs in India and abroad; government research jobs at organizations like BARC and DRDO; fellowships such as CSIR-UGC NET JRF and DST INSPIRE; and private sector roles at companies like Texas Instruments.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-3">Which organizations post on ElectroBridge?</h2>
          <p>We aggregate opportunities from DRDO (Defence Research and Development Organisation), ISRO (Indian Space Research Organisation), CSIR-NPL, CSIR-CEERI, BARC (Bhabha Atomic Research Centre), IIT Delhi, IIT Bombay, IIT Kanpur, NITs, TU Chemnitz (Germany), A*STAR (Singapore), Texas Instruments India, and many more.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-3">Who can use ElectroBridge?</h2>
          <p>ElectroBridge is designed for MSc Electronics/Physics students seeking JRF positions, NET/GATE qualified candidates looking for research fellowships, BE/BTech Electronics engineers exploring research opportunities, PhD aspirants searching for doctoral positions, and professionals looking for semiconductor industry roles.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-3">How often is ElectroBridge updated?</h2>
          <p>Our platform updates daily through a combination of automated RSS feed scraping from official sources and manual curation. News articles are fetched every few hours, while opportunities are updated at least once daily. All auto-scraped listings are marked as pending verification.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-3">Is ElectroBridge free to use?</h2>
          <p>Yes, ElectroBridge is completely free for all users. You can browse, search, filter, and apply for opportunities without any subscription or payment. We also offer free email alerts for new opportunities matching your interests.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-3">What is the difference between JRF and SRF?</h2>
          <p>JRF (Junior Research Fellow) is an entry-level research position for candidates with postgraduate qualifications like MSc, typically with NET or GATE qualification. The stipend is around ₹37,000/month + HRA. After 2 years, JRFs can be upgraded to SRF (Senior Research Fellow), who receive around ₹42,000/month + HRA. SRF positions require research experience and publications.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-3">What is UGC-NET Electronics Science?</h2>
          <p>UGC-NET (National Eligibility Test) in Electronic Science is a qualifying exam conducted by NTA for determining eligibility for JRF and Assistant Professor positions in Indian universities and colleges. It covers topics like electronic devices, circuit theory, signals & systems, digital electronics, communication systems, and VLSI design. A valid NET score is required for most government JRF positions.</p>
        </div>
      </section>
    </div>
  );
}
