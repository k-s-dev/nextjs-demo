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
 * @param splitKeys - object of keys to be split into array along with separator.
 * @returns Parsed form data, ready to be validated.
 *
 * @example
 * ```
 * Write me later.
 * ```
 */
export function parseFormData(
  formData: FormData,
  excludeKeys: string[] = [],
  splitKeys?: { [k: string]: "," | string },
) {
  const rawFormData = Object.fromEntries(formData);
  const parsedFormData: { [k: string]: string | string[] } = {};
  for (const key in rawFormData) {
    if (excludeKeys.includes(key)) continue;
    if (typeof rawFormData[key] === "string") {
      parsedFormData[key] = rawFormData[key];
    }
    if (!!splitKeys && Object.keys(splitKeys).includes(key)) {
      parsedFormData[key] = rawFormData[key].toString().split(splitKeys[key]);
    }
    if (formData.getAll(key).length > 1) {
      parsedFormData[key] = formData.getAll(key) as string[];
    }
  }
  return parsedFormData;
}
