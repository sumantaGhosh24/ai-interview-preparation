"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertCircleIcon, FolderCodeIcon, LoaderIcon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useGlobalParams } from "@/features/global/hooks/use-global-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type EntityContainerProps = {
  children: ReactNode;
  header?: ReactNode;
  search?: ReactNode;
  pagination?: ReactNode;
};

export const EntityContainer = ({ children, header, search, pagination }: EntityContainerProps) => {
  return (
    <div className="mx-auto container w-full flex flex-col gap-y-8">
      {header}
      <div className="flex flex-col gap-y-4">
        {search}
        {children}
      </div>
      {pagination}
    </div>
  );
};

type EntityHeaderProps = {
  title: string;
  description?: string;
  create?: ReactNode;
};

export const EntityHeader = ({ title, description, create }: EntityHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && <p className="text-xs md:text-sm text-muted-foreground">{description}</p>}
      </div>
      {create && create}
    </div>
  );
};

interface EntitySearchProps {
  placeholder?: string;
}

export const EntitySearch = ({ placeholder = "Search" }: EntitySearchProps) => {
  const [params, setParams] = useGlobalParams();

  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <div className="relative">
      <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="w-full bg-background shadow-none border-border pl-8"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  const previousDisabled = page === 1 || disabled;
  const nextDisabled = page === totalPages || totalPages === 0 || disabled;

  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => (previousDisabled ? null : onPageChange(Math.max(1, page - 1)))}
                aria-disabled={previousDisabled}
                className={`${
                  previousDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => (nextDisabled ? null : onPageChange(Math.min(totalPages, page + 1)))}
                aria-disabled={nextDisabled}
                className={`${nextDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export const LoadingView = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Empty className="shadow-md container mx-auto h-112.5 dark:shadow-gray-200">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LoaderIcon className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>Loading...</EmptyTitle>
          <EmptyDescription>Please wait</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
};

interface ErrorViewProps {
  title: string;
  description: string;
  buttonText: string;
  redirectUrl: string;
}

export const ErrorView = ({ title, description, buttonText, redirectUrl }: ErrorViewProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Empty className="shadow-md container mx-auto h-112.5 dark:shadow-gray-200">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircleIcon />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(redirectUrl)}>
              {buttonText}
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
};

interface EmptyViewProps {
  title: string;
  description: string;
  buttonText?: string;
  redirectUrl?: string;
}

export const EmptyView = ({ title, description, buttonText, redirectUrl }: EmptyViewProps) => {
  const router = useRouter();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {buttonText && redirectUrl && (
        <EmptyContent>
          <div className="flex gap-2">
            <Button onClick={() => router.push(redirectUrl)}>{buttonText}</Button>
          </div>
        </EmptyContent>
      )}
    </Empty>
  );
};

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-sm mx-auto">{emptyView}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
}
