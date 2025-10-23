import AdminCreateFormLinks, {
  IAdminCreateFormLinksProps,
} from "./AdminCreateFormLinks";
import AdminFormHeaderContainer from "../AdminFormHeaderContainer";

export default function AdminCreateFormHeader(
  props: IAdminCreateFormHeaderProps,
) {
  return (
    <AdminFormHeaderContainer modelName={props.modelName} mode="create">
      <AdminCreateFormLinks {...props} />
    </AdminFormHeaderContainer>
  );
}

export type IAdminCreateFormHeaderProps = IAdminCreateFormLinksProps;
