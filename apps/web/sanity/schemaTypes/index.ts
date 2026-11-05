import { type SchemaTypeDefinition } from "sanity";
import { blockContentType } from "./blockContentType";
import { authorType } from "./authorType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { newsletterType } from "./newsletterType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, authorType, categoryType, postType, newsletterType],
};
