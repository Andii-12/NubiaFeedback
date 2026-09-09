"use client";

export function CommentBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 500))}
        rows={5}
        placeholder="Энд дурын санал, гомдол, тайлбараа бичиж болно..."
        className="w-full rounded-[16px] border-2 border-border bg-white p-3 text-base text-navy outline-none placeholder:text-muted-foreground focus:border-primary"
      />
      <div className="text-right text-xs text-muted-foreground">
        {value.length} / 500
      </div>
    </div>
  );
}
