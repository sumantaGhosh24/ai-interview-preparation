"use state";

import {useState} from "react";
import Link from "next/link";
import {toast} from "sonner";
import {
  AlertTriangleIcon,
  EyeIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PenIcon,
  SearchIcon,
  SendIcon,
  TrashIcon,
} from "lucide-react";

import {cn} from "@/lib/utils";

import LoadingSwap from "./loading-swap";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import {Card, CardContent, CardDescription, CardTitle} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {Badge} from "./ui/badge";

type EntityHeaderProps = {
  title: string;
  description?: string;
};

export const EntityHeader = ({title, description}: EntityHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

type EntityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) => {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
};

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search",
}: EntitySearchProps) => {
  return (
    <div className="relative">
      <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="w-full bg-background shadow-none border-border pl-8"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={page === 1 || disabled}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          disabled={page === totalPages || totalPages === 0 || disabled}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

interface StateViewProps {
  message?: string;
}

export const LoadingView = ({message}: StateViewProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <Loader2Icon className="size-6 animate-spin text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export const ErrorView = ({message}: StateViewProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <AlertTriangleIcon className="size-6 text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export const EmptyView = ({message}: StateViewProps) => {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>No items</EmptyTitle>
      {!!message && <EmptyDescription>{message}</EmptyDescription>}
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
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

interface EntityItemProps {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  onUpdate?: (fileName: string) => void | Promise<void>;
  isUpdating?: boolean;
  className?: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
}

export const EntityItem = ({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  onUpdate,
  isUpdating,
  className,
  status,
}: EntityItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fileName, setFileName] = useState(title);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving || isUpdating) {
      return;
    }

    if (onRemove) {
      await onRemove();
    }
  };

  const handleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleUpdate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving || isUpdating) {
      return;
    }

    if (fileName.length < 0) {
      toast.error("File name is required");
    }

    if (fileName.length > 50) {
      toast.error("File name length not be greater than 50");
    }

    if (onUpdate) {
      await onUpdate(fileName);
    }

    setIsEditing(false);
  };

  return (
    <Card
      className={cn(
        "p-4 shadow-none hover:shadow transition-all",
        isRemoving && "opacity-50 cursor-not-allowed",
        isUpdating && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <CardContent className="flex flex-row items-center justify-between p-0">
        <div className="flex items-center gap-3 w-full">
          {image}
          <div className="w-full">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <div className="flex items-center gap-3 mb-3 w-full">
                  <Input
                    type="text"
                    placeholder="Enter file name"
                    id="fileName"
                    name="fileName"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    type="button"
                    disabled={isUpdating}
                    onClick={handleUpdate}
                  >
                    <LoadingSwap
                      isLoading={Boolean(isUpdating)}
                      className="flex items-center"
                    >
                      <SendIcon className="mr-2" /> Update
                    </LoadingSwap>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <CardTitle className="text-base font-medium">
                    {title}
                  </CardTitle>
                  {status && (
                    <Badge
                      className={cn(
                        "ml-2 uppercase",
                        status === "PENDING" && "bg-yellow-100 text-yellow-800",
                        status === "PROCESSING" && "bg-blue-100 text-blue-800",
                        status === "COMPLETED" && "bg-green-100 text-green-800",
                        status === "FAILED" && "bg-red-100 text-red-800",
                      )}
                    >
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            {!!subtitle && (
              <CardDescription className="text-xs">{subtitle}</CardDescription>
            )}
          </div>
        </div>
        {(actions || onRemove) && (
          <div className="flex gap-x-4 items-center">
            {actions}
            <Button size="icon" variant="ghost" asChild>
              <Link href={href}>
                <EyeIcon className="size-4" />
              </Link>
            </Button>
            {onRemove && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem
                    onClick={handleRemove}
                    className="cursor-pointer"
                  >
                    <TrashIcon className="size-4" />
                    Delete
                  </DropdownMenuItem>
                  {onUpdate && (
                    <DropdownMenuItem
                      onClick={handleEdit}
                      className="cursor-pointer"
                    >
                      <PenIcon className="size-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
