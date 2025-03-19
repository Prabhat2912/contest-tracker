import Header from "@/components/Header";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-200 dark:bg-gray-900 '>
      <Header />
      {children}
    </div>
  );
}
