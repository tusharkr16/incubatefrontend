export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=faktum@400,500,600,700,800&display=swap"
      />
      <div style={{ fontFamily: "'Faktum', sans-serif" }}>{children}</div>
    </>
  );
}
