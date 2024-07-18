"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/atomics/pagination';
import Title from '@/components/atomics/title';
import CardEmpty from '@/components/molecules/card/card-empty';
import CardTransaction from '@/components/molecules/card/card-transaction';
import { Transaction } from '@/interfaces/transaction';
import { useGetMyTransactionQuery } from '@/services/transaction.service';

function MyTransactions() {
  const { data: transactions} = useGetMyTransactionQuery({});
  console.log("🚀 ~ MyTransactions ~ transactions:", transactions)
  return (
    <main>
      <div className='flex items-center justify-between'>
        <Title
          section='admin'
          title='My Transactions'
          subtitle='Manage your house and get money'
        />
      </div>

      <div className='mt-[30px] space-y-5'>
        {
          transactions?.data.total?
          transactions?.data?.data.slice(0, 4).map((transaction: Transaction, index: number) => (
            <CardTransaction
              key={transaction.id}
              id= {transaction.id}
              image={transaction.listing.attachments?.[0]||""}
              title={transaction.listing.title}
              location={transaction.listing.address}
              days={transaction.total_days}
              price={transaction.total_price}
              status={transaction.status}
            />
          )) : <CardEmpty/>
        }
      </div>

      <Pagination className='mt-[30px]'>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">10</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  )
}

export default MyTransactions
