import { getGraphToken } from "./graphAuth";

export async function getArticles() {
  const token = await getGraphToken();

  const url = `https://graph.microsoft.com/v1.0/sites/${import.meta.env.SITE_ID}/lists/${import.meta.env.LIST_ID}/items?expand=fields`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!data.value) {
    throw new Error("Nessun articolo trovato");
  }

  return data.value.map((item: any) => ({
    id: item.id,
    title: item.fields.Title,
    slug: item.fields.Slug,
    excerpt: item.fields.Excerpt,
    content: item.fields.Content,
    publishedDate: item.fields.PublishedDate,
    isPublished: item.fields.IsPublished,
    coverImage: item.fields.CoverImage,
    tags: item.fields.Tags
  }));
}
