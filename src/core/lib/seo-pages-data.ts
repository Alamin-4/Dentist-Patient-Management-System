export interface SEOPage {
  id: string;
  status: string;
  published_date: string;
  dentist_name: string;
  dentist_initials: string;
  dentist_avatar_color: string;
  dentist_title: string;
  dentist_specialty: string;
  dentist_location: string;
  dentist_rating: number;
  dentist_review_count: number;
  dentist_verified: boolean;
  patient_name: string;
  patient_initials: string;
  patient_avatar_color: string;
  patient_location: string;
  patient_verified: boolean;
  procedure: string;
  city: string;
  country: string;
  rating: number;
  ratings_breakdown: { label: string; rating: number }[];
  review_content: string;
  helpful_yes: number;
  helpful_no: number;
  has_photos: boolean;
}

const seoPagesData = {
  meta: {
    total: 0,
    published: 0,
    removed: 0,
    this_month: 0
  },
  pages: [] as SEOPage[]
};

export default seoPagesData;
