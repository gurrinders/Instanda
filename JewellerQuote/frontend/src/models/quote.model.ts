export interface Quote {
  id: number;
  user_id: number;
  application_id: number;
  base_premium: number;
  fees: number;
  taxes: number;
  total_premium: number;
  currency: string;
  breakdown_json?: string;
  created_at: string;
}

export interface QuoteBreakdown {
  base_premium: number;
  fees: number;
  taxes: number;
  total_premium: number;
  [key: string]: any; // Allow additional breakdown fields
}
