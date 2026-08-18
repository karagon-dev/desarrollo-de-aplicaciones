using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using Skama.Api.Options;

namespace Skama.Api.Services;

public class SmtpEmailSender : IEmailSender
{
    private readonly EmailOptions _options;
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(IOptions<EmailOptions> options, ILogger<SmtpEmailSender> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    private string NormalizedPassword =>
        (_options.Smtp.Password ?? string.Empty).Replace(" ", string.Empty);

    public bool IsConfigured =>
        _options.Enabled
        && !string.IsNullOrWhiteSpace(_options.Smtp.Host)
        && !string.IsNullOrWhiteSpace(_options.Smtp.User)
        && NormalizedPassword.Length > 0;

    public async Task SendAsync(
        string to,
        string subject,
        string htmlBody,
        CancellationToken cancellationToken = default)
    {
        if (!IsConfigured)
        {
            throw new InvalidOperationException("El envío de correo no está configurado.");
        }

        var fromAddress = string.IsNullOrWhiteSpace(_options.FromAddress)
            ? _options.Smtp.User
            : _options.FromAddress;

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_options.FromName, fromAddress));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

        try
        {
            await SendWithAsync(
                _options.Smtp.Port,
                _options.Smtp.UseStartTls ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto,
                message,
                cancellationToken);
        }
        catch (Exception exception) when (_options.Smtp.Port != 465)
        {
            _logger.LogWarning(
                exception,
                "SMTP en {Host}:{Port} falló. Reintentando por el puerto 465.",
                _options.Smtp.Host,
                _options.Smtp.Port);
            await SendWithAsync(465, SecureSocketOptions.SslOnConnect, message, cancellationToken);
        }

        _logger.LogInformation("Correo enviado a {Recipient} con asunto {Subject}.", to, subject);
    }

    private async Task SendWithAsync(
        int port,
        SecureSocketOptions socketOptions,
        MimeMessage message,
        CancellationToken cancellationToken)
    {
        using var client = new SmtpClient { Timeout = 20_000 };
        await client.ConnectAsync(_options.Smtp.Host, port, socketOptions, cancellationToken);
        await client.AuthenticateAsync(_options.Smtp.User, NormalizedPassword, cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}
