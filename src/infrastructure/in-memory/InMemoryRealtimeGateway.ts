import type { RealtimeGateway, RealtimeHandler } from '@application/ports/RealtimeGateway';

/** No-op realtime pour l'in-memory — rien à synchroniser entre onglets. */
export class InMemoryRealtimeGateway implements RealtimeGateway {
  subscribe(_userId: unknown, _handler: RealtimeHandler): () => void {
    return () => {};
  }
}
