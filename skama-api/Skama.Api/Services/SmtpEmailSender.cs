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

    public bool IsConfigured =>
        _options.Enabled
        && !string.IsNullOrWhiteSpace(_options.Smtp.Host)
        && !string.IsNullOrWhiteSpace(_options.Smtp.User)
        && !string.IsNullOrWhiteSpace(_options.Smtp.Password);

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

        using var client = new SmtpClient();
        var socketOptions = _options.Smtp.UseStartTls
            ? SecureSocketOptions.StartTls
            : SecureSocketOptions.Auto;

        await client.ConnectAsync(_options.Smtp.Host, _options.Smtp.Port, socketOptions, cancellationToken);
        await client.AuthenticateAsync(_options.Smtp.User, _options.Smtp.Password, cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);

        _logger.LogInformation("Correo enviado a {Recipient} con asunto {Subject}.", to, subject);
    }
}
