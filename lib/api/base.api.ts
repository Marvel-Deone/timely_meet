export const api = {
  get: async (url: string) => {
    const res = await fetch(url, { method: "GET" });
    return res.json();
  },
  post: async (url: string, body: any) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },
  put: async (url: string, body: any) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },
  delete: async (url: string) => {
    const res = await fetch(url, { method: "DELETE" });
    return res.json();
  },
};
