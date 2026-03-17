import { mockListings, mockUsers } from "../shared";

const profileUser = {
  id: mockUsers[0].id,
  email: mockUsers[0].email,
  phone: mockUsers[0].phone,
  photo: mockUsers[0].photo,
  firstName: "Ariana",
  lastName: "Rahimi",
  fullName: mockUsers[0].fullName,
  contacts: mockUsers[0].contacts,
  address: {
    city: "Kabul",
    street: "District 10",
    country: "Afghanistan",
  },
  metadata: "Product strategist and verified seller focused on premium tech and lifestyle listings.",
  roles: mockUsers[0].roles,
  listings: mockListings,
  representatives: mockListings.flatMap((item) => item.representatives || []),
  followers: [
    { id: "f-1", fullName: "Farid Ahmadi", photo: mockUsers[1].photo },
    { id: "f-2", fullName: "Admin Operator", photo: mockUsers[2].photo },
  ],
};

export const profilePageFallback = {
  usersById: {
    [mockUsers[0].id]: profileUser,
    [mockUsers[1].id]: {
      ...profileUser,
      id: mockUsers[1].id,
      fullName: mockUsers[1].fullName,
      email: mockUsers[1].email,
      phone: mockUsers[1].phone,
      photo: mockUsers[1].photo,
      listings: mockListings.filter((x) => x.user?.id === mockUsers[1].id),
    },
  },
};
