interface LinkTypeIndicatorProps {
  type: "direct" | "homepage" | "pdf" | "email" | "portal";
}

const LINK_LABELS: Record<string, { icon: string; text: string }> = {
  direct: { icon: "🔗", text: "Direct application link — takes you to the application form" },
  homepage: { icon: "🏛️", text: "Organization homepage — navigate to Careers/Recruitment section" },
  pdf: { icon: "📄", text: "PDF notification — download and read full advertisement" },
  email: { icon: "📧", text: "Email application — send your CV to the listed email" },
  portal: { icon: "🌐", text: "Application portal — create account and apply online" },
};

export default function LinkTypeIndicator({ type }: LinkTypeIndicatorProps) {
  const info = LINK_LABELS[type] || LINK_LABELS.homepage;
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2.5">
      <p className="text-text-muted text-xs flex items-center gap-2">
        <span className="text-base">{info.icon}</span>
        <span>{info.text}</span>
      </p>
    </div>
  );
}
