import z from "zod";
import checkApi from "@/actions/checkApi";
import PaymentsList from "@/components/PaymentsList";
import { domainsApi } from "../../../api/domainsApi";
import { paymentsApi } from "../../../api/paymentsApi";
import { projectsApi } from "../../../api/projectsApi";
import "../tables.css";
import PaymentsStats from "@/components/PaymentsStats";

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
export default async function Payments({
  searchParams,
}: {
  searchParams: Promise<FiltersSchemaType>;
}) {
  const params = await searchParams;
  const filters = await FiltersSchema.parseAsync(params);
  await checkApi();

  const [payments, projects, domains] = await Promise.all([
    paymentsApi.getPayments(filters, filters.page, filters.limit),
    projectsApi.getProjects(),
    domainsApi.getDomains(filters),
  ]);

  return (
    <section className="p-4 mx-auto h-full  w-full max-w-[1500px]">
      <PaymentsList
        filters={filters}
        projects={projects}
        payments={payments}
        domains={domains}
      />
    </section>
  );
}
