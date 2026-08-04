export interface BenchEmployee {
  id: string;
  name: string;
  department: string;
  designation: string;
  primarySkills: string[];
  currentAllocation: number;
  availableCapacity: number;
  benchDays: number;
  risk: 'High' | 'Medium' | 'Low';
  status: 'Fully Available' | 'Partially Available' | 'Releasing Soon';
}

export interface BenchStats {
  fullyAvailable: number;
  partiallyAvailable: number;
  releasingSoon: number;
  benchOver15Days: number;
  benchOver30Days: number;
  benchOver60Days: number;
}

export interface BenchSkill {
  name: string;
  count: number;
}