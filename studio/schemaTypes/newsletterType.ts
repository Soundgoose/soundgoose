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
      name: "metaDescription",
      title: "Meta Description (SEO)",
      type: "text",
      rows: 3,
      description:
        "150-160 character summary of the core value proposition for search snippets.",
      validation: (rule) =>
        rule
          .max(170)
          .warning("Keep under 160 characters for optimal search display."),
    }),
    defineField({
      name: "author",
      title: "Author / Editor",
      type: "reference",
      to: [{ type: "author" }],
      description: "Author credentials for E-E-A-T and bylines.",
    }),
    defineField({
      name: "tldr",
      title: "Part 2: TL;DR / Executive Summary (AEO Focus)",
      type: "array",
      of: [{ type: "string" }],
      description:
        "2-3 concise, direct bullet points answering the core question for readers and AI engines.",
    }),
    defineField({
      name: "personalizedIntro",
      title: "Part 2: Personalized Intro",
      type: "text",
      rows: 4,
      description:
        "A brief, human take on a current industry trend, acoustic shift, or first-hand test result.",
    }),
    defineField({
      name: "fullBody",
      title: "Part 3: Main Feature / Deep Dive",
      type: "blockContent",
      description:
        "The core article with H2/H3 subheadings, lists, bold terms, and internal/external links.",
    }),
    defineField({
      name: "quickBites",
      title: "Part 4: Quick Bites / Curated Signals",
      type: "array",
      of: [
        {
          type: "object",
          name: "signal",
          title: "Curated Signal",
          fields: [
            {
              name: "title",
              title: "Signal Title",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              name: "testedObservation",
              title: "What Was Tested / Observed",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required(),
            },
            {
              name: "recommendation",
              title: "What We Recommend",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required(),
            },
            {
              name: "link",
              title: "Reference URL (Optional)",
              type: "url",
            },
          ],
        },
      ],
      description:
        "Bite-sized takeaways clearly separating observed data from recommendations.",
    }),
    defineField({
      name: "actionableNextStep",
      title: "Part 5: Actionable Next Step",
      type: "text",
      rows: 3,
      description:
        "A single, concrete action item the reader can test or execute this week.",
    }),
    defineField({
      name: "canonicalCtaLabel",
      title: "Part 5: CTA Button Label",
      type: "string",
      initialValue: "Try Sound Goose Canvas",
    }),
    defineField({
      name: "canonicalCtaUrl",
      title: "Part 5: CTA Destination URL",
      type: "string",
      initialValue: "/#waitlist",
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
