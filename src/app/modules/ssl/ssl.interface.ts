export interface SSLPaymentInitData {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url: string;
    cus_name: string;
    cus_email: string;
    // cus_phone: string;
    product_name: string;
    product_category: string;
    product_profile: string;
  }