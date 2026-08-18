using System.Globalization;
using System.Net;
using System.Text;
using Skama.Api.DTOs;

namespace Skama.Api.Services;

public static class EmailTemplateBuilder
{
    private static readonly CultureInfo CostaRicaCulture = CultureInfo.GetCultureInfo("es-CR");

    public static (string Subject, string HtmlBody) BuildOrderConfirmation(OrderDetailDto order)
    {
        var subject = $"Confirmación de tu pedido {order.OrderNumber}";
        var intro = "Recibimos tu compra y ya estamos preparando tu pedido SKAMA.";
        var html = BuildOrderEmail(subject, intro, order);
        return (subject, html);
    }

    public static (string Subject, string HtmlBody) BuildOrderStatusUpdate(OrderDetailDto order)
    {
        var statusLabel = GetStatusLabel(order.Status);
        var subject = $"Tu pedido {order.OrderNumber} ahora está {statusLabel.ToLowerInvariant()}";
        var intro = GetStatusMessage(order.Status, order.OrderNumber);
        var html = BuildOrderEmail(subject, intro, order);
        return (subject, html);
    }

    public static (string Subject, string HtmlBody) BuildPasswordReset(string resetUrl)
    {
        const string subject = "Restablece tu contraseña de SKAMA";
        var safeUrl = Encode(resetUrl);
        var html = WrapLayout(subject, $"""
            <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#1D2A20;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta SKAMA.
            </p>
            <p style="margin:0 0 24px;font-size:16px;line-height:1.5;color:#5E6B60;">
              El enlace vence en 1 hora. Si no solicitaste este cambio, puedes ignorar este mensaje.
            </p>
            <p style="margin:0 0 24px;">
              <a href="{safeUrl}" style="display:inline-block;background:#4EA65F;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">
                Restablecer contraseña
              </a>
            </p>
            <p style="margin:0;font-size:13px;line-height:1.5;color:#94A39A;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
              <span style="word-break:break-all;">{safeUrl}</span>
            </p>
            """);

        return (subject, html);
    }

    private static string BuildOrderEmail(string title, string intro, OrderDetailDto order)
    {
        var itemsHtml = new StringBuilder();
        foreach (var item in order.Items)
        {
            itemsHtml.Append($"""
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #D8E3DA;color:#1D2A20;">{Encode(item.ProductName)}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #D8E3DA;text-align:center;color:#5E6B60;">{item.Quantity}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #D8E3DA;text-align:right;color:#1D2A20;">{FormatCrc(item.LineTotal)}</td>
                </tr>
                """);
        }

        var body = $"""
            <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#1D2A20;">{Encode(intro)}</p>
            <p style="margin:0 0 20px;font-size:14px;color:#5E6B60;">
              Pedido <strong>{Encode(order.OrderNumber)}</strong> · Estado: <strong>{Encode(GetStatusLabel(order.Status))}</strong>
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px;">
              <thead>
                <tr>
                  <th align="left" style="padding:8px 0;border-bottom:2px solid #4EA65F;color:#1D2A20;">Producto</th>
                  <th align="center" style="padding:8px 0;border-bottom:2px solid #4EA65F;color:#1D2A20;">Cant.</th>
                  <th align="right" style="padding:8px 0;border-bottom:2px solid #4EA65F;color:#1D2A20;">Total</th>
                </tr>
              </thead>
              <tbody>
                {itemsHtml}
              </tbody>
            </table>
            <p style="margin:0 0 8px;font-size:16px;color:#1D2A20;"><strong>Total: {FormatCrc(order.Total)}</strong></p>
            <p style="margin:0 0 4px;font-size:14px;color:#5E6B60;">Pago: {Encode(GetPaymentMethodLabel(order.PaymentMethod))}</p>
            <p style="margin:0;font-size:14px;color:#5E6B60;">Envío: {Encode(order.ShippingAddress)}</p>
            """;

        return WrapLayout(title, body);
    }

    private static string WrapLayout(string title, string innerHtml) => $"""
        <!DOCTYPE html>
        <html lang="es">
        <body style="margin:0;padding:24px;background:#F8FAF8;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #D8E3DA;border-radius:12px;">
            <tr>
              <td style="padding:24px 28px;background:#09241F;border-radius:12px 12px 0 0;">
                <p style="margin:0 0 6px;color:#D6B76A;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">SKAMA Jewelry</p>
                <h1 style="margin:0;color:#ffffff;font-size:22px;">{Encode(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">{innerHtml}</td>
            </tr>
          </table>
        </body>
        </html>
        """;

    private static string GetStatusLabel(string status) => status switch
    {
        "PENDING" => "Pendiente",
        "PAID" => "Pagada",
        "SHIPPED" => "Enviada",
        "DELIVERED" => "Entregada",
        "CANCELLED" => "Cancelada",
        _ => status
    };

    private static string GetStatusMessage(string status, string orderNumber) => status switch
    {
        "PENDING" => $"Recibimos tu pedido {orderNumber} y está pendiente de confirmación.",
        "PAID" => $"Confirmamos el pago de tu pedido {orderNumber}.",
        "SHIPPED" => $"Tu pedido {orderNumber} ya está en camino.",
        "DELIVERED" => $"Tu pedido {orderNumber} fue entregado. Gracias por comprar en SKAMA.",
        "CANCELLED" => $"Tu pedido {orderNumber} fue cancelado.",
        _ => $"El estado de tu pedido {orderNumber} se actualizó."
    };

    private static string GetPaymentMethodLabel(string paymentMethod) => paymentMethod switch
    {
        "SINPE_MOVIL" => "SINPE Móvil",
        "TRANSFERENCIA" => "Transferencia bancaria",
        "TARJETA" => "Tarjeta",
        "CASH" => "Efectivo",
        _ => paymentMethod
    };

    private static string FormatCrc(decimal amount) => amount.ToString("C0", CostaRicaCulture);

    private static string Encode(string value) => WebUtility.HtmlEncode(value);
}
