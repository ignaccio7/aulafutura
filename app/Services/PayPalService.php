<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayPalService
{
  private string $baseUrl;
  private string $clientId;
  private string $clientSecret;
  private string $currency;

  public function __construct()
  {
    $this->clientId     = config('services.paypal.client_id');
    $this->clientSecret = config('services.paypal.client_secret');
    $this->currency     = config('services.paypal.currency', 'PEN');

    // Sandbox = pruebas, live = producción real
    $this->baseUrl = config('services.paypal.mode') === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  }

  /**
   * Obtiene un token de acceso OAuth2 de PayPal.
   * PayPal requiere este token en cada llamada a su API.
   */
  public function getAccessToken(): string
  {
    $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
      ->asForm()
      ->post("{$this->baseUrl}/v1/oauth2/token", [
        'grant_type' => 'client_credentials',
      ]);

    if ($response->failed()) {
      Log::error('PayPal getAccessToken error', $response->json());
      throw new \Exception('No se pudo obtener el token de PayPal');
    }

    return $response->json('access_token');
  }

  /**
   * Crea una Order en PayPal.
   * Esto le dice a PayPal: "quiero cobrar X soles por este plan".
   * PayPal responde con un ID de orden y una URL de aprobación.
   */
  public function createOrder(float $amount, string $description, string $planSlug): array
  {
    $token = $this->getAccessToken();

    $response = Http::withToken($token)
      ->post("{$this->baseUrl}/v2/checkout/orders", [
        'intent' => 'CAPTURE',
        'purchase_units' => [
          [
            'description' => $description,
            'custom_id'   => $planSlug, // guardamos el slug para usarlo al capturar
            'amount'      => [
              'currency_code' => $this->currency,
              'value'         => number_format($amount, 2, '.', ''),
            ],
          ],
        ],
        'application_context' => [
          'return_url' => route('paypal.success'),
          'cancel_url' => route('paypal.cancel'),
          'brand_name' => 'AulaFutura',
          'user_action' => 'PAY_NOW',
          'locale'     => 'es-PE',
        ],
      ]);

    if ($response->failed()) {
      Log::error('PayPal createOrder error', $response->json());
      throw new \Exception('No se pudo crear la orden en PayPal: ' . $response->body());
    }

    return $response->json();
  }

  /**
   * Captura el pago una vez que el usuario lo aprobó en PayPal.
   * Solo después de esto el dinero se mueve (en producción).
   */
  public function captureOrder(string $orderId): array
  {
    $token = $this->getAccessToken();

    $response = Http::withToken($token)
      ->withHeaders([
        'Content-Type' => 'application/json',
      ])
      ->withBody('{}', 'application/json') // PayPal requiere body JSON vacío explícito
      ->post("{$this->baseUrl}/v2/checkout/orders/{$orderId}/capture");

    if ($response->failed()) {
      Log::error('PayPal captureOrder error', $response->json());
      throw new \Exception('No se pudo capturar el pago: ' . $response->body());
    }

    return $response->json();
  }
}
