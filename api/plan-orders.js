const { hasSupabaseConfig, json, readJsonBody, supabaseRequest } = require("./_supabase");

function normalizePlanOrder(input) {
  return {
    customer_name: String(input.customerName || "").trim(),
    contact: String(input.contact || "").trim(),
    plan_name: String(input.planName || "").trim(),
    plan_description: String(input.planDescription || "").trim(),
    price: Number(input.price || 0),
    settlement_date: input.settlementDate || null,
    payment_method: String(input.paymentMethod || "Balcao").trim(),
    payment_status: input.paymentMethod === "Pix" ? "pix_pending" : "counter_pending",
    pix_key: String(input.pixKey || "").trim(),
  };
}

function fromDatabase(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    customerName: row.customer_name,
    contact: row.contact,
    planName: row.plan_name,
    planDescription: row.plan_description,
    price: Number(row.price || 0),
    settlementDate: row.settlement_date,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    pixKey: row.pix_key,
  };
}

module.exports = async function handler(req, res) {
  if (!hasSupabaseConfig()) {
    return json(res, 503, { error: "Supabase ainda nao configurado na Vercel." });
  }

  try {
    if (req.method === "POST") {
      const body = await readJsonBody(req);
      const order = normalizePlanOrder(body);

      if (!order.customer_name || !order.contact || !order.plan_name || !order.price || !order.settlement_date) {
        return json(res, 400, { error: "Dados do plano incompletos." });
      }

      const rows = await supabaseRequest("plan_orders", {
        method: "POST",
        body: JSON.stringify(order),
      });

      return json(res, 201, { order: fromDatabase(rows[0]) });
    }

    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Metodo nao permitido." });
  } catch (error) {
    return json(res, 500, { error: error.message || "Erro ao salvar plano." });
  }
};
