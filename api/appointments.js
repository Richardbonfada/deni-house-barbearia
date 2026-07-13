const { hasSupabaseConfig, json, readJsonBody, supabaseRequest } = require("./_supabase");

function normalizeAppointment(input) {
  return {
    client_name: input.clientName || "Cliente",
    contact: input.contact || "",
    email: input.email || "",
    service: input.service,
    provider: input.provider,
    barber_id: input.barberId,
    appointment_date: input.date,
    date_label: input.dateLabel,
    appointment_time: input.time,
    payment_method: input.payment,
    payment_status: input.paymentStatus || (input.payment === "Pago antecipado" ? "pending" : "counter"),
    price: Number(input.price || 0),
  };
}

function fromDatabase(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    clientName: row.client_name,
    contact: row.contact,
    email: row.email,
    service: row.service,
    provider: row.provider,
    barberId: row.barber_id,
    date: row.appointment_date,
    dateLabel: row.date_label,
    time: row.appointment_time,
    payment: row.payment_method,
    paymentStatus: row.payment_status,
    paymentId: row.payment_id,
    price: Number(row.price || 0),
  };
}

module.exports = async function handler(req, res) {
  if (!hasSupabaseConfig()) {
    return json(res, 503, { error: "Supabase ainda nao configurado na Vercel." });
  }

  try {
    if (req.method === "GET") {
      const rows = await supabaseRequest("appointments?select=*&order=appointment_date.asc,appointment_time.asc");
      return json(res, 200, { appointments: rows.map(fromDatabase) });
    }

    if (req.method === "POST") {
      const body = await readJsonBody(req);
      const appointment = normalizeAppointment(body);

      if (!appointment.service || !appointment.provider || !appointment.appointment_date || !appointment.appointment_time) {
        return json(res, 400, { error: "Dados do agendamento incompletos." });
      }

      const rows = await supabaseRequest("appointments", {
        method: "POST",
        body: JSON.stringify(appointment),
      });

      return json(res, 201, { appointment: fromDatabase(rows[0]) });
    }

    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { error: "Metodo nao permitido." });
  } catch (error) {
    return json(res, 500, { error: error.message || "Erro ao salvar agendamento." });
  }
};
