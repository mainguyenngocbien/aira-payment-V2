import AuthTest from '@/components/AuthTest';
import FirebaseDebug from '@/components/FirebaseDebug';

export default function TestPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthTest />
        <FirebaseDebug />
      </div>
    </main>
  );
}
