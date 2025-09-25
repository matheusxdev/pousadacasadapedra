export function isProbablyHtml(input?: string | null): boolean {
  if (!input) return false
  // quick heuristic: any tag-like structure
  return /<\/?[a-z][\s\S]*>/i.test(input)
}
