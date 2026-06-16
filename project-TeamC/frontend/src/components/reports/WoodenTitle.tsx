import type { ReactNode } from "react";

type WoodenTitleProps = {
  children: ReactNode;
  fontSize?: string;
};

export function WoodenTitle({ children, fontSize = "32px" }: WoodenTitleProps) {
  return (
    <div
      style={{
        backgroundColor: "#cfa97e",
        backgroundImage:
          "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%)",
        border: "6px solid #8b6f47",
        borderRadius: "12px",
        padding: "12px 24px",
        width: "fit-content",
        margin: "0 auto 24px",
        boxShadow: "4px 4px 0 #8b6233, 6px 6px 12px rgba(0,0,0,0.3)",
        fontSize,
        fontWeight: 800,
        color: "#4a3b2a",
        textShadow: "1px 1px 0 #fff",
      }}
    >
      {children}
    </div>
  );
}
