import { type SchemaTypeDefinition } from "sanity";
import { blockContentType } from "./blockContentType";
import { authorType } from "./authorType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { newsletterType } from "./newsletterType";

export const schemaTypes: SchemaTypeDefinition[] = [
  blockContentType,
  authorType,
  categoryType,
  postType,
  newsletterType,
];

export const schema = {
  types: schemaTypes,
};
