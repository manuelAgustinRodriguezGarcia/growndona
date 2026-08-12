"use client";

import { useSyncExternalStore } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STORAGE_KEY = "growndona-install-clicked";

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const subscribers = new Set<() => void>();

function notifyAll() {
  subscribers.forEach((notify) => notify());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notifyAll();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notifyAll();
  });
}

function subscribe(notify: () => void) {
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) ? null : deferredPrompt;
}

export function InstallAppButton() {
  const promptEvent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => null
  );

  if (!promptEvent) return null;

  const handleClick = async () => {
    localStorage.setItem(STORAGE_KEY, "1");
    deferredPrompt = null;
    notifyAll();
    await promptEvent.prompt();
  };

  return (
    <Button variant="secondary" full onClick={handleClick}>
      <Download size={16} aria-hidden="true" />
      Descargar aplicación
    </Button>
  );
}
