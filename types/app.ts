import type { Database } from "@/types/database";

export type Board = Database["public"]["Tables"]["boards"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
