export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 w-full">
      {children}
    </main>
  );
}
