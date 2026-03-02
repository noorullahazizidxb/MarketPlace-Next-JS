import { mockListings } from "../shared";

export const pendingsPageFallback = {
  pendingListings: mockListings.filter((listing) => listing.status === "PENDING"),
};
