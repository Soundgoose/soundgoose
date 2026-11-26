import { defineType, defineField } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt / Summary",
      type: "text",
      rows: 3,
      description: "Brief summary used for SEO metadata, card previews, and email teasers",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "body",
      title: "Body Content",
      type: "blockContent",
    }),
    defineField({
      name: "emailSubject",
      title: "Email Subject Line",
      type: "string",
      description:
        "Custom subject line for Resend broadcast. If blank, defaults to post title.",
    }),
    defineField({
      name: "emailExcerpt",
      title: "Email Teaser Excerpt",
      type: "text",
      rows: 4,
      description:
        "Custom teaser text for the email before the 'Read Full Article' CTA. If blank, defaults to the excerpt above.",
    }),
    defineField({
      name: "broadcastStatus",
      title: "Mailing List Broadcast Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Ready to Broadcast", value: "ready" },
          { title: "Broadcast Sent", value: "sent" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
    }),
    defineField({
      name: "broadcastSentAt",
      title: "Broadcast Sent At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "broadcastResendId",
      title: "Resend Broadcast ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "seo",
      title: "SEO Metadata Overrides",
      type: "object",
      fields: [
        {
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
        },
        {
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 2,
        },
        {
          name: "canonicalUrl",
          title: "Canonical URL",
          type: "url",
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "coverImage",
      publishedAt: "publishedAt",
      status: "broadcastStatus",
    },
    prepare(selection) {
      const { author, publishedAt, status } = selection;
      const dateFormatted = publishedAt
        ? new Date(publishedAt).toLocaleDateString()
        : "Unpublished";
      const statusBadge = status === "sent" ? " [Broadcast Sent]" : "";
      return {
        ...selection,
        subtitle: author
          ? `By ${author} • ${dateFormatted}${statusBadge}`
          : `${dateFormatted}${statusBadge}`,
      };
    },
  },
});
