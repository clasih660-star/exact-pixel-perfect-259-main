import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyInstitutions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: memberships, error } = await supabase
      .from("institution_members")
      .select(
        "role, status, institution:institutions(id, name, slug, type, country, city, status, contact_email, phone, brand_color, logo_url, learner_count, preferred_use_case, created_at)",
      )
      .eq("user_id", userId)
      .eq("status", "active");
    if (error) throw new Error(error.message);
    return { memberships: memberships ?? [] };
  });

export const getInstitutionOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { institution_id: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const [inst, classrooms, members, resources] = await Promise.all([
      supabase.from("institutions").select("*").eq("id", data.institution_id).single(),
      supabase
        .from("virtual_classrooms")
        .select("id, name, status", { count: "exact" })
        .eq("institution_id", data.institution_id),
      supabase
        .from("institution_members")
        .select("id, role", { count: "exact" })
        .eq("institution_id", data.institution_id),
      supabase
        .from("classroom_resources")
        .select("id", { count: "exact", head: true })
        .eq("institution_id", data.institution_id),
    ]);
    if (inst.error) throw new Error(inst.error.message);

    const memberRows = members.data ?? [];
    const teacherCount = memberRows.filter((m) => m.role === "teacher").length;
    const studentCount = memberRows.filter((m) => m.role === "student").length;

    return {
      institution: inst.data,
      stats: {
        classrooms: classrooms.count ?? 0,
        active_classrooms: (classrooms.data ?? []).filter((c) => c.status === "active").length,
        teachers: teacherCount,
        students: studentCount,
        resources: resources.count ?? 0,
        sessions: 0,
      },
    };
  });
