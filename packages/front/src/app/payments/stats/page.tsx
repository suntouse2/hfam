import z from "zod";
import checkApi from "@/actions/checkApi";
import PaymentsStats from "@/components/PaymentsStats";
import { paymentsApi } from "../../../../api/paymentsApi";

const FiltersSchema = z.object({
  api_key: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(15),
  status: z.enum(["CREATED", "PAID", "REFUND"]).optional(),
  projectId: z.coerce.number().optional(),
  query: z.string().trim().optional(),
  domain: z.string().trim().optional(),
  createdFrom: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? new Date(v).toISOString() : undefined)),
  createdTo: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? new Date(v).toISOString() : undefined)),
});

export type FiltersSchemaType = z.infer<typeof FiltersSchema>;

//biome-ignore format: no need to format
export default async function Payments() {
  await checkApi();

  const stats = await paymentsApi.getStats();

  return (
    <section className="p-4 mx-auto h-full  w-full max-w-[1500px]">
      <PaymentsStats stats={stats} />
    </section>
  );
}
