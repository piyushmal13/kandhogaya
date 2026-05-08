export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      algo_licenses: {
        Row: {
          algo_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          starts_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          algo_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          starts_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          algo_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          starts_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "algo_licenses_algo_id_fkey"
            columns: ["algo_id"]
            isOneToOne: false
            referencedRelation: "algorithms"
            referencedColumns: ["id"]
          },
        ]
      }
      algo_performance_snapshots: {
        Row: {
          algo_id: string | null
          created_at: string | null
          drawdown_pct: number
          id: string
          period_end: string
          period_start: string
          roi_pct: number
        }
        Insert: {
          algo_id?: string | null
          created_at?: string | null
          drawdown_pct: number
          id?: string
          period_end: string
          period_start: string
          roi_pct: number
        }
        Update: {
          algo_id?: string | null
          created_at?: string | null
          drawdown_pct?: number
          id?: string
          period_end?: string
          period_start?: string
          roi_pct?: number
        }
        Relationships: [
          {
            foreignKeyName: "algo_performance_snapshots_algo_id_fkey"
            columns: ["algo_id"]
            isOneToOne: false
            referencedRelation: "algorithms"
            referencedColumns: ["id"]
          },
        ]
      }
      algorithms: {
        Row: {
          compliance_disclaimer: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          min_capital: number | null
          monthly_roi_pct: number | null
          name: string
          price: number | null
          risk_classification: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          compliance_disclaimer?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_capital?: number | null
          monthly_roi_pct?: number | null
          name: string
          price?: number | null
          risk_classification?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          compliance_disclaimer?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_capital?: number | null
          monthly_roi_pct?: number | null
          name?: string
          price?: number | null
          risk_classification?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string | null
          body: string
          category: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_name?: string | null
          body: string
          category?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_name?: string | null
          body?: string
          category?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "university_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          course_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          is_free: boolean | null
          pdf_url: string | null
          sort_order: number | null
          title: string
          video_url: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          pdf_url?: string | null
          sort_order?: number | null
          title: string
          video_url?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          pdf_url?: string | null
          sort_order?: number | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "university_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          level: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          level?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          level?: string | null
          title?: string | null
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          pdf_url: string | null
          title: string | null
          video_url: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          title?: string | null
          video_url?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          title?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          license_key: string | null
          plan_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          license_key?: string | null
          plan_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          license_key?: string | null
          plan_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "licenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_events: {
        Row: {
          created_at: string
          email: string
          event_type: string
          id: string
          meta: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_type: string
          id?: string
          meta?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_type?: string
          id?: string
          meta?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      otps: {
        Row: {
          attempts: number
          code_hash: string
          created_at: string
          email: string
          expires_at: string
          id: string
          used: boolean
          user_id: string
        }
        Insert: {
          attempts?: number
          code_hash: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          used?: boolean
          user_id: string
        }
        Update: {
          attempts?: number
          code_hash?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          meta: Json | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          meta?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          meta?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_plan: string | null
          created_at: string | null
          email: string | null
          email_verified: boolean
          full_name: string | null
          id: string
          is_verified: boolean | null
          license_key: string | null
          plan_expiry: string | null
          plan_status: string | null
          role: string | null
        }
        Insert: {
          active_plan?: string | null
          created_at?: string | null
          email?: string | null
          email_verified?: boolean
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          license_key?: string | null
          plan_expiry?: string | null
          plan_status?: string | null
          role?: string | null
        }
        Update: {
          active_plan?: string | null
          created_at?: string | null
          email?: string | null
          email_verified?: boolean
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          license_key?: string | null
          plan_expiry?: string | null
          plan_status?: string | null
          role?: string | null
        }
        Relationships: []
      }
      progress: {
        Row: {
          completed: boolean | null
          id: string
          lesson_id: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          broker_endorsement: string | null
          company_name: string
          created_at: string | null
          id: string
          is_featured: boolean | null
          quote: string
          video_url: string | null
        }
        Insert: {
          broker_endorsement?: string | null
          company_name: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          quote: string
          video_url?: string | null
        }
        Update: {
          broker_endorsement?: string | null
          company_name?: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          quote?: string
          video_url?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          payment_method: string | null
          plan_name: string | null
          price: number | null
          status: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          payment_method?: string | null
          plan_name?: string | null
          price?: number | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          payment_method?: string | null
          plan_name?: string | null
          price?: number | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      university_courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          plan_required: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          plan_required?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          plan_required?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      usdt_submissions: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          status: string | null
          txid: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          txid?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          status?: string | null
          txid?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          email: string
          email_verified: boolean | null
          full_name: string | null
          id: string
          last_login_at: string | null
          login_count: number | null
          onboarding_completed: boolean | null
          phone: string | null
          role: string | null
          subscription_expires_at: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          last_login_at?: string | null
          login_count?: number | null
          onboarding_completed?: boolean | null
          phone?: string | null
          role?: string | null
          subscription_expires_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          login_count?: number | null
          onboarding_completed?: boolean | null
          phone?: string | null
          role?: string | null
          subscription_expires_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      webinar_agenda: {
        Row: {
          id: string
          speaker: string | null
          time_label: string | null
          topic: string | null
          webinar_id: string | null
        }
        Insert: {
          id?: string
          speaker?: string | null
          time_label?: string | null
          topic?: string | null
          webinar_id?: string | null
        }
        Update: {
          id?: string
          speaker?: string | null
          time_label?: string | null
          topic?: string | null
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_agenda_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_agenda_items: {
        Row: {
          created_at: string | null
          id: string
          sort_order: number | null
          speaker_image_url: string | null
          speaker_linkedin: string | null
          speaker_name: string | null
          time: string | null
          topic: string
          webinar_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          sort_order?: number | null
          speaker_image_url?: string | null
          speaker_linkedin?: string | null
          speaker_name?: string | null
          time?: string | null
          topic: string
          webinar_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          sort_order?: number | null
          speaker_image_url?: string | null
          speaker_linkedin?: string | null
          speaker_name?: string | null
          time?: string | null
          topic?: string
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_agenda_items_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_faqs: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          question: string
          sort_order: number | null
          webinar_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          question: string
          sort_order?: number | null
          webinar_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          question?: string
          sort_order?: number | null
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_faqs_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_registrations: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
          webinar_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          webinar_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_registrations_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_speakers: {
        Row: {
          bio: string | null
          company: string | null
          display_order: number | null
          id: string
          image: string | null
          image_url: string | null
          is_keynote: boolean | null
          linkedin: string | null
          name: string | null
          role: string | null
          webinar_id: string | null
        }
        Insert: {
          bio?: string | null
          company?: string | null
          display_order?: number | null
          id?: string
          image?: string | null
          image_url?: string | null
          is_keynote?: boolean | null
          linkedin?: string | null
          name?: string | null
          role?: string | null
          webinar_id?: string | null
        }
        Update: {
          bio?: string | null
          company?: string | null
          display_order?: number | null
          id?: string
          image?: string | null
          image_url?: string | null
          is_keynote?: boolean | null
          linkedin?: string | null
          name?: string | null
          role?: string | null
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_speakers_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_sponsors: {
        Row: {
          display_order: number | null
          id: string
          logo: string | null
          logo_url: string | null
          name: string | null
          tier: string | null
          webinar_id: string | null
          website: string | null
        }
        Insert: {
          display_order?: number | null
          id?: string
          logo?: string | null
          logo_url?: string | null
          name?: string | null
          tier?: string | null
          webinar_id?: string | null
          website?: string | null
        }
        Update: {
          display_order?: number | null
          id?: string
          logo?: string | null
          logo_url?: string | null
          name?: string | null
          tier?: string | null
          webinar_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_sponsors_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinars: {
        Row: {
          agenda: string | null
          broker_name: string | null
          capacity: number | null
          created_at: string | null
          date_time: string | null
          description: string | null
          event_date: string | null
          faq: Json | null
          hero_image: string | null
          hero_image_url: string | null
          host_details: string | null
          hotel_sponsor: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_premium: boolean | null
          is_published: boolean | null
          location: string | null
          max_seats: number | null
          price: number | null
          promo_video: string | null
          promo_video_url: string | null
          registration_deadline: string | null
          seat_limit: number | null
          slug: string
          speaker_name: string | null
          sponsor_tier: string | null
          starts_at: string | null
          title: string | null
          venue: string | null
          zoom_link: string | null
        }
        Insert: {
          agenda?: string | null
          broker_name?: string | null
          capacity?: number | null
          created_at?: string | null
          date_time?: string | null
          description?: string | null
          event_date?: string | null
          faq?: Json | null
          hero_image?: string | null
          hero_image_url?: string | null
          host_details?: string | null
          hotel_sponsor?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_premium?: boolean | null
          is_published?: boolean | null
          location?: string | null
          max_seats?: number | null
          price?: number | null
          promo_video?: string | null
          promo_video_url?: string | null
          registration_deadline?: string | null
          seat_limit?: number | null
          slug: string
          speaker_name?: string | null
          sponsor_tier?: string | null
          starts_at?: string | null
          title?: string | null
          venue?: string | null
          zoom_link?: string | null
        }
        Update: {
          agenda?: string | null
          broker_name?: string | null
          capacity?: number | null
          created_at?: string | null
          date_time?: string | null
          description?: string | null
          event_date?: string | null
          faq?: Json | null
          hero_image?: string | null
          hero_image_url?: string | null
          host_details?: string | null
          hotel_sponsor?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_premium?: boolean | null
          is_published?: boolean | null
          location?: string | null
          max_seats?: number | null
          price?: number | null
          promo_video?: string | null
          promo_video_url?: string | null
          registration_deadline?: string | null
          seat_limit?: number | null
          slug?: string
          speaker_name?: string | null
          sponsor_tier?: string | null
          starts_at?: string | null
          title?: string | null
          venue?: string | null
          zoom_link?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
