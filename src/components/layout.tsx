import Image from "next/image";

import { Sidebar } from "./sidebar";
// import { Menu } from "./menu";
import { type ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/logo.png"
          width={1280}
          height={1114}
          alt="Combat Training"
        />
      </div>
      <div className="hidden md:block">
        {/* <Menu /> */}
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
