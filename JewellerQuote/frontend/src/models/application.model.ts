export interface ApplicationPayload {
  // Section 1: Definition
  firm_name?: string;
  country?: string;
  currency?: string;
  exRate?: number;
  cadLimit?: number;
  cadExcess?: number;
  totalDiscounts?: number;
  business_type?: string;
  dropdown_clause?: string;


  // Section 2: Nature of Business
  other_layers?: InsuranceLayer[];
  sendings_layers?: InsuranceLayer[];
  exhibition_layers?: ExhibitionLayer[];
  // Section 3: Employees
  travel?: TravelRecord[];
  increase_limit_amount?: number;
  increase_limit_days?: number;
  peak_season_rate?: number;
  unattended_vehicle_load_percent?: number;
  percentage_of_exposure?: number;
  adjustments?: Adjustment[];

  // Section 4: Travel (array of travel records)


  nonStandardCoverage?: NonStandardCoverage[];
  deductibles?: Deductibles[];

  // Section 5: Cancellations/Refusals
  loss_history_percentage?: number;
  loss_history_load_credit?: number;
  loss_history_premium?: number;
  custom_discount?: number;
  insurance_start_date?: string;



  // Section 6: Jewellers Security Alliance

  // Section 7: Claims Settlement Basis

  // Section 8: Inventories
  last_inventory_amount?: number;
  stock_composition?: StockComposition;

  // Section 16: Building Details

  // Section 17: Business Interruption
  annual_gross_revenue?: number;
  annual_profit?: number;
  indemnity_period_months?: number;

  // Section 18: Travellers
  travellers?: Traveller[];

  // Section 19: Show Window Display
  show_windows?: ShowWindowDetails;

  // Section 21: Premises Protection
  alarm_system?: AlarmSystem;
  holdup_alarm?: HoldupAlarm;
  safes_vaults?: SafeVault[];

  // Calculated/derived fields
  total_stock_value?: number;
}

export interface TravelRecord {
  limit?: number;
  days?: number;
  travel_type?: string;
}

export interface NonStandardCoverage {
  type?: string;
  loadCredit?: number;
  premium?: number;
}

export interface Deductibles {
  type?: string;
  amount?: number;
  loadCredit?: number;
  premium?: number;
}

export interface Adjustment {
  description?: string;
  loadCredit?: number;
  premium?: number;
}

export interface StockComposition {
  unset_diamonds_percent?: number;
  pearls_percent?: number;
  other_precious_stones_percent?: number;
  other_stones_unset_percent?: number;
  jewellery_mounted_precious_percent?: number;
  other_jewellery_percent?: number;
  watches_mounted_diamonds_percent?: number;
  other_watches_percent?: number;
  clocks_percent?: number;
  gold_finished_percent?: number;
  silverware_percent?: number;
  jewellers_findings_percent?: number;
  other_stock_percent?: number;
  other_stock_description?: string;
}

export interface Traveller {
  name?: string;
  days_in_city?: number;
  days_elsewhere?: number;
  average_amount?: number;
  limit_liability?: number;
  home_address?: string;
  protections?: string;
}

export interface ShowWindowDetails {
  windows_opening_interior?: number;
  windows_protected_count?: number;
  windows_protection_method?: string;
  outside_showcases_count?: number;
  outside_showcases_description?: string;
  outside_showcases_protection?: string;
  max_value_open_protected?: number;
  max_value_open_unprotected?: number;
  max_value_closed_protected?: number;
  max_value_closed_unprotected?: number;
  max_value_one_window?: number;
  max_value_one_article?: number;
  max_value_one_outside_showcase?: number;
  limits_all_windows?: number;
  limits_one_window?: number;
  limits_one_article?: number;
  limits_one_outside_showcase?: number;
}

export interface AlarmSystem {
  mercantile_premises_alarm?: boolean;
  central_station?: boolean;
  local_alarm?: boolean;
  protection_extent?: string;
  grade?: string;
  company_name?: string;
  ul_certificate?: string;
  expiration_date?: string;
}

export interface HoldupAlarm {
  central_station_holdup?: boolean;
  signal_buttons?: number;
  cage_double_entrance?: boolean;
  cctv?: boolean;
  cctv_recorder?: boolean;
  guards_count?: number;
  guards_armed?: number;
  other_protective_systems?: boolean;
}

export interface SafeVault {
  type: 'safe' | 'vault';
  number?: number;
  make_class?: string;
  ul_rating?: string;
  construction?: string;
  door_specification?: string;
  locks?: string;
  protective_company?: string;
  central_station?: boolean;
  local?: boolean;
  local_to_police?: boolean;
  grade?: string;
  complete_or_partial?: string;
  ul_certificate?: string;
  expiration?: string;
  stock_percent?: number;
}

export interface Application {
  id: number;
  user_id: number;
  firm_name?: string;
  premises_address?: string;
  annual_gross_revenue?: number;
  annual_profit?: number;
  raw_payload: ApplicationPayload;
  created_at: string;
}

export interface ApplicationCreate extends ApplicationPayload {}

export interface InsuranceLayer {
  id: string;
  label: string;
  limit: number;      // How much this layer pays
  excessOf: number;
  exposure: number;
  premium?: number;
}

export interface ExhibitionLayer {
  id: string;
  label: string;
  limit: number;
  no_of_shows: number;
  premium?: number;
}

export interface PremiumExposureRates {
  layerId: string;
  label: string;
  rate: number;
}