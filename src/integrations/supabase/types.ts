export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: string;
          description: string | null;
          earned_at: string;
          icon: string | null;
          id: string;
          institution_id: string | null;
          metadata_json: Json;
          student_id: string;
          title: string;
        };
        Insert: {
          achievement_type: string;
          description?: string | null;
          earned_at?: string;
          icon?: string | null;
          id?: string;
          institution_id?: string | null;
          metadata_json?: Json;
          student_id: string;
          title: string;
        };
        Update: {
          achievement_type?: string;
          description?: string | null;
          earned_at?: string;
          icon?: string | null;
          id?: string;
          institution_id?: string | null;
          metadata_json?: Json;
          student_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "achievements_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      board_snapshots: {
        Row: {
          active_line_index: number;
          course_id: string;
          created_at: string;
          description: string | null;
          highlight: string | null;
          id: string;
          institution_id: string;
          lesson_id: string;
          lines_json: Json;
          mode: string;
          request_key: string | null;
          session_id: string;
          source_event_id: string | null;
          step_key: string | null;
          title: string;
        };
        Insert: {
          active_line_index?: number;
          course_id: string;
          created_at?: string;
          description?: string | null;
          highlight?: string | null;
          id?: string;
          institution_id: string;
          lesson_id: string;
          lines_json?: Json;
          mode?: string;
          request_key?: string | null;
          session_id: string;
          source_event_id?: string | null;
          step_key?: string | null;
          title: string;
        };
        Update: {
          active_line_index?: number;
          course_id?: string;
          created_at?: string;
          description?: string | null;
          highlight?: string | null;
          id?: string;
          institution_id?: string;
          lesson_id?: string;
          lines_json?: Json;
          mode?: string;
          request_key?: string | null;
          session_id?: string;
          source_event_id?: string | null;
          step_key?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "board_snapshots_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "board_snapshots_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "board_snapshots_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "board_snapshots_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "board_snapshots_source_event_id_fkey";
            columns: ["source_event_id"];
            isOneToOne: false;
            referencedRelation: "session_events";
            referencedColumns: ["id"];
          },
        ];
      };
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
      course_materials: {
        Row: {
          course_id: string;
          created_at: string;
          extracted_text: string | null;
          file_url: string | null;
          id: string;
          institution_id: string;
          link_url: string | null;
          processing_error: string | null;
          processing_status: string;
          syllabus_reference: string | null;
          title: string;
          type: string;
          updated_at: string;
          uploaded_by: string | null;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          extracted_text?: string | null;
          file_url?: string | null;
          id?: string;
          institution_id: string;
          link_url?: string | null;
          processing_error?: string | null;
          processing_status?: string;
          syllabus_reference?: string | null;
          title: string;
          type?: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          extracted_text?: string | null;
          file_url?: string | null;
          id?: string;
          institution_id?: string;
          link_url?: string | null;
          processing_error?: string | null;
          processing_status?: string;
          syllabus_reference?: string | null;
          title?: string;
          type?: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "course_materials_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_materials_institution_id_fkey";
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
          lesson_generation_mode: string | null;
          level: string | null;
          programme_id: string | null;
          slug: string;
          status: string;
          subject: string | null;
          target_lesson_count: number | null;
          timeline_weeks: number | null;
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
          lesson_generation_mode?: string | null;
          level?: string | null;
          programme_id?: string | null;
          slug: string;
          status?: string;
          subject?: string | null;
          target_lesson_count?: number | null;
          timeline_weeks?: number | null;
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
          lesson_generation_mode?: string | null;
          level?: string | null;
          programme_id?: string | null;
          slug?: string;
          status?: string;
          subject?: string | null;
          target_lesson_count?: number | null;
          timeline_weeks?: number | null;
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
          {
            foreignKeyName: "courses_programme_id_fkey";
            columns: ["programme_id"];
            isOneToOne: false;
            referencedRelation: "programmes";
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
          onboarding_started_at: string | null;
          onboarding_status: string | null;
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
          onboarding_started_at?: string | null;
          onboarding_status?: string | null;
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
          onboarding_started_at?: string | null;
          onboarding_status?: string | null;
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
      learner_questions: {
        Row: {
          answer_source: string;
          answer_text: string | null;
          answer_word_count: number | null;
          board_item_ref: string | null;
          context_json: Json;
          course_id: string;
          created_at: string;
          id: string;
          institution_id: string;
          learning_mode: string | null;
          lesson_id: string;
          question_text: string;
          section_type: string | null;
          session_id: string | null;
          student_id: string;
        };
        Insert: {
          answer_source?: string;
          answer_text?: string | null;
          answer_word_count?: number | null;
          board_item_ref?: string | null;
          context_json?: Json;
          course_id: string;
          created_at?: string;
          id?: string;
          institution_id: string;
          learning_mode?: string | null;
          lesson_id: string;
          question_text: string;
          section_type?: string | null;
          session_id?: string | null;
          student_id: string;
        };
        Update: {
          answer_source?: string;
          answer_text?: string | null;
          answer_word_count?: number | null;
          board_item_ref?: string | null;
          context_json?: Json;
          course_id?: string;
          created_at?: string;
          id?: string;
          institution_id?: string;
          learning_mode?: string | null;
          lesson_id?: string;
          question_text?: string;
          section_type?: string | null;
          session_id?: string | null;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "learner_questions_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learner_questions_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learner_questions_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learner_questions_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      learning_results: {
        Row: {
          confidence_checks_json: Json;
          course_id: string;
          created_at: string;
          current_section: string | null;
          events_json: Json;
          hints_used: number;
          id: string;
          institution_id: string;
          last_active_at: string;
          lesson_id: string;
          middle_question_correct: boolean | null;
          misconceptions_detected: number;
          notes_saved: boolean;
          practice_attempts: number;
          practice_correct: number;
          progress_percentage: number;
          questions_asked: number;
          raised_hands: number;
          resume_point_json: Json;
          session_id: string | null;
          status: string;
          student_id: string;
          time_spent_seconds: number;
          transcript_saved: boolean;
          updated_at: string;
          weak_areas: Json;
        };
        Insert: {
          confidence_checks_json?: Json;
          course_id: string;
          created_at?: string;
          current_section?: string | null;
          events_json?: Json;
          hints_used?: number;
          id?: string;
          institution_id: string;
          last_active_at?: string;
          lesson_id: string;
          middle_question_correct?: boolean | null;
          misconceptions_detected?: number;
          notes_saved?: boolean;
          practice_attempts?: number;
          practice_correct?: number;
          progress_percentage?: number;
          questions_asked?: number;
          raised_hands?: number;
          resume_point_json?: Json;
          session_id?: string | null;
          status?: string;
          student_id: string;
          time_spent_seconds?: number;
          transcript_saved?: boolean;
          updated_at?: string;
          weak_areas?: Json;
        };
        Update: {
          confidence_checks_json?: Json;
          course_id?: string;
          created_at?: string;
          current_section?: string | null;
          events_json?: Json;
          hints_used?: number;
          id?: string;
          institution_id?: string;
          last_active_at?: string;
          lesson_id?: string;
          middle_question_correct?: boolean | null;
          misconceptions_detected?: number;
          notes_saved?: boolean;
          practice_attempts?: number;
          practice_correct?: number;
          progress_percentage?: number;
          questions_asked?: number;
          raised_hands?: number;
          resume_point_json?: Json;
          session_id?: string | null;
          status?: string;
          student_id?: string;
          time_spent_seconds?: number;
          transcript_saved?: boolean;
          updated_at?: string;
          weak_areas?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "learning_results_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learning_results_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learning_results_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learning_results_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
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
      lesson_sections: {
        Row: {
          course_id: string;
          created_at: string;
          estimated_minutes: number;
          id: string;
          institution_id: string;
          lesson_id: string;
          order_index: number;
          title: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          estimated_minutes?: number;
          id?: string;
          institution_id: string;
          lesson_id: string;
          order_index?: number;
          title: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          estimated_minutes?: number;
          id?: string;
          institution_id?: string;
          lesson_id?: string;
          order_index?: number;
          title?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_sections_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_sections_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_sections_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
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
          estimated_duration_minutes: number | null;
          generation_mode: string | null;
          id: string;
          institution_id: string;
          lesson_data_json: Json;
          minimum_duration_minutes: number;
          objective: string | null;
          order_index: number;
          programme_id: string | null;
          source_material_ids: string[];
          source_resource_id: string | null;
          status: string;
          syllabus_reference: string | null;
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
          estimated_duration_minutes?: number | null;
          generation_mode?: string | null;
          id?: string;
          institution_id: string;
          lesson_data_json?: Json;
          minimum_duration_minutes?: number;
          objective?: string | null;
          order_index?: number;
          programme_id?: string | null;
          source_material_ids?: string[];
          source_resource_id?: string | null;
          status?: string;
          syllabus_reference?: string | null;
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
          estimated_duration_minutes?: number | null;
          generation_mode?: string | null;
          id?: string;
          institution_id?: string;
          lesson_data_json?: Json;
          minimum_duration_minutes?: number;
          objective?: string | null;
          order_index?: number;
          programme_id?: string | null;
          source_material_ids?: string[];
          source_resource_id?: string | null;
          status?: string;
          syllabus_reference?: string | null;
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
            foreignKeyName: "lessons_programme_id_fkey";
            columns: ["programme_id"];
            isOneToOne: false;
            referencedRelation: "programmes";
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
      material_images: {
        Row: {
          caption: string | null;
          course_id: string;
          course_material_id: string;
          created_at: string;
          extracted_context: string | null;
          id: string;
          image_url: string;
          institution_id: string;
          suggested_lesson_id: string | null;
        };
        Insert: {
          caption?: string | null;
          course_id: string;
          course_material_id: string;
          created_at?: string;
          extracted_context?: string | null;
          id?: string;
          image_url: string;
          institution_id: string;
          suggested_lesson_id?: string | null;
        };
        Update: {
          caption?: string | null;
          course_id?: string;
          course_material_id?: string;
          created_at?: string;
          extracted_context?: string | null;
          id?: string;
          image_url?: string;
          institution_id?: string;
          suggested_lesson_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "material_images_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "material_images_course_material_id_fkey";
            columns: ["course_material_id"];
            isOneToOne: false;
            referencedRelation: "course_materials";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "material_images_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "material_images_suggested_lesson_id_fkey";
            columns: ["suggested_lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          institution_id: string | null;
          notification_type: string;
          payload_json: Json;
          read_at: string | null;
          target_url: string | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          institution_id?: string | null;
          notification_type: string;
          payload_json?: Json;
          read_at?: string | null;
          target_url?: string | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          institution_id?: string | null;
          notification_type?: string;
          payload_json?: Json;
          read_at?: string | null;
          target_url?: string | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
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
          role: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          role?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      programmes: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          institution_id: string;
          learning_outcomes: Json;
          level: string | null;
          start_date: string | null;
          status: string;
          subject_area: string | null;
          target_learners: string | null;
          timeline_weeks: number | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          institution_id: string;
          learning_outcomes?: Json;
          level?: string | null;
          start_date?: string | null;
          status?: string;
          subject_area?: string | null;
          target_learners?: string | null;
          timeline_weeks?: number | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          institution_id?: string;
          learning_outcomes?: Json;
          level?: string | null;
          start_date?: string | null;
          status?: string;
          subject_area?: string | null;
          target_learners?: string | null;
          timeline_weeks?: number | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "programmes_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
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
          request_key: string | null;
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
          request_key?: string | null;
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
          request_key?: string | null;
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
      recommendations: {
        Row: {
          course_id: string | null;
          created_at: string;
          description: string | null;
          id: string;
          institution_id: string;
          is_read: boolean;
          lesson_id: string | null;
          priority: number;
          reason_json: Json;
          recommendation_type: string;
          session_id: string | null;
          student_id: string;
          target_url: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          course_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          institution_id: string;
          is_read?: boolean;
          lesson_id?: string | null;
          priority?: number;
          reason_json?: Json;
          recommendation_type: string;
          session_id?: string | null;
          student_id: string;
          target_url?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          course_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          institution_id?: string;
          is_read?: boolean;
          lesson_id?: string | null;
          priority?: number;
          reason_json?: Json;
          recommendation_type?: string;
          session_id?: string | null;
          student_id?: string;
          target_url?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recommendations_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recommendations_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recommendations_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recommendations_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      session_events: {
        Row: {
          actor_role: string;
          actor_user_id: string | null;
          course_id: string;
          created_at: string;
          event_source: string | null;
          event_type: string;
          id: string;
          institution_id: string;
          lesson_id: string;
          payload_json: Json;
          request_key: string | null;
          session_id: string;
          student_id: string | null;
        };
        Insert: {
          actor_role: string;
          actor_user_id?: string | null;
          course_id: string;
          created_at?: string;
          event_source?: string | null;
          event_type: string;
          id?: string;
          institution_id: string;
          lesson_id: string;
          payload_json?: Json;
          request_key?: string | null;
          session_id: string;
          student_id?: string | null;
        };
        Update: {
          actor_role?: string;
          actor_user_id?: string | null;
          course_id?: string;
          created_at?: string;
          event_source?: string | null;
          event_type?: string;
          id?: string;
          institution_id?: string;
          lesson_id?: string;
          payload_json?: Json;
          request_key?: string | null;
          session_id?: string;
          student_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "session_events_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_events_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_events_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_events_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      session_notes: {
        Row: {
          body: string;
          course_id: string;
          created_at: string;
          id: string;
          institution_id: string;
          is_board_export: boolean;
          lesson_id: string;
          notes_json: Json;
          request_key: string | null;
          session_id: string | null;
          source_type: string;
          student_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          body?: string;
          course_id: string;
          created_at?: string;
          id?: string;
          institution_id: string;
          is_board_export?: boolean;
          lesson_id: string;
          notes_json?: Json;
          request_key?: string | null;
          session_id?: string | null;
          source_type?: string;
          student_id: string;
          title?: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          course_id?: string;
          created_at?: string;
          id?: string;
          institution_id?: string;
          is_board_export?: boolean;
          lesson_id?: string;
          notes_json?: Json;
          request_key?: string | null;
          session_id?: string | null;
          source_type?: string;
          student_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_notes_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_notes_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_notes_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_notes_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
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
      study_goals: {
        Row: {
          created_at: string;
          current_value: number;
          goal_type: string;
          id: string;
          institution_id: string | null;
          is_active: boolean;
          period: string;
          student_id: string;
          target_value: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          current_value?: number;
          goal_type?: string;
          id?: string;
          institution_id?: string | null;
          is_active?: boolean;
          period?: string;
          student_id: string;
          target_value?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          current_value?: number;
          goal_type?: string;
          id?: string;
          institution_id?: string | null;
          is_active?: boolean;
          period?: string;
          student_id?: string;
          target_value?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "study_goals_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      teaching_items: {
        Row: {
          accessible_description: string;
          board_text: string | null;
          common_mistake: string | null;
          course_id: string;
          created_at: string;
          estimated_seconds: number;
          exact_spoken_text: string;
          id: string;
          image_alt: string | null;
          image_url: string | null;
          institution_id: string;
          learner_notes: string;
          lesson_id: string;
          order_index: number;
          section_id: string;
          source_material_id: string | null;
          teacher_explanation: string;
          type: string;
          updated_at: string;
          why_this_matters: string | null;
          writing_speed: string | null;
        };
        Insert: {
          accessible_description?: string;
          board_text?: string | null;
          common_mistake?: string | null;
          course_id: string;
          created_at?: string;
          estimated_seconds?: number;
          exact_spoken_text?: string;
          id?: string;
          image_alt?: string | null;
          image_url?: string | null;
          institution_id: string;
          learner_notes?: string;
          lesson_id: string;
          order_index?: number;
          section_id: string;
          source_material_id?: string | null;
          teacher_explanation?: string;
          type: string;
          updated_at?: string;
          why_this_matters?: string | null;
          writing_speed?: string | null;
        };
        Update: {
          accessible_description?: string;
          board_text?: string | null;
          common_mistake?: string | null;
          course_id?: string;
          created_at?: string;
          estimated_seconds?: number;
          exact_spoken_text?: string;
          id?: string;
          image_alt?: string | null;
          image_url?: string | null;
          institution_id?: string;
          learner_notes?: string;
          lesson_id?: string;
          order_index?: number;
          section_id?: string;
          source_material_id?: string | null;
          teacher_explanation?: string;
          type?: string;
          updated_at?: string;
          why_this_matters?: string | null;
          writing_speed?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "teaching_items_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teaching_items_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teaching_items_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teaching_items_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "lesson_sections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teaching_items_source_material_id_fkey";
            columns: ["source_material_id"];
            isOneToOne: false;
            referencedRelation: "course_materials";
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
      admission_cycles: {
        Row: {
          created_at: string;
          created_by: string;
          default_programme_id: string | null;
          description: string | null;
          id: string;
          institution_id: string;
          opens_at: string | null;
          closes_at: string | null;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          default_programme_id?: string | null;
          description?: string | null;
          id?: string;
          institution_id: string;
          opens_at?: string | null;
          closes_at?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          default_programme_id?: string | null;
          description?: string | null;
          id?: string;
          institution_id?: string;
          opens_at?: string | null;
          closes_at?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admission_cycles_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      admission_applications: {
        Row: {
          admission_cycle_id: string | null;
          application_notes: string | null;
          created_at: string;
          decision_at: string | null;
          email: string;
          full_name: string;
          id: string;
          institution_id: string;
          internal_notes: string | null;
          metadata_json: Json | null;
          phone: string | null;
          reviewed_by: string | null;
          status: string;
          submitted_at: string | null;
          submitted_by: string | null;
          target_course_id: string | null;
          updated_at: string;
        };
        Insert: {
          admission_cycle_id?: string | null;
          application_notes?: string | null;
          created_at?: string;
          decision_at?: string | null;
          email: string;
          full_name: string;
          id?: string;
          institution_id: string;
          internal_notes?: string | null;
          metadata_json?: Json | null;
          phone?: string | null;
          reviewed_by?: string | null;
          status?: string;
          submitted_at?: string | null;
          submitted_by?: string | null;
          target_course_id?: string | null;
          updated_at?: string;
        };
        Update: {
          admission_cycle_id?: string | null;
          application_notes?: string | null;
          created_at?: string;
          decision_at?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          institution_id?: string;
          internal_notes?: string | null;
          metadata_json?: Json | null;
          phone?: string | null;
          reviewed_by?: string | null;
          status?: string;
          submitted_at?: string | null;
          submitted_by?: string | null;
          target_course_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admission_applications_admission_cycle_id_fkey";
            columns: ["admission_cycle_id"];
            isOneToOne: false;
            referencedRelation: "admission_cycles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "admission_applications_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "admission_applications_target_course_id_fkey";
            columns: ["target_course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          actor_role: string | null;
          actor_user_id: string | null;
          created_at: string;
          details_json: Json;
          entity_id: string | null;
          entity_type: string;
          id: string;
          institution_id: string | null;
          summary: string | null;
        };
        Insert: {
          action: string;
          actor_role?: string | null;
          actor_user_id?: string | null;
          created_at?: string;
          details_json?: Json;
          entity_id?: string | null;
          entity_type: string;
          id?: string;
          institution_id?: string | null;
          summary?: string | null;
        };
        Update: {
          action?: string;
          actor_role?: string | null;
          actor_user_id?: string | null;
          created_at?: string;
          details_json?: Json;
          entity_id?: string | null;
          entity_type?: string;
          id?: string;
          institution_id?: string | null;
          summary?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      calendar_events: {
        Row: {
          audience: string;
          course_id: string;
          created_at: string;
          created_by: string;
          description: string | null;
          ends_at: string | null;
          id: string;
          institution_id: string;
          lesson_id: string;
          session_id: string;
          starts_at: string;
          status: string;
          timezone: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          audience?: string;
          course_id: string;
          created_at?: string;
          created_by: string;
          description?: string | null;
          ends_at?: string | null;
          id?: string;
          institution_id: string;
          lesson_id: string;
          session_id: string;
          starts_at: string;
          status?: string;
          timezone?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          audience?: string;
          course_id?: string;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          ends_at?: string | null;
          id?: string;
          institution_id?: string;
          lesson_id?: string;
          session_id?: string;
          starts_at?: string;
          status?: string;
          timezone?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "calendar_events_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "calendar_events_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "calendar_events_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "calendar_events_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      certificates: {
        Row: {
          certificate_number: string;
          completion_rule_id: string | null;
          course_id: string;
          created_at: string;
          id: string;
          institution_id: string;
          issued_at: string;
          issued_by: string;
          metadata_json: Json;
          status: string;
          student_id: string;
          updated_at: string;
          verification_code: string;
        };
        Insert: {
          certificate_number: string;
          completion_rule_id?: string | null;
          course_id: string;
          created_at?: string;
          id?: string;
          institution_id: string;
          issued_at?: string;
          issued_by: string;
          metadata_json?: Json;
          status?: string;
          student_id: string;
          updated_at?: string;
          verification_code: string;
        };
        Update: {
          certificate_number?: string;
          completion_rule_id?: string | null;
          course_id?: string;
          created_at?: string;
          id?: string;
          institution_id?: string;
          issued_at?: string;
          issued_by?: string;
          metadata_json?: Json;
          status?: string;
          student_id?: string;
          updated_at?: string;
          verification_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "certificates_completion_rule_id_fkey";
            columns: ["completion_rule_id"];
            isOneToOne: false;
            referencedRelation: "completion_rules";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "certificates_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "certificates_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      completion_rules: {
        Row: {
          auto_issue_certificate: boolean;
          course_id: string | null;
          created_at: string;
          created_by: string;
          id: string;
          institution_id: string;
          min_progress_percentage: number;
          min_quiz_percentage: number;
          require_active_enrollment: boolean;
          require_quiz_pass: boolean;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          auto_issue_certificate?: boolean;
          course_id?: string | null;
          created_at?: string;
          created_by: string;
          id?: string;
          institution_id: string;
          min_progress_percentage?: number;
          min_quiz_percentage?: number;
          require_active_enrollment?: boolean;
          require_quiz_pass?: boolean;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          auto_issue_certificate?: boolean;
          course_id?: string | null;
          created_at?: string;
          created_by?: string;
          id?: string;
          institution_id?: string;
          min_progress_percentage?: number;
          min_quiz_percentage?: number;
          require_active_enrollment?: boolean;
          require_quiz_pass?: boolean;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "completion_rules_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "completion_rules_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      data_export_jobs: {
        Row: {
          created_at: string;
          export_type: string;
          filters_json: Json;
          id: string;
          institution_id: string;
          requested_by: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          export_type: string;
          filters_json?: Json;
          id?: string;
          institution_id: string;
          requested_by: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          export_type?: string;
          filters_json?: Json;
          id?: string;
          institution_id?: string;
          requested_by?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "data_export_jobs_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      institution_invites: {
        Row: {
          accepted_at: string | null;
          accepted_user_id: string | null;
          created_at: string;
          email: string;
          expires_at: string | null;
          full_name: string | null;
          id: string;
          institution_id: string;
          invited_by: string;
          message: string | null;
          metadata_json: Json | null;
          role: string;
          status: string;
          token_hash: string;
          updated_at: string;
        };
        Insert: {
          accepted_at?: string | null;
          accepted_user_id?: string | null;
          created_at?: string;
          email: string;
          expires_at?: string | null;
          full_name?: string | null;
          id?: string;
          institution_id: string;
          invited_by: string;
          message?: string | null;
          metadata_json?: Json | null;
          role: string;
          status?: string;
          token_hash: string;
          updated_at?: string;
        };
        Update: {
          accepted_at?: string | null;
          accepted_user_id?: string | null;
          created_at?: string;
          email?: string;
          expires_at?: string | null;
          full_name?: string | null;
          id?: string;
          institution_id?: string;
          invited_by?: string;
          message?: string | null;
          metadata_json?: Json | null;
          role?: string;
          status?: string;
          token_hash?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "institution_invites_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      outbound_email_jobs: {
        Row: {
          attempt_count: number | null;
          created_at: string;
          id: string;
          idempotency_key: string | null;
          institution_id: string | null;
          kind: string;
          last_error: string | null;
          payload_json: Json;
          provider: string;
          related_invite_id: string | null;
          related_user_id: string | null;
          scheduled_for: string;
          sent_at: string | null;
          status: string;
          subject: string;
          template_key: string | null;
          to_email: string;
          to_name: string | null;
          updated_at: string;
        };
        Insert: {
          attempt_count?: number | null;
          created_at?: string;
          id?: string;
          idempotency_key?: string | null;
          institution_id?: string | null;
          kind: string;
          last_error?: string | null;
          payload_json?: Json;
          provider?: string;
          related_invite_id?: string | null;
          related_user_id?: string | null;
          scheduled_for: string;
          sent_at?: string | null;
          status?: string;
          subject: string;
          template_key?: string | null;
          to_email: string;
          to_name?: string | null;
          updated_at?: string;
        };
        Update: {
          attempt_count?: number | null;
          created_at?: string;
          id?: string;
          idempotency_key?: string | null;
          institution_id?: string | null;
          kind?: string;
          last_error?: string | null;
          payload_json?: Json;
          provider?: string;
          related_invite_id?: string | null;
          related_user_id?: string | null;
          scheduled_for?: string;
          sent_at?: string | null;
          status?: string;
          subject?: string;
          template_key?: string | null;
          to_email?: string;
          to_name?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "outbound_email_jobs_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
        ];
      };
      session_reminders: {
        Row: {
          calendar_event_id: string;
          created_at: string;
          email_job_id: string | null;
          id: string;
          institution_id: string;
          payload_json: Json;
          reminder_type: string;
          scheduled_for: string;
          session_id: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          calendar_event_id: string;
          created_at?: string;
          email_job_id?: string | null;
          id?: string;
          institution_id: string;
          payload_json?: Json;
          reminder_type: string;
          scheduled_for: string;
          session_id: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          calendar_event_id?: string;
          created_at?: string;
          email_job_id?: string | null;
          id?: string;
          institution_id?: string;
          payload_json?: Json;
          reminder_type?: string;
          scheduled_for?: string;
          session_id?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_reminders_calendar_event_id_fkey";
            columns: ["calendar_event_id"];
            isOneToOne: false;
            referencedRelation: "calendar_events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_reminders_institution_id_fkey";
            columns: ["institution_id"];
            isOneToOne: false;
            referencedRelation: "institutions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_reminders_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "classroom_sessions";
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
      get_user_institution_id: { Args: { p_user_id: string }; Returns: string };
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
      is_session_participant: {
        Args: { p_session_id: string; p_user_id: string };
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
