"use client";

import { LifeBuoy, Phone, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HELP } from "@/content/help";

/**
 * Persistent "Get Help" button, available on every screen. Some players are living
 * the scenarios on the cards, so help is always one tap away.
 */
export function GetHelp() {
  return (
    <Dialog>
      <DialogTrigger
        aria-label="Get help"
        className={buttonVariants({
          variant: "secondary",
          size: "sm",
          className: "fixed bottom-4 right-4 z-50 gap-1.5 rounded-full shadow-md",
        })}
      >
        <LifeBuoy className="size-4" aria-hidden />
        Get Help
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>You can get help</DialogTitle>
          <DialogDescription>{HELP.reassurance}</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{HELP.prompt}</p>
        <div className="flex flex-col gap-3">
          {HELP.lines.map((line) => (
            <a
              key={line.name}
              href={line.href}
              target={line.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium">{line.name}</span>
                <span className="text-xs text-muted-foreground">{line.detail}</span>
              </span>
              {line.href.startsWith("tel:") ? (
                <Phone className="size-4 shrink-0" aria-hidden />
              ) : (
                <ExternalLink className="size-4 shrink-0" aria-hidden />
              )}
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
