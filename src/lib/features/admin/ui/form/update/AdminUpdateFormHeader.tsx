import AdminUpdateFormLinks, {
  IAdminUpdateFormLinksProps,
} from "./AdminUpdateFormLinks";
import AdminFormHeaderContainer from "../AdminFormHeaderContainer";

export default function AdminUpdateFormHeader(
  props: IAdminUpdateFormHeaderProps,
) {
  return (
    <AdminFormHeaderContainer modelName={props.modelName} mode="update">
      <AdminUpdateFormLinks {...props} />
    </AdminFormHeaderContainer>
  );
}

export type IAdminUpdateFormHeaderProps = IAdminUpdateFormLinksProps;
