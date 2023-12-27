import {
  BreadcrumbItem,
  Breadcrumbs,
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { useCallback } from "react";
import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { getAllRoles } from "~/modules/role/get-all-roles";
import { getAllUsers } from "~/modules/user/get-all-user";
import { UserFilters } from "~/routes/_app.users/components/user-filters";
import { UserPaginationInfo } from "~/routes/_app.users/components/user-pagination-info";
import { columns, roleColorMap } from "~/routes/_app.users/constants";
import { User } from "~/routes/_app.users/types";
import { requireUserId } from "~/utils/auth.server";
import { getMessagesStorage } from "~/utils/messages.server";

export const meta: MetaFunction = () => {
  return [{ title: "User Management" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const rolesParam = searchParams.get("roles");

  const [[users, meta], roles] = await Promise.all([
    await getAllUsers({
      pagination: {
        page: page ? Number(page) : 1,
        limit: 15,
      },
      filters: {
        roles: rolesParam ? rolesParam.split(",") : undefined,
      },
      search: searchParam || "",
    }),
    getAllRoles(),
  ]);

  const { messages, commitMessages } = await getMessagesStorage(request);
  const message = messages.get("user-created");

  return json(
    {
      users: {
        data: users,
        meta,
      },
      roles,
      message,
    },
    {
      headers: { "set-cookie": await commitMessages(messages) },
    }
  );
}

export default function Users() {
  const { users, roles, message } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const renderCell = useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "roles":
        return (
          <div className="inline-flex space-x-1">
            {user.roles.map((role) => (
              <Chip
                key={role.name}
                className="capitalize"
                color={roleColorMap[role.name]}
                size="sm"
                variant="flat"
              >
                {role.name}
              </Chip>
            ))}
          </div>
        );
      default:
        return String(cellValue);
    }
  }, []);

  return (
    <>
      <Outlet />
      <div className="space-y-unit-5 md:space-y-unit-10">
        <div className="flex flex-col w-full space-y-unit-4 md:flex-row md:justify-between md:items-center md:space-y-unit-0">
          <div className="space-y-unit-3">
            <h2 className="text-2xl font-semibold">User Management</h2>
            <Breadcrumbs>
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem>Users</BreadcrumbItem>
            </Breadcrumbs>
          </div>
          <Button
            as={Link}
            href={`/users/create?${searchParams.toString()}`}
            startContent={<Icon name="user-plus" size="sm" />}
          >
            New User
          </Button>
        </div>

        {message && (
          <Alert variant="success" size="small">
            {message}
          </Alert>
        )}

        <Table
          aria-label="User List"
          topContentPlacement="outside"
          topContent={<UserFilters roles={roles} />}
          bottomContentPlacement="outside"
          bottomContent={
            users.meta.pageCount ? (
              <UserPaginationInfo
                page={users.meta.currentPage}
                total={users.meta.pageCount}
              />
            ) : null
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={users.data} emptyContent={"No user found."}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
