export function getSearchParam({
  url,
  param,
}: {
  url: string;
  param: string;
}): string | null {
  return new URL(url).searchParams.get(param);
}
