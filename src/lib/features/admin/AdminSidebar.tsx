"use client";

import "./AdminSidebar.scss";
import Link from "next/link";
import { Button, Modal, NavLink } from "@mantine/core";
import { usePathname } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { IAdminModelList } from "./adminModelList";
import { routes } from "@/lib/utils/routeMapper";

// TODO: render links as a tree that can collapse/expand (mantine/tree)
// TODO: search functionality synchronized with expand/collapse

export default function AdminSidebar({
  modelList,
}: {
  modelList: IAdminModelList;
}) {
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);
  const itemList = generateItemList(modelList, pathname);

  return (
    <>
      <div className="media-tablet-up">
        <NavLink
          p={0}
          href={routes.admin.root}
          label="Admin"
          component={Link}
          active={pathname === routes.admin.root}
        />
        <ul className="admin-sidebar-table-link-list">{itemList}</ul>
      </div>
      <div className="media-tablet-down">
        <Button variant="default" onClick={open}>
          Toggle Navigation
        </Button>
        <Modal opened={opened} onClose={close}>
          <NavLink
            p={0}
            href={routes.admin.root}
            label="Admin"
            component={Link}
            active={pathname === routes.admin.root}
          />
          <ul className="admin-sidebar-table-link-list" onClick={close}>
            {itemList}
          </ul>
        </Modal>
      </div>
    </>
  );
}

export function generateItemList(
  adminModels: IAdminModelList,
  pathname: string,
  itemList: React.ReactNode[] = [],
) {
  const entry = Object.entries(adminModels);

  entry.forEach(([category, item]) => {
    itemList.push(<span key={category}>{category}</span>);
    if (Array.isArray(item)) {
      item.map((model) => {
        const active = pathname.includes(model.rootPath);

        itemList.push(
          <NavLink
            key={model.name}
            href={model.href}
            label={`${model.name} (${model.count})`}
            component={Link}
            active={active}
          />,
        );
      });
    } else {
      generateItemList(item, pathname, itemList);
    }
  });

  return itemList;
}
