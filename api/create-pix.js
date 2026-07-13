const { hasSupabaseConfig, json, readJsonBody, supabaseRequest } = require("./_supabase");

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

function onlyNumbers(value) {
  return String(value || "").replace(/\D/g, "");
}

function getEmail(appointment) {
  if (appointment.email && appointment.email.includes("@")) {
    return appointment.email;
  }
  return "cliente@denihouse.com.br";
}

async function updateAppointmentPayment(appointmentId, payment) {
  if (!hasSupabaseConfig() || !appointmentId) {
    return;
  }

  await supabaseRequest(`appointments?id=eq.${appointmentId}`, {
    method: "PATCH",
    body: JSON.stringify({
      payment_id: String(payment.id),
      payment_status: payment.status || "pending",
      payment_qr_code: payment.point_of_interaction?.transaction_data?.qr_code || null,
      payment_qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64 || null,
    }),
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Metodo nao permitido." });
  }

  if (!MERCADO_PAGO_ACCESS_TOKEN) {
    return json(res, 503, { error: "Mercado Pago ainda nao configurado na Vercel." });
  }

  try {
    const { appointment } = await readJsonBody(req);
    const amount = Number(appointment?.price || 0);

    if (!appointment?.id || !amount) {
      return json(res, 400, { error: "Agendamento ou valor invalido para gerar Pix." });
    }

    const payerName = appointment.clientName || "Cliente Deni House";
    const phone = onlyNumbers(appointment.contact);
    const firstName = payerName.split(" ")[0] || "Cliente";
    const lastName = payerName.split(" ").slice(1).join(" ") || "Deni House";

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": appointment.id,
      },
      body: JSON.stringify({
        transaction_amount: amount,
        description: `Deni House - ${appointment.service}`,
        payment_method_id: "pix",
        external_reference: appointment.id,
        notification_url: process.env.MERCADO_PAGO_WEBHOOK_URL || undefined,
        payer: {
          email: getEmail(appointment),
          first_name: firstName,
          last_name: lastName,
          phone: phone
            ? {
                area_code: phone.slice(0, 2),
                number: phone.slice(2),
              }
            : undefined,
        },
      }),
    });

    const payment = await response.json();

    if (!response.ok) {
      return json(res, response.status, {
        error: payment.message || payment.error || "Nao foi possivel gerar o Pix.",
      });
    }

    await updateAppointmentPayment(appointment.id, payment);

    return json(res, 200, {
      paymentId: payment.id,
      status: payment.status,
      qrCode: payment.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
      ticketUrl: payment.point_of_interaction?.transaction_data?.ticket_url,
    });
  } catch (error) {
    return json(res, 500, { error: error.message || "Erro ao gerar Pix." });
  }
};
