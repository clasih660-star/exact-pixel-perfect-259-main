import { School, GraduationCap, Users, Heart, Briefcase, Monitor } from "lucide-react";

export function InstitutionStrip() {
  const items = [
    { label: "Schools", icon: School },
    { label: "Universities", icon: GraduationCap },
    { label: "Tutoring centres", icon: Users },
    { label: "NGOs", icon: Heart },
    { label: "Training organisations", icon: Briefcase },
    { label: "Online academies", icon: Monitor },
  ];

  return (
    <section className="py-8 bg-white border-y border-border" id="institution-types">
      <div className="container-editorial flex flex-col lg:flex-row items-center justify-between gap-5">
        <h2 className="text-[13px] font-medium text-muted text-center lg:text-left">
          Built for the places where serious learning happens.
        </h2>

        <div className="flex flex-wrap justify-center gap-x-7 gap-y-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-body hover:text-heading transition-colors text-[13px] font-medium"
            >
              <item.icon size={15} className="text-muted" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
