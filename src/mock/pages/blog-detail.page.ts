import { mockBlogs } from "../shared";

export const blogDetailPageFallback = {
  blogsById: Object.fromEntries(mockBlogs.map((blog) => [String(blog.id), blog])),
};
