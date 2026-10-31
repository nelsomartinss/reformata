export default function VerseNumber({ number }: { number: number }) {
  return (
    <sup className="mr-1.5 font-sans text-[0.68em] font-semibold text-muted-foreground">
      {number}
    </sup>
  );
}
