import { IssueResolutionForm } from "../../dataType/types/issueResolutionForm";
import { VoucherRepository } from "./voucherRespository";

export const issueresolutionformRepo = new VoucherRepository<IssueResolutionForm>({
    table: "issueresolutionform",
    primaryKey: "id",
});