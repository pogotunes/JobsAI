import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors from Figma design system
        background: "#0B1120",
        foreground: "#FFFFFF",
        card: "#1A2438",
        "card-foreground": "#FFFFFF",
        popover: "#111827",
        "popover-foreground": "#FFFFFF",
        "text-primary": "#F9FAFB",
        "text-muted": "#94A3B8",
        
        // Brand colors
        primary: "#00E5FF",
        secondary: "#3B82F6",
        accent: "#3B82F6",
        
        // Status colors
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        destructive: "#EF4444",
        "destructive-foreground": "#FFFFFF",
        
        // Neutral colors
        "navy": "#0A0F1E",
        "navy-light": "#111827",
        "border": "#1F2937",
        "input": "#111827",
        "input-background": "#1A2438",
        "switch-background": "#1F2937",
        "ring": "#00E5FF",
        
        // Chart colors
        "chart-1": "#00E5FF",
        "chart-2": "#3B82F6",
        "chart-3": "#10B981",
        "chart-4": "#F59E0B",
        "chart-5": "#8B5CF6",
        
        // Sidebar colors
        sidebar: "#111827",
        "sidebar-foreground": "#FFFFFF",
        "sidebar-primary": "#00E5FF",
        "sidebar-primary-foreground": "#0B1120",
        "sidebar-accent": "#1A2438",
        "sidebar-accent-foreground": "#FFFFFF",
        "sidebar-border": "#1F2937",
        "sidebar-ring": "#00E5FF",
      },
      fontFamily: {
        // Exact fonts from Figma design system
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        // Exact shadows from Figma
        card: "0 4px 24px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 0 20px rgba(0, 229, 255, 0.06)",
        "accent-glow": "0 0 32px rgba(0, 229, 255, 0.2)",
      },
      borderRadius: {
        // Exact radius from Figma design
        card: "0.875rem", // 14px
        badge: "0.375rem", // 6px (small)
        btn: "0.625rem", // 10px (medium)
        lg: "0.875rem", // var(--radius)
        xl: "1.375rem", // 22px
      },
      backgroundImage: {
        // Any gradients from Figma
        "hero-gradient": "linear-gradient(to b, rgba(0, 229, 255, 0.05), transparent)",
        "card-gradient": "linear-gradient(to br, rgba(0, 229, 255, 0.1), rgba(59, 130, 246, 0.1))",
        "icon-gradient": "linear-gradient(to br, rgba(0, 229, 255, 0.2), rgba(59, 130, 246, 0.2))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
