// createServerClient: versão do cliente Supabase para Server Components.
// Diferente do createBrowserClient, ele acessa os cookies da requisição HTTP,
// o que permite ao Supabase identificar o usuário logado e aplicar as políticas RLS.
// cookies() vem do Next.js e lê os cookies da requisição atual no servidor.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorado em Server Components — o middleware cuida de renovar cookies
          }
        },
      },
    }
  );
}
