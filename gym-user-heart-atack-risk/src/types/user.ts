export interface UserInputs {
  age: number;
  gender: string;
  bloodPressure: number;
  cholesterol: number;
  glucose: number;
  smoker: boolean;
  physicalActivity: number;
  bmi: number;
  family_history: boolean;
  alcohol_consumption: number;
  stress_level: number;
}

export interface User extends UserInputs {
  id: string;
  name: string;
  email: string;
  phone?: string;
  heartAttackRisk: number; // 0-100 percentage
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  age: number;
  gender: string;
  bloodPressure: number;
  cholesterol: number;
  glucose: number;
  smoker: boolean;
  physicalActivity: number;
  bmi: number;
  family_history: boolean;
  alcohol_consumption: number;
  stress_level: number;
}
