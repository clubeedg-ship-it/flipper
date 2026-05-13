export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="font-heading text-[20px] text-[--text-primary] mb-2">{title}</p>
        <p className="font-body text-[14px] text-[--text-tertiary]">Esta seção estará disponível em breve.</p>
      </div>
    </div>
  );
}
