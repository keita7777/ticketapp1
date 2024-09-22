import prisma from "@/prisma/db";
import DataTable from "./DataTable";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Pagenation from "@/components/Pagenation";
import StatusFilter from "@/components/StatusFilter";
import { Status, Ticket } from "@prisma/client";

export interface SearchParams {
  status: Status;
  page: string;
  orderBy: keyof Ticket;
}

const Tickets = async ({ searchParams }: { searchParams: SearchParams }) => {
  const pageSize = 10;

  // URLにパラメータが無い場合は1ページ目となる
  const page = parseInt(searchParams.page) || 1;

  // searchParams.orderByが存在しない場合、作成日順に並べる
  const orderBy = searchParams.orderBy ? searchParams.orderBy : "createdAt";

  // Statusすべての値を取得し、statuses という配列に格納
  // [ 'OPEN', 'STARTED', 'CLOSED' ]
  const statuses = Object.values(Status);

  // searchParams.statusが有効な値（OPEN/STARTED/CLOSED）であるかチェック
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  let where = {};

  if (status) {
    // statusが存在する場合は、チェック済みのstatusの値をwhereクエリに設定する
    // statusがOPENである場合、where: {status: "OPEN"}となる
    where = {
      status,
    };
  } else {
    // statusが存在しない場合は、NOTクエリを使って、
    // statusが "CLOSED" ではないすべてのチケットを取得する条件を指定
    where = {
      NOT: [{ status: "CLOSED" as Status }],
    };
  }

  const ticketCount = await prisma.ticket.count({ where });

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: {
      [orderBy]: "desc",
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return (
    <div>
      <div className="flex gap-2">
        <Link
          href="/tickets/new"
          className={buttonVariants({ variant: "default" })}
        >
          New Ticket
        </Link>
        <StatusFilter />
      </div>
      <DataTable tickets={tickets} searchParams={searchParams} />
      <Pagenation
        itemCount={ticketCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  );
};
export default Tickets;
