import LoginCard from '@/components/LoginCard';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="w-full max-w-md">
        <LoginCard />
      </div>
    </main>
  );
}
