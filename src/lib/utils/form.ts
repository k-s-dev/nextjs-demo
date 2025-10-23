import { decode, FormDataInfo, FormDataTransform } from "decode-formdata";

/**
 * Parse FormData into regular JS object.
 *   - exclude specified keys, e.g. forms with file input
 *   - split multiple values based on input
 *     - e.g. input from custom multiple select field
 *   - combine multiple values in FormData into an array of strings
 *     - e.g. input from native multiple select/radio fields
 *
 * @param formData
 * @param excludeKeys - list of keys to be excluded.
 * @returns Parsed form data, ready to be validated.
 *
 * @example
 * ```
 * Write me later.
 * ```
 */
export function parseFormData(args: {
  formData: FormData;
  info?: FormDataInfo;
  transform?: FormDataTransform;
  excludeKeys?: string[];
}) {
  let parsedFormData: { [k: string]: unknown };
  if (args.info) {
    parsedFormData = decode(args.formData, args.info, args.transform);
  } else {
    parsedFormData = decode(args.formData, args.transform);
  }

  if (args.excludeKeys) {
    args.excludeKeys.forEach((exKey) => {
      if (exKey in parsedFormData) {
        delete parsedFormData[exKey];
      }
    });
  }

  return parsedFormData;
}
