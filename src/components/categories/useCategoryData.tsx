"use client";
import { useState, useMemo, useCallback } from "react";
import { useApiGet, useApiMutation } from "@/lib/api-hooks";
import type {
  CategoryEntity,
  CategoryTreeNode,
  CreateCategoryInput,
} from "./types";

function buildPath(cat: CategoryEntity): string {
  const segs: string[] = [];
  let cur: CategoryEntity | undefined | null = cat;
  let guard = 0;
  while (cur && guard < 25) {
    // prevent cycles
    segs.push(cur.name);
    cur = cur.parent as any;
    guard++;
  }
  return segs.reverse().join(" › ");
}

export function useCategories(search?: string) {
  const { data, error, isLoading, mutate } = useApiGet<CategoryEntity[] | any>(
    ["categories", search],
    "/categories",
    search ? { search } : undefined
  );
  const list: CategoryEntity[] = useMemo(
    () => (Array.isArray(data) ? data : data?.data ?? []),
    [data]
  );
  const flat: CategoryTreeNode[] = useMemo(() => {
    const out: CategoryTreeNode[] = [];
    const visit = (node: CategoryEntity, depth: number) => {
      out.push({ ...node, depth, path: buildPath(node) });
      (node.children || []).forEach((c) => visit(c, depth + 1));
    };
    list.filter((c) => !c.parentId).forEach((r) => visit(r, 0));
    return out;
  }, [list]);
  return { categories: list, flat, error, isLoading, reload: mutate };
}

export function useCreateCategory(onSuccess?: () => void) {
  const mutation = useApiMutation<any>("post", "/categories");
  const submit = async (input: CreateCategoryInput) => {
    await mutation.mutateAsync(input as any);
    onSuccess?.();
  };
  return { ...mutation, submit };
}

export function useUpdateCategory(id: number, onSuccess?: () => void) {
  const mutation = useApiMutation<any>("put", `/categories/${id}`);
  const submit = async (input: Partial<CreateCategoryInput>) => {
    await mutation.mutateAsync(input as any);
    onSuccess?.();
  };
  return { ...mutation, submit };
}

export function useDeleteCategory(id: number, onSuccess?: () => void) {
  const mutation = useApiMutation<any>("delete", `/categories/${id}`);
  const remove = async () => {
    await mutation.mutateAsync({});
    onSuccess?.();
  };
  return { ...mutation, remove };
}
