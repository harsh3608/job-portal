using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

namespace ApplicationService.Events;

/// <summary>
/// Publishes domain events to RabbitMQ exchanges / queues.
/// Registered as a singleton — owns its own connection.
/// </summary>
public sealed class RabbitMqPublisher : IDisposable
{
    private readonly IConnection _connection;
    private readonly IChannel _channel;
    private const string ExchangeName = "jobportal.events";

    public RabbitMqPublisher(IConfiguration config)
    {
        var factory = new ConnectionFactory
        {
            HostName = config["RabbitMq:Host"] ?? "rabbitmq",
            Port = int.Parse(config["RabbitMq:Port"] ?? "5672"),
            UserName = config["RabbitMq:Username"] ?? "guest",
            Password = config["RabbitMq:Password"] ?? "guest"
        };

        // Use synchronous creation for simplicity; production code should use async
        _connection = factory.CreateConnectionAsync().GetAwaiter().GetResult();
        _channel = _connection.CreateChannelAsync().GetAwaiter().GetResult();

        // Declare a fanout exchange so multiple consumers can subscribe
        _channel.ExchangeDeclareAsync(
            exchange: ExchangeName,
            type: ExchangeType.Fanout,
            durable: true,
            autoDelete: false).GetAwaiter().GetResult();
    }

    /// <summary>
    /// Publish a typed event to the fanout exchange.
    /// </summary>
    public async Task PublishAsync<T>(string routingKey, T message) where T : class
    {
        var json = JsonSerializer.Serialize(message);
        var body = Encoding.UTF8.GetBytes(json);

        await _channel.BasicPublishAsync(
            exchange: ExchangeName,
            routingKey: routingKey,
            body: body);
    }

    public void Dispose()
    {
        _channel?.Dispose();
        _connection?.Dispose();
    }
}
