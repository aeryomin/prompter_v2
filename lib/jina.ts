export async function fetchDocumentationMarkdown(url: string): Promise<string> {
  const encoded = encodeURIComponent(url);
  const response = await fetch(`https://r.jina.ai/${encoded}`);

  if (!response.ok) {
    const statusText = response.statusText || "Неизвестная ошибка";
    throw new Error(
      `Не удалось получить документацию через Jina Reader: ${response.status} ${statusText}`,
    );
  }

  return response.text();
}

