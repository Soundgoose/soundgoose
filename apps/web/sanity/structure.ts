import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content Studio")
    .items([
      S.listItem()
        .title("Liner Notes")
        .schemaType("post")
        .child(
          S.documentTypeList("post")
            .title("Liner Notes Dispatches")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),

      S.listItem()
        .title("Weekly Digest")
        .schemaType("newsletter")
        .child(
          S.list()
            .title("Weekly Digest Issues")
            .items([
              S.listItem()
                .title("All Editions")
                .child(
                  S.documentTypeList("newsletter")
                    .title("All Editions")
                    .defaultOrdering([
                      { field: "issueNumber", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Drafts")
                .child(
                  S.documentList()
                    .title("Draft Editions")
                    .schemaType("newsletter")
                    .filter(
                      '_type == "newsletter" && broadcastStatus == "draft"',
                    )
                    .defaultOrdering([
                      { field: "issueNumber", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Ready to Broadcast")
                .child(
                  S.documentList()
                    .title("Ready to Broadcast")
                    .schemaType("newsletter")
                    .filter(
                      '_type == "newsletter" && broadcastStatus == "ready"',
                    )
                    .defaultOrdering([
                      { field: "issueNumber", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Sent Editions")
                .child(
                  S.documentList()
                    .title("Sent Editions")
                    .schemaType("newsletter")
                    .filter(
                      '_type == "newsletter" && broadcastStatus == "sent"',
                    )
                    .defaultOrdering([
                      { field: "issueNumber", direction: "desc" },
                    ]),
                ),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("Authors & Contributors")
        .schemaType("author")
        .child(S.documentTypeList("author").title("Authors & Contributors")),

      S.listItem()
        .title("Categories & Tags")
        .schemaType("category")
        .child(S.documentTypeList("category").title("Categories & Tags")),
    ]);
