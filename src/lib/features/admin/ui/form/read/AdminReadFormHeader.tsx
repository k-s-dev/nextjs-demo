import AdminReadFormLinks, {
  IAdminReadFormLinksProps,
} from "./AdminReadFormLinks";
import AdminFormHeaderContainer from "../AdminFormHeaderContainer";

export default function AdminReadFormHeader(props: IAdminReadFormHeaderProps) {
  return (
    <AdminFormHeaderContainer modelName={props.modelName} mode="detail">
      <AdminReadFormLinks {...props} />
    </AdminFormHeaderContainer>
  );
}

export type IAdminReadFormHeaderProps = IAdminReadFormLinksProps;
