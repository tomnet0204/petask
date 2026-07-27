import type { SymptomInput, UrgencyLevel } from './types';

interface EmergencyRule {
  id: string;
  condition: (input: SymptomInput) => boolean;
  urgencyLevel: UrgencyLevel;
  flag: string;
}

export const EMERGENCY_RULES: EmergencyRule[] = [
  {
    id: 'consciousness-loss',
    condition: (i) => i.energy === 'unconscious',
    urgencyLevel: 'emergency',
    flag: '意識消失の可能性',
  },
  {
    id: 'breathing-severe',
    condition: (i) => i.breathing === 'very_difficult',
    urgencyLevel: 'emergency',
    flag: '重篤な呼吸困難',
  },
  {
    id: 'no-urination',
    condition: (i) => i.urination === 'none',
    urgencyLevel: 'emergency',
    flag: '尿閉の可能性（特に猫の雄で致命的）',
  },
  {
    id: 'possible-ingestion',
    condition: (i) => i.possibleIngestion === true,
    urgencyLevel: 'emergency',
    flag: '誤飲の可能性',
  },
  {
    id: 'blood-stool',
    condition: (i) => i.defecation === 'blood',
    urgencyLevel: 'urgent',
    flag: '血便',
  },
  {
    id: 'no-water',
    condition: (i) => i.canDrinkWater === 'no',
    urgencyLevel: 'urgent',
    flag: '水分摂取不能',
  },
  {
    id: 'no-food',
    condition: (i) => i.appetite === 'none',
    urgencyLevel: 'watchful',
    flag: '完全な食欲廃絶',
  },
  {
    id: 'labored-breathing',
    condition: (i) => i.breathing === 'labored',
    urgencyLevel: 'urgent',
    flag: '努力性呼吸',
  },
  {
    id: 'very-low-energy',
    condition: (i) => i.energy === 'very_low',
    urgencyLevel: 'watchful',
    flag: '著しい元気消失',
  },
];

export function evaluateUrgency(input: SymptomInput): {
  urgencyLevel: UrgencyLevel;
  flags: string[];
} {
  const matched = EMERGENCY_RULES.filter((r) => r.condition(input));

  const LEVEL_PRIORITY: Record<UrgencyLevel, number> = {
    emergency: 4,
    urgent: 3,
    watchful: 2,
    monitor: 1,
  };

  const highest = matched.reduce<UrgencyLevel>((best, rule) => {
    return LEVEL_PRIORITY[rule.urgencyLevel] > LEVEL_PRIORITY[best]
      ? rule.urgencyLevel
      : best;
  }, 'monitor');

  return {
    urgencyLevel: highest,
    flags: matched.map((r) => r.flag),
  };
}
