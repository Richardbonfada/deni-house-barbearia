const crypto = require("crypto");
const { hasSupabaseConfig, json, readJsonBody, supabaseRequest } = require("./_supabase");

function normalizeContact(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return { hash, salt };
}

function publicCustomer(row) {
  return {
    id: row.id,
    name: row.name,
    contact: row.contact,
    createdAt: row.created_at,
  };
}

async function findCustomer(normalizedContact) {
  const rows = await supabaseRequest(`customers?normalized_contact=eq.${encodeURIComponent(normalizedContact)}&select=*`);
  return rows[0] || null;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Metodo nao permitido." });
  }

  if (!hasSupabaseConfig()) {
    return json(res, 503, { error: "Supabase ainda nao configurado na Vercel." });
  }

  try {
    const body = await readJsonBody(req);
    const action = body.action;
    const name = String(body.name || "").trim();
    const contact = String(body.contact || "").trim();
    const password = String(body.password || "").trim();
    const normalizedContact = normalizeContact(contact);

    if (!contact || !password) {
      return json(res, 400, { error: "Informe contato e senha." });
    }

    if (action === "signup") {
      if (!name) {
        return json(res, 400, { error: "Informe o nome para cadastrar." });
      }

      const existingCustomer = await findCustomer(normalizedContact);
      if (existingCustomer) {
        return json(res, 409, { error: "Esse contato ja esta cadastrado. Entre pelo login." });
      }

      const passwordData = hashPassword(password);
      const rows = await supabaseRequest("customers", {
        method: "POST",
        body: JSON.stringify({
          name,
          contact,
          normalized_contact: normalizedContact,
          password_hash: passwordData.hash,
          password_salt: passwordData.salt,
        }),
      });

      return json(res, 201, { customer: publicCustomer(rows[0]) });
    }

    if (action === "login") {
      const customer = await findCustomer(normalizedContact);
      if (!customer) {
        return json(res, 401, { error: "Cadastro nao encontrado." });
      }

      const passwordData = hashPassword(password, customer.password_salt);
      if (passwordData.hash !== customer.password_hash) {
        return json(res, 401, { error: "Senha incorreta." });
      }

      return json(res, 200, { customer: publicCustomer(customer) });
    }

    return json(res, 400, { error: "Acao invalida." });
  } catch (error) {
    return json(res, 500, { error: error.message || "Erro no cadastro." });
  }
};
