export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-200 dark:bg-gray-900  '>
      {children}
    </div>
  );
}
