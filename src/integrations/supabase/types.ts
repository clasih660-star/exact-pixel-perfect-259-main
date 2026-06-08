export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      chat_messages: {
        Row: {
          course_id: string;
          created_at: string;
          id: string;
          institution_id: string;
          lesson_id: string;
          message: string;
          message_type: string;
          sender: string;
          session_id: string;
          user_id: string | null;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          id?: string;
          institution_id: string;
          lesson_id: string;
          message: string;
          message_type?: string;
          sender: string;
          session_id: string;
          user_id?: string | null;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          id?: string;
          institution_id?: string;
          lesson_id?: string;
          message?: string;
          message_type?: string;
          sender?: string;
          session_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      classroom_resources: {
        Row: {
          classroom_id: string | null;
          created_at: string;
          description: string | null;
          external_url: string | null;
          file_url: string | null;
          grade_level: string | null;
          id: string;
          institution_id: string;
          status: Database["public"]["Enums"]["resource_status"];
          subject: string | null;
          tags: Json;
          title: string;
          type: Database["public"]["Enums"]["resource_type"];
          updated_at: string;
          uploaded_by: string | null;
        };
        Insert: {
          classroom_id?: string | null;
          created_at?: string;
          description?: string | null;
          external_url?: string | null;
          file_url?: string | null;
          grade_level?: string | null;
          id?: string;
          institution_id: string;
          status?: Database["public"]["Enums"]["resource_status"];
          subject?: string | null;
          tags?: Json;
          title: string;
          type: Database["public"]["Enums"]["resource_type"];
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Update: {
          classroom_id?: string | null;
          created_at?: string;
          description?: string | null;
          external_url?: string | null;
          file_url?: string | null;
          grade_level?: string | null;
          id?: string;
          institution_id?: string;
          status?: Database["public"]["Enums"]["resource_status"];
          subject?: string | null;
          tags?: Json;
          title?: string;
          type?: Database["public"]["Enums"]["resource_type"];
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "classroom_resources_classroom_id_fkey";
            columns: ["classroom_id"];
            isOneToOne: false;
            referencedRelation: "virtual_classrooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "classroom_resources_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      classroom_sessions: {
        Row: {
          course_id: string;
          created_at: string;
          ended_at: string | null;
          host_user_id: string | null;
          id: string;
          institution_id: string;
          lesson_id: string;
          mode: string;
          scheduled_start_at: string | null;
          started_at: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          ended_at?: string | null;
          host_user_id?: string | null;
          id?: string;
          institution_id: string;
          lesson_id: string;
          mode?: string;
          scheduled_start_at?: string | null;
          started_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          ended_at?: string | null;
          host_user_id?: string | null;
          id?: string;
          institution_id?: string;
          lesson_id?: string;
          mode?: string;
          scheduled_start_at?: string | null;
          started_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "classroom_sessions_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "classroom_sessions_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "classroom_sessions_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      course_enrollments: {
        Row: {
          completed_at: string | null;
          course_id: string;
          enrolled_at: string;
          enrolled_by: string | null;
          id: string;
          institution_id: string;
          status: string;
          student_id: string;
        };
        Insert: {
          completed_at?: string | null;
          course_id: string;
          enrolled_at?: string;
          enrolled_by?: string | null;
          id?: string;
          institution_id: string;
          status?: string;
          student_id: string;
        };
        Update: {
          completed_at?: string | null;
          course_id?: string;
          enrolled_at?: string;
          enrolled_by?: string | null;
          id?: string;
          institution_id?: string;
          status?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_enrollments_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      course_teachers: {
        Row: {
          course_id: string;
          created_at: string;
          id: string;
          role: string;
          teacher_id: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          id?: string;
          role?: string;
          teacher_id: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          id?: string;
          role?: string;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_teachers_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      courses: {
        Row: {
          cover_image_url: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          institution_id: string;
          level: string | null;
          slug: string;
          status: string;
          subject: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          cover_image_url?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          institution_id: string;
          level?: string | null;
          slug: string;
          status?: string;
          subject?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          cover_image_url?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          institution_id?: string;
          level?: string | null;
          slug?: string;
          status?: string;
          subject?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "courses_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      institution_members: {
        Row: {
          created_at: string;
          id: string;
          institution_id: string;
          role: Database["public"]["Enums"]["member_role"];
          status: Database["public"]["Enums"]["member_status"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          institution_id: string;
          role?: Database["public"]["Enums"]["member_role"];
          status?: Database["public"]["Enums"]["member_status"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          institution_id?: string;
          role?: Database["public"]["Enums"]["member_role"];
          status?: Database["public"]["Enums"]["member_status"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "institution_members_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      institutions: {
        Row: {
          brand_color: string | null;
          city: string | null;
          contact_email: string | null;
          country: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          learner_count: number | null;
          logo_url: string | null;
          name: string;
          phone: string | null;
          preferred_use_case: Database["public"]["Enums"]["preferred_use_case"] | null;
          slug: string;
          status: Database["public"]["Enums"]["institution_status"];
          type: Database["public"]["Enums"]["institution_type"];
          updated_at: string;
        };
        Insert: {
          brand_color?: string | null;
          city?: string | null;
          contact_email?: string | null;
          country?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          learner_count?: number | null;
          logo_url?: string | null;
          name: string;
          phone?: string | null;
          preferred_use_case?: Database["public"]["Enums"]["preferred_use_case"] | null;
          slug: string;
          status?: Database["public"]["Enums"]["institution_status"];
          type?: Database["public"]["Enums"]["institution_type"];
          updated_at?: string;
        };
        Update: {
          brand_color?: string | null;
          city?: string | null;
          contact_email?: string | null;
          country?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          learner_count?: number | null;
          logo_url?: string | null;
          name?: string;
          phone?: string | null;
          preferred_use_case?: Database["public"]["Enums"]["preferred_use_case"] | null;
          slug?: string;
          status?: Database["public"]["Enums"]["institution_status"];
          type?: Database["public"]["Enums"]["institution_type"];
          updated_at?: string;
        };
        Relationships: [];
      };
      learner_access_profiles: {
        Row: {
          accessibility_modes_json: Json;
          audio_enabled: boolean;
          board_descriptions_enabled: boolean;
          captions_enabled: boolean;
          created_at: string;
          explanation_style: string;
          font_scale: number;
          high_contrast: boolean;
          id: string;
          institution_id: string;
          keyboard_shortcuts_enabled: boolean;
          large_text: boolean;
          lesson_pace: string;
          reduced_motion: boolean;
          screen_reader_optimized: boolean;
          speech_rate: number;
          transcript_enabled: boolean;
          updated_at: string;
          user_id: string;
          voice_input_enabled: boolean;
        };
        Insert: {
          accessibility_modes_json?: Json;
          audio_enabled?: boolean;
          board_descriptions_enabled?: boolean;
          captions_enabled?: boolean;
          created_at?: string;
          explanation_style?: string;
          font_scale?: number;
          high_contrast?: boolean;
          id?: string;
          institution_id: string;
          keyboard_shortcuts_enabled?: boolean;
          large_text?: boolean;
          lesson_pace?: string;
          reduced_motion?: boolean;
          screen_reader_optimized?: boolean;
          speech_rate?: number;
          transcript_enabled?: boolean;
          updated_at?: string;
          user_id: string;
          voice_input_enabled?: boolean;
        };
        Update: {
          accessibility_modes_json?: Json;
          audio_enabled?: boolean;
          board_descriptions_enabled?: boolean;
          captions_enabled?: boolean;
          created_at?: string;
          explanation_style?: string;
          font_scale?: number;
          high_contrast?: boolean;
          id?: string;
          institution_id?: string;
          keyboard_shortcuts_enabled?: boolean;
          large_text?: boolean;
          lesson_pace?: string;
          reduced_motion?: boolean;
          screen_reader_optimized?: boolean;
          speech_rate?: number;
          transcript_enabled?: boolean;
          updated_at?: string;
          user_id?: string;
          voice_input_enabled?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "learner_access_profiles_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_progress: {
        Row: {
          confusion_score: number;
          course_id: string;
          created_at: string;
          current_step: string | null;
          id: string;
          institution_id: string;
          lesson_id: string;
          progress_percentage: number;
          session_id: string | null;
          status: string;
          student_id: string;
          student_level: string;
          teacher_state: string;
          time_spent_minutes: number;
          updated_at: string;
        };
        Insert: {
          confusion_score?: number;
          course_id: string;
          created_at?: string;
          current_step?: string | null;
          id?: string;
          institution_id: string;
          lesson_id: string;
          progress_percentage?: number;
          session_id?: string | null;
          status?: string;
          student_id: string;
          student_level?: string;
          teacher_state?: string;
          time_spent_minutes?: number;
          updated_at?: string;
        };
        Update: {
          confusion_score?: number;
          course_id?: string;
          created_at?: string;
          current_step?: string | null;
          id?: string;
          institution_id?: string;
          lesson_id?: string;
          progress_percentage?: number;
          session_id?: string | null;
          status?: string;
          student_id?: string;
          student_level?: string;
          teacher_state?: string;
          time_spent_minutes?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_progress_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_progress_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_summaries: {
        Row: {
          course_id: string;
          created_at: string;
          homework: string | null;
          id: string;
          institution_id: string;
          key_points_json: Json;
          lesson_id: string;
          session_id: string | null;
          student_id: string;
          summary_text: string;
          whiteboard_notes_json: Json;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          homework?: string | null;
          id?: string;
          institution_id: string;
          key_points_json?: Json;
          lesson_id: string;
          session_id?: string | null;
          student_id: string;
          summary_text: string;
          whiteboard_notes_json?: Json;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          homework?: string | null;
          id?: string;
          institution_id?: string;
          key_points_json?: Json;
          lesson_id?: string;
          session_id?: string | null;
          student_id?: string;
          summary_text?: string;
          whiteboard_notes_json?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_summaries_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_summaries_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_summaries_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_summaries_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: {
          accessibility_data_json: Json;
          course_id: string;
          created_at: string;
          created_by: string | null;
          description: string | null;
          difficulty: string | null;
          duration_minutes: number | null;
          id: string;
          institution_id: string;
          lesson_data_json: Json;
          order_index: number;
          source_resource_id: string | null;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          accessibility_data_json?: Json;
          course_id: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          difficulty?: string | null;
          duration_minutes?: number | null;
          id?: string;
          institution_id: string;
          lesson_data_json?: Json;
          order_index?: number;
          source_resource_id?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          accessibility_data_json?: Json;
          course_id?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          difficulty?: string | null;
          duration_minutes?: number | null;
          id?: string;
          institution_id?: string;
          lesson_data_json?: Json;
          order_index?: number;
          source_resource_id?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lessons_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lessons_source_resource_id_fkey";
            columns: ["source_resource_id"];
            isOneToOne: false;
            referencedRelation: "classroom_resources";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      quiz_results: {
        Row: {
          answers_json: Json;
          completed_at: string;
          course_id: string;
          created_at: string;
          feedback_json: Json;
          id: string;
          institution_id: string;
          lesson_id: string;
          percentage: number;
          quiz_id: string;
          score: number;
          session_id: string | null;
          student_id: string;
        };
        Insert: {
          answers_json?: Json;
          completed_at?: string;
          course_id: string;
          created_at?: string;
          feedback_json?: Json;
          id?: string;
          institution_id: string;
          lesson_id: string;
          percentage: number;
          quiz_id: string;
          score: number;
          session_id?: string | null;
          student_id: string;
        };
        Update: {
          answers_json?: Json;
          completed_at?: string;
          course_id?: string;
          created_at?: string;
          feedback_json?: Json;
          id?: string;
          institution_id?: string;
          lesson_id?: string;
          percentage?: number;
          quiz_id?: string;
          score?: number;
          session_id?: string | null;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_results_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quiz_results_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quiz_results_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quiz_results_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quiz_results_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      quizzes: {
        Row: {
          course_id: string;
          created_at: string;
          id: string;
          institution_id: string;
          lesson_id: string;
          questions_json: Json;
          title: string;
          total_points: number;
          updated_at: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          id?: string;
          institution_id: string;
          lesson_id: string;
          questions_json?: Json;
          title: string;
          total_points?: number;
          updated_at?: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          id?: string;
          institution_id?: string;
          lesson_id?: string;
          questions_json?: Json;
          title?: string;
          total_points?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quizzes_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      session_participants: {
        Row: {
          id: string;
          joined_at: string;
          left_at: string | null;
          role: string;
          session_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          joined_at?: string;
          left_at?: string | null;
          role: string;
          session_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          joined_at?: string;
          left_at?: string | null;
          role?: string;
          session_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      virtual_classrooms: {
        Row: {
          capacity: number | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          institution_id: string;
          level: string | null;
          mode: Database["public"]["Enums"]["classroom_mode"];
          name: string;
          status: Database["public"]["Enums"]["classroom_status"];
          subject: string | null;
          updated_at: string;
        };
        Insert: {
          capacity?: number | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          institution_id: string;
          level?: string | null;
          mode?: Database["public"]["Enums"]["classroom_mode"];
          name: string;
          status?: Database["public"]["Enums"]["classroom_status"];
          subject?: string | null;
          updated_at?: string;
        };
        Update: {
          capacity?: number | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          institution_id?: string;
          level?: string | null;
          mode?: Database["public"]["Enums"]["classroom_mode"];
          name?: string;
          status?: Database["public"]["Enums"]["classroom_status"];
          subject?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "virtual_classrooms_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      course_institution: { Args: { _course_id: string }; Returns: string };
      has_institution_role: {
        Args: {
          _institution_id: string;
          _roles: Database["public"]["Enums"]["member_role"][];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_course_teacher: {
        Args: { _course_id: string; _user_id: string };
        Returns: boolean;
      };
      is_enrolled: {
        Args: { _course_id: string; _user_id: string };
        Returns: boolean;
      };
      is_institution_member: {
        Args: { _institution_id: string; _user_id: string };
        Returns: boolean;
      };
      session_course: { Args: { _session_id: string }; Returns: string };
    };
    Enums: {
      classroom_mode: "ai_teacher" | "human_teacher" | "hybrid";
      classroom_status: "draft" | "active" | "archived";
      institution_status: "pending" | "active" | "suspended";
      institution_type:
        | "school"
        | "university"
        | "college"
        | "tuition_center"
        | "online_tutor"
        | "ngo"
        | "company_training"
        | "religious_institution"
        | "government_program"
        | "other";
      member_role: "owner" | "admin" | "teacher" | "student";
      member_status: "active" | "invited" | "suspended";
      preferred_use_case:
        | "ai_classroom"
        | "human_teacher_classroom"
        | "hybrid_classroom"
        | "training_program"
        | "exam_preparation"
        | "accessibility_focused";
      resource_status: "processing" | "ready" | "failed";
      resource_type: "pdf" | "text" | "image" | "link" | "video" | "audio" | "slides" | "document";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      classroom_mode: ["ai_teacher", "human_teacher", "hybrid"],
      classroom_status: ["draft", "active", "archived"],
      institution_status: ["pending", "active", "suspended"],
      institution_type: [
        "school",
        "university",
        "college",
        "tuition_center",
        "online_tutor",
        "ngo",
        "company_training",
        "religious_institution",
        "government_program",
        "other",
      ],
      member_role: ["owner", "admin", "teacher", "student"],
      member_status: ["active", "invited", "suspended"],
      preferred_use_case: [
        "ai_classroom",
        "human_teacher_classroom",
        "hybrid_classroom",
        "training_program",
        "exam_preparation",
        "accessibility_focused",
      ],
      resource_status: ["processing", "ready", "failed"],
      resource_type: ["pdf", "text", "image", "link", "video", "audio", "slides", "document"],
    },
  },
} as const;
