import { whatsappIcon } from "../data/site";
import { cn } from "../utils/cn";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <img
      src={whatsappIcon}
      alt=""
      aria-hidden="true"
      className={cn("h-4 w-4 shrink-0 object-contain", className)}
    />
  );
}
