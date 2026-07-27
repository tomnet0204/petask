'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/petask/Breadcrumb';
import DisclaimerBanner from '@/components/petask/DisclaimerBanner';
import SymptomChecker from '@/components/petask/SymptomChecker';
import CheckerResult from '@/components/petask/CheckerResult';
import type { CheckerResult as CheckerResultType, AnimalType } from '@/lib/petask/types';

export default function CheckerPage() {
  const [result, setResult] = useState<CheckerResultType | null>(null);
  const [animalType, setAnimalType] = useState<AnimalType>('dog');

  function handleResult(r: CheckerResultType, animal: AnimalType) {
    setResult(r);
    setAnimalType(animal);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleReset() {
    setResult(null);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb items={[
        { label: 'PetAsk', href: '/petask' },
        { label: '症状チェッカー' },
      ]} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900">症状チェッカー</h1>
        <p className="text-slate-500 mt-1 text-sm">
          ペットの状態を入力すると、受診の緊急度と獣医師への伝え方を確認できます
        </p>
      </div>

      {result ? (
        <CheckerResult result={result} animalType={animalType} onReset={handleReset} />
      ) : (
        <SymptomChecker onResult={handleResult} />
      )}

      <DisclaimerBanner />
    </div>
  );
}
