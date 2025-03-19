export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='bg-gray-200 dark:bg-gray-900  '>{children}</div>;
}
