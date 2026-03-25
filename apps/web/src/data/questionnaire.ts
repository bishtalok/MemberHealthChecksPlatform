export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  category: string;
  text: string;
  type: 'single-choice' | 'yes-no' | 'numeric' | 'text';
  options?: QuestionOption[];
  required: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
}

export const QUESTIONS: Question[] = [
  {
    id: 'activity_level',
    category: 'Lifestyle',
    text: 'How would you describe your physical activity level?',
    type: 'single-choice',
    options: [
      { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
      { value: 'light', label: 'Lightly active (1-3 days/week)' },
      { value: 'moderate', label: 'Moderately active (3-5 days/week)' },
      { value: 'active', label: 'Very active (6-7 days/week)' },
    ],
    required: true,
  },
  {
    id: 'smoking',
    category: 'Lifestyle',
    text: 'Do you currently smoke or use tobacco products?',
    type: 'yes-no',
    required: true,
  },
  {
    id: 'alcohol_units',
    category: 'Lifestyle',
    text: 'How many units of alcohol do you typically consume per week?',
    type: 'numeric',
    min: 0,
    max: 100,
    required: true,
  },
  {
    id: 'family_heart_disease',
    category: 'Medical History',
    text: 'Do you have a family history of heart disease or stroke?',
    type: 'yes-no',
    required: true,
  },
  {
    id: 'family_diabetes',
    category: 'Medical History',
    text: 'Do you have a family history of diabetes?',
    type: 'yes-no',
    required: true,
  },
  {
    id: 'existing_conditions',
    category: 'Medical History',
    text: 'Do you have any existing medical conditions? (e.g., high blood pressure, diabetes)',
    type: 'single-choice',
    options: [
      { value: 'none', label: 'None' },
      { value: 'hypertension', label: 'High blood pressure' },
      { value: 'diabetes', label: 'Diabetes' },
      { value: 'cholesterol', label: 'High cholesterol' },
      { value: 'other', label: 'Other' },
    ],
    required: true,
  },
  {
    id: 'medications',
    category: 'Current Medications',
    text: 'Are you currently taking any regular medications?',
    type: 'yes-no',
    required: true,
  },
  {
    id: 'medication_details',
    category: 'Current Medications',
    text: 'If yes, please list your current medications:',
    type: 'text',
    placeholder: 'e.g., Amlodipine 5mg, Metformin 500mg',
    required: false,
  },
  {
    id: 'symptoms',
    category: 'Current Health',
    text: 'Are you experiencing any concerning symptoms? (e.g., persistent fatigue, chest pain, dizziness)',
    type: 'single-choice',
    options: [
      { value: 'none', label: 'No concerning symptoms' },
      { value: 'fatigue', label: 'Persistent fatigue' },
      { value: 'chest_pain', label: 'Chest pain or discomfort' },
      { value: 'dizziness', label: 'Dizziness or lightheadedness' },
      { value: 'other', label: 'Other symptoms' },
    ],
    required: true,
  },
  {
    id: 'health_goal',
    category: 'Goals',
    text: 'What is your main health goal from this check?',
    type: 'single-choice',
    options: [
      { value: 'general', label: 'General health assessment' },
      { value: 'specific_concern', label: 'Investigate a specific concern' },
      { value: 'prevention', label: 'Preventative screening' },
      { value: 'employer_insurer', label: 'Required by employer/insurer' },
    ],
    required: true,
  },
];
