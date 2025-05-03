import { Request } from "express";
import { SortOrder } from "mongoose";

export interface FindOptions {
  search?: string;
  sort?: Record<string, SortOrder>;
  limit?: number;
  skip?: number;
}

export function getFindOptions(req: Request) {
  let { search, sort, limit, page } = req.query;
  const options: FindOptions = {};

  if (search) options.search = search as string;
  if (typeof sort === "string" && sort) {
    options.sort = {};
    sort.split(",").forEach((item: string) => {
      const [key, order] = item.split(":");
      options.sort![key] = order === "desc" ? -1 : 1;
    });
  }

  if (page && !isNaN(Number(page))) {
    options.skip = (+Number(page)! - 1) * +Number(limit || 0);
  }

  if (limit && !isNaN(Number(limit))) {
    options.limit = Number(limit);
  }

  return options;
}
