import Image from "next/image";
import type { Planet } from "@/content/schema";
import { formatDay, formatMonth, parseDate } from "@/lib/time";

function formatEntryDate(d: string): string {
  const ms = parseDate(d);
  return d.length > 7 ? formatDay(ms) : formatMonth(ms);
}

export function Timeline({ planet }: { planet: Planet }) {
  return (
    <ol className="timeline" data-testid="timeline">
      {planet.timeline.map((t, i) => (
        <li key={`${t.date}-${i}`} className="timeline-entry">
          <time dateTime={t.date} className="timeline-date">
            {formatEntryDate(t.date)}
          </time>
          <div className="timeline-content">
            <p className="timeline-title">{t.title}</p>
            {t.detail && <p className="timeline-detail">{t.detail}</p>}
            {t.image && (
              <figure className="timeline-figure">
                <Image
                  src={t.image.src}
                  alt={t.image.alt}
                  width={t.image.width}
                  height={t.image.height}
                  unoptimized={t.image.src.endsWith(".svg")}
                  sizes="(max-width: 768px) 92vw, 520px"
                  className="timeline-image"
                />
                <figcaption>{t.image.caption}</figcaption>
              </figure>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
