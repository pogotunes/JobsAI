import type { Metadata } from "next";
import { BookOpen, GraduationCap, Briefcase, Globe, FileText, BookMarked } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources — JRF Guide, DRDO Labs, CSIR Research | ElectroBridge",
  description: "Comprehensive guide to JRF positions in India, list of DRDO and CSIR labs for electronics research, international fellowship programs, and more. Free resources for electronics researchers.",
  alternates: { canonical: "https://electrobridge.vercel.app/resources" },
  openGraph: {
    title: "ElectroBridge Resources — JRF Guide & Research Information",
    description: "Step-by-step JRF application guide, DRDO/CSIR lab directory, international fellowship programs for Indian researchers.",
    url: "https://electrobridge.vercel.app/resources",
  },
};

const sections = [
  {
    icon: GraduationCap,
    title: "How to Apply for JRF Positions in India",
    content: [
      "Ensure you meet the eligibility criteria: MSc in Electronics/Physics with at least 55% marks (50% for SC/ST) and valid NET or GATE score.",
      "Prepare your documents: Updated CV, educational certificates, NET/GATE scorecard, research proposal (if required), and identity proof.",
      "Find JRF openings: Check official websites of DRDO labs, CSIR institutes, ISRO centers, IITs, and NITs. You can also use ElectroBridge to see all active JRF positions in one place.",
      "Submit application: Most organizations accept applications through their official portals. Some CSIR labs conduct walk-in interviews.",
      "Prepare for interview: JRF selection typically involves a written test followed by an interview. Be prepared to discuss your academic background and research interests.",
    ],
  },
  {
    icon: BookMarked,
    title: "Complete List of DRDO Labs Offering Electronics Research Positions",
    content: [
      "LRDE (Electronics & Radar Development Establishment) — Bangalore: Radar systems, signal processing, antenna design.",
      "DEAL (Defence Electronics Applications Laboratory) — Dehradun: Communication systems, RF engineering, electronic warfare.",
      "RCI (Research Centre Imarat) — Hyderabad: Missile electronics, guidance systems, embedded systems.",
      "SAG (Scientific Analysis Group) — Delhi: Cryptography, signal analysis, electronic warfare.",
      "CAIR (Centre for Artificial Intelligence & Robotics) — Bangalore: AI/ML, robotics, autonomous systems.",
      "DRDO Young Scientist Labs: Several new labs focusing on quantum technologies, photonics, and advanced electronics.",
    ],
  },
  {
    icon: Briefcase,
    title: "CSIR Labs for Electronics & Semiconductor Research",
    content: [
      "CSIR-NPL (National Physical Laboratory) — Delhi: Semiconductor metrology, nanoelectronics, quantum standards, VLSI characterization.",
      "CSIR-CEERI (Central Electronics Engineering Research Institute) — Pilani: Microelectronics, MEMS, sensors, VLSI design, photovoltaic devices.",
      "CSIR-CSIO (Central Scientific Instruments Organisation) — Chandigarh: Biomedical electronics, instrumentation, optical sensors.",
      "CSIR-CMERI (Central Mechanical Engineering Research Institute) — Durgapur: Industrial electronics, robotics, automation.",
    ],
  },
  {
    icon: Globe,
    title: "International Fellowship Programs for Indian Electronics Researchers",
    content: [
      "SINGA (Singapore International Graduate Award) — A*STAR Singapore: Fully-funded PhD in biomedical sciences, physical sciences, and engineering disciplines including electronics.",
      "DAAD Research Grants — Germany: Funding for PhD and post-doctoral research at German universities in electronics and related fields.",
      "Marie Curie Fellowship — European Union: Research fellowships for experienced researchers in all fields including electronics and semiconductor research.",
      "JSPS Fellowship — Japan: Post-doctoral research fellowship for researchers in all fields including electronics and information engineering.",
    ],
  },
  {
    icon: FileText,
    title: "JRF vs SRF vs Project Associate — What's the Difference?",
    content: [
      "JRF (Junior Research Fellow): Entry-level research position for fresh MSc holders with NET/GATE. Tenure: 2 years. Stipend: ₹37,000/month + HRA.",
      "SRF (Senior Research Fellow): Promotion from JRF after 2 years, or direct entry for candidates with PhD. Stipend: ₹42,000/month + HRA. Involves leading research projects.",
      "Project Associate: Short-term (6-12 month) positions on specific funded projects. Lower stipend (₹20,000-₹30,000/month). Less stringent eligibility: can join with BE/BTech.",
      "Research Associate: For PhD holders. Higher stipend (₹47,000-₹54,000/month). Involves independent research and project management.",
    ],
  },
  {
    icon: BookOpen,
    title: "UGC-NET Electronic Science Syllabus Overview",
    content: [
      "Unit 1: Electronic Devices — Semiconductor physics, PN junction, BJT, FET, MOSFET, optoelectronic devices.",
      "Unit 2: Circuit Theory — Network theorems, transient analysis, two-port networks, filters and attenuators.",
      "Unit 3: Analog Electronics — Op-amps, oscillators, regulators, amplifiers, feedback circuits.",
      "Unit 4: Digital Electronics — Logic families, combinational/sequential circuits, memories, microprocessors.",
      "Unit 5: Signals & Systems — Fourier/Laplace/Z transforms, convolution, sampling theorem, LTI systems.",
      "Unit 6: Communication Systems — AM/FM/PM modulation, digital modulation, satellite/optical communication.",
      "Unit 7: Electromagnetics — Maxwell's equations, wave propagation, transmission lines, antennas.",
      "Unit 8: VLSI & Embedded Systems — CMOS design, FPGA, microcontroller programming, embedded C.",
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-text-primary mb-3">Resources</h1>
      <p className="text-text-muted text-sm mb-10">
        Comprehensive guides and information for electronics researchers and professionals.
      </p>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-navy-light border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0">
                <section.icon className="w-5 h-5 text-cyan" />
              </div>
              <h2 className="font-display text-lg font-bold text-text-primary">{section.title}</h2>
            </div>
            <ul className="space-y-2">
              {section.content.map((item, i) => (
                <li key={i} className="text-text-muted text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-cyan mt-1 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
