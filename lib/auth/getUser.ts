import { createClient } from "@/lib/supabase/server";

export type UserRole = "ADMIN" | "OPERADOR" | "VENDEDOR" | "FINANCEIRO";

export interface AppUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}

export async function getUser(): Promise<AppUser | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("id, nome, email, role")
    .eq("id", user.id)
    .eq("ativo", true)
    .single();

  return data ?? null;
}
