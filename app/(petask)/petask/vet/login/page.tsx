'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/petask/Breadcrumb';

export default function VetLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/petask/vet/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'ログインに失敗しました');
      router.push('/petask/vet/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <Breadcrumb items={[
        { label: 'PetAsk', href: '/petask' },
        { label: '獣医師ログイン' },
      ]} />

      <div className="text-center space-y-2">
        <div className="text-5xl">🩺</div>
        <h1 className="text-2xl font-bold text-slate-900">獣医師ページ</h1>
        <p className="text-slate-500 text-sm">認証済み獣医師の方はログインしてください</p>
      </div>

      <form onSubmit={handleLogin} className="border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="vet@example.com"
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        獣医師アカウントの登録は
        <Link href="/petask/vets" className="text-green-600 hover:underline ml-1">こちら</Link>
        からお問い合わせください
      </p>
    </div>
  );
}
