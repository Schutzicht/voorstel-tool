interface Props {
  label: string;
  icon?: React.ReactNode;
  description: string;
}

export function StaticSlideForm({ label, icon, description }: Props) {
  return (
    <div className="py-6 text-center text-text-secondary">
      <div className="w-16 h-16 bg-indigo/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
        {icon || <div className="font-display font-bold text-indigo text-xl">Ag</div>}
      </div>
      <p className="font-medium text-dark mb-2">{label} slide</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}
