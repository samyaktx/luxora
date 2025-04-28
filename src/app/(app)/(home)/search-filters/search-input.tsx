"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react"

import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

import { CategoriesSiderbar } from "./categories-sidebar";

interface SearchInputProps {
  disabled?: boolean;
};

export const SearchInput = ({
  disabled,
}: SearchInputProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSiderbar open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input className="pl-8" placeholder="Search products" disabled={disabled} />
      </div>
      <Button
        variant="elevated"
        className="size-12 shrink-0 flex lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
      {session.data?.user && (
        <Button
          asChild
          variant="elevated"
        >
          <Link href="/library">
            <BookmarkCheckIcon />
            Library
          </Link>
        </Button>
      )}
    </div>
  )
}