import Link from "next/link";

import { cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-4xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className={cyberPanelClasses("w-full p-6 sm:p-8")}>
        <div className="space-y-4">
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            404 signal lost
          </p>
          <h1 className="text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">
            This page drifted off the grid.
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            The content you were looking for does not exist or may have moved.
            Return to the CyberSENSE home screen and continue training.
          </p>
          <Link href="/" className={cyberButtonClasses("primary", "md", "mt-2")}>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
