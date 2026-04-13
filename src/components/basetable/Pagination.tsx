import React from 'react';
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  pageSize: number;
  pageOptions?: number[];
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  setPageIndex,
  setPageSize,
  pageSize,
  pageOptions = [10, 20, 30, 40, 50],
  isLoading = false,
}) => {
  const currentPage = pageIndex + 1;
  const totalPages = Math.max(pageCount, 1);
  
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              const newPageSize = Number(value);
              // First reset to page 0, then change page size
              setPageIndex(0);
              // Use setTimeout to ensure the page index update happens first
              setTimeout(() => {
                setPageSize(newPageSize);
              }, 0);
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden !h-8 !w-8 p-0 lg:flex"
            onClick={() => setPageIndex(0)}
            disabled={!canPreviousPage || isLoading}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="!h-4 !w-4" />
          </Button>
          <Button
            variant="outline"
            className="!h-8 !w-8 p-0"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={!canPreviousPage || isLoading}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="!h-8 !w-8 p-0"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={!canNextPage || isLoading}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden !h-8 !w-8 p-0 lg:flex"
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={!canNextPage || isLoading}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="!h-4 !w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
