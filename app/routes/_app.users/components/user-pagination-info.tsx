import { Pagination, PaginationProps } from "@nextui-org/react";
import { useSearchParams } from "@remix-run/react";

type UserPaginationInfoProps = Pick<PaginationProps, "page" | "total">;

export function UserPaginationInfo({ total, page }: UserPaginationInfoProps) {
  const [, setSearchParams] = useSearchParams();

  return (
    <div className="flex w-full justify-center">
      <Pagination
        showControls
        variant="light"
        page={page}
        total={total}
        onChange={(page) => {
          setSearchParams(
            (prev) => {
              prev.set("page", String(page));
              return prev;
            },
            { preventScrollReset: true }
          );
        }}
      />
    </div>
  );
}
