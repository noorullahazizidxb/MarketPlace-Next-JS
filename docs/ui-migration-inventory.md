# Marketplace Front-end UI Migration Inventory

Replacement targets use `src/components/ui/atoms/shadcn/*` unless noted.

Generated via MarkItDown from `ui-migration-inventory-source.html`.

| Element | Source | Replacement | Status |
| --- | --- | --- | --- |
| button / Button | src/components/ui/button.tsx (legacy) | atoms/shadcn/button.tsx (compat wrapper) | done |
| raw button | src/components/layout/navbar.tsx | atoms/shadcn/button + tooltip | done |
| raw button | src/components/layout/sidebar.tsx | AdminBaseLayout + AppSidebar (retire chrome) | done |
| raw button / input | src/components/layout/topbar.tsx | button / TextInputField | pending |
| raw button | src/components/layout/footer.tsx | button | done |
| input / form | src/app/sign-in/page.tsx | TextInputField + button | done |
| input / form | src/app/sign-up/page.tsx | TextInputField + button | done |
| input / form | src/components/ui/contact-form.tsx | TextInputField + textarea + button | done |
| input / form | src/app/listings/create/page.tsx | TextInputField / SelectField / checkbox | done |
| input / form | src/app/profile/page.tsx | TextInputField + button | done |
| input / search | src/components/ui/search-box.tsx | TextInputField or input | done |
| input / filters | src/components/ui/filters-bar.tsx | TextInputField / select / button | done |
| table | src/components/categories/CategoriesTable.tsx | atoms/shadcn/table | done |
| table / wizard | src/components/users/users-dashboard.tsx | table + button + TextInputField | pending |
| wizard inputs | src/components/users/user-create-wizard.tsx | TextInputField / SelectField | done |
| wizard inputs | src/components/blogs/BlogCreateWizard.tsx | TextInputField / textarea | pending |
| wizard inputs | src/components/categories/CategoryCreateWizard.tsx | TextInputField / SelectField | done |
| admin page buttons | src/app/admin/page.tsx | button / card | pending |
| admin notifications | src/app/admin/notifications/page.tsx | TextInputField / button / table | pending |
| admin ads | src/app/admin/ads/page.tsx | button / SelectField / card | done |
| admin contacts | src/app/admin/contacts/page.tsx | table / button | done |
| admin stories | src/app/admin/stories/page.tsx | button / dialog | done |
| admin content status | src/app/admin/manage-content-status/page.tsx | table / tabs / button | pending |
| pendings | src/app/pendings/page.tsx | table / button / badge | done |
| settings themes | src/app/settings/themes/page.tsx | button / card | done |
| settings | src/app/settings/page.tsx | button / TextInputField | done |
| dropdown | src/components/ui/language-dropdown.tsx | dropdown-menu | done |
| checkbox / switch | src/components/ads/switch.tsx | switch / checkbox | done |
| select | src/components/ads/placement-select.tsx | SelectField | done |
| dialog | src/components/ui/confirm-dialog.tsx | dialog | done |
| duplicate TextInputField | src/components/ui/TextInputField.tsx | re-export atoms/shadcn/TextInputField | done |
| admin layout | src/components/layout/app-shell.tsx | templates/admin-base-layout + organisms/app-sidebar | done |
| hero buttons/inputs | src/components/listings/HomeHero.tsx | button / TextInputField | pending |
| hero buttons/inputs | src/components/blogs/BlogHero.tsx | button / TextInputField | pending |
| comments | src/components/blogs/CommentsInline.tsx | TextInputField / button | done |
| autocomplete | src/components/categories/ParentAutocomplete.tsx | command / TextInputField | pending |
| my listings | src/app/my-listings/page.tsx | button / card / badge | pending |
| listing detail | src/app/listings/[id]/page.tsx | button / badge | pending |
| listings page | src/app/listings/page.tsx | button / filters | pending |
| blogs pages | src/app/blogs/page.tsx, src/app/blogs/[id]/page.tsx | button / TextInputField | pending |
| story UI | src/components/stories/*, src/components/ui/StoryCreateModal.tsx | button / dialog / TextInputField | pending |
| notifications panel | src/components/ui/notifications-panel.tsx | button / badge | pending |
| bottom nav | src/components/ui/BottomNavigation.tsx | button | done |
| auth social | src/components/auth/SocialAuthButtons.tsx | button | done |
| follow | src/components/profile/FollowButton.tsx | button | done |
| legacy input | src/components/ui/input.tsx | atoms/shadcn/input or TextInputField | done |
