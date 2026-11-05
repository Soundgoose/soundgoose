import { defineType, defineField } from "sanity";

export const newsletterType = defineType({
  name: "newsletter",
  title: "Newsletter Issue",
  type: "document",
  fields: [
    defineField({
      name: "issueNumber",
      title: "Issue #",
      type: "number",
      validation: (rule) => rule.required().positive().integer(),
    }),
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
      name: "publishedAt",
      title: "Publish Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
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
      name: "emailSubject",
      title: "Email Subject Line",
      type: "string",
      description:
        "The subject line delivered to inboxes (e.g., 'Sound Goose Issue #4: The Future of Spatial Audio')",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "emailExcerpt",
      title: "Partial Email Teaser",
      type: "text",
      rows: 5,
      description:
        "The introductory teaser body included in the email before the 'Read More on Sound Goose' button.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fullBody",
      title: "Full Web Post Content",
      type: "blockContent",
      description:
        "The complete long-form issue displayed on soundgoose.com/newsletter/[slug].",
    }),
    defineField({
      name: "broadcastStatus",
      title: "Broadcast Status",
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
  ],
  preview: {
    select: {
      title: "title",
      issueNumber: "issueNumber",
      media: "coverImage",
      status: "broadcastStatus",
    },
    prepare({ title, issueNumber, media, status }) {
      return {
        title: issueNumber ? `Issue #${issueNumber}: ${title}` : title,
        subtitle: `Status: ${status || "draft"}`,
        media,
      };
    },
  },
});
