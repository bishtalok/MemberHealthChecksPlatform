import {
  JourneyType,
  JourneyStatus,
  BookingStatus,
  ResultStatus,
} from './enums';

// --- Insurer Handoff ---

export interface InsurerHandoffRequest {
  insurer_member_id: string;
  insurer_code: string;
  eligibility_token: string;
  callback_url?: string;
}

export interface InsurerHandoffResponse {
  journey_id: string;
  redirect_url: string;
}

// --- Journey ---

export interface JourneyResponse {
  id: string;
  member_id: string;
  journey_type: JourneyType;
  status: JourneyStatus;
  pre_assessment: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  booking?: BookingResponse | null;
  results?: HealthCheckResultResponse[];
}

export interface ConsentRequest {
  data_processing: boolean;
  health_data_sharing: boolean;
  marketing?: boolean;
  consent_version: string;
}

export interface PreAssessmentRequest {
  answers: Record<string, unknown>;
}

// --- Booking ---

export interface BookingRequest {
  journey_id: string;
  store_id: string;
  slot_id: string;
}

export interface BookingResponse {
  id: string;
  journey_id: string;
  store_id: string;
  store_name: string;
  slot_start: string;
  slot_end: string;
  status: BookingStatus;
  confirmed_at: string;
}

export interface SlotResponse {
  id: string;
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface StoreResponse {
  id: string;
  name: string;
  address: string;
  city: string;
  postcode: string;
}

// --- Results ---

export interface ResultsSubmitRequest {
  journey_id: string;
  pharmacist_id: string;
  results: HealthCheckResultInput[];
  notes?: string;
}

export interface HealthCheckResultInput {
  metric: string;
  value: number;
  unit: string;
  status: ResultStatus;
}

export interface HealthCheckResultResponse {
  id: string;
  metric: string;
  value: number;
  unit: string;
  status: ResultStatus;
  interpretation: string;
  recorded_at: string;
}

export interface NextBestAction {
  type: 'consultation' | 'product' | 'follow_up' | 'info';
  title: string;
  description: string;
  cta_label: string;
  cta_url: string;
  priority: number;
}

export interface ResultsWithActionsResponse {
  journey_id: string;
  results: HealthCheckResultResponse[];
  next_best_actions: NextBestAction[];
}

// --- Dashboard ---

export interface DashboardMetrics {
  total_journeys: number;
  completed_journeys: number;
  completion_rate: number;
  journeys_by_status: Record<JourneyStatus, number>;
  journeys_by_type: Record<JourneyType, number>;
  average_completion_days: number;
  bookings_today: number;
}

// --- Pharmacy ---

export interface PharmacyDailyListItem {
  booking_id: string;
  slot_start: string;
  slot_end: string;
  member_name: string;
  journey_type: JourneyType;
  journey_status: JourneyStatus;
  journey_id: string;
}

// --- API Envelope ---

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
