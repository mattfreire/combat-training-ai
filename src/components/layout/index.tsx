import Image from "next/image";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

import { Button } from "../ui/button";
import { api } from "~/utils/api";
import { RepoSelector } from "./_components/preset-selector";
import { Menu } from "./_components/menu";
import { RepoSidebar } from "../RepoSidebar";
import { useRepo } from "~/context/repo";
import { ScrollArea } from "../ui/scroll-area";

export function Layout() {
  const { data: repos, isLoading } = api.repo.getAll.useQuery();
  const { repo } = useRepo();
  return (
    <div className="flex flex-1 flex-col">
      <div className="hidden h-full flex-col md:flex">
        <div className="container sticky top-0 z-10 flex flex-col items-start justify-between space-y-2 border-b border-stone-800 bg-opacity-50 py-4 backdrop-blur sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <Menu />
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            {isLoading ? "loading..." : null}
            {repos && <RepoSelector repos={repos} />}
            {/* <PresetSave /> */}
            <div className="hidden space-x-2 md:flex">
              {/* <CodeViewer /> */}
              {/* <PresetShare /> */}
            </div>
            {/* <PresetActions /> */}
          </div>
        </div>
        <div className="flex-1">
          <div className="container h-full py-6">
            <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_300px]">
              <div className="hidden flex-col space-y-4 sm:flex md:order-2">
                <Textarea
                  placeholder="Ask questions"
                  className="min-h-[400px] flex-1 p-4 outline-stone-200 focus:outline-stone-200 focus:ring-0 md:min-h-[700px] lg:min-h-[700px]"
                />
              </div>
              <div className="h-full w-full flex-1 flex-col">
                <div className="flex h-full flex-col space-y-4">
                  <div className="flex flex-1 gap-6">
                    {repo && (
                      <ScrollArea className="h-[calc(100vh-170px)] w-72">
                        <RepoSidebar repo={repo} />
                      </ScrollArea>
                    )}
                    <Textarea
                      placeholder="Write a tagline for an ice cream shop"
                      className="h-full flex-1 flex-col p-4"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button>Submit</Button>
                    <Button variant="secondary">
                      <span className="sr-only">Show history</span>
                      <CounterClockwiseClockIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
