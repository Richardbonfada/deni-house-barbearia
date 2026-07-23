const { hasSupabaseConfig, json, readJsonBody, supabaseRequest } = require("./_supabase");

function normalizeCatalogItem(input) {
  return {
    type: input.type,
    name: String(input.name || "").trim(),
    description: String(input.description || "").trim(),
    price: Number(input.price || 0),
    duration: input.duration ? Number(input.duration) : null,
    stock: input.stock === 0 || input.stock ? Number(input.stock) : null,
    visits_per_month: input.visitsPerMonth ? Number(input.visitsPerMonth) : null,
    active: true,
  };
}

function fromDatabase(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    type: row.type,
    name: row.name,
    description: row.description,
    price: Number(row.price || 0),
    duration: row.duration,
    stock: row.stock,
    visitsPerMonth: row.visits_per_month,
    active: row.active,
  };
}

module.exports = async function handler(req, res) {
  if (!hasSupabaseConfig()) {
    return json(res, 503, { error: "Supabase ainda nao configurado na Vercel." });
  }

  try {
    if (req.method === "GET") {
      const rows = await supabaseRequest("catalog_items?select=*&active=eq.true&order=created_at.desc");
      return json(res, 200, { items: rows.map(fromDatabase) });
    }

    if (req.method === "POST") {
      const body = await readJsonBody(req);
      const item = normalizeCatalogItem(body);

      if (!["plan", "service", "product"].includes(item.type) || !item.name || !item.price) {
        return json(res, 400, { error: "Dados do item incompletos." });
      }

      const rows = await supabaseRequest("catalog_items", {
        method: "POST",
        body: JSON.stringify(item),
      });

      return json(res, 201, { item: fromDatabase(rows[0]) });
    }

    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { error: "Metodo nao permitido." });
  } catch (error) {
    return json(res, 500, { error: error.message || "Erro ao salvar item." });
  }
};
