// Defines what columns show in the table and what fields appear in the
// add/edit form, for each admin-managed resource. Adding a new manageable
// content type later just means adding an entry here — no new page needed.
const RESOURCE_CONFIG = {
  events: {
    label: 'Events',
    titleField: 'title',
    columns: ['title', 'start_date', 'location', 'is_active'],
    fields: [
      { name: 'title', label: 'Event Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'start_date', label: 'Start Date & Time', type: 'datetime-local', required: true },
      { name: 'end_date', label: 'End Date & Time', type: 'datetime-local' },
      { name: 'image_path', label: 'Event Image', type: 'image' },
      { name: 'display_order', label: 'Display Order (lower = shown first)', type: 'number', default: 0 },
      { name: 'is_active', label: 'Active (shown on homepage slider)', type: 'checkbox', default: true },
    ],
  },
  news: {
    label: 'News',
    titleField: 'title',
    columns: ['title', 'is_published', 'published_at'],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'body', label: 'Body', type: 'textarea', required: true },
      { name: 'image_path', label: 'Image', type: 'image' },
      { name: 'published_at', label: 'Publish Date', type: 'datetime-local' },
      { name: 'is_published', label: 'Published', type: 'checkbox', default: false },
    ],
  },
  blog: {
    label: 'Blog Posts',
    titleField: 'title',
    columns: ['title', 'author_name', 'is_published'],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'body', label: 'Body', type: 'textarea', required: true },
      { name: 'author_name', label: 'Author', type: 'text' },
      { name: 'image_path', label: 'Cover Image', type: 'image' },
      { name: 'published_at', label: 'Publish Date', type: 'datetime-local' },
      { name: 'is_published', label: 'Published', type: 'checkbox', default: false },
    ],
  },
  stories: {
    label: 'Stories',
    titleField: 'title',
    columns: ['title', 'child_name', 'is_published'],
    fields: [
      { name: 'title', label: 'Story Title', type: 'text', required: true },
      { name: 'child_name', label: "Child's First Name (optional, for privacy)", type: 'text' },
      { name: 'body', label: 'Story', type: 'textarea', required: true },
      { name: 'image_path', label: 'Image', type: 'image' },
      { name: 'is_published', label: 'Published', type: 'checkbox', default: false },
    ],
  },
  programs: {
    label: 'Programs',
    titleField: 'title',
    columns: ['title', 'summary', 'is_active'],
    fields: [
      { name: 'title', label: 'Program Title', type: 'text', required: true },
      { name: 'summary', label: 'Short Summary', type: 'text' },
      { name: 'body', label: 'Full Description', type: 'textarea', required: true },
      { name: 'icon', label: 'Icon (Font Awesome class, e.g. fa-graduation-cap)', type: 'text' },
      { name: 'image_path', label: 'Image', type: 'image' },
      { name: 'display_order', label: 'Display Order', type: 'number', default: 0 },
      { name: 'is_active', label: 'Active', type: 'checkbox', default: true },
    ],
  },
  projects: {
    label: 'Projects',
    titleField: 'title',
    columns: ['title', 'status', 'is_active'],
    fields: [
      { name: 'title', label: 'Project Title', type: 'text', required: true },
      { name: 'summary', label: 'Short Summary', type: 'text' },
      { name: 'body', label: 'Full Description', type: 'textarea', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['planned', 'ongoing', 'completed'], default: 'ongoing' },
      { name: 'image_path', label: 'Image', type: 'image' },
      { name: 'display_order', label: 'Display Order', type: 'number', default: 0 },
      { name: 'is_active', label: 'Active', type: 'checkbox', default: true },
    ],
  },
  gallery: {
    label: 'Gallery Images',
    titleField: 'caption',
    columns: ['caption', 'category', 'is_active'],
    fields: [
      { name: 'caption', label: 'Caption', type: 'text' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'image_path', label: 'Image', type: 'image', required: true },
      { name: 'display_order', label: 'Display Order', type: 'number', default: 0 },
      { name: 'is_active', label: 'Active', type: 'checkbox', default: true },
    ],
  },
};
